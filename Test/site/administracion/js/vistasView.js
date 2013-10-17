var VistasView = Class.extend({
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

        this.colModelos = Env.colecciones('ipk.presentaciones', Env.Service_ADM.execute({operation:'getTable', params : {table : 'presentaciones'}}));
        this.colRoles   = Env.colecciones('ipk.rol', Env.Service_ADM.execute({operation:'getTable', params : {table : 'roles'}}));
        this.colFases   = Env.colecciones('ipk.fase', Env.Service_ADM.execute({operation:'getTable', params : {table : 'fases'}}));
        this.colVistas   = Env.colecciones('ipk.vista_presentacion');
        this.colCamposVista = Env.colecciones('ipk.vista_campo_presentacion');

        this.tablaModelosConfig  = {
            type: 'Table',
            name: 'tablaPresentaciones',
            renderTo : '#gridModelos',
            presentacion :   Env.presentaciones('tbPresentaciones', true),
            modelCollection: this.colModelos,
            events: {
                control: {
                    rowClick: _.bind(this.onModeloClick, this),
                    rowDblClick: _.bind(this.onModeloDoubleClick, this),
                    buttonClicked : function(){}
                }
            }
        };
        this.fichaModelosConfig = {
            type : 'Ficha',
            name : 'fchPresentaciones',
            title : 'Edición de modelos',
            presentacion :   Env.presentaciones('fchPresentaciones', true),
            events : {}
        };

        this.tablaRolesConfig  = {
            type: 'Table',
            name: 'tablaRoles',
            renderTo : '#gridRoles',
            presentacion :   Env.presentaciones('tbRoles', true),
            modelCollection: this.colRoles,
            events: {
                control: {
                    rowClick: _.bind(this.onModeloClick, this),
                    buttonClicked : function(){}
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
                    rowClick : _.bind(this.onModeloClick, this),
                    buttonClicked : function(){}
                }
            }
        };
        this.fichaFasesConfig = {
            type : 'Ficha',
            name : 'fchFases',
            title : 'Edición de fase',
            presentacion :   Env.presentaciones('fchFases', true)
        };

        this.tablaVistasConfig  = {
            type: 'Table',
            name: 'tablaVistas',
            renderTo : '#gridAccesos',
            presentacion :   Env.presentaciones('tbVistaPresentacion', true),
            modelCollection: this.colVistas    ,
            events :{
                control : {
                    rowClick : _.bind(this.onVistaClick, this)
                }
            }
        };
        this.fichaVistasConfig = {
            type : 'Ficha',
            name : 'fchVistaPresentacion',
            title : 'Edición de vista',
            presentacion : Env.presentaciones('fchVistaPresentacion', true)
        };

        this.tablaCamposVistaConfig  = {
            type: 'Table',
            name: 'tablaCamposVista',
            renderTo : '#gridCamposVista',
            presentacion :   Env.presentaciones('tbVistaCamposPresentacion', true),
            modelCollection: this.colCamposVista
        };
        this.fichaCamposVistaConfig = {
            type : 'Ficha',
            name : 'fchCamposVistaPresentacion',
            title : 'Edición de campo de vista',
            presentacion : Env.presentaciones('fchVistaCamposPresentacion', true)
        };

        this.gridModelos = {
            type: 'Grid',
            name: 'gridPresentaciones',
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
        this.gridVistas = {
            type: 'Grid',
            name: 'gridVistas',
            fichaConfig: this.fichaVistasConfig,
            tablaConfig: this.tablaVistasConfig
        };
        this.gridCamposVista = {
            type: 'Grid',
            name: 'gridCamposVista',
            fichaConfig: this.fichaCamposVistaConfig,
            tablaConfig: this.tablaCamposVistaConfig
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

        this.gridVistas = new Grid(this.gridVistas);
        this.gridVistas.render();
        //this.gridVistas.tabla.toolbar.onlyIcons();

        this.gridCamposVista = new Grid(this.gridCamposVista);
        this.gridCamposVista.render();
        this.gridCamposVista.tabla.toolbar.addAction( {
            nombre : 'btnImportar',
            value :'Importar',
            descripcion :'Importar los campos de la presentación',
            clases : '',
            accessKey : undefined,
            icono : 'icon-download'
        } );
        //this.gridCamposVista.tabla.toolbar.onlyIcons();
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

        this.colVistas.on('updated', _.bind(this.actualizarVista, this));
        this.colVistas.on('inserted', _.bind(this.insertarVista, this));
        this.colVistas.on('deleted', _.bind(this.eliminarVista, this));

        this.colCamposVista.on('updated', _.bind(this.actualizarCampoVista, this));
        this.colCamposVista.on('inserted', _.bind(this.insertarCampoVista, this));
        this.colCamposVista.on('deleted', _.bind(this.eliminarCampoVista, this));

        this.gridVistas.ficha.on('opened', _.bind(this.inicializarFK, this));
        this.gridVistas.tabla.on('rowClick', _.bind(this.inicializarFK, this));

        this.gridCamposVista.tabla.on('buttonClicked', _.bind(this.gestionarAccionesCamposVistas, this));

    },

    // CRUD MODELOS //
    insertarModelo : function(registro){

        this.Service_ADM.execute({
            operation: 'insert',
            params : {
                table: 'presentaciones',
                row : registro.to_JSON()
            }
        });

    },
    actualizarModelo : function(registro){
        this.Service_ADM.execute({
            operation: 'update',
            params : {
                table: 'presentaciones',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });

    },
    eliminarModelo : function(registro){
        this.Service_ADM.execute({
            operation: 'delete',
            params : {
                table: 'presentaciones',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // CRUD ROLES//
    insertarRol: function(registro){

        this.Service_ADM.execute({
            operation: 'insert',
            params : {
                table: 'roles',
                row : registro.to_JSON()
            }
        });

    },
    actualizarRol : function(registro){
        this.Service_ADM.execute({
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
        this.Service_ADM.execute({
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

        this.Service_ADM.execute({
            operation: 'insert',
            params : {
                table: 'fases',
                row : registro.to_JSON()
            }
        });

    },
    actualizarFase : function(registro){
        this.Service_ADM.execute({
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
        this.Service_ADM.execute({
            operation: 'delete',
            params : {
                table: 'fases',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // CRUD VISTAS //
    insertarVista: function(registro){

        this.Service_ADM.execute({
            operation: 'insert',
            params : {
                table: 'vista_presentacion',
                row : registro.to_JSON()
            }
        });

    },
    actualizarVista : function(registro){
        this.Service_ADM.execute({
            operation: 'update',
            params : {
                table: 'vista_presentacion',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });

    },
    eliminarVista : function(registro){
        this.Service_ADM.execute({
            operation: 'delete',
            params : {
                table: 'vista_presentacion',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // CRUD CAMPO VISTAS //
    insertarCampoVista: function(registro){

        this.Service_ADM.execute({
            operation: 'insert',
            params : {
                table: 'campos_vista_presentacion',
                row : registro.to_JSON()
            }
        });

    },
    actualizarCampoVista : function(registro){
        this.Service_ADM.execute({
            operation: 'update',
            params : {
                table: 'campos_vista_presentacion',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });

    },
    eliminarCampoVista : function(registro){
        this.Service_ADM.execute({
            operation: 'delete',
            params : {
                table: 'campos_vista_presentacion',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    gestionarAccionesCamposVistas : function(boton){
        switch (boton.nombre)
        {
            case 'btnImportar':
                this.importarCamposDesdePresentacion();
                break;
        }
    },
    importarCamposDesdePresentacion : function() {
        var camposPresentacion = Env.Service_ADM.execute({
            operation : 'query',
            params : {
                table : 'campos_presentacion',
                field: 'idPresentacion',
                value : this.gridVistas.tabla.datosFilaSeleccionada.idPresentacion
            }
        });
        console.log(camposPresentacion);

        var that = this;
        _.each(camposPresentacion , function(campo){
            campo.idVista = that.gridVistas.tabla.idFilaSeleccionada;
            that.gridCamposVista.tabla.collection.crear(campo);
        });
    },

    inicializarFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idPresentacion').Value(this.gridModelos.tabla.idFilaSeleccionada);
            ficha.find('idRol').Value(this.gridRoles.tabla.idFilaSeleccionada);
            ficha.find('idFase').Value(this.gridFases.tabla.idFilaSeleccionada);
        }
    }              ,
    cargarCamposModeloSeleccionado : function(tabla){

        if(this.gridModelos.tabla.idFilaSeleccionada !== undefined && this.gridRoles.tabla.idFilaSeleccionada !== undefined && this.gridFases.tabla.idFilaSeleccionada !== undefined)
        {
            var vistas = Env.Service_ADM.execute({
                operation:  'query',
                params : {
                    table : 'vista_presentacion',
                    fields : {
                        idPresentacion : this.gridModelos.tabla.idFilaSeleccionada,
                        idRol : this.gridRoles.tabla.idFilaSeleccionada,
                        idFase : this.gridFases.tabla.idFilaSeleccionada
                    }
                }
            });

            if(vistas)
            {
                vistas = (vistas.length > 0) ? vistas : [vistas];
                this.gridVistas.tabla.collection.setData(vistas);

                if(vistas.length == 1)
                    this.cargarCamposVistaSeleccionada(vistas[0].id)
            }
            else
            {
                this.gridVistas.tabla.collection.setData( []);
                this.gridCamposVista.tabla.collection.setData( []);
                alert('No hay VISTAS creadas para los criterios seleccionados');
            }
        }
    },
    cargarCamposVistaSeleccionada : function(idVista){
        var campos_vista = Env.Service_ADM.execute({
            operation:  'query',
            params : {
                table : 'campos_vista_presentacion',
                field : 'idVista',
                value : idVista
            }
        });
        this.gridCamposVista.tabla.collection.setData(campos_vista);
    },
    onModeloClick : function(tabla) {
        this.cargarCamposModeloSeleccionado(tabla);
    },
    onModeloDoubleClick : function(tabla) {
        this.cargarCamposModeloSeleccionado(tabla);
        this.gridModelos.tabla.toolbar.controls[1].$element.trigger('click');
    },
    onVistaClick : function(tabla) {
        alert(tabla.idFilaSeleccionada);
        this.cargarCamposVistaSeleccionada(tabla.idFilaSeleccionada);
    }
});
