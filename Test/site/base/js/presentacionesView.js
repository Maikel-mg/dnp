var PresentacionesView = Class.extend({
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
        this.colPresentacion = Env.colecciones('ipk.presentaciones', Env.Service_BASE.execute({operation: 'getTable', params : {table: 'presentaciones'}}));
        this.colCamposPresentacion = Env.colecciones('ipk.campo_presentacion');

        this.tablaPresentacionesConfig  = {
            type: 'Table',
            name: 'tablaPresentaciones',
            renderTo : '#gridPresentaciones',
            presentacion : Env.presentaciones('tbPresentaciones', true),
            modelCollection: this.colPresentacion,
            events: {
                control: {
                    rowClick: _.bind(this.onPresentacionClick, this),
                    rowDblClick: _.bind(this.onPresentacionDoubleClick, this),
                    buttonClicked :_.bind(this.gestionarAccionesPresentaciones, this)
                }
            }
        };
        this.fichaPresentacionesConfig = {
            type : 'Ficha',
            name : 'fchPresentacion',
            title : 'Edicion de presentacion',
            presentacion :   Env.presentaciones('fchPresentaciones', true)
        };

        this.tablaCamposPresentacionesConfig  = {
            type: 'Table',
            name: 'tablaCamposPresentacion',
            renderTo : '#gridCamposPresentacion',
            presentacion :  Env.presentaciones('tbCampoPresentacion', true) ,
            modelCollection: this.colCamposPresentacion,
            events: {
                control: {
                    rowDblClick: _.bind(this.onCampoPresentacionDoubleClick, this),
                    buttonClicked : _.bind(this.gestionarAccionesCamposPresentaciones, this)
                }
            }
        };
        this.fichaCamposPresentacionesConfig = {
            type : 'Ficha',
            name : 'fchModelos',
            title : 'Edicion de campo de la presentacion',
            presentacion :  Env.presentaciones('fchCamposPresentacion', true),
            events: {
                control: {
                    opened : _.bind(this.inicializarPresentacion, this)
                }
            }
        };

        this.gridPresentaciones = {
            type: 'Grid',
            name: 'gridPresentaciones',
            fichaConfig: this.fichaPresentacionesConfig,
            tablaConfig: this.tablaPresentacionesConfig
        };
        this.gridCamposPresentaciones = {
            type: 'Grid',
            name: 'gridCamposPresentaciones',
            fichaConfig: this.fichaCamposPresentacionesConfig,
            tablaConfig: this.tablaCamposPresentacionesConfig
        };

    },
    initializeData : function () {
        if(!localStorage[AppConfig.adminBD])
            location = 'creacion.html';
    },
    initializeUI : function(){
        this.gridPresentaciones = new Grid(this.gridPresentaciones);
        this.gridPresentaciones.render();
        this.gridPresentaciones.tabla.toolbar.addAction( {
            nombre : 'btnCopiar',
            value :'Copiar',
            descripcion :'Copia la presentacion seleccionada',
            clases : '',
            accessKey : undefined,
            icono : 'icon-retweet'

        } );
        this.gridPresentaciones.tabla.toolbar.addAction( {
            nombre : 'btnExportarRegistro',
            value :'Exportar',
            descripcion :'Exportar a JSON',
            clases : '',
            accessKey : undefined,
            icono : 'icon-upload'
        } );
        this.gridPresentaciones.tabla.toolbar.addAction( {
            nombre : 'btnPreview',
            value :'Preview',
            descripcion :'Previsualizar',
            clases : '',
            accessKey : undefined,
            icono : 'icon-eye-open'
        } );
        this.gridPresentaciones.tabla.toolbar.onlyIcons();

        this.gridCamposPresentaciones = new Grid(this.gridCamposPresentaciones);
        this.gridCamposPresentaciones.render();
        this.gridCamposPresentaciones.tabla.toolbar.addAction( {
            nombre : 'btnCopiar',
            value :'Copiar',
            descripcion :'Copia el campo de la presentacion seleccionada',
            clases : '',
            accessKey : undefined,
            icono : 'icon-retweet'

        } );
        this.gridCamposPresentaciones.tabla.toolbar.addAction( {
            nombre : 'btnImportar',
            value :'Importar',
            descripcion :'Importar los campos del modelo',
            clases : '',
            accessKey : undefined,
            icono : 'icon-download'
        } );
        this.gridCamposPresentaciones.tabla.sort('Orden');
    },
    initializeEvents : function(){

        this.colPresentacion.on('updated', _.bind(this.actualizarPresentacion, this));
        this.colPresentacion.on('inserted', _.bind(this.insertarPresentacion, this));
        this.colPresentacion.on('deleted', _.bind(this.eliminarPresentacion, this));

        this.colCamposPresentacion.on('updated', _.bind(this.actualizarCampoPresentacion, this));
        this.colCamposPresentacion.on('inserted', _.bind(this.insertarCampoPresentacion, this));
        this.colCamposPresentacion.on('deleted', _.bind(this.eliminarCampoPresentacion, this));
    },

    // FUNCIONES
    cargarCamposPresentacionSeleccionada : function(tabla){

        var campos = Env.Service_BASE.execute({
            operation : 'query',
            params : {
                table: 'campos_presentacion',
                field : 'idPresentacion',
                value : tabla.datosFilaSeleccionada.id
            }
        });
        if(campos && campos.length > 0)
            this.gridCamposPresentaciones.tabla.collection.setData(campos);
        else
            this.gridCamposPresentaciones.tabla.collection.setData([]);
    },
    cargarCamposModelo : function(tabla){
        var campos = Env.Service_BASE.execute({
            operation : 'query',
            params : {
                table: 'campos_modelo',
                field : 'idModelo',
                value : tabla.datosFilaSeleccionada.idModelo
            }
        });

        if(campos && campos.length > 0)
            this.gridCamposPresentaciones.ficha.find('idCampoModelo').setData(campos);
    },
    inicializarPresentacion : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idPresentacion').Value(this.gridPresentaciones.tabla.idFilaSeleccionada);
        }
    },

    gestionarAccionesPresentaciones : function(boton){
        switch (boton.nombre)
        {
            case 'btnCopiar':
                this.copiarPresentacion();
                break;
            case 'btnExportarRegistro':
                this.exportarPresentacion();
                break;
            case 'btnPreview':
                this.previsualizarPresentacion();
                break;
        }
    },
    copiarPresentacion : function(){
        var registro = this.gridPresentaciones.tabla.collection.buscar('id', this.gridPresentaciones.tabla.idFilaSeleccionada);
        registro.set('id', '');
        registro.set('nombre', registro.get('nombre') + '_Copia');
        this.gridPresentaciones.tabla.toolbar.controls[0].$element.trigger('click');
        this.gridPresentaciones.tabla.container.ficha.setData(registro.to_JSON());
    },
    exportarPresentacion : function(){
        var registro = this.gridPresentaciones.tabla.collection.buscar('id', this.gridPresentaciones.tabla.idFilaSeleccionada);
        myWindow = window.open('','Exportacion de registro a JSON','width=500,height=500');
        myWindow.document.write("<p>" + JSON.stringify(registro.to_JSON()) + "</p>");
        myWindow.focus();
    },
    previsualizarPresentacion : function(){
        if(this.gridPresentaciones.tabla.datosFilaSeleccionada.tipo == enums.TipoPresentacion.Ficha)
        {
            var presentacionConfig = {
                title : 'PREVISUALIZACION :: ' + this.gridPresentaciones.tabla.datosFilaSeleccionada.nombre,
                presentacion : Env.presentaciones(this.gridPresentaciones.tabla.datosFilaSeleccionada.clave, true)
            };

            var preview = new Ficha(presentacionConfig);
            preview.render();
            preview.open();
            preview.modoConsulta();
            preview.toolbar.hide();
        }
        else{
            var presentacionConfig = {
                type : 'TablePresentacion',
                nombre : 'tabla',
                title : 'PREVISUALIZACION :: ' + this.gridPresentaciones.tabla.datosFilaSeleccionada.nombre,
                modelCollection : undefined,
                presentacion : Env.presentaciones(this.gridPresentaciones.tabla.datosFilaSeleccionada.clave, true)
            };

            var dialogoPreview = new Dialog({title:'PREVIEW', elements : [presentacionConfig]});
            dialogoPreview.render();
            dialogoPreview.open();
            dialogoPreview.find(presentacionConfig.nombre).toolbar.hide();
        }
    },

    gestionarAccionesCamposPresentaciones : function(boton){
        switch (boton.nombre)
        {
            case 'btnCopiar':
                this.copiarCampoPresentacion();
                break;
            case 'btnImportar':
                this.importarCamposDesdeModelo();
                break;
        }
    },
    copiarCampoPresentacion : function(){
        var registro = this.gridCamposPresentaciones.tabla.collection.buscar('id', this.gridCamposPresentaciones.tabla.idFilaSeleccionada);
        registro.set('id', '');
        registro.set('nombre', registro.get('nombre') + '_Copia');
        this.gridCamposPresentaciones.tabla.toolbar.controls[0].$element.trigger('click');
        this.gridCamposPresentaciones.tabla.container.ficha.setData(registro.to_JSON());
    },
    importarCamposDesdeModelo : function() {
        var presentacionSeleccionada = this.gridPresentaciones.tabla.collection.buscar('id', this.gridPresentaciones.tabla.idFilaSeleccionada);
        var idModelo = presentacionSeleccionada.get('idModelo');
        var camposModelo = importarCampos(idModelo);

        var that = this;
        _.each(camposModelo, function(campo){
            campo.idPresentacion = that.gridPresentaciones.tabla.idFilaSeleccionada;
            that.service.execute({
                operation: 'insert',
                params : {
                    table: 'campos_presentacion',
                    row :campo
                }
            });
            console.log(campo);
        });

        this.gridCamposPresentaciones.tabla.collection.setData(camposModelo);
    },

    // CRUD PRESENTACIONES
    insertarPresentacion : function(registro){
        Env.Service_BASE.execute({
            operation: 'insert',
            params : {
                table: 'presentaciones',
                row : registro.to_JSON()
            }
        });
    },
    actualizarPresentacion : function(registro){
        Env.Service_BASE.execute({
            operation: 'update',
            params : {
                table: 'presentaciones',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });

    },
    eliminarPresentacion : function(registro){
        Env.Service_BASE.execute({
            operation: 'delete',
            params : {
                table: 'presentaciones',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // CRUD CAMPOS PRESENTACIONES
    insertarCampoPresentacion : function(registro){
        Env.Service_BASE.execute({
            operation: 'insert',
            params : {
                table: 'campos_presentacion',
                row : registro.to_JSON()
            }
        });
    },
    actualizarCampoPresentacion : function(registro){
        Env.Service_BASE.execute({
            operation: 'update',
            params : {
                table: 'campos_presentacion',
                field : 'id',
                value: registro.get('id'),
                row : registro.to_JSON()
            }
        });
    },
    eliminarCampoPresentacion : function(registro){
        Env.Service_BASE.execute({
            operation: 'delete',
            params : {
                table: 'campos_presentacion',
                field : 'id',
                value: registro.get('id')
            }
        });
    },

    // EVENTOS
    onPresentacionClick : function(tabla) {
        this.cargarCamposPresentacionSeleccionada(tabla);
        this.cargarCamposModelo(tabla);
    },
    onPresentacionDoubleClick : function() {
        this.cargarCamposPresentacionSeleccionada(this.gridPresentaciones.tabla);
        this.gridPresentaciones.tabla.toolbar.controls[1].$element.trigger('click');
    } ,

    onCampoPresentacionDoubleClick : function() {
        tabla.toolbar.controls[1].$element.trigger('click');
    }
});

