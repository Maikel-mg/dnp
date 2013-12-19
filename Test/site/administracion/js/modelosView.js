var ModelosView = Class.extend({
    initialize : function(){
        Env.on('loaded' , _.bind( this.initializeComponent, this) );

        return this;
    },
    initializeComponent : function(){
        this.initializeData();
        this.createVariables();
        this.initializeUI();
        this.initializeEvents();

        this.obtenerModelos();
    },

    createVariables : function () {
        this.colModelos = Env.colecciones('ipk.modelo');
        this.colCamposModelo = Env.colecciones('ipk.campo_modelo');

        this.colModelos.makePersistible({
            table : 'adm_Modelos',
            service : Env.Service_WS
        });
        this.colCamposModelo.makePersistible({
            table : 'adm_CamposModelos',
            service : Env.Service_WS
        });

        this.tablaModelosConfig  = {
            type: 'Table',
            name: 'tabla',
            renderTo : '#gridModelos',
            presentacion :   Env.presentaciones('tbModelos', true),
            modelCollection: this.colModelos
        };
        this.fichaModelosConfig = {
            type : 'Ficha',
            name : 'fchModelos',
            title : 'Edición de modelos',
            presentacion :   Env.presentaciones('fchModelos', true)
        };

        this.tablaCamposModeloConfig  = {
            type: 'Table',
            name: 'tablaCamposModelos',
            renderTo : '#gridCamposModelo',
            presentacion :   Env.presentaciones('tbCamposModelo', true),
            modelCollection: this.colCamposModelo
        };
        this.fichaCamposModeloConfig = {
            type : 'Ficha',
            name : 'fchModelos',
            title : 'Edición de campo de modelo',
            presentacion :   Env.presentaciones('fchCamposModelo', true)
        };

        this.gridModelos = {
            type: 'Grid',
            name: 'gridModelos',
            fichaConfig: this.fichaModelosConfig,
            tablaConfig: this.tablaModelosConfig
        };
        this.gridCamposModelos = {
            type: 'Grid',
            name: 'gridCamposModelos',
            fichaConfig: this.fichaCamposModeloConfig,
            tablaConfig: this.tablaCamposModeloConfig
        };
    },
    initializeData : function () {
        if(!localStorage[AppConfig.adminBD])
            location = 'creacion.html';
    },
    initializeUI : function(){
        this.gridModelos = new Grid(this.gridModelos);
        this.gridModelos.render();

        this.gridModelos.tabla.toolbar.addAction( {
            nombre : 'btnImportar',
            value :'Importar',
            descripcion :'Importar a partir de BD',
            clases : '',
            accessKey : undefined,
            icono : 'icon-download'

        } );

        this.gridModelos.tabla.toolbar.onlyIcons();

        this.gridCamposModelos = new Grid(this.gridCamposModelos);
        this.gridCamposModelos.render();
    },
    initializeEvents : function(){
        // DATA
        this.colModelos.on('post-fetch', _.bind(this.cargarModelos, this));
        this.colCamposModelo.on('post-query', _.bind(this.cargarCamposModelo, this));

        // UI
        this.gridModelos.tabla.on('rowClick', _.bind(this.onModeloClick, this));
        this.gridModelos.tabla.on('rowDblClick', _.bind(this.onModeloDoubleClick, this));
        this.gridModelos.tabla.on('buttonClicked', _.bind(this.onModeloButtonClicked, this));
        this.gridCamposModelos.ficha.on('opened',  _.bind(this.inicializarModelo, this));

    },

    // FUNCIONES
    obtenerModelos : function(){
        this.colModelos.fetch();
    },
    cargarModelos: function(datos){
        if(datos.tieneDatos)
        {
            this.gridModelos.tabla.collection.setData(datos.datos);
            this.gridCamposModelos.ficha.find('idModelo').setData(datos.datos);
        }
    },
    cargarCamposModelo : function(datos){
        if(datos.tieneDatos)
        {
            this.gridCamposModelos.tabla.collection.setData(datos.datos);
        }
    },

    gestionarAccionesModelos : function(boton){
        switch (boton.nombre)
        {
            case 'btnImportar':
                this.buscarEntidad();
                break;
        }
    },
    buscarEntidad : function(){
        logger.append('ModelosView', 'importarEntidad', 'Entrada', arguments);

        var nombre = undefined;
        nombre = window.prompt('Introduce el nombre del modelo a importar');

        if(nombre){
            console.log(nombre);
            logger.append('ModelosView', 'importarEntidad', 'Busqueda de entidad :: ' + nombre, {nombre: nombre});

            Env.Service_WS.execute({ operation : 'entidades' }).done(_.bind(this.gestionarResultadosImportacion,  this, nombre));
        }
        logger.append('ModelosView', 'importarEntidad', 'Salida');
    },
    gestionarResultadosImportacion : function(nombre, resultados){
        var entidad = _.where(resultados.datos, {EntityName : nombre});
        if(entidad && entidad.length > 0)
            this.importarEntidad(entidad[0]);
        else
            alert('No se ha encontrado ninguna entidad con el nombre indicado');
    },
    importarEntidad : function(entidad){

        var modelo = Env.ModelStore.crear('ipk.modelo', {nombre : entidad.EntityName});
        Env.Service_WS.execute({
            operation : 'insert',
            params : {
                table: 'adm_Modelos',
                datos : modelo.to_JSON()
            }
        }).done(
            _.bind(this.importarCamposEntidad, this, entidad, modelo)
        );
    },
    importarCamposEntidad : function(entidad, modelo){
        var campoModelo = undefined;

        _.each(entidad.PropertyNames, function(item){
            campoModelo = Env.ModelStore.crear('ipk.campo_modelo', {
                nombre : item.Name,
                nombreInterno : item.Name,
                tipo : item.Type.toLowerCase(),
                tipoInterno : item.Type.toLowerCase(),
                titulo : item.Name,
                idReferencia: 'ipk.modelo',
                idModelo : modelo.get('id')
            });

            Env.Service_WS.execute({
                operation : 'insert',
                params : {
                    table: 'adm_CamposModelos',
                    datos : campoModelo.to_JSON()
                }
            })
        });

        this.obtenerModelos();
    },
    inicializarModelo : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idModelo').Value(this.gridModelos.tabla.idFilaSeleccionada);
        }
    },
    obtenerCamposModeloSeleccionado : function(tabla){
        var query = {
            query : {idModelo: "'" + this.gridModelos.tabla.idFilaSeleccionada + "'"},
            referencias: false,
            colecciones:false
        };
        this.colCamposModelo.query(query);
    },

    // EVENTOS
    onModeloClick : function(tabla) {
        this.obtenerCamposModeloSeleccionado(tabla);
    },
    onModeloDoubleClick : function(tabla) {
        this.obtenerCamposModeloSeleccionado(tabla);
        this.gridModelos.tabla.toolbar.controls[1].$element.trigger('click');
    },
    onModeloButtonClicked : function(boton) {
        this.gestionarAccionesModelos(boton);
    }
});
