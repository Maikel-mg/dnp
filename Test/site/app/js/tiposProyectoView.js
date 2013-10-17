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
        this.colTiposProyecto.on('updated', _.bind(this.actualizarTipoProyecto, this));
        this.colTiposProyecto.on('inserted', _.bind(this.insertarTipoProyecto, this));
        this.colTiposProyecto.on('deleted', _.bind(this.eliminarTipoProyecto, this));

        this.colFasesProyecto.on('updated', _.bind(this.actualizarFaseTipoProyecto, this));
        this.colFasesProyecto.on('inserted', _.bind(this.insertarFaseTipoProyecto, this));
        this.colFasesProyecto.on('deleted', _.bind(this.eliminarFaseTipoProyecto, this));

        /*
        this.colTareasFaseProyecto.on('updated', _.bind(this.actualizarTareaFaseProyecto, this));
        this.colTareasFaseProyecto.on('inserted', _.bind(this.insertarTareaFaseProyecto, this));
        this.colTareasFaseProyecto.on('deleted', _.bind(this.eliminarTareaFaseProyecto, this));
        */
        this.colTareasFaseProyecto.makePersistible({
            table : 'mod_tareasTipoProyecto',
            service : Env.Service_WS

        });
        this.colTareasFaseProyecto.on('post-updated', function(){ alert('post-updated')});
    },

    obtenerTiposDeProyectos : function(){
        Env.Service_WS.execute({operation: 'listado', params : { table: 'mod_tiposProyecto'}})
            .done(_.bind(this.cargarTiposDeProyectos, this));
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

    // CRUD TIPOS PROYECTO
    insertarTipoProyecto : function(registro){
        Env.Service_WS.execute( { operation: 'insert', params : { table: 'mod_tiposProyecto', datos: registro.to_JSON()} } )
            .done(_.bind(this.obtenerTiposDeProyectos, this));
    },
    actualizarTipoProyecto : function(registro){
        var actualizacion =  registro.to_JSON();
        delete actualizacion.id;

        Env.Service_WS.execute( { operation: 'update', params : { table: 'mod_tiposProyecto', clave : {Clave : 'id', Valor : registro.get('id')}, datos: actualizacion, grupo : '' } } )
            .done(_.bind(this.obtenerTiposDeProyectos, this));
    },
    eliminarTipoProyecto : function(registro){
        Env.Service_WS.execute( { operation: 'delete', params : { table: 'mod_tiposProyecto', clave : 'id', valor: registro.get('id') } } )
           .done(_.bind(this.obtenerTiposDeProyectos, this));
    },

    // CRUD FASES
    insertarFaseTipoProyecto : function(registro){
        Env.Service_WS.execute( { operation: 'insert', params : { table: 'mod_fasesTipoProyecto', datos: registro.to_JSON()} } )
           .done(_.bind(this.cargarFasesTipoProyectoSeleccionado, this));
    },
    actualizarFaseTipoProyecto : function(registro){
        var actualizacion =  registro.to_JSON();
        delete actualizacion.id;

        Env.Service_WS.execute( { operation: 'update', params : { table: 'mod_fasesTipoProyecto', clave : {Clave : 'id', Valor : registro.get('id')}, datos: actualizacion, grupo : '' } } )
           .done(_.bind(this.cargarFasesTipoProyectoSeleccionado, this));
    },
    eliminarFaseTipoProyecto : function(registro){
        Env.Service_WS.execute( { operation: 'delete', params : { table: 'mod_fasesTipoProyecto', clave : 'id', valor: registro.get('id') } } )
            .done(_.bind(this.cargarFasesTipoProyectoSeleccionado, this));
    },

    // CRUD TAREAS
    insertarTareaFaseProyecto : function(registro){
        Env.Service_WS.execute( { operation: 'insert', params : { table: 'mod_tareasTipoProyecto', datos: registro.to_JSON()} } )
            .done(_.bind(this.cargarTareasFasesProyectoSeleccionado, this));
    },
    actualizarTareaFaseProyecto : function(registro){
        var actualizacion =  registro.to_JSON();
        delete actualizacion.id;

        Env.Service_WS.execute( { operation: 'update', params : { table: 'mod_tareasTipoProyecto', clave : {Clave : 'id', Valor : registro.get('id')}, datos: actualizacion, grupo : '' } } )
            .done(_.bind(this.cargarTareasFasesProyectoSeleccionado, this));
    },
    eliminarTareaFaseProyecto : function(registro){
        Env.Service_WS.execute( { operation: 'delete', params : { table: 'mod_tareasTipoProyecto', clave : 'id', valor: registro.get('id') } } )
            .done(_.bind(this.cargarTareasFasesProyectoSeleccionado, this));
    },

    // FUNCIONES
    setTipoProyectoFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idTipoProyecto').Value(this.gridTiposProyecto.tabla.idFilaSeleccionada);
        }
    },
    cargarFasesTipoProyectoSeleccionado : function(tabla){
                    Env.Service_WS.execute( { operation: 'buscar', params : { table :'mod_fasesTipoProyecto', clave: {idTipoProyecto: "'" + this.gridTiposProyecto.tabla.idFilaSeleccionada + "'"}, Referencias: false, Colecciones:false}})
            .done(_.bind(this.cargarFasesTiposDeProyectos, this));
    },

    setFaseProyectoFK : function(ficha){
        if(ficha.modo == Ficha.Modos.Alta)
        {
            ficha.find('idFase').Value(this.gridFasesProyecto.tabla.idFilaSeleccionada);
        }
    },
    cargarTareasFasesProyectoSeleccionado : function(tabla){

        Env.Service_WS.execute( { operation: 'buscar', params : { table :'mod_tareasTipoProyecto', clave: {idFase: "'" + this.gridFasesProyecto.tabla.idFilaSeleccionada + "'"}, Referencias: false, Colecciones:false}})
            .done(_.bind(this.cargarTareasFasesTiposDeProyecto, this));
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
