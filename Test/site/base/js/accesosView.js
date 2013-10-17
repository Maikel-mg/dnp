var AccesosView = Class.extend({
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
        this.colModelos = Env.colecciones('ipk.modelo', Env.Service_BASE.execute({operation:'getTable', params : {table : 'modelos'}}));
        this.colRoles   = Env.colecciones('ipk.rol', Env.Service_BASE.execute({operation:'getTable', params : {table : 'roles'}}));
        this.colFases   = Env.colecciones('ipk.fase', Env.Service_BASE.execute({operation:'getTable', params : {table : 'fases'}}));
        this.colAccesos = Env.colecciones('ipk.acceso');

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

        this.tablaRolesConfig  = {
            type: 'Table',
            name: 'tablaRoles',
            renderTo : '#gridRoles',
            presentacion :   Env.presentaciones('tbRoles', true),
            modelCollection: this.colRoles,
            events: {
                control: {
                    rowClick: _.bind(this.onModeloClick, this)
                }
            }
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
            modelCollection: this.colFases,
            events: {
                control: {
                    rowClick: _.bind(this.onModeloClick, this)
                }
            }
        };
        this.fichaFasesConfig = {
            type : 'Ficha',
            name : 'fchFases',
            title : 'Edición de fase',
            presentacion :   Env.presentaciones('fchFases', true)
        };

        this.tablaAccesosConfig  = {
            type: 'Table',
            name: 'tablaRoles',
            renderTo : '#gridAccesos',
            presentacion :   Env.presentaciones('tbAccesos', true),
            modelCollection: this.colAccesos
        };
        this.fichaAccesosConfig = {
            type : 'Ficha',
            name : 'fchRoles',
            title : 'Edición de fases',
            presentacion : Env.presentaciones('fchAccesos', true)
        };

        this.gridModelos = {
            type: 'Grid',
            name: 'gridModelos',
            fichaConfig: this.fichaModelosConfig,
            tablaConfig: this.tablaModelosConfig
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
        this.gridAccesos = {
            type: 'Grid',
            name: 'gridAccesos',
            fichaConfig: this.fichaAccesosConfig,
            tablaConfig: this.tablaAccesosConfig
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

        this.gridRoles = new Grid(this.gridRoles);
        this.gridRoles.render();
        this.gridRoles.tabla.toolbar.onlyIcons();

        this.gridFases = new Grid(this.gridFases);
        this.gridFases.render();
        this.gridFases.tabla.toolbar.onlyIcons();

        this.gridAccesos = new Grid(this.gridAccesos);
        this.gridAccesos.render();
        this.gridAccesos.tabla.toolbar.onlyIcons();
    },
    initializeEvents : function(){
        this.colModelos.on('updated', _.bind(this.actualizarModelo, this));
        this.colModelos.on('inserted', _.bind(this.insertarModelo, this));
        this.colModelos.on('deleted', _.bind(this.eliminarModelo, this));

        this.colRoles.on('updated', _.bind(this.actualizarRol, this));
        this.colRoles.on('inserted', _.bind(this.insertarRol, this));
        this.colRoles.on('deleted', _.bind(this.eliminarRol, this));

        this.colFases.on('updated', _.bind(this.actualizarFase, this));
        this.colFases.on('inserted', _.bind(this.insertarFase, this));
        this.colFases.on('deleted', _.bind(this.eliminarFase, this));

        this.colAccesos.on('updated', _.bind(this.actualizarAcceso, this));
        this.colAccesos.on('inserted', _.bind(this.insertarAcceso, this));
        this.colAccesos.on('deleted', _.bind(this.eliminarAcceso, this));

        this.gridAccesos.ficha.on('opened', _.bind(this.inicializarFK, this));
    },

    // CRUD MODELOS //
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

    // CRUD ROLES//
    insertarRol: function(registro){
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

    // CRUD FASES //
    insertarFase: function(registro){
        Env.Service_BASE.execute({
            operation: 'insert',
            params : {
                table: 'fases',
                row : registro.to_JSON()
            }
        });

    },
    actualizarFase : function(registro){
        Env.Service_BASE.execute({
            operation: 'update',
            params : {
                table: 'fases',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });

    },
    eliminarFase : function(registro){
        Env.Service_BASE.execute({
            operation: 'delete',
            params : {
                table: 'fases',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // CRUD ACCESOS //
    insertarAcceso: function(registro){
        Env.Service_BASE.execute({
            operation: 'insert',
            params : {
                table: 'accesos',
                row : registro.to_JSON()
            }
        });

    },
    actualizarAcceso : function(registro){
        Env.Service_BASE.execute({
            operation: 'update',
            params : {
                table: 'accesos',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });

    },
    eliminarAcceso : function(registro){
        Env.Service_BASE.execute({
            operation: 'delete',
            params : {
                table: 'accesos',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // FUNCIONES
    inicializarFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idModelo').Value(this.gridModelos.tabla.idFilaSeleccionada);
            ficha.find('idRol').Value(this.gridRoles.tabla.idFilaSeleccionada);
            ficha.find('idFase').Value(this.gridFases.tabla.idFilaSeleccionada);
        }
    },
    cargarCamposModeloSeleccionado : function(tabla){

        if(this.gridModelos.tabla.idFilaSeleccionada !== undefined && this.gridRoles.tabla.idFilaSeleccionada !== undefined && this.gridFases.tabla.idFilaSeleccionada !== undefined)
        {
            var accesos = Env.Service_BASE.execute({
                operation:  'query',
                params : {
                    table : 'accesos',
                    fields : {
                        idModelo : this.gridModelos.tabla.idFilaSeleccionada,
                        idRol : this.gridRoles.tabla.idFilaSeleccionada,
                        idFase : this.gridFases.tabla.idFilaSeleccionada
                    }
                }
            });

            if(accesos)
            {
                accesos = (accesos.length > 0) ? accesos : [accesos];
                this.gridAccesos.tabla.collection.setData(accesos);
            }
            else
                this.gridAccesos.tabla.collection.setData( []);
        }
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
