var TablaHijosManualPage = function(configuracion){
    this.ficha = {};
    this.areaColecciones = $('#areaColecciones');

//    this.crearFicha();

    this.genericoDS = {};
    this.ipkConfiguracion = new IpkInfraestructura();

    this.crearGenericoDS();
    this.crearIpkConfiguracion();

    this.ipkConfiguracion.getFichaByName('Dossier');
};

TablaHijosManualPage.prototype.crearIpkConfiguracion = function(){
    var self = this;
    this.ipkConfiguracion.onGetFicha = function(ficha){
        app.log.debug('onGetFicha' , ficha);
        self.ficha.setEstructura( ficha);

        var control = new IpkTablaHijos(self ,ficha.zz_CamposFichas[21]);
        self.ipkConfiguracion.getModeloById(ficha.zz_Modelos.IdModelo);
    };
    this.ipkConfiguracion.onGetModelo = function(modelo){
        self.modelo = modelo;

        var clave = _.find(self.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;});
        self.genericoDS.CambiarEntidad(self.modelo.Nombre, clave.Nombre);
    };
};
TablaHijosManualPage.prototype.crearGenericoDS = function(){
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
                //self.ficha.setDatos(respuesta.datos[0]);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};

TablaHijosManualPage.prototype.crearFicha = function(){
    var self = this;
    var configuracion = {
        contenedor   : 'contenedor',
        nombre       : 'FormaEmb' ,
        ficha        : 'Ficha' ,
        modo         : IpkFicha.Modos.Consulta
    };

    this.ficha = new IpkRemoteFicha(configuracion);
};


