var FasesView = Class.extend({
    initialize : function(){
        this.initializeComponent();

        return this;
    },
    initializeComponent : function(){
        this.initializeData();
        this.createVariables();
        this.initializeUI();
        this.initializeEvents();

        this.obtenerFases();
    },

    createVariables : function () {
        this.colFases = Env.colecciones('ipk.fase');
        this.colFases.makePersistible({
            table: 'base_Fases',
            service : Env.Service_WS
        });

        this.tablaFasesConfig  = {
            type: 'Table',
            name: 'tablaFases',
            renderTo : '#gridFases',
            presentacion :   Env.presentaciones('tbFases', true),
            modelCollection: this.colFases
        };
        this.fichaFasesConfig = {
            type : 'Ficha',
            name : 'fchFses',
            title : 'Edición de fases',
            presentacion : Env.presentaciones('fchFases', true)
        };
        this.gridFases = {
            type: 'Grid',
            name: 'gridFases',
            fichaConfig: this.fichaFasesConfig,
            tablaConfig: this.tablaFasesConfig
        };
    },
    initializeData : function () {
    },
    initializeUI : function(){
        this.gridFases = new Grid(this.gridFases);
        this.gridFases.render();
    },
    initializeEvents : function(){
        // DATA
        this.colFases.on('post-fetch', _.bind(this.cargarFases, this));

        // UI
        this.gridFases.tabla.on('rowClick', _.bind(this.onFaseClick, this));
        this.gridFases.tabla.on('rowDblClick', _.bind(this.onFaseDoubleClick, this));
    },

    // FUNCIONES
    obtenerFases : function(){
        this.colFases.fetch();
    },
    cargarFases : function(datos){
        if(datos.tieneDatos)
            this.gridFases.tabla.collection.setData(datos.datos);
        else
            alert('No hay fases creadas');
    },

    // EVENTOS
    onFaseClick : function() {},
    onFaseDoubleClick : function() {
        this.gridFases.tabla.toolbar.controls[1].$element.trigger('click');
    }
});
