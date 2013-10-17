var GastosView = Class.extend({
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
        this.colGastos = Env.colecciones('ipk.gasto');

        this.tablaGastosConfig  = {
            type: 'Table',
            name: 'tablaGastos',
            renderTo : '#gridGastos',
            presentacion :   Env.presentaciones('tbGastos'),
            modelCollection: this.colGastos,
            events: {
                control: {
                    rowClick: _.bind(this.onGastoClick, this),
                    rowDblClick: _.bind(this.onGastoDoubleClick, this)
                }
            }
        };
        this.fichaGastosConfig = {
            type : 'Ficha',
            name : 'fchGastos',
            title : 'Edición de gasto',
            presentacion :   Env.presentaciones('fchGastos'),
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
        this.gridGastos = {
            type: 'Grid',
            name: 'gridGastos',
            fichaConfig: this.fichaGastosConfig,
            tablaConfig: this.tablaGastosConfig
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

        this.gridGastos = new Grid(this.gridGastos);
        this.gridGastos.render();
        this.gridGastos.tabla.toolbar.onlyIcons();
    },
    initializeEvents : function(){
        this.colGastos.on('updated', _.bind(this.actualizarGasto, this));
        this.colGastos.on('inserted', _.bind(this.insertarGasto, this));
        this.colGastos.on('deleted', _.bind(this.eliminarGasto, this));

        this.colClientes.on('updated', _.bind(this.actualizarCliente, this));
        this.colClientes.on('inserted', _.bind(this.insertarCliente, this));
        this.colClientes.on('deleted', _.bind(this.eliminarCliente, this));
    },

    // CRUD TIPOS PROYECTO
    insertarGasto : function(registro){
        Env.Service.execute({
            operation: 'insert',
            params : {
                table: 'gastos',
                row : registro.to_JSON()
            }
        });
    },
    actualizarGasto : function(registro){
        Env.Service.execute({
            operation: 'update',
            params : {
                table: 'gastos',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarGasto : function(registro){
        Env.Service.execute({
            operation: 'delete',
            params : {
                table: 'gastos',
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

    // FUNCIONES
    setClienteFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idCliente').Value(this.gridClientes.tabla.idFilaSeleccionada);
        }
    },
    cargarGastosClienteSeleccionado : function(tabla){
        var campos = Env.Service.execute({
            operation : 'query',
            params : {
                table: 'gastos',
                field : 'idCliente',
                value : tabla.datosFilaSeleccionada.id
            }
        });
        if(campos && campos.length > 0)
            this.gridGastos.tabla.collection.setData(campos);
        else
        {
            alert('No hay gastos para el cliente seleccionado.');
            this.gridGastos.tabla.collection.setData([]);

        }

    },

    // EVENTOS
    onGastoClick : function(tabla) {},
    onGastoDoubleClick : function(tabla) {
        this.gridGastos.tabla.toolbar.controls[1].$element.trigger('click');
    },

    onClienteClick : function(tabla) {
        this.cargarGastosClienteSeleccionado(tabla);
    },
    onClienteDoubleClick : function(tabla) {
        this.cargarGastosClienteSeleccionado(tabla);
        this.gridClientes.tabla.toolbar.controls[1].$element.trigger('click');
    }

});
