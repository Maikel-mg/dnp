var IpkToolbar = function(configuracion){
    this.defaults = {};
    this.propiedades = $.extend( this.defaults, configuracion );

    this.comandos = {};

    this.crear();

    return this;
};

IpkToolbar.prototype.crear = function(){
    this.propiedades.control = $('<div id="'+ this.propiedades.id +'" class="toolbar"><ul></ul><div class="clearFix"></div></div>');
    this.propiedades.control.appendTo('#'+this.propiedades.contenedor);
};

IpkToolbar.prototype.agregarBoton = function(configuracion){
    this.comandos[configuracion.nombre] = configuracion;

    var $boton = this.crearBoton(configuracion);
    this.agregarEventos($boton);

    $("ul" ,this.propiedades.control).append($boton);
};
IpkToolbar.prototype.crearBoton = function(configuracion){
    var $li = $("<li></li>");
    $li.attr('id', configuracion.nombre);
    $li.attr('title', configuracion.descripcion);
    $li.attr('alt', configuracion.descripcion);
    $li.addClass(configuracion.clases);

    var $a = $("<a></a>");
    $a.attr('href', '#');

    if(configuracion.icono)
    {
        var $icono = $("<span></span>");
        $icono.addClass(configuracion.icono);
        $a.append($icono);
    }

    var $texto = $("<span></span>");
    $texto.text(configuracion.texto);

    $a.append($texto);
    $li.append($a);

    return $li;
};
IpkToolbar.prototype.agregarEventos = function($boton){
    var self = this;
    $boton.on('click' , function(e){
        var $sender = $(this);
        var nombre = $sender.attr('id');
        var evento = 'on'+ nombre;

        if(self[evento])
            self[evento].apply( self, [$sender, nombre]);
        else
            alert('No se ha configurado ninguna accion para el boton "'+ nombre +'"');
    });
};

IpkToolbar.prototype.visibilidad = function(nombre, visibilidad){
    if(visibilidad)
        this.propiedades.control.find('#' + nombre).show();
    else
        this.propiedades.control.find('#' + nombre).hide();
};


