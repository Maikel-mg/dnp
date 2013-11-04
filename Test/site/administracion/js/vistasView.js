var VistasView = Class.extend({
    initialize : function(){
        Env.on('loaded' , _.bind( this.initializeComponent, this) );

        return this;
    },
    initializeComponent : function(){
        this.initializeData();
        this.createVariables();
        this.initializeUI();
        this.initializeEvents();

        this.obtenerPresentaciones();
        this.obtenerRoles();
        this.obtenerFases();
    },

    createVariables : function () {

        this.colPresentaciones = Env.colecciones('ipk.presentaciones');
        this.colRoles   = Env.colecciones('ipk.rol');
        this.colFases   = Env.colecciones('ipk.fase');
        this.colVistas   = Env.colecciones('ipk.vista_presentacion');
        this.colCamposVista = Env.colecciones('ipk.vista_campo_presentacion');

        this.colPresentaciones.makePersistible({
            table : 'adm_Presentaciones',
            service : Env.Service_WS
        });
        this.colRoles.makePersistible({
            table : 'adm_Roles',
            service : Env.Service_WS
        });
        this.colFases.makePersistible({
            table : 'adm_Fases',
            service : Env.Service_WS
        });
        this.colVistas.makePersistible({
            table : 'adm_VistaPresentacion',
            service : Env.Service_WS
        });
        this.colCamposVista.makePersistible({
            table : 'adm_VistaCampoPresentacion',
            service : Env.Service_WS
        });

        this.tablaPresentacionConfig  = {
            type: 'Table',
            name: 'tablaPresentaciones',
            renderTo : '#gridModelos',
            presentacion :   Env.presentaciones('tbPresentaciones', true),
            modelCollection: this.colPresentaciones
        };
        this.fichaPresentacionConfig = {
            type : 'Ficha',
            name : 'fchPresentaciones',
            title : 'Edición de modelos',
            presentacion :   Env.presentaciones('fchPresentaciones', true),
            events : {}
        };

        this.tablaRolesConfig  = {
            type: 'Table',
            name: 'tablaRoles',
            renderTo : '#gridRoles',
            presentacion :   Env.presentaciones('tbRoles', true),
            modelCollection: this.colRoles
        };
        this.fichaRolesConfig = {
            type : 'Ficha',
            name : 'fchModelos',
            title : 'Edición de rol',
            presentacion :   Env.presentaciones('fchRoles', true)
        };

        this.tablaFasesConfig  = {
            type: 'Table',
            name: 'tablaFases',
            renderTo : '#gridFases',
            presentacion :   Env.presentaciones('tbFases', true),
            modelCollection: this.colFases
        };
        this.fichaFasesConfig = {
            type : 'Ficha',
            name : 'fchFases',
            title : 'Edición de fase',
            presentacion :   Env.presentaciones('fchFases', true)
        };

        this.tablaVistasConfig  = {
            type: 'Table',
            name: 'tablaVistas',
            renderTo : '#gridAccesos',
            presentacion :   Env.presentaciones('tbVistaPresentacion', true),
            modelCollection: this.colVistas
        };
        this.fichaVistasConfig = {
            type : 'Ficha',
            name : 'fchVistaPresentacion',
            title : 'Edición de vista',
            presentacion : Env.presentaciones('fchVistaPresentacion', true)
        };

        this.tablaCamposVistaConfig  = {
            type: 'Table',
            name: 'tablaCamposVista',
            renderTo : '#gridCamposVista',
            presentacion :   Env.presentaciones('tbVistaCamposPresentacion', true),
            modelCollection: this.colCamposVista
        };
        this.fichaCamposVistaConfig = {
            type : 'Ficha',
            name : 'fchCamposVistaPresentacion',
            title : 'Edición de campo de vista',
            presentacion : Env.presentaciones('fchVistaCamposPresentacion', true)
        };

        this.gridPresentaciones  = {
            type: 'Grid',
            name: 'gridPresentaciones',
            fichaConfig: this.fichaPresentacionConfig,
            tablaConfig: this.tablaPresentacionConfig
        };
        this.gridRoles = {
            type: 'Grid',
            name: 'gridRoles',
            fichaConfig: this.fichaRolesConfig,
            tablaConfig: this.tablaRolesConfig
        };
        this.gridFases = {
            type: 'Grid',
            name: 'gridFases',
            fichaConfig: this.fichaFasesConfig,
            tablaConfig: this.tablaFasesConfig
        };
        this.gridVistas = {
            type: 'Grid',
            name: 'gridVistas',
            fichaConfig: this.fichaVistasConfig,
            tablaConfig: this.tablaVistasConfig
        };
        this.gridCamposVista = {
            type: 'Grid',
            name: 'gridCamposVista',
            fichaConfig: this.fichaCamposVistaConfig,
            tablaConfig: this.tablaCamposVistaConfig
        };
    },
    initializeData : function () {
    },
    initializeUI : function(){
        this.gridPresentaciones = new Grid(this.gridPresentaciones);
        this.gridPresentaciones.render();
        this.gridPresentaciones.tabla.toolbar.onlyIcons();

        this.gridRoles = new Grid(this.gridRoles);
        this.gridRoles.render();
        this.gridRoles.tabla.toolbar.onlyIcons();

        this.gridFases = new Grid(this.gridFases);
        this.gridFases.render();
        this.gridFases.tabla.toolbar.onlyIcons();

        this.gridVistas = new Grid(this.gridVistas);
        this.gridVistas.render();
        //this.gridVistas.tabla.toolbar.onlyIcons();

        this.gridCamposVista = new Grid(this.gridCamposVista);
        this.gridCamposVista.render();
        this.gridCamposVista.tabla.toolbar.addAction( {
            nombre : 'btnImportar',
            value :'Importar',
            descripcion :'Importar los campos de la presentación',
            clases : '',
            accessKey : undefined,
            icono : 'icon-download'
        } );
        //this.gridCamposVista.tabla.toolbar.onlyIcons();
    },
    initializeEvents : function(){
        // DATA
        this.colPresentaciones.on('post-fetch', _.bind(this.cargarPresentaciones, this));
        this.colRoles.on('post-fetch' , _.bind(this.cargarRoles, this));
        this.colFases.on('post-fetch' , _.bind(this.cargarFases, this));
        this.colVistas.on('post-query' , _.bind(this.cargarVistas, this));
        this.colCamposVista.on('post-query' , _.bind(this.cargarCamposVistas, this));

        // UI
        this.gridPresentaciones.tabla.on('rowClick', _.bind(this.onPresentacionClick, this));
        this.gridPresentaciones.tabla.on('rowDblClick', _.bind(this.onPresentacionDoubleClick, this));
        this.gridRoles.tabla.on('rowClick', _.bind(this.onRolClick, this));
        this.gridFases.tabla.on('rowClick', _.bind(this.onFaseClick, this));
        this.gridVistas.tabla.on('rowClick', _.bind(this.onVistaClick, this));

        this.gridVistas.ficha.on('opened', _.bind(this.inicializarFK, this));

        this.gridCamposVista.ficha.on('opened', _.bind(this.inicializarCampoVistaFK, this));
        this.gridCamposVista.tabla.on('buttonClicked', _.bind(this.gestionarAccionesCamposVistas, this));
    },

    // FUNCIONES
    obtenerPresentaciones: function(){
        this.colPresentaciones.fetch();
    },
    obtenerRoles: function(){
        this.colRoles.fetch();
    },
    obtenerFases: function(){
        this.colFases.fetch();
    },
    obtenerVistasSeleccion: function(){
        var objQuery = {
            query : {
                idPresentacion : "'" + this.gridPresentaciones.tabla.idFilaSeleccionada + "'",
                idRol : "'" + this.gridRoles.tabla.idFilaSeleccionada + "'",
                idFase : "'" + this.gridFases.tabla.idFilaSeleccionada + "'"
            },
            referencias: true,
            colecciones : true
        }
        this.colVistas.query(objQuery);
    },
    obtenerCamposVistasSeleccion: function(){
        var objQuery = {
            query : {
                idVista : "'" + this.gridVistas.tabla.idFilaSeleccionada + "'"
            },
            referencias: false,
            colecciones : false
        };
        this.colCamposVista.query(objQuery);
    },

    cargarPresentaciones :function(datos){
        if(datos.tieneDatos)
        {
            this.gridPresentaciones.tabla.collection.setData(datos.datos);
        }
    },
    cargarRoles :function(datos){
        if(datos.tieneDatos)
        {
            this.gridRoles.tabla.collection.setData(datos.datos);
        }
    },
    cargarFases :function(datos){
        if(datos.tieneDatos)
        {
            this.gridFases.tabla.collection.setData(datos.datos);
        }
    },
    cargarVistas :function(datos){
        if(datos.tieneDatos)
        {
            this.gridVistas.tabla.collection.setData(datos.datos);
        }
        else
        {
            alert('No hay vistas para la selección realizada.')
        }
    },
    cargarCamposVistas :function(datos){
        if(datos.tieneDatos)
        {
            this.gridCamposVista.tabla.collection.setData(datos.datos);
        }
        else
        {
            alert('No hay campos para la vista seleccionada.');
        }
    },

    gestionarAccionesCamposVistas : function(boton){
        switch (boton.nombre)
        {
            case 'btnImportar':
                this.importarCamposDesdePresentacion();
                break;
        }
    },
    importarCamposDesdePresentacion : function() {
        alert('No implementado');
        /*
        var camposPresentacion = Env.Service_ADM.execute({
            operation : 'query',
            params : {
                table : 'campos_presentacion',
                field: 'idPresentacion',
                value : this.gridVistas.tabla.datosFilaSeleccionada.idPresentacion
            }
        });
        console.log(camposPresentacion);

        var that = this;
        _.each(camposPresentacion , function(campo){
            campo.idVista = that.gridVistas.tabla.idFilaSeleccionada;
            that.gridCamposVista.tabla.collection.crear(campo);
        });
        */
    },

    inicializarFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idPresentacion').Value(this.gridPresentaciones.tabla.idFilaSeleccionada);
            ficha.find('idRol').Value(this.gridRoles.tabla.idFilaSeleccionada);
            ficha.find('idFase').Value(this.gridFases.tabla.idFilaSeleccionada);

        }
    }              ,
    cargarCamposModeloSeleccionado : function(){

        if(this.gridPresentaciones.tabla.idFilaSeleccionada !== undefined && this.gridRoles.tabla.idFilaSeleccionada !== undefined && this.gridFases.tabla.idFilaSeleccionada !== undefined)
        {
            this.obtenerVistasSeleccion();
        }
    },
    inicializarCampoVistaFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idVista').Value(this.gridVistas.tabla.idFilaSeleccionada);
        }
    },

    // EVENTOS
    onPresentacionClick : function(){},
    onPresentacionDoubleClick : function(){
        this.cargarCamposModeloSeleccionado();
    },
    onRolClick : function(){
        this.cargarCamposModeloSeleccionado();
    },
    onFaseClick : function(){
        this.cargarCamposModeloSeleccionado();
    },

    onModeloClick : function(tabla) {
        this.cargarCamposModeloSeleccionado(tabla);
    },
    onModeloDoubleClick : function(tabla) {
        this.cargarCamposModeloSeleccionado(tabla);
        this.gridModelos.tabla.toolbar.controls[1].$element.trigger('click');
    },
    onVistaClick : function(tabla) {
        this.obtenerCamposVistasSeleccion();
    }
});
