var MaestroClientesView = Class.extend({
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
        this.colTiposProyecto = Env.colecciones('ipk.cliente', Env.Service.execute({operation : 'getTable', params : {table: 'clientes'}}));

        this.tablaTiposProyectoConfig  = {
            type: 'Table',
            name: 'tablaClientes',
            renderTo : '#gridClientes',
            presentacion :   Env.presentaciones('tbClientes'),
            modelCollection: this.colTiposProyecto,
            events: {
                control: {
                    rowClick: _.bind(this.onTipoProyectoClick, this),
                    rowDblClick: _.bind(this.onTipoProyectoDoubleClick, this)
                }
            }
        };
        this.fichaTiposProyectoConfig = {
            type : 'Ficha',
            name : 'fchTiposProyecto',
            title : 'Edición de clientes',
            presentacion :   Env.presentaciones('fchClientes')
        };

        this.gridTiposProyecto = {
            type: 'Grid',
            name: 'gridTiposProyecto',
            fichaConfig: this.fichaTiposProyectoConfig,
            tablaConfig: this.tablaTiposProyectoConfig
        };
    },
    initializeData : function () {
        if(!localStorage[AppConfig.adminBD])
            location = 'creacion.html';
    },
    initializeUI : function(){
        this.gridTiposProyecto = new Grid(this.gridTiposProyecto);
        this.gridTiposProyecto.render();
        this.gridTiposProyecto.tabla.toolbar.onlyIcons();
    },
    initializeEvents : function(){
        this.colTiposProyecto.on('updated', _.bind(this.actualizarTipoProyecto, this));
        this.colTiposProyecto.on('inserted', _.bind(this.insertarTipoProyecto, this));
        this.colTiposProyecto.on('deleted', _.bind(this.eliminarTipoProyecto, this));
    },

    // CRUD TIPOS PROYECTO
    insertarTipoProyecto : function(registro){
        Env.Service.execute({
            operation: 'insert',
            params : {
                table: 'clientes',
                row : registro.to_JSON()
            }
        });
    },
    actualizarTipoProyecto : function(registro){
        Env.Service.execute({
            operation: 'update',
            params : {
                table: 'clientes',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarTipoProyecto : function(registro){
        Env.Service.execute({
            operation: 'delete',
            params : {
                table: 'clientes',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // FUNCIONES
    setTipoProyectoFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idTipoProyecto').Value(this.gridTiposProyecto.tabla.idFilaSeleccionada);
        }
    },
    cargarFasesTipoProyectoSeleccionado : function(tabla){
        var campos = Env.Service.execute({
            operation : 'query',
            params : {
                table: 'fasesProyecto',
                field : 'idTipoProyecto',
                value : tabla.datosFilaSeleccionada.id
            }
        });
        if(campos && campos.length > 0)
        {
            this.gridFasesProyecto.tabla.collection.setData(campos);
            this.gridTareasFasesProyecto.ficha.find('idFase').setData(campos);
        }
        else
        {
            this.gridFasesProyecto.tabla.collection.setData([]);
            this.gridTareasFasesProyecto.tabla.collection.setData([]);
            this.gridTareasFasesProyecto.ficha.find('idFase').setData([]);
        }

    },

    // EVENTOS
    onTipoProyectoClick : function(tabla) {
        this.cargarFasesTipoProyectoSeleccionado(tabla);
    },
    onTipoProyectoDoubleClick : function(tabla) {
        this.cargarFasesTipoProyectoSeleccionado(tabla);
        this.gridTiposProyecto.tabla.toolbar.controls[1].$element.trigger('click');
    }

});
