var CopiaDossieresPage = function(){
    var self= this;
    this.factory = new IpkRemoteFactory();
    this.factory.onGetRemoteDataSource = function(eventArgs){
        self.setRemote(eventArgs);
    };
    this.factory.onGetListado = function(eventArgs){
        self.setRemote(eventArgs);
        self.filtro.inicializar({nomber: 'filtroDossieres', contenedor: 'miFiltro', tabla : self.tabla});
    };
    this.factory.onGetFicha = function(eventArgs){
        self.setRemote(eventArgs);
    };

    this.navegacion = {};
    this.accionesTabla = {};
    this.tabla = {};
    this.accionesFiltro = {};
    this.ficha = {};
    this.fichaCopia = new IpkFichaCopia();

    this.filtro = new IpkFiltro();
    this.filtro.onFiltrar = function(cadena)    {
        self.dossieresDS.Filtrar(cadena);
    };

    this.dossieresDS = {};

    this.crearDataSources();

    this.inicializarLayout();

    this.crearTabla();
    this.crearToolbarTabla();
    this.crearToolbarMenu();

    this.crearFicha();
};

CopiaDossieresPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        },
        south : {
            resizable  : false,
            closable : false,
            size: '220'
        }
    });
};

CopiaDossieresPage.prototype.crearDataSources = function(){
    this.factory.getRemoteDataSource('Dossier', 'dossieresDS');
};
CopiaDossieresPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        Nombre     : "Dossieres",
        Listado    : "Dossier"
    };
    this.factory.getTabla('Dossier', 'tabla' , configuracion);
};
CopiaDossieresPage.prototype.crearToolbarMenu = function(){
    app.configuracion.navegacion();
};
CopiaDossieresPage.prototype.crearToolbarTabla = function(){
    var self = this;
    var configuracion = {
        contenedor : "accionesTabla",
        id         : "accionesTabla"
    };

    this.accionesTabla = new IpkToolbar(configuracion);
    this.accionesTabla.agregarBoton({
        nombre : "Copiar",
        descripcion : "Copia el dossier seleccionado (ALT + Y)",
        clases : "",
        icono : "icon-repeat",
        accessKey : "y",
        texto : "Copiar",
        permisos : ['COMERCIAL']
    });
    this.accionesTabla.onCopiar = function(){
        var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();
        var unicos = _.filter(self.tabla.modelo.zz_CamposModelos , function(e){return e.EsIndice});

        if(idRegistro)
        {
            if(unicos.length > 0)
            {
                self.fichaCopia.setIdRegistro(idRegistro);
                self.fichaCopia.setInfoModelo(self.tabla.modelo);

                self.dialogoFicha.dialog('open');
                app.log.debug('CopiaDossieresPage -- crearToolbarTabla -- onCopiar' , unicos);
            }
            else
            {
                self.dossieresDS.Copiar(idRegistro, {DescripcionArt : 'Maikel'});
            }
        }
    };

};
CopiaDossieresPage.prototype.crearFicha = function(){
    var self = this;
    var configuracion = {
        contenedor : "fichaCopiaPlaceholder",
        nombre     : "copiaDossier"
    };

    this.fichaCopia.inicializar(configuracion);
    this.fichaCopia.onCancelar = function(){
        self.dialogoFicha.dialog('close');
    };
    this.fichaCopia.onGuardar = function(datosCopia){
        self.dialogoFicha.dialog('close');
        self.dossieresDS.Copiar(self.tabla.tabla.getIdRegistroSeleccionada(), datosCopia);
    };

    this.dialogoFicha = $('#' + configuracion.contenedor).dialog({
        width     : '760',
        autoOpen  : false,
        modal     : true,
        title     : 'Copia de dossier'
    });
};

CopiaDossieresPage.prototype.dossieresDSEventos = function(){
    var self = this;

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
CopiaDossieresPage.prototype.obtenerDossieres = function(){
    this.dossieresDS.Listado();
};

CopiaDossieresPage.prototype.setRemote = function(eventArgs){
    if(this[eventArgs.propiedad])
    {
        this[eventArgs.propiedad] = eventArgs.control;

        if(this[eventArgs.propiedad + 'Eventos'])
            this[eventArgs.propiedad + 'Eventos']();
    }
};
