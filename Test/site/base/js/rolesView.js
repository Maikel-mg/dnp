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

        this.obtenerRoles();
    },

    createVariables : function () {
        this.colRoles = Env.colecciones('ipk.rol');
        this.colRoles.makePersistible({
            table : 'base_Roles',
            service : Env.Service_WS
        });

        this.tablaRolesConfig  = {
            type: 'Table',
            name: 'tablaRoles',
            renderTo : '#gridRoles',
            presentacion :   Env.presentaciones('tbRoles', true),
            modelCollection: this.colRoles
        };
        this.fichaRolesConfig = {
            type : 'Ficha',
            name : 'fchRoles',
            title : 'Edición de roles',
            presentacion : Env.presentaciones('fchRoles', true)
        };
        this.gridRoles = {
            type: 'Grid',
            name: 'gridRoles',
            fichaConfig: this.fichaRolesConfig,
            tablaConfig: this.tablaRolesConfig
        };
    },
    initializeData : function () {
    },
    initializeUI : function(){
        this.gridRoles = new Grid(this.gridRoles);
        this.gridRoles.render();
    },
    initializeEvents : function(){
        // DATA
        this.colRoles.on('post-fetch', _.bind(this.cargarRoles, this));

        // UI
        this.gridRoles.tabla.on('rowClick', _.bind(this.onRolClick, this));
        this.gridRoles.tabla.on('rowDblClick', _.bind(this.onRolDoubleClick, this));
    },

    obtenerRoles : function(){
        this.colRoles.fetch();
    },
    cargarRoles : function(datos){
        if(datos.tieneDatos)
        {
            this.gridRoles.tabla.collection.setData(datos.datos);
        }
    },

    onRolClick : function() { },
    onRolDoubleClick : function() {
        this.gridRoles.tabla.toolbar.controls[1].$element.trigger('click');
    }
});
