var TablaManualPage = function(){
    this.listadosDS = {};
    this.tabla = {};

    this.crearTabla();
    this.crearDataSources();

    this.obtenerConfiguracionListado();
};

TablaManualPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "contenedorTabla",
        id         : "tabla"
    };

    this.tabla = new IpkTabla(configuracion);
};
TablaManualPage.prototype.crearDataSources = function(){
    this.crearListadosDS();
    this.crearDossieresDS();
};
TablaManualPage.prototype.crearListadosDS = function(){
    var self = this;

    this.listadosDS = new IpkRemoteDataSource({
        entidad : "zz_Listados",
        clave   : "IdListado"
    });

    this.listadosDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Configuracion del listado', respuesta.datos);

                var camposListado = respuesta.datos[0].zz_CamposListados;
                self.tabla.setColumnas(camposListado);
                self.obtenerDossieres();
            }

        }
        else
            alert(respuesta.mensaje);
    };
};
TablaManualPage.prototype.crearDossieresDS = function(){
    var self = this;

    this.dossieresDS= new IpkRemoteDataSource({
        entidad : "Dossier",
        clave   : "IdDossier"
    });
    this.dossieresDS.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Listado de dossieres', respuesta.datos);
                self.tabla.setDatos(respuesta.datos);
            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.dossieresDS.onFiltrar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Filtrado de dossieres', respuesta.datos);
                self.tabla.setDatos(respuesta.datos);
            }

        }
        else
            alert(respuesta.mensaje);
    };
};

// **** FUNCIONES DATOS *****
TablaManualPage.prototype.obtenerConfiguracionListado = function(){
    var where = {
        "Clave" : "'Dossier'"
    };

    this.listadosDS.Buscar(where , true, true);
};
TablaManualPage.prototype.obtenerDossieres = function(){
    this.dossieresDS.Listado();
};