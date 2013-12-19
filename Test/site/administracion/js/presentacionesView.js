var PresentacionesView = Class.extend({
    initialize : function(){
        Env.on('loaded' , _.bind( this.initializeComponent, this) );

        return this;
    },
    initializeComponent : function(){
        this.initializeData();
        this.createVariables();
        this.initializeUI();
        this.initializeEvents();

        this.obtenerPresentaciones();
    },

    createVariables : function () {
        this.colPresentacion = Env.colecciones('ipk.presentaciones');
        this.colCamposPresentacion = Env.colecciones('ipk.campo_presentacion');
        this.colCamposModelo = Env.colecciones('ipk.campo_modelo');

        this.colPresentacion.makePersistible({
            table : 'adm_Presentaciones',
            service : Env.Service_WS
        });
        this.colCamposPresentacion.makePersistible({
            table : 'adm_CamposPresentacion',
            service : Env.Service_WS
        });
        this.colCamposModelo.makePersistible({
            table : 'adm_CamposModelos',
            service : Env.Service_WS
        });

        this.tablaPresentacionesConfig  = {
            type: 'Table',
            name: 'tablaPresentaciones',
            renderTo : '#gridPresentaciones',
            presentacion : Env.presentaciones('tbPresentaciones', true),
            modelCollection: this.colPresentacion
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
            modelCollection: this.colCamposPresentacion
        };
        this.fichaCamposPresentacionesConfig = {
            type : 'Ficha',
            name : 'fchModelos',
            title : 'Edicion de campo de la presentacion',
            presentacion :  Env.presentaciones('fchCamposPresentacion', true)
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
        // DATA
        this.colPresentacion.on('post-fetch', _.bind(this.cargarPresentaciones , this));
        this.colCamposPresentacion.on('post-query', _.bind(this.cargarCamposPresentaciones, this));
        this.colCamposModelo.on('post-query', _.bind(this.cargarCamposModelo, this));

        //UI
        this.gridPresentaciones.tabla.on('rowClick', _.bind(this.onPresentacionClick,this));
        this.gridPresentaciones.tabla.on('rowDblClick', _.bind(this.onPresentacionDoubleClick,this));
        this.gridPresentaciones.tabla.on('buttonClicked', _.bind(this.onPresentacionButtonClicked,this));

        this.gridCamposPresentaciones.tabla.on('rowDblClick', _.bind(this.onCampoPresentacionDoubleClick,this));
        this.gridCamposPresentaciones.tabla.on('buttonClicked', _.bind(this.onCampoPresentacionButtonClicked,this));
    },

    // FUNCIONES
    obtenerPresentaciones: function(){
        this.colPresentacion.fetch();
    },
    obtenerCamposPresentacion: function(){
        var query = {
            query : {idPresentacion: "'" + this.gridPresentaciones.tabla.idFilaSeleccionada + "'"},
            referencias: false,
            colecciones:false
        };
        this.colCamposPresentacion.query(query);
    },
    obtenerCamposModelo: function(){
        var query = {
            query : {idModelo: "'" + this.gridPresentaciones.tabla.datosFilaSeleccionada.idModelo + "'"},
            referencias: false,
            colecciones:false
        };
        this.colCamposModelo.query(query);
    },

    cargarPresentaciones : function(datos){
            if(datos.tieneDatos)
            {
                this.gridPresentaciones.tabla.collection.setData(datos.datos);
                this.gridCamposPresentaciones.ficha.find('idPresentacion').setData(datos.datos);
            }
    },
    cargarCamposPresentaciones : function(datos){
        if(datos.tieneDatos)
            this.gridCamposPresentaciones.tabla.collection.setData(datos.datos);
        else
            this.gridCamposPresentaciones.tabla.collection.setData([]);
    },
    cargarCamposModelo : function(datos){
        if(datos.tieneDatos)
            this.gridCamposPresentaciones.ficha.find('idCampoModelo').setData(datos.datos);
        else
            this.gridCamposPresentaciones.tabla.collection.setData([]);
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
                presentacion : Env.presentaciones(this.gridPresentaciones.tabla.datosFilaSeleccionada.clave)
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
                presentacion : Env.presentaciones(this.gridPresentaciones.tabla.datosFilaSeleccionada.clave)
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
            // TODO : Cambiar esto para que funcione desde el webservice
            Env.Service_WS.execute({
                operation: 'insert',
                params : {
                    table: 'adm_CamposPresentacion',
                    datos : Env.modelos('ipk.campo_presentacion', campo).to_JSON()
                }
            });
            console.log(campo);
        });

        this.gridCamposPresentaciones.tabla.collection.setData(camposModelo);
    },

    // EVENTOS
    onPresentacionClick : function() {
        this.obtenerCamposPresentacion();
        this.obtenerCamposModelo();
    },
    onPresentacionDoubleClick : function() {
        this.onPresentacionClick();
        this.gridPresentaciones.tabla.toolbar.controls[1].$element.trigger('click');
    } ,
    onPresentacionButtonClicked : function(boton){
        this.gestionarAccionesPresentaciones(boton)
    },

    onCampoPresentacionDoubleClick : function() {
        this.gridCamposPresentaciones.tabla.toolbar.controls[1].$element.trigger('click');
    },
    onCampoPresentacionButtonClicked : function(boton){
        this.gestionarAccionesCamposPresentaciones(boton)
    }
});
