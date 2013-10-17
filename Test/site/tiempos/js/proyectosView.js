var ProyectosView = Class.extend({
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
        this.colClientes = Env.colecciones('ipk.cliente', Env.Service.execute({operation : 'getTable', params : {table: 'clientes'}}));
        this.colProyectos = Env.colecciones('ipk.proyecto');
        this.colTareas = Env.colecciones('ipk.tarea');
        this.colImputaciones = Env.colecciones('ipk.imputacion');

        this.tablaImputacionesConfig  = {
            type: 'Table',
            name: 'tablaGastos',
            renderTo : '#gridImputaciones',
            presentacion :   Env.presentaciones('tbImputaciones'),
            modelCollection: this.colImputaciones
        };
        this.fichaImputacionesConfig = {
            type : 'Ficha',
            name : 'fchGastos',
            title : 'Edición de gasto',
            presentacion :   Env.presentaciones('fchImputacion'),
            events : {
                control : {
                    opened: _.bind(this.setTareaFK, this)
                }
            }
        };
        
        this.tablaTareasConfig  = {
            type: 'Table',
            name: 'tablaGastos',
            renderTo : '#gridTareas',
            presentacion :   Env.presentaciones('tbTareas'),
            modelCollection: this.colTareas,
            events: {
                control: {
                    rowClick: _.bind(this.onTareaClick, this),
                    rowDblClick: _.bind(this.onTareaDoubleClick, this)
                }
            }
        };
        this.fichaTareasConfig = {
            type : 'Ficha',
            name : 'fchGastos',
            title : 'Edición de gasto',
            presentacion :   Env.presentaciones('fchTareas'),
            events : {
                control : {
                    opened: _.bind(this.setProyectoFK, this)
                }
            }
        };

        this.tablaProyectosConfig  = {
            type: 'Table',
            name: 'tablaProyectos',
            renderTo : '#gridProyectos',
            presentacion :   Env.presentaciones('tbProyectos'),
            modelCollection: this.colProyectos,
            events: {
                control: {
                    rowClick: _.bind(this.onProyectoClick, this),
                    rowDblClick: _.bind(this.onProyectoDoubleClick, this)
                }
            }
        };
        this.fichaProyectosConfig = {
            type : 'Ficha',
            name : 'fchProyectos',
            title : 'Edición de gasto',
            presentacion :   Env.presentaciones('fchProyecto'),
            events : {
                control : {
                    opened: _.bind(this.setClienteFK, this)
                }
            }
        };

        this.tablaClientesConfig  = {
            type: 'Table',
            name: 'tablaClientes',
            renderTo : '#gridClientes',
            presentacion :   Env.presentaciones('tbClientes'),
            modelCollection: this.colClientes,
            events: {
                control: {
                    rowClick: _.bind(this.onClienteClick, this),
                    rowDblClick: _.bind(this.onClienteDoubleClick, this)
                }
            }
        };
        this.fichaClienteConfig = {
            type : 'Ficha',
            name : 'fchClientes',
            title : 'Edición de clientes',
            presentacion :   Env.presentaciones('fchClientes')
        };

        this.gridClientes = {
            type: 'Grid',
            name: 'gridClientes',
            fichaConfig: this.fichaClienteConfig,
            tablaConfig: this.tablaClientesConfig
        };
        this.gridProyectos = {
            type: 'Grid',
            name: 'gridProyectos',
            fichaConfig: this.fichaProyectosConfig,
            tablaConfig: this.tablaProyectosConfig
        };
        this.gridTareas = {
            type: 'Grid',
            name: 'gridTareas',
            fichaConfig: this.fichaTareasConfig,
            tablaConfig: this.tablaTareasConfig
        };

        this.gridImputaciones = {
            type: 'Grid',
            name: 'gridImputaciones',
            fichaConfig: this.fichaImputacionesConfig,
            tablaConfig: this.tablaImputacionesConfig
        };
    },
    initializeData : function () {
        if(!localStorage[AppConfig.adminBD])
            location = 'creacion.html';
    },
    initializeUI : function(){
        this.gridClientes = new Grid(this.gridClientes);
        this.gridClientes.render();
        this.gridClientes.tabla.toolbar.onlyIcons();

        this.gridProyectos = new Grid(this.gridProyectos);
        this.gridProyectos.render();
        this.gridProyectos.tabla.toolbar.onlyIcons();

        this.gridTareas = new Grid(this.gridTareas);
        this.gridTareas.render();
        this.gridTareas.tabla.toolbar.onlyIcons();

        this.gridImputaciones = new Grid(this.gridImputaciones);
        this.gridImputaciones.render();
        this.gridImputaciones.tabla.toolbar.onlyIcons();
    },
    initializeEvents : function(){
        this.colProyectos.on('updated', _.bind(this.actualizarProyecto, this));
        this.colProyectos.on('inserted', _.bind(this.insertarProyecto, this));
        this.colProyectos.on('deleted', _.bind(this.eliminarProyecto, this));

        this.colTareas.on('updated', _.bind(this.actualizarTarea, this));
        this.colTareas.on('inserted', _.bind(this.insertarTarea, this));
        this.colTareas.on('deleted', _.bind(this.eliminarTarea, this));

        this.colImputaciones.on('updated', _.bind(this.actualizarImputacion, this));
        this.colImputaciones.on('inserted', _.bind(this.insertarImputacion, this));
        this.colImputaciones.on('deleted', _.bind(this.eliminarImputacion, this));

        this.colClientes.on('updated', _.bind(this.actualizarCliente, this));
        this.colClientes.on('inserted', _.bind(this.insertarCliente, this));
        this.colClientes.on('deleted', _.bind(this.eliminarCliente, this));
    },

    // CRUD TIPOS PROYECTO
    insertarProyecto : function(registro){
        Env.Service.execute({
            operation: 'insert',
            params : {
                table: 'proyectos',
                row : registro.to_JSON()
            }
        });
    },
    actualizarProyecto : function(registro){
        Env.Service.execute({
            operation: 'update',
            params : {
                table: 'proyectos',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarProyecto : function(registro){
        Env.Service.execute({
            operation: 'delete',
            params : {
                table: 'proyectos',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    insertarCliente : function(registro){
        Env.Service.execute({
            operation: 'insert',
            params : {
                table: 'clientes',
                row : registro.to_JSON()
            }
        });
    },
    actualizarCliente : function(registro){
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
    eliminarCliente : function(registro){
        Env.Service.execute({
            operation: 'delete',
            params : {
                table: 'clientes',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    insertarTarea : function(registro){
        Env.Service.execute({
            operation: 'insert',
            params : {
                table: 'tareas',
                row : registro.to_JSON()
            }
        });
    },
    actualizarTarea : function(registro){
        Env.Service.execute({
            operation: 'update',
            params : {
                table: 'tareas',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarTarea : function(registro){
        Env.Service.execute({
            operation: 'delete',
            params : {
                table: 'tareas',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    insertarImputacion : function(registro){
        Env.Service.execute({
            operation: 'insert',
            params : {
                table: 'imputaciones',
                row : registro.to_JSON()
            }
        });
    },
    actualizarImputacion : function(registro){
        Env.Service.execute({
            operation: 'update',
            params : {
                table: 'imputaciones',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarImputacion : function(registro){
        Env.Service.execute({
            operation: 'delete',
            params : {
                table: 'imputaciones',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // FUNCIONES
    setClienteFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idCliente').Value(this.gridClientes.tabla.idFilaSeleccionada);
        }
    },
    cargarProyectosClienteSeleccionado : function(tabla){
        var campos = Env.Service.execute({
            operation : 'query',
            params : {
                table: 'proyectos',
                field : 'idCliente',
                value : tabla.datosFilaSeleccionada.id
            }
        });
        if(campos && campos.length > 0)
        {
            this.gridProyectos.tabla.collection.setData(campos);
            this.gridTareas.ficha.find('idProyecto').setData(campos);
        }
        else
        {
            alert('No hay gastos para el cliente seleccionado.');
            this.gridProyectos.tabla.collection.setData([]);
            this.gridTareas.ficha.find('idProyecto').setData([]);
        }

        this.gridTareas.tabla.collection.setData([]);
        this.gridImputaciones.tabla.collection.setData([]);

    },

    setProyectoFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idProyecto').Value(this.gridProyectos.tabla.idFilaSeleccionada);
        }
    },
    cargarTareasProyectoSeleccionado : function(tabla){
        var campos = Env.Service.execute({
            operation : 'query',
            params : {
                table: 'tareas',
                field : 'idProyecto',
                value : tabla.datosFilaSeleccionada.id
            }
        });
        if(campos && campos.length > 0)
        {
            this.gridTareas.tabla.collection.setData(campos);
            this.gridImputaciones.ficha.find('idTarea').setData(campos);
        }
        else
        {
            alert('No hay tareas para el proyecto seleccionado.');
            this.gridTareas.tabla.collection.setData([]);
            this.gridImputaciones.ficha.find('idTarea').setData([]);
        }

        this.gridImputaciones.tabla.collection.setData([]);
    },

    setTareaFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idTarea').Value(this.gridTareas.tabla.idFilaSeleccionada);
        }
    },
    cargarImputacionesTareasSeleccionado : function(tabla){
        var campos = Env.Service.execute({
            operation : 'query',
            params : {
                table: 'imputaciones',
                field : 'idTarea',
                value : tabla.datosFilaSeleccionada.id
            }
        });
        if(campos && campos.length > 0)
        {
            this.gridImputaciones.tabla.collection.setData(campos);
        }
        else
        {
            alert('No hay imputaciones para la tarea seleccionada.');
            this.gridImputaciones.tabla.collection.setData([]);
        }
    },

    // EVENTOS
    onProyectoClick : function(tabla) {
        this.cargarTareasProyectoSeleccionado(tabla);
    },
    onProyectoDoubleClick : function(tabla) {
        this.cargarTareasProyectoSeleccionado(tabla);
        this.gridProyectos.tabla.toolbar.controls[1].$element.trigger('click');
    },

    onTareaClick : function(tabla) {
        this.cargarImputacionesTareasSeleccionado(tabla);
    },
    onTareaDoubleClick : function(tabla) {
        this.cargarImputacionesTareasSeleccionado(tabla);
        this.gridTareas.tabla.toolbar.controls[1].$element.trigger('click');
    },

    onClienteClick : function(tabla) {
        this.cargarProyectosClienteSeleccionado(tabla);
    },
    onClienteDoubleClick : function(tabla) {
        this.cargarProyectosClienteSeleccionado(tabla);
        this.gridClientes.tabla.toolbar.controls[1].$element.trigger('click');
    }

});
