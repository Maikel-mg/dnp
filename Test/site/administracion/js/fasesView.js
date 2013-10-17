var FasesView = Class.extend({
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
        var dataRoles = Env.Service_ADM.execute({operation : 'getTable', params : {table : 'fases'}});
        this.colRoles = Env.colecciones('ipk.fase', dataRoles);

        this.tablaModelosConfig  = {
            type: 'Table',
            name: 'tablaRoles',
            renderTo : '#gridRoles',
            presentacion :   Env.presentaciones('tbFases', true),
            modelCollection: this.colRoles,
            events: {
                control: {
                    rowClick: _.bind(this.onModeloClick, this),
                    rowDblClick: _.bind(this.onModeloDoubleClick, this)
                }
            }
        };
        this.fichaModelosConfig = {
            type : 'Ficha',
            name : 'fchRoles',
            title : 'Edición de fases',
            presentacion : Env.presentaciones('fchFases', true)
        };
        this.gridModelos = {
            type: 'Grid',
            name: 'gridModelos',
            fichaConfig: this.fichaModelosConfig,
            tablaConfig: this.tablaModelosConfig
        };
    },
    initializeData : function () {
    },
    initializeUI : function(){
        this.gridModelos = new Grid(this.gridModelos);
        this.gridModelos.render();
    },
    initializeEvents : function(){
        this.colRoles.on('updated', _.bind(this.actualizarFases, this));
        this.colRoles.on('inserted', _.bind(this.insertarFases, this));
        this.colRoles.on('deleted', _.bind(this.eliminarFases, this));
    },

    // CRUD FASES
    insertarFases : function(registro){
        Env.Service_ADM.execute({
            operation: 'insert',
            params : {
                table: 'fases',
                row : registro.to_JSON()
            }
        });
    },
    actualizarFases : function(registro){
        Env.Service_ADM.execute({
            operation: 'update',
            params : {
                table: 'fases',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarFases : function(registro){
        Env.Service_ADM.execute({
            operation: 'delete',
            params : {
                table: 'fases',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // EVENTOS
    onModeloClick : function() {
    },
    onModeloDoubleClick : function() {
        this.gridModelos.tabla.toolbar.controls[1].$element.trigger('click');
    }
});
