var IpkMostrarElegir = function(configuracion){
    this.referencia = Date.now();
    this.defaults = {};
    this.propiedades = $.extend(this.defaults , configuracion);

    this.tabla = {};
    this.toolbar = {};
    this.dialogo = {};

    this.seleccion = {};

    this.crear();
};

IpkMostrarElegir.prototype.crear = function(){
    this.crearDialogo();
    this.crearToolbar();
    this.crearTabla();

};

IpkMostrarElegir.prototype.crearDialogo = function(){
    var nombreME = this.propiedades.Nombre  + "_ME_" + this.referencia;
    var selectorME = "#" + nombreME;
    var selectorTitleBar = "#ui-dialog-title-" + nombreME;

    if($(selectorME).length > 0)
        $(selectorME + " *").remove();
    else{
        this.dialogo = $("<div id='" + nombreME + "' class='ME listado'></div>");
        $('body').append(this.dialogoMe);
        this.dialogo.dialog({
            autoOpen: false,
            modal : true,
            title : 'Seleccion de ' + this.propiedades.Nombre,
            width: '1120',
            height : '700'
        });
        $(selectorTitleBar).closest('div').find('a').hide();
    }
};
IpkMostrarElegir.prototype.crearTabla = function(){
    var contenedorTabla = this.propiedades.Nombre  + "_Tabla_ME_" + this.referencia;
    var toolbarContainer = $('<div id="' + contenedorTabla + '"></div>');
    this.dialogo.append(toolbarContainer);

    //this.tabla = new IpkTablaConectada(contenedorTabla , this.propiedades);
    this.propiedades.contenedor = contenedorTabla;
    this.tabla = new IpkRemoteTabla(this.propiedades);

    var self = this;
    this.tabla.tabla.onRowClicked = function(){
        self.seleccion  = this.datos.find( this.campoClave() , this.getIdRegistroSeleccionada());
    };
};
IpkMostrarElegir.prototype.crearToolbar = function(){
    var idToolbar = 'toolbar' + this.propiedades.Nombre +'_ME_' + this.referencia;
    var toolbarContainer = $('<div id="' + idToolbar  + '"></div>');
    this.dialogo.append(toolbarContainer);

    this.toolbar = new IpkToolbar({
        contenedor : idToolbar ,
        id         : idToolbar
    });

    this.toolbar.agregarBoton({
        nombre : "Seleccion",
        descripcion : "Seleccionar el registro",
        clases : "",
        icono : "icon-ok",
        texto : "Seleccionar"
    });
    this.toolbar.agregarBoton({
        nombre : "Cancelar",
        descripcion : "Cancelar la selección de registro",
        clases : "",
        icono : "icon-remove",
        texto : "Cancelar"
    });

    var self = this;
    this.toolbar.onSeleccion = function(){

        var eventArgs = {
            seleccion : self.seleccion
        };

        self.cerrar();
        self.onSeleccionClick(eventArgs);
        self.seleccion = undefined;
    };
    this.toolbar.onCancelar = function(){
        self.cerrar();
        self.onCancelarClick();

        self.seleccion = undefined;
    };
};

IpkMostrarElegir.prototype.abrir = function(){
    this.dialogo.dialog('open');
};
IpkMostrarElegir.prototype.cerrar = function(){
    this.dialogo.dialog('close');
};
IpkMostrarElegir.prototype.setDatos = function(datos){
    this.tabla.tabla.setDatos(datos);
};

IpkMostrarElegir.prototype.onSeleccionClick = function(eventArgs){
    app.log.debug('onSeleccionClick', eventArgs);
};
IpkMostrarElegir.prototype.onCancelarClick = function(){};

