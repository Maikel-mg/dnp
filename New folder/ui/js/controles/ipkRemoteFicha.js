var IpkRemoteFicha = function(configuracion){
    this.defaults = {};
    this.propiedades = $.extend(this.defaults , configuracion);

    this.genericoDS = {};

    this.modelo = {};
    this.ficha = {};

    this.crearFicha();

    this.ipkConfiguracion = new IpkInfraestructura();

    this.crearGenericoDS();
    this.crearIpkConfiguracion();

    this.ipkConfiguracion.getFichaByName(configuracion.nombre);
};

IpkRemoteFicha.prototype.crearIpkConfiguracion = function(){
    var self = this;
    this.ipkConfiguracion.onGetFicha = function(ficha){
        app.log.debug('onGetFicha' , ficha);
        self.ficha.setEstructura( ficha);
        self.ipkConfiguracion.getModeloById(ficha.zz_Modelos.IdModelo);
    };
    this.ipkConfiguracion.onGetModelo = function(modelo){
        self.modelo = modelo;

        var clave = _.find(self.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;});
        self.genericoDS.CambiarEntidad(self.modelo.Nombre, clave.Nombre);
    };
};
IpkRemoteFicha.prototype.crearGenericoDS = function(){
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
/*
                if(self.datosPasados)
                    self.tabla.setDatos(self.datosPasados);
                else
                    self.tabla.setDatos(respuesta.datos);
*/
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.genericoDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Buscar Registro', respuesta.datos);
                self.ficha.setDatos(respuesta.datos[0]);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};

IpkRemoteFicha.prototype.crearFicha = function(){
    var self = this;

    this.ficha = new IpkFicha(this.propiedades);
    this.ficha.onEditarClick = function( eventArgs ){
        app.log.debug('onEditarClick', eventArgs);
    };
    this.ficha.onGuardarClick = function(eventArgs){
        var ficha = eventArgs.sender;
        var registro = {} ;
        self.ficha.serializar(true);

        if(ficha.modo === IpkFicha.Modos.Alta)
        {
            registro = self.ficha.serializar();
            self.crearRegistro(registro);
        }
        else
        {
            registro = self.ficha.serializar(true);
            self.actualizarRegistro(registro);
        }

        app.log.debug('onGuardarClick', eventArgs);
    };
    this.ficha.onBorrarClick = function( eventArgs ){
        alert('Vamos a borrar');
    };
    this.ficha.onCopiarClick = function( eventArgs ){
        alert('Vamos a copiar');
    };
    this.ficha.onCancelarClick = function(){
        alert('Vamos a cancelar');
    };
};

IpkRemoteFicha.prototype.cargarRegistro = function(id){
    var where = {};
    var campoClave = this.ficha.campoClave();

    where[campoClave] = id;

    this.genericoDS.Buscar(where , true, true);
};
IpkRemoteFicha.prototype.actualizarRegistro = function(datos){
    this.genericoDS.Update(datos);
};