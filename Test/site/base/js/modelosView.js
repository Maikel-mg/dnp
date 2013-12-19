var ModelosView = Class.extend({
    initialize : function(){
        logger.append('ModelosView', 'initialize', '');

        Env.on('loaded' , _.bind( this.initializeComponent, this) );

        return this;
    },
    initializeComponent : function(){
        logger.append('ModelosView', 'initializeComponent', '');

        this.initializeData();
        this.createVariables();
        this.initializeUI();
        this.initializeEvents();

        this.obtenerModelos();
    },

    createVariables : function () {
        logger.append('ModelosView', 'createVariables', '');

        this.colModelos = Env.colecciones('ipk.modelo');
        this.colCamposModelo = Env.colecciones('ipk.campo_modelo');

        this.colModelos.makePersistible({
            table : 'base_Modelos',
            service : Env.Service_WS
        });
        this.colCamposModelo.makePersistible({
            table : 'base_CamposModelos',
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
    initializeData : function (){
        logger.append('ModelosView', 'initializeData', '');
    },
    initializeUI : function(){
        logger.append('ModelosView', 'initializeUI', '');

        this.gridModelos = new Grid(this.gridModelos);
        this.gridModelos.render();
        this.gridModelos.tabla.toolbar.onlyIcons();

        this.gridCamposModelos = new Grid(this.gridCamposModelos);
        this.gridCamposModelos.render();
    },
    initializeEvents : function(){
        logger.append('ModelosView', 'initializeEvents', '');

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
        logger.append('ModelosView', 'obtenerModelos', '');

        this.colModelos.fetch();
    },
    cargarModelos: function(datos){
        logger.append('ModelosView', 'cargarModelos', '', arguments);

        if(datos.tieneDatos)
        {
            this.gridModelos.tabla.collection.setData(datos.datos);
            this.gridCamposModelos.ficha.find('idModelo').setData(datos.datos);
        }
    },
    cargarCamposModelo : function(datos){
        logger.append('ModelosView', 'cargarCamposModelo', '', arguments);

        if(datos.tieneDatos)
        {
            this.gridCamposModelos.tabla.collection.setData(datos.datos);
        }
    },

    inicializarModelo : function(ficha){
        logger.append('ModelosView', 'inicializarModelo', '', arguments);

        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idModelo').Value(this.gridModelos.tabla.idFilaSeleccionada);
        }
    },
    obtenerCamposModeloSeleccionado : function(){
        logger.append('ModelosView', 'obtenerCamposModeloSeleccionado', '', arguments);

        var query = {
            query : {idModelo: "'" + this.gridModelos.tabla.idFilaSeleccionada + "'"},
            referencias: false,
            colecciones:false
        };
        this.colCamposModelo.query(query);
    },

    // EVENTOS
    onModeloClick : function(tabla) {
        logger.append('ModelosView', 'onModeloClick', '', arguments);

        this.obtenerCamposModeloSeleccionado(tabla);
    },
    onModeloDoubleClick : function(tabla) {
        logger.append('ModelosView', 'onModeloDoubleClick', '', arguments);

        this.obtenerCamposModeloSeleccionado(tabla);
        this.gridModelos.tabla.toolbar.controls[1].$element.trigger('click');
    }
});
