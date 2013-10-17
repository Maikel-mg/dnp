var CreacionView = Class.extend({
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
    },
    initializeData : function () {
    },
    initializeUI : function(){
        this.btnCrearApp = $("#crearApp");
    },
    initializeEvents : function(){
        this.btnCrearApp.on('click', _.bind( this.onBtnCrearAppClick, this));
    },

    comprobarExistenciaAplicacion : function(nombre){
        return (localStorage[nombre + '_ADM']);
    },
    crearAplicacion : function(nombre){
        localStorage[nombre + '_ADM'] = JSON.stringify( {
            modelos : [],
            campos_modelo : [],
            presentaciones : [],
            campos_presentacion : [],
            vista_presentacion : [],
            campos_vista_presentacion : [],
            roles : [],
            accesos : [],
            usuarios : [],
            fases : []
        } );
        localStorage[nombre + '_DATA'] = JSON.stringify({});
        localStorage[nombre + '_BACKUP'] = JSON.stringify({});
    },
    onBtnCrearAppClick : function() {
        var nombreApp = prompt('Introduce el nombre de la aplicación');
        if(nombreApp)
        {
            if( this.comprobarExistenciaAplicacion(nombreApp) )
                alert('Ya existe la aplicacion ' + nombreApp);
            else
            {
                this.crearAplicacion(nombreApp);
                alert('OK, la aplicación ' +  nombreApp + ' ha sido creada');
                location = 'modelos.html';
            }
        }

    }
});
