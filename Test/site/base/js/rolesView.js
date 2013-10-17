var RolesView = Class.extend({
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
        var dataRoles = Env.Service_BASE.execute({operation : 'getTable', params : {table : 'roles'}});
        this.colRoles = Env.colecciones('ipk.rol', dataRoles);

        this.tablaModelosConfig  = {
            type: 'Table',
            name: 'tablaRoles',
            renderTo : '#gridRoles',
            presentacion :   Env.presentaciones('tbRoles', true),
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
            title : 'Edición de roles',
            presentacion : Env.presentaciones('fchRoles', true)
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
        //this.gridModelos.tabla.toolbar.onlyIcons();
    },
    initializeEvents : function(){
        this.colRoles.on('updated', _.bind(this.actualizarRol, this));
        this.colRoles.on('inserted', _.bind(this.insertarRol, this));
        this.colRoles.on('deleted', _.bind(this.eliminarRol, this));
    },

    // CRUD ROLES
    insertarRol : function(registro){
        Env.Service_BASE.execute({
            operation: 'insert',
            params : {
                table: 'roles',
                row : registro.to_JSON()
            }
        });
    },
    actualizarRol : function(registro){
        Env.Service_BASE.execute({
            operation: 'update',
            params : {
                table: 'roles',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarRol : function(registro){
        Env.Service_BASE.execute({
            operation: 'delete',
            params : {
                table: 'roles',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    onModeloClick : function() {

    },
    onModeloDoubleClick : function() {
        this.gridModelos.tabla.toolbar.controls[1].$element.trigger('click');
    }
});
