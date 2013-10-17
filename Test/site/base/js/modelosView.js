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
    },

    createVariables : function () {
        this.colModelos = Env.colecciones('ipk.modelo', Env.Service_BASE.execute({operation : 'getTable', params : {table: 'modelos'}}));
        this.colCamposModelo = Env.colecciones('ipk.campo_modelo');

        this.tablaModelosConfig  = {
            type: 'Table',
            name: 'tabla',
            renderTo : '#gridModelos',
            presentacion :   Env.presentaciones('tbModelos', true),
            modelCollection: this.colModelos,
            events: {
                control: {
                    rowClick: _.bind(this.onModeloClick, this),
                    rowDblClick: _.bind(this.onModeloDoubleClick, this)
                }
            }
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
            presentacion :   Env.presentaciones('fchCamposModelo', true),
            events: {
                control: {
                    opened : _.bind(this.inicializarModelo, this)
                }
            }
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
        this.colModelos.on('updated', _.bind(this.actualizarModelo, this));
        this.colModelos.on('inserted', _.bind(this.insertarModelo, this));
        this.colModelos.on('deleted', _.bind(this.eliminarModelo, this));

        this.colCamposModelo.on('updated', _.bind(this.actualizarCampoModelo, this));
        this.colCamposModelo.on('inserted', _.bind(this.insertarCampoModelo, this));
        this.colCamposModelo.on('deleted', _.bind(this.eliminarCampoModelo, this));
    },

    // CRUD MODELOS
    insertarModelo : function(registro){
        Env.Service_BASE.execute({
            operation: 'insert',
            params : {
                table: 'modelos',
                row : registro.to_JSON()
            }
        });
    },
    actualizarModelo : function(registro){
        Env.Service_BASE.execute({
            operation: 'update',
            params : {
                table: 'modelos',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });

    },
    eliminarModelo : function(registro){
        Env.Service_BASE.execute({
            operation: 'delete',
            params : {
                table: 'modelos',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // CRUD CAMPOS MODELO
    insertarCampoModelo : function(registro){
        Env.Service_BASE.execute({
            operation: 'insert',
            params : {
                table: 'campos_modelo',
                row : registro.to_JSON()
            }
        });
    },
    actualizarCampoModelo : function(registro){
        Env.Service_BASE.execute({
            operation: 'update',
            params : {
                table: 'campos_modelo',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarCampoModelo : function(registro){
        Env.Service_BASE.execute({
            operation: 'delete',
            params : {
                table: 'campos_modelo',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // FUNCIONES
    inicializarModelo : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idModelo').Value(this.gridModelos.tabla.idFilaSeleccionada);
        }
    },
    cargarCamposModeloSeleccionado : function(tabla){
        var campos = Env.Service_BASE.execute({
            operation : 'query',
            params : {
                table: 'campos_modelo',
                field : 'idModelo',
                value : tabla.datosFilaSeleccionada.id
            }
        });
        if(campos && campos.length > 0)
            this.gridCamposModelos.tabla.collection.setData(campos);
        else
            this.gridCamposModelos.tabla.collection.setData([]);
    },

    // EVENTOS
    onModeloClick : function(tabla) {
        this.cargarCamposModeloSeleccionado(tabla);
    },
    onModeloDoubleClick : function(tabla) {
        this.cargarCamposModeloSeleccionado(tabla);
        this.gridModelos.tabla.toolbar.controls[1].$element.trigger('click');
    }
});
