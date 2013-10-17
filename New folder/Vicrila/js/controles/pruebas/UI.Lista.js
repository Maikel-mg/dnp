/**
 *
 * @param {Object}   configuracion
 * @param {String}   configuracion.contenedor
 * @param {String}   configuracion.id
 * @param {String}   configuracion.titulo
 * @param [{Boolean}]  configuracion.allowNew
 * @param [{Boolean}]  configuracion.allowDelete
 * @param [{Boolean}]  configuracion.allowEdit
 */
var Lista = function(configuracion){

    if( !$.isEmptyObject(configuracion) )
    {
        this.configurar(configuracion)
    }

    return this;
};

/* FUNCIONES DE CREACION DE LA TABLA
 **************************************************************************/
Lista.prototype.configurar  = function(configuracion){
    this.defaults = {
        allowNew : false,
        allowDelete : false,
        allowEdit : false
    };

    this.propiedades = $.extend(this.defaults, configuracion);
    this.elemento = $('#' + configuracion.contenedor);
    this.datos = [];
    this.seleccion = {};
    this.seleccionHTML = {};
    this.plantilla = '';

    this.crear();
    this.vincularEventos();
};
Lista.prototype.crear  = function(){
    this.crearLista();
};
Lista.prototype.crearLista = function(){
    var _lista = $('<div class="ipkLista"></div>');

    this.elemento.append(_lista);

    this.crearCabecera(_lista);
    this.crearCuerpo(_lista);
    this.crearPie(_lista);
};
Lista.prototype.crearToolbar = function(pie){

    var toolbarContainer = $('<div id="toolbar" class="miniToolbar"></div>');
    var toolbar = $('<ul></ul>');

    app.log.debug('Toolbar', toolbar);

    if(this.propiedades.allowNew)
        toolbar.append( this.crearToolbarButton("btnNuevoGrupo", "A&ntilde;adir nuevo registro","ui-icon ui-icon-plusthick" ) );

    toolbarContainer.append(toolbar);
    toolbarContainer.append( $('<div class="clearFix"></div>') );
    pie.append(toolbarContainer);
};
Lista.prototype.crearToolbarButton = function(id, titulo, claseIcono  ){
    var clase = 'boton';

    return "<li class='"+ clase +"' id='"+ id +"' title='"+ titulo +"'><a href='#'><span class='"+ claseIcono +"'></span></a></li>";
};
Lista.prototype.crearCabecera = function(lista){
    var cabecera = $('<div class="head"></div>');
    var titulo = $("<span class='block-Title'>"+ this.propiedades.titulo +"</span>");

    cabecera.append(titulo);

    lista.append(cabecera);
};
Lista.prototype.crearCuerpo = function(tabla){
    tabla.append('<div class="cuerpo"></div>');
};
Lista.prototype.crearPie = function(tabla){

    var pie = $('<div class="pie"></div>');

    this.crearToolbar(pie);

    tabla.append(pie);
};

Lista.prototype.vincularEventos = function(){
    var self = this;

    $(this.elemento).delegate('.cuerpo ul.datos li', 'click', function(){
        self.setSeleccion(this);

        var eventArgs = {
            elemento : this,
            datos    : self.seleccion
        };

        self.onSeleccion(eventArgs);
    });
    $(this.elemento).delegate('.cuerpo ul.datos li a.btnEditar', 'click' , function(){
        var id = $(this).closest('li').attr('id').replace(self.propiedades.id + "-", '');

        var eventArgs = {
            elemento : this,
            datos    : self.datos.find(self.propiedades.campoId, id)
        };

        self.onEdicionClick(eventArgs);
    });
    $(this.elemento).delegate('.cuerpo ul.datos li a.btnEliminar', 'click' , function(){
        var id = $(this).closest('li').attr('id').replace(self.propiedades.id + "-", '');

        var eventArgs = {
            elemento : this,
            datos    : self.datos.find(self.propiedades.campoId, id)
        };

        self.onBorrarClick(eventArgs);
    });
    $('#btnNuevoGrupo', this.elemento).on('click', function(){
        self.onNuevoClick();
    });
};

Lista.prototype.crearPlantilla = function(){
    var self = this;

    var script = $('<script type="text/template"></script>');
    var $plantilla  =  $("<li id='" + this.propiedades.id + "-${" + this.propiedades.campoId +"}'></li>");

    $plantilla.append("<a href='#'>${" + this.propiedades.campo + "}</a>");

    if(this.propiedades.allowDelete)
        $plantilla.append("<a href='#' class='ui-icon ui-icon-trash btnEliminar' style='float: right' ></a>");

    if(this.propiedades.allowEdit)
        $plantilla.append("<a href='#' class='ui-icon ui-icon-pencil btnEditar' style='float: right' ></a>");

    return script.append($plantilla);
};
Lista.prototype.setDatos = function(datos){
    var cfgDataSource = {
        entidad : this.propiedades.entidad,
        campoId : this.propiedades.campoId
    };

    this.datos = new DataSource(datos, cfgDataSource);
    this.datosCache = datos;
    this.filaSeleccionada = undefined;

    this.onDataChange(datos);
    this.render();

    return this;
};
Lista.prototype.render = function(){
    var contexto, listaDatos, plantilla;

    contexto = $('.cuerpo' , this.elemento);
    $('ul', contexto ).remove();

    listaDatos = $('<ul class="datos"></ul>');

    plantilla = this.crearPlantilla();
    plantilla.tmpl(this.datos.data).appendTo(listaDatos);

    contexto.append(listaDatos);
};
Lista.prototype.refrescar = function(evento , eventArgs ){
    if(eventArgs === undefined || eventArgs.entidad === undefined)
    {
        if(this.datos.data !== undefined)
        {
            app.log.debug('Refrescamos los datos con lo que ya tiene', eventArgs);
            this.setDatos(this.datos.data);
            this.setSeleccion($("#"+this.propiedades.id + "-" + this.getIdRegistroSeleccionada()) );
        }
    }
    else if(eventArgs.entidad == this.propiedades.entidad)
    {
        app.log.debug('Refrescamos los datos', eventArgs);
        this.setDatos(eventArgs.datos);
    }

};

Lista.prototype.setSeleccionPorId = function(id){
    $('.cuerpo ul.datos li.seleccionado', this.elemento).removeClass('seleccionado');

    var elementoHTML = $("#" +this.propiedades.id + "-" + id);
    $(elementoHTML).addClass('seleccionado');
    this.seleccion  = this.datos.find(this.propiedades.campoId, parseInt(id));
    this.seleccionHTML = elementoHTML;
};
Lista.prototype.setSeleccion = function(elementoHTML){
    $('.cuerpo ul.datos li.seleccionado', this.elemento).removeClass('seleccionado');
    $(elementoHTML).addClass('seleccionado');

    var idSeleccion = $(elementoHTML).attr('id').replace(this.propiedades.id + "-", '');
    this.seleccion  = this.datos.find(this.propiedades.campoId, idSeleccion);
    this.seleccionHTML = elementoHTML;
};
Lista.prototype.removeSeleccion = function(){
    this.seleccion  = undefined;
    this.seleccionHTML = undefined;
    $('.cuerpo ul.datos li.seleccionado', this.elemento).removeClass('seleccionado');
};
Lista.prototype.getFilaSeleccionada = function(){
    return this.seleccionHTML;
};
Lista.prototype.getIdRegistroSeleccionada = function(){
    var id = undefined;
    if(this.seleccionHTML === undefined)
    {
        alert('Debes seleccionar un registro.');
    }
    else
    {
        id = $(this.seleccionHTML).attr('id').replace(this.propiedades.id + '-', '');
        id = parseInt(id);
    }

    return id;
};
Lista.prototype.configuracionModo = function() {
    if (this.propiedades.infoListado.EsME) {
        $('.toolbar .boton', this.elemento).hide();
        $('.toolbar .botonME', this.elemento).show();
    }
    else {
        $('.toolbar .boton', this.elemento).show();
        $('.toolbar .botonME', this.elemento).hide();
    }
};
Lista.prototype.borrarFilaSeleccionada = function(){
    $(this.seleccionHTML).remove();
    this.datos.remove(parseInt(this.seleccion[this.propiedades.campoId]));
};
Lista.prototype.agregarRegistro = function(datos){
    this.datos.data.push(datos);
    this.renderFila(datos);
};
Lista.prototype.renderFila = function(datos){
    var plantilla = this.crearPlantilla();
    var fila = plantilla.tmpl(datos);
    $('.cuerpo ul.datos', this.elemento).append(fila);

    return this;
};

/* FUNCIONES DE LOS EVENTOS
 **************************************************************************/
Lista.prototype.onRender = function(){};
Lista.prototype.onDataChange = function(datos){};
Lista.prototype.onSeleccion = function(eventArgs){};
Lista.prototype.onNuevoClick = function(){};
Lista.prototype.onEdicionClick = function(eventArgs){};
Lista.prototype.onBorrarClick = function(eventArgs){};
