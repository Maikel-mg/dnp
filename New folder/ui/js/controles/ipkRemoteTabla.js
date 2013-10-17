var IpkRemoteTabla = function(configuracion ,datos){
    this.defaults = {};
    this.propiedades = $.extend(this.defaults , configuracion);

    this.modelo = {};

    this.ipkConfiguracion = new IpkInfraestructura();

    this.genericoDS = {};

    this.contenedor = $('#'+ this.propiedades.contenedor);
    this.tabla = {};

    if(datos)
    {
        this.datos = datos;
        this.datosPasados = datos;
    }

    this.crearIpkConfiguracion();
    this.crearGenericoDS();
    this.crearTabla();
};

IpkRemoteTabla.prototype.crearIpkConfiguracion = function(){
    var self = this;
    this.ipkConfiguracion.onGetListado = function(listado){
        self.tabla.setColumnas(listado.zz_CamposListados);
        self.ipkConfiguracion.getModeloById(listado.zz_Modelos.IdModelo);
    };
    this.ipkConfiguracion.onGetModelo = function(modelo){
        self.modelo = modelo;

        var clave = _.find(self.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;});
        self.genericoDS.CambiarEntidad(self.modelo.Nombre, clave.Nombre);
        self.obtenerDatosListado();
    };
};

IpkRemoteTabla.prototype.crearGenericoDS = function(){
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
IpkRemoteTabla.prototype.configurarGenericoDS = function(){
    var clave = _.find(this.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;});
    this.genericoDS.CambiarEntidad(this.modelo.Nombre, clave.Nombre);
};

IpkRemoteTabla.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : this.propiedades.contenedor,
        id         : this.propiedades.Nombre
    };

    this.tabla = new IpkTabla(configuracion);

    this.obtenerConfiguracionListado(this.propiedades.Listado);
};

// **** FUNCIONES DATOS *****
IpkRemoteTabla.prototype.obtenerConfiguracionListado = function(nombre){
    this.ipkConfiguracion.getListadoByName(nombre);
};
IpkRemoteTabla.prototype.obtenerConfiguracionModelo = function(Id){
    this.ipkConfiguracion.getModeloById(Id);
};

IpkRemoteTabla.prototype.obtenerDatosListado = function(){
    this.genericoDS.Listado();
};
IpkRemoteTabla.prototype.setDatos = function(datos){
    this.tabla.setDatos(datos);
};




