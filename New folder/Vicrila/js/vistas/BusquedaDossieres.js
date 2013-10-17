var BusquedaDossieresPage = function(){
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
    this.inicializarLayout();
    this.crearToolbarMenu();
    this.crearToolbarTabla();
    this.crearToolbarFiltros();

    this.dossieresDS = {};

    this.cambiarBusqueda('Dossier');
};

BusquedaDossieresPage.prototype.inicializarLayout = function(){
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

BusquedaDossieresPage.prototype.crearDataSources = function(Tipo){
    this.factory.getRemoteDataSource(Tipo, 'dossieresDS');
};
BusquedaDossieresPage.prototype.crearTabla = function(Tipo){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        Nombre     : Tipo,
        Listado    : Tipo
    };

    this.factory.getTabla(Tipo, 'tabla' , configuracion);
};
BusquedaDossieresPage.prototype.crearToolbarMenu = function(){
    app.configuracion.navegacion();
};
BusquedaDossieresPage.prototype.crearToolbarTabla = function(){
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
            }
            else
            {
                self.dossieresDS.Copiar(idRegistro, {DescripcionArt : 'Maikel'});
            }
        }
    };

};
BusquedaDossieresPage.prototype.crearToolbarFiltros = function(){
    var self = this;
    var configuracion = {
        contenedor : "areaFiltros",
        id         : "areaFiltros"
    };

    this.areaFiltros = new IpkToolbar(configuracion);
    this.areaFiltros.agregarBoton({
        nombre : "Dossieres",
        descripcion : "Copia el dossier seleccionado (ALT + Y)",
        clases : "",
        icono : "icon-repeat",
        texto : "Dossieres",
        permisos : []
    });
    this.areaFiltros.agregarBoton({
        nombre : "Soluciones",
        descripcion : "Copia el dossier seleccionado (ALT + Y)",
        clases : "",
        icono : "icon-repeat",
        texto : "Solucionse",
        permisos : []
    });
    this.areaFiltros.agregarBoton({
        nombre : "Formas",
        descripcion : "Copia el dossier seleccionado (ALT + Y)",
        clases : "",
        icono : "icon-repeat",
        texto : "Formas",
        permisos : []
    });
    this.areaFiltros.agregarBoton({
        nombre : "Embalajes",
        descripcion : "Copia el dossier seleccionado (ALT + Y)",
        clases : "",
        icono : "icon-repeat",
        texto : "Embalajes",
        permisos : []
    });
    this.areaFiltros.onDossieres = function(){
        self.filtro.limpiarFiltro();
        self.cambiarBusqueda('Dossier');
    };
    this.areaFiltros.onSoluciones = function(){
        self.filtro.limpiarFiltro();
        self.cambiarBusqueda('Solucion');
    };
    this.areaFiltros.onFormas = function(){
        self.filtro.limpiarFiltro();
        self.cambiarBusqueda('FormaArt');
    };
    this.areaFiltros.onEmbalajes = function(){
        self.filtro.limpiarFiltro();
        self.cambiarBusqueda('FormaEmb');
    };

};
BusquedaDossieresPage.prototype.crearFicha = function(Tipo){
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
        title     : 'Copia de ' + Tipo
    });
};

BusquedaDossieresPage.prototype.dossieresDSEventos = function(){
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
BusquedaDossieresPage.prototype.obtenerDossieres = function(){
    this.dossieresDS.Listado();
};

BusquedaDossieresPage.prototype.setRemote = function(eventArgs){
    if(this[eventArgs.propiedad])
    {
        this[eventArgs.propiedad] = eventArgs.control;

        if(this[eventArgs.propiedad + 'Eventos'])
            this[eventArgs.propiedad + 'Eventos']();
    }
};

BusquedaDossieresPage.prototype.cambiarBusqueda = function(Tipo){
    this.tipo = Tipo;
    this.crearDataSources(this.tipo);
    this.crearTabla(this.tipo);
    this.crearFicha();
};
