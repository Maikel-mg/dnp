var IpkTablaConectada = function(contenedor , configuracion ,datos){
    this.defaults = {};
    this.propiedades = $.extend(this.defaults , configuracion);
    this.propiedades.contenedor = contenedor;

    this.modelo = {};

    this.modelosDS = {};
    this.listadosDS = {};
    this.genericoDS = {};

    this.contenedor = $('#'+ this.propiedades.contenedor);
    this.tabla = {};

    if(datos)
    {
        this.datos = datos;
        this.datosPasados = datos;
    }

    this.crearGenericoDS();
    this.crearModelosDS();
    this.crearListadosDS();

    this.crearTabla();

    this.obtenerConfiguracionModelo();
};

IpkTablaConectada.prototype.crearGenericoDS = function(){
    var self = this;
    this.genericoDS = new IpkRemoteDataSource({
        entidad : 'zz_Modelos',
        clave : 'IdModelo'
    });

    this.genericoDS.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('GETMODELO IpkTablaConectada  ', respuesta.datos);

                if(self.datosPasados)
                    self.tabla.setDatos(self.datosPasados);
                else
                    self.tabla.setDatos(respuesta.datos);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
IpkTablaConectada.prototype.crearModelosDS = function(){
    var self = this;
    this.modelosDS = new IpkRemoteDataSource({
        entidad : 'zz_Modelos',
        clave : 'IdModelo'
    });

    this.modelosDS.onGetById = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('GETMODELO', respuesta.datos);
                self.modelo = respuesta.datos;
                self.obtenerConfiguracionListado(respuesta.datos.Nombre);
            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.modelosDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('GETMODELOBUSCAR', respuesta.datos);
                self.modelo = respuesta.datos[0];
                self.configurarGenericoDS();
                self.obtenerConfiguracionListado(respuesta.datos[0].Nombre);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
IpkTablaConectada.prototype.crearListadosDS = function(){
    var self = this;
    this.listadosDS = new IpkRemoteDataSource({
        entidad : 'zz_Listados',
        clave : 'IdListado'
    });

    this.listadosDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                var camposListado = respuesta.datos[0].zz_CamposListados;
                self.tabla.setColumnas(camposListado);
                self.obtenerListado();
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
IpkTablaConectada.prototype.configurarGenericoDS = function(){
    var clave = _.find(this.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;});
    this.genericoDS.CambiarEntidad(this.modelo.Nombre, clave.Nombre);
};

IpkTablaConectada.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : this.propiedades.contenedor,
        id         : this.propiedades.Nombre
    };

    this.tabla = new IpkTabla(configuracion);
};

// **** FUNCIONES DATOS *****
IpkTablaConectada.prototype.obtenerConfiguracionListado = function(nombre){


    var where = {
        "Clave" : "'" + nombre + "'"
    };

    this.listadosDS.Buscar(where , true, true);
};
IpkTablaConectada.prototype.obtenerConfiguracionModelo = function(){

    alert('IdReferencia' + this.propiedades.IdReferencia);

    var where = {
        "IdModelo" : this.propiedades.IdReferencia
    };

    this.modelosDS.Buscar(where , true, true);
    //this.modelosDS.GetById(this.propiedades.IdReferencia);
};

IpkTablaConectada.prototype.obtenerListado = function(){
    this.genericoDS.Listado();
};
IpkTablaConectada.prototype.setDatos = function(datos){
    this.tabla.setDatos(datos);
};



