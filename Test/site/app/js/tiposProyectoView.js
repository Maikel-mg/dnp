var TiposProyectoView = Class.extend({
    initialize : function(){
        this.initializeComponent();

        return this;
    },
    initializeComponent : function(){
        this.createVariables();
        this.initializeData();
        this.initializeUI();
        this.initializeEvents();

        this.obtenerTiposDeProyectos();
    },

    createVariables : function () {
        this.colTiposProyecto = Env.colecciones('vcl.tipoProyecto');
        this.colFasesProyecto = Env.colecciones('vcl.faseProyecto');
        this.colTareasFaseProyecto = Env.colecciones('vcl.tareaFaseProyecto');

        this.colTiposProyecto.makePersistible({
            table : 'mod_tiposProyecto',
            service : Env.Service_WS

        });
        this.colFasesProyecto.makePersistible({
            table : 'mod_fasesTipoProyecto',
            service : Env.Service_WS

        });
        this.colTareasFaseProyecto.makePersistible({
            table : 'mod_tareasTipoProyecto',
            service : Env.Service_WS

        });

        this.tablaTiposProyectoConfig  = {
            type: 'Table',
            name: 'tablaTiposProyecto',
            renderTo : '#gridModelos',
            presentacion :   Env.presentaciones('tbTiposProyecto'),
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
            title : 'Edición de Tipo Proyecto',
            presentacion :   Env.presentaciones('fchTiposProyecto')
        };

        this.tablaFasesProyectoConfig  = {
            type: 'Table',
            name: 'tablaFasesProyecto',
            renderTo : '#gridFasesProyecto',
            presentacion :   Env.presentaciones('tbFasesTipoProyecto'),
            modelCollection: this.colFasesProyecto,
            events: {
                control: {
                    rowClick: _.bind(this.onFaseProyectoClick, this),
                    rowDblClick: _.bind(this.onFaseProyectoDoubleClick, this)
                }
            }
        };
        this.fichaFasesProyectoConfig = {
            type : 'Ficha',
            name : 'fchFasesProyecto',
            title : 'Edición de fase del proyecto',
            presentacion :   Env.presentaciones('fchFasesTipoProyecto'),
            events: {
                control: {
                    opened : _.bind(this.setTipoProyectoFK, this)
                }
            }
        };

        this.tablaTareasFaseProyectoConfig  = {
            type: 'Table',
            name: 'tablaTareasFasesProyecto',
            renderTo : '#gridTareasFasesProyecto',
            presentacion :   Env.presentaciones('tbTareasFaseProyecto'),
            modelCollection: this.colTareasFaseProyecto,
            events: {
                control: {
                    rowDblClick: _.bind(this.onTareaFaseProyectoDoubleClick, this)
                }
            }
        };
        this.fichaTareasFaseProyectoConfig = {
            type : 'Ficha',
            name : 'fchTareasFasesProyecto',
            title : 'Edición de la tarea de la fase',
            presentacion :   Env.presentaciones('fchTareasFaseProyecto'),
            events: {
                control: {
                    opened : _.bind(this.setFaseProyectoFK, this)
                }
            }
        };

        this.gridTiposProyecto = {
            type: 'Grid',
            name: 'gridTiposProyecto',
            fichaConfig: this.fichaTiposProyectoConfig,
            tablaConfig: this.tablaTiposProyectoConfig
        };
        this.gridFasesProyecto = {
            type: 'Grid',
            name: 'gridFasesModelo',
            fichaConfig: this.fichaFasesProyectoConfig,
            tablaConfig: this.tablaFasesProyectoConfig
        };
        this.gridTareasFasesProyecto = {
            type: 'Grid',
            name: 'gridTareasFaseModelo',
            fichaConfig: this.fichaTareasFaseProyectoConfig,
            tablaConfig: this.tablaTareasFaseProyectoConfig
        };
    },
    initializeData : function () {
        console.log('initializeData');
    },
    initializeUI : function(){
        this.gridTiposProyecto = new Grid(this.gridTiposProyecto);
        this.gridTiposProyecto.render();
        this.gridTiposProyecto.tabla.toolbar.onlyIcons();

        this.gridFasesProyecto = new Grid(this.gridFasesProyecto);
        this.gridFasesProyecto.render();
        this.gridFasesProyecto.tabla.toolbar.onlyIcons();

        this.gridTareasFasesProyecto = new Grid(this.gridTareasFasesProyecto);
        this.gridTareasFasesProyecto.render();
        this.gridTareasFasesProyecto.tabla.toolbar.onlyIcons();
    },
    initializeEvents : function(){
        this.colTiposProyecto.on('post-fetch', _.bind(this.cargarTiposDeProyectos, this));
        this.colTiposProyecto.on('post-inserted', _.bind(this.obtenerTiposDeProyectos, this));
        this.colTiposProyecto.on('post-updated', _.bind(this.obtenerTiposDeProyectos, this));
        this.colTiposProyecto.on('post-deleted', _.bind(this.obtenerTiposDeProyectos, this));

        this.colFasesProyecto.on('post-query', _.bind(this.cargarFasesTiposDeProyectos, this));
        this.colFasesProyecto.on('post-inserted', _.bind(this.cargarFasesTipoProyectoSeleccionado, this));
        this.colFasesProyecto.on('post-updated', _.bind(this.cargarFasesTipoProyectoSeleccionado, this));
        this.colFasesProyecto.on('post-deleted', _.bind(this.cargarFasesTipoProyectoSeleccionado, this));

        this.colTareasFaseProyecto.on('post-query', _.bind(this.cargarTareasFasesTiposDeProyecto, this));
        this.colTareasFaseProyecto.on('post-inserted', _.bind(this.cargarTareasFasesProyectoSeleccionado, this));
        this.colTareasFaseProyecto.on('post-updated', _.bind(this.cargarTareasFasesProyectoSeleccionado, this));
        this.colTareasFaseProyecto.on('post-deleted', _.bind(this.cargarTareasFasesProyectoSeleccionado, this));
    },

    obtenerTiposDeProyectos : function(){
        this.colTiposProyecto.fetch();
    },
    cargarTiposDeProyectos: function(datos){
        if(datos.tieneDatos)
        {
            this.gridTiposProyecto.tabla.collection.setData(datos.datos);
            this.gridFasesProyecto.ficha.find('idTipoProyecto').setData(datos.datos);
        }
    },
    cargarFasesTiposDeProyectos: function(datos){
        if(datos.tieneDatos)
        {
            this.gridFasesProyecto.tabla.collection.setData(datos.datos);
            this.gridTareasFasesProyecto.ficha.find('idFase').setData(datos.datos);
            this.gridTareasFasesProyecto.tabla.collection.setData([]);
        }
        else
        {
            this.gridFasesProyecto.tabla.collection.setData([]);
            this.gridTareasFasesProyecto.tabla.collection.setData([]);
            this.gridTareasFasesProyecto.ficha.find('idFase').setData([]);
        }
    },
    cargarTareasFasesTiposDeProyecto: function(datos){
        if(datos.tieneDatos)
            this.gridTareasFasesProyecto.tabla.collection.setData(datos.datos);
        else
            this.gridTareasFasesProyecto.tabla.collection.setData([]);
    },

    // FUNCIONES
    setTipoProyectoFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idTipoProyecto').Value(this.gridTiposProyecto.tabla.idFilaSeleccionada);
        }
    },
    cargarFasesTipoProyectoSeleccionado : function(tabla){
        var query = {
            query : {
                idTipoProyecto: "'" + this.gridTiposProyecto.tabla.idFilaSeleccionada + "'"
            },
            referencias: false,
            colecciones:false
        };
        this.colFasesProyecto.query(query);
    },

    setFaseProyectoFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idFase').Value(this.gridFasesProyecto.tabla.idFilaSeleccionada);
        }
    },
    cargarTareasFasesProyectoSeleccionado : function(tabla){
        var query = {
            query : {idFase: "'" + this.gridFasesProyecto.tabla.idFilaSeleccionada + "'"},
            referencias: false,
            colecciones:false
        };
        this.colTareasFaseProyecto.query(query);
    },

    // EVENTOS
    onTipoProyectoClick : function(tabla) {
        this.cargarFasesTipoProyectoSeleccionado(tabla);
    },
    onTipoProyectoDoubleClick : function(tabla) {
        this.cargarFasesTipoProyectoSeleccionado(tabla);
        this.gridTiposProyecto.tabla.toolbar.controls[1].$element.trigger('click');
    },

    onFaseProyectoClick : function(tabla) {
        this.cargarTareasFasesProyectoSeleccionado(tabla);
    },
    onFaseProyectoDoubleClick : function(tabla) {
        this.cargarTareasFasesProyectoSeleccionado(tabla);
        this.gridFasesProyecto.tabla.toolbar.controls[1].$element.trigger('click');
    },

    onTareaFaseProyectoDoubleClick : function(tabla) {
        this.gridTareasFasesProyecto.tabla.toolbar.controls[1].$element.trigger('click');
    }
});
