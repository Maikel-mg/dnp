/**
 * Control toolbar al que se le pueden añadir comendos y configurar el comportamiento cuando estos se pulsan
 *
 * @class   IpkToolbar
 * @name    IpkToolbar
 *
 * @param   {Object}   configuracion                Datos de configuración del control
 * @param   {String}   configuracion.contenedor     Contenedor donde se va ha crear el control
 * @param   {String}   configuracion.id             Identificador que se le da a el control
 */
var IpkToolbar = function(configuracion){
    this.defaults = {};
    this.propiedades = $.extend( this.defaults, configuracion );

    this.comandos = {};

    this.crear();

    return this;
};

/**
 * Creación del control dentro del contendor indicado en la configuracion
 *
 * @function
 * @private
 * @name        crear
 * @memberOf    IpkToolbar
 */
IpkToolbar.prototype.crear = function(){
    this.propiedades.control = $('<div id="'+ this.propiedades.id +'" class="toolbar noDisplay"><ul></ul><div class="clearFix"></div></div>');
    this.propiedades.control.appendTo('#'+this.propiedades.contenedor);
};
/**
 * Agregar el boton en la toobar si el grupo para con el que se esta conectado tiene acceso
 *
 * @function
 * @private
 * @name     agregarBoton
 * @memberOf IpkToolbar
 * @param   {Object}    configuracion               Datos de configuración del botón
 * @param   {String}    configuracion.nombre        Nombre del botón
 * @param   {String}    configuracion.descripcion   Descripción del botón que se mostrará al pasar el ratón por encima
 * @param   {String}    configuracion.clases        Clases extra poner en el control
 * @param   [{String}]  configuracion.accessKey     Letra para acceso rápido por teclado
 * @param   [{String}]  configuracion.icono         Clase del icono del botón
 * @param   {String}    configuracion.texto         Texto del botón
 */
IpkToolbar.prototype.agregarBoton = function(configuracion){

    if(this.tieneAcceso(configuracion))
    {
        this.comandos[configuracion.nombre] = configuracion;

        var $boton = this.crearBoton(configuracion);
        this.agregarEventos($boton);

        $("ul" , this.propiedades.control).append($boton);
        this.propiedades.control.removeClass('noDisplay');
    }

};
/**
 * Crea el boton con los datos de la configuración
 *
 * @function
 * @public
 * @name     crearBoton
 * @memberOf IpkToolbar
 * @param   {Object}    configuracion               Datos de configuración del botón
 * @param   {String}    configuracion.nombre        Nombre del botón
 * @param   {String}    configuracion.descripcion   Descripción del botón que se mostrará al pasar el ratón por encima
 * @param   {String}    configuracion.clases        Clases extra poner en el control
 * @param   {[String]}  configuracion.accessKey     Letra para acceso rápido por teclado
 * @param   [{String}]  configuracion.icono         Clase del icono del botón
 * @param   {String}    configuracion.texto         Texto del botón
 */
IpkToolbar.prototype.crearBoton = function(configuracion){
    var $li = $("<li></li>");
    $li.attr('id', configuracion.nombre);
    $li.attr('title', configuracion.descripcion);
    $li.attr('alt', configuracion.descripcion);
    $li.addClass(configuracion.clases);

    var $a = $("<a></a>");
    $a.attr('href', '#');

    if(configuracion.accessKey)
    {
        $a.attr('accessKey', configuracion.accessKey);
    }

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
/**
 * Creación del evento click del botón para lanzar el evento personalizado
 *
 * @function
 * @private
 * @name     agregarEventos
 * @memberOf IpkToolbar
 *
 * @param   {jQuery}    $boton
 */
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
/**
 * Establece la Visibilidad de los botones del toolbar
 *
 * @function
 * @public
 * @name     visibilidad
 * @memberOf IpkToolbar
 *
 * @param   {String}    nombre          Nombre del botón
 * @param   {Boolean}   visibilidad     True para mostrarlo y false para ocultarlo
 */
IpkToolbar.prototype.visibilidad = function(nombre, visibilidad){
    if(visibilidad)
        this.propiedades.control.find('#' + nombre).show();
    else
        this.propiedades.control.find('#' + nombre).hide();
};
/**
 * Comprueba si para el botón el grupo actual tiene acceso y si no , no lo dibuja
 *
 * @function
 * @private
 * @name     tieneAcceso
 * @memberOf IpkToolbar
 *
 * @param   {Object}    configuracion            Configuracion del acceso
 * @param   {String[]}  configuracion.permisos   Grupos que tienen acceso al botón, vacio si todo el mundo tiene acceso
 */
IpkToolbar.prototype.tieneAcceso = function(configuracion){
    var tieneAcceso = true;
    var permisos = configuracion.permisos;

    if(permisos)
        if( $.inArray(app.seguridad.grupoActual, permisos) == -1 )
            tieneAcceso = false;

    return tieneAcceso;
};
