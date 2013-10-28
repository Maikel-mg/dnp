var ModelosView = Class.extend({
    initialize : function(){
        this.initializeComponent();

        return this;
    },
    initializeComponent : function(){
        this.initializeData();
        this.createVariables();
        this.initializeUI();
        this.initializeEvents();

        this.obtenerModelos();
    },

    createVariables : function () {
        this.colModelos = Env.colecciones('ipk.modelo');
        this.colCamposModelo = Env.colecciones('ipk.campo_modelo');

        this.colModelos.makePersistible({
            table : 'adm_Modelos',
            service : Env.Service_WS
        });
        this.colCamposModelo.makePersistible({
            table : 'adm_CamposModelos',
            service : Env.Service_WS
        });

        this.tablaModelosConfig  = {
            type: 'Table',
            name: 'tabla',
            renderTo : '#gridModelos',
            presentacion :   Env.presentaciones('tbModelos', true),
            modelCollection: this.colModelos
        };
        this.fichaModelosConfig = {
            type : 'Ficha',
            name : 'fchModelos',
            title : 'Edición de modelos',
            presentacion :   Env.presentaciones('fchModelos', true)
        };

        this.tablaCamposModeloConfig  = {
            type: 'Table',
            name: 'tablaCamposModelos',
            renderTo : '#gridCamposModelo',
            presentacion :   Env.presentaciones('tbCamposModelo', true),
            modelCollection: this.colCamposModelo
        };
        this.fichaCamposModeloConfig = {
            type : 'Ficha',
            name : 'fchModelos',
            title : 'Edición de campo de modelo',
            presentacion :   Env.presentaciones('fchCamposModelo', true)
        };

        this.gridModelos = {
            type: 'Grid',
            name: 'gridModelos',
            fichaConfig: this.fichaModelosConfig,
            tablaConfig: this.tablaModelosConfig
        };
        this.gridCamposModelos = {
            type: 'Grid',
            name: 'gridCamposModelos',
            fichaConfig: this.fichaCamposModeloConfig,
            tablaConfig: this.tablaCamposModeloConfig
        };
    },
    initializeData : function () {
        if(!localStorage[AppConfig.adminBD])
            location = 'creacion.html';
    },
    initializeUI : function(){
        this.gridModelos = new Grid(this.gridModelos);
        this.gridModelos.render();
        this.gridModelos.tabla.toolbar.onlyIcons();

        this.gridCamposModelos = new Grid(this.gridCamposModelos);
        this.gridCamposModelos.render();
    },
    initializeEvents : function(){
        // DATA
        this.colModelos.on('post-fetch', _.bind(this.cargarModelos, this));
        this.colCamposModelo.on('post-query', _.bind(this.cargarCamposModelo, this));

        // UI
        this.gridModelos.tabla.on('rowClick', _.bind(this.onModeloClick, this));
        this.gridModelos.tabla.on('rowDblClick', _.bind(this.onModeloDoubleClick, this));
        this.gridCamposModelos.ficha.on('opened',  _.bind(this.inicializarModelo, this));

    },

    // FUNCIONES
    obtenerModelos : function(){
        this.colModelos.fetch();
    },
    cargarModelos: function(datos){
        if(datos.tieneDatos)
        {
            this.gridModelos.tabla.collection.setData(datos.datos);
            this.gridCamposModelos.ficha.find('idModelo').setData(datos.datos);
        }
    },
    cargarCamposModelo : function(datos){
        if(datos.tieneDatos)
        {
            this.gridCamposModelos.tabla.collection.setData(datos.datos);
        }
    },

    inicializarModelo : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idModelo').Value(this.gridModelos.tabla.idFilaSeleccionada);
        }
    },
    obtenerCamposModeloSeleccionado : function(tabla){
        var query = {
            query : {idModelo: "'" + this.gridModelos.tabla.idFilaSeleccionada + "'"},
            referencias: false,
            colecciones:false
        };
        this.colCamposModelo.query(query);
    },

    // EVENTOS
    onModeloClick : function(tabla) {
        this.obtenerCamposModeloSeleccionado(tabla);
    },
    onModeloDoubleClick : function(tabla) {
        this.obtenerCamposModeloSeleccionado(tabla);
        this.gridModelos.tabla.toolbar.controls[1].$element.trigger('click');
    }
});
