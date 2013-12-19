var AccesosView = Class.extend({
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
        this.obtenerRoles();
        this.obtenerFases();
        this.obtenerAccesosSeleccion();
    },

    createVariables : function () {

        this.colModelos = Env.colecciones('ipk.modelo');
        this.colRoles   = Env.colecciones('ipk.rol');
        this.colFases   = Env.colecciones('ipk.fase');
        this.colAccesos = Env.colecciones('ipk.acceso');

        this.colModelos.makePersistible({
            table   : 'base_Modelos',
            service : Env.Service_WS
        });
        this.colRoles.makePersistible({
            table   : 'base_Roles',
            service : Env.Service_WS
        });
        this.colFases.makePersistible({
            table   : 'base_Fases',
            service : Env.Service_WS
        });
        this.colAccesos.makePersistible({
            table   : 'base_Accesos',
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

        this.tablaRolesConfig  = {
            type: 'Table',
            name: 'tablaRoles',
            renderTo : '#gridRoles',
            presentacion :   Env.presentaciones('tbRoles', true),
            modelCollection: this.colRoles
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
            modelCollection: this.colFases
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
    initializeData : function () {},
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
        // DATA
        this.colModelos.on('post-fetch', _.bind(this.cargarModelos, this));
        this.colFases.on('post-fetch', _.bind(this.cargarFases, this));
        this.colRoles.on('post-fetch', _.bind(this.cargarRoles, this));
        this.colAccesos.on('post-query', _.bind(this.cargarAccesosSeleccion, this));

        // UI
        this.gridModelos.tabla.on('rowClick', _.bind(this.onFilterClick, this));
        this.gridFases.tabla.on('rowClick', _.bind(this.onFilterClick, this));
        this.gridRoles.tabla.on('rowClick', _.bind(this.onFilterClick, this));
        this.gridAccesos.ficha.on('opened', _.bind(this.inicializarFK, this));
    },

    // FUNCIONES
    obtenerModelos : function(){
        this.colModelos.fetch();
    },
    obtenerRoles : function(){
        this.colRoles.fetch();
    },
    obtenerFases: function(){
        this.colFases.fetch();
    },
    obtenerAccesosSeleccion : function(){
        if(this.gridModelos.tabla.idFilaSeleccionada !== undefined && this.gridRoles.tabla.idFilaSeleccionada !== undefined && this.gridFases.tabla.idFilaSeleccionada !== undefined)
        {
            var consulta = {
            query : {
                idModelo : "'" + this.gridModelos.tabla.idFilaSeleccionada + "'",
                idRol : "'" + this.gridRoles.tabla.idFilaSeleccionada + "'",
                idFase : "'" + this.gridFases.tabla.idFilaSeleccionada + "'"
            },
            referencias : false,
            colecciones : false
        };
            this.colAccesos.query(consulta);
        }
    },

    cargarModelos : function(datos){
        if(datos.tieneDatos)
            this.gridModelos.tabla.collection.setData(datos.datos);
    },
    cargarRoles : function(datos){
        if(datos.tieneDatos)
            this.gridRoles.tabla.collection.setData(datos.datos);
    },
    cargarFases : function(datos){
        if(datos.tieneDatos)
            this.gridFases.tabla.collection.setData(datos.datos);
    },
    cargarAccesosSeleccion : function(datos){
        if(datos.tieneDatos)
            this.gridAccesos.tabla.collection.setData(datos.datos);
        else
        {
            alert('No hay accesos creados para los datos seleccionados');
            this.gridAccesos.tabla.collection.setData([]);
        }
    },

    inicializarFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idModelo').Value(this.gridModelos.tabla.idFilaSeleccionada);
            ficha.find('idRol').Value(this.gridRoles.tabla.idFilaSeleccionada);
            ficha.find('idFase').Value(this.gridFases.tabla.idFilaSeleccionada);
        }
    },

    // EVENTOS
    onFilterClick : function(tabla) {
        this.obtenerAccesosSeleccion();
    }
});
