/**
 * User: Maikel Merillas
 * Date: 19/06/2012
 * Time: 9:24
 * Clase base para los listados
 */
var ComponenteListado = function (opciones) {
    this.filaSeleccionada = undefined;
    this.propiedades = {};

    this.propiedades.opciones = opciones;
    this.propiedades.entidad  = opciones.entidad;
    this.propiedades.contenedor = opciones.contenedor;
    this.propiedades.cabecera = opciones.cabecera;
    this.propiedades.plantilla = opciones.plantilla;
    this.propiedades.esME = (opciones.esME === undefined)? false : opciones.esME ;
    this.propiedades.accionesEnLinea = (opciones.accionesEnLinea === undefined)? false : opciones.accionesEnLinea ;
    this.propiedades.sufijo = opciones.sufijo;

    this.vincularEventos();
    this.configuracionModo();
    app.log.debug('Inicalizado', this);

    return this;
};

ComponenteListado.prototype.vincularEventos = function(){
    var self = this;

    /* TABLA */
    $(this.propiedades.contenedor).delegate('tbody tr', 'click',  $.proxy(self.onRowClick, self ) );

    /* TOOLBAR */
    $('#btnSeleccionME', this.propiedades.contenedor).on('click', $.proxy(self.onBtnSeleccionMEClick, self) );
    $('#btnCancelarME', this.propiedades.contenedor).on('click', $.proxy(self.onBtnCancelarMEClick, self ) );
    $('#btnNuevoDossier', this.propiedades.contenedor).on('click', $.proxy(self.onBtnNuevoClick, self) );
    $('#btnIrAFichar', this.propiedades.contenedor).on('click', $.proxy(self.onBtnIrAFichaClick, self) );
    $('#btnBorrar', this.propiedades.contenedor).on('click', $.proxy(self.onBtnBorrarClick, self ) );
    $('#btnCopiar',this.propiedades.contenedor).on('click', $.proxy(self.onBtnCopiarClick, self ) );
    $('#btnNuevaVersion', this.propiedades.contenedor).on('click', $.proxy(self.onBtnNuevaVersion, self ) );
    $('#btnCrearLanzamiento',this.propiedades.contenedor).on('click', $.proxy(self.onBtnCrearLanzamiento, self ) );

    /* ACCIONES GRID */
    $('#btnFiltrar', this.propiedades.contenedor).on('click' , function(){
        $('#panelFiltro').toggle();
    });
};
ComponenteListado.prototype.render = function(){
    var filaCabecera = this.crearFilaCabecera();
    $('table thead', this.propiedades[ComponenteListado.Propiedades.Contenedor]).append(filaCabecera);

    return this;
};
ComponenteListado.prototype.renderFila = function(datos){
    var fila = $(this.propiedades[ComponenteListado.Propiedades.Plantilla]).tmpl(datos);
    $('table tbody', this.propiedades[ComponenteListado.Propiedades.Contenedor]).append(fila);

    return this;
};
ComponenteListado.prototype.getPropiedad = function(propiedad){
    return this.propiedades[propiedad];
};
ComponenteListado.prototype.setDatos = function(datos){
    var contexto;
    this.propiedades[ComponenteListado.Propiedades.Datos] = datos;
    this.filaSeleccionada = undefined;

    contexto = $('table tbody' , this.propiedades.contenedor);

    $('tr', contexto ).remove();
    $(this.propiedades.plantilla).tmpl(datos).appendTo(contexto);

    this.setNumeroRegistros();
    this.visibilidadAccionesEnLinea();
};
ComponenteListado.prototype.crearFilaCabecera = function() {
    var filaCabecera , camposCabecera , tieneAccionesEnLinea;

    camposCabecera = this.propiedades[ComponenteListado.Propiedades.Cabecera];
    tieneAccionesEnLinea = this.propiedades[ComponenteListado.Propiedades.AccionesEnLinea];

    var strCabecera;

    $.each(camposCabecera, function (k, v) {
        strCabecera += '<th>' + v + ' </th>';
    });

    if (tieneAccionesEnLinea)
        strCabecera += '<th>&nbsp;</th>';

    filaCabecera = $('<tr>' + strCabecera + '</tr>');

    return filaCabecera;
};
ComponenteListado.prototype.visibilidadAccionesEnLinea = function() {
    if (!this.propiedades.accionesEnLinea) {
        $('.acciones', this.propiedades.contenedor).closest('td').hide();
    }
};
ComponenteListado.prototype.setNumeroRegistros = function() {
    app.log.debug('cuenta', this.propiedades[ComponenteListado.Propiedades.Datos] );
    if(this.propiedades[ComponenteListado.Propiedades.Datos] != null)
        return $('tfoot #count', this.propiedades[ComponenteListado.Propiedades.Contenedor]).text(this.propiedades[ComponenteListado.Propiedades.Datos].length);
};
ComponenteListado.prototype.configuracionModo = function() {
    if (this.propiedades.esME) {
        $('.toolbar .boton', this.propiedades.contenedor).hide();
        $('.toolbar .botonME', this.propiedades.contenedor).show();
    }
    else {
        $('.toolbar .boton', this.propiedades.contenedor).show();
        $('.toolbar .botonME', this.propiedades.contenedor).hide();
    }
};
ComponenteListado.prototype.getFilaSeleccionada = function(){
    return this.filaSeleccionada;
};
ComponenteListado.prototype.getIdRegistroSeleccionada = function(){
    var id = undefined;
    if(this.filaSeleccionada === undefined)
    {
        alert('Debes seleccionar un registro.');
    }
    else
    {
        id = $(this.filaSeleccionada).attr('id').replace(this.propiedades.sufijo, '');
        id = parseInt(id);
    }

    return id;
};
ComponenteListado.prototype.borrarFilaSeleccionada = function(){
    $(this.filaSeleccionada).remove();
    // TODO: Eliminar el registro de los datos en memoria y actualizar el numero de registros del formulario
};
ComponenteListado.prototype.agregarRegistro = function(datos){
    this.propiedades.datos.push(datos);
    this.renderFila(datos);
    this.visibilidadAccionesEnLinea();
    this.setNumeroRegistros();
};

/**** EVENTOS ****/
ComponenteListado.prototype.onRowClick = function(evento){

    $('tr.seleccionado', this.propiedades.contenedor).removeClass('seleccionado');
    $(evento.currentTarget).addClass('seleccionado');

    this.filaSeleccionada = $(evento.currentTarget);

    app.eventos.publicar(ComponenteListado.Eventos.OnRowClick, {Entidad: this.propiedades.entidad ,Fila:  this.filaSeleccionada }, true)
};
ComponenteListado.prototype.onBtnNuevoClick = function(sender){
    app.eventos.publicar(ComponenteListado.Eventos.OnBtnNuevoClick, { Entidad: this.propiedades.entidad } , true);
};
ComponenteListado.prototype.onBtnIrAFichaClick = function(sender){
    app.log.debug('Seleccion', this.filaSeleccionada);
    if(this.filaSeleccionada === undefined)
    {
        alert('Debes seleccionar un registro.');
    }
    else
    {
        app.eventos.publicar(ComponenteListado.Eventos.OnBtnIrAFichaClick, {Entidad: this.propiedades.entidad ,Fila: this.filaSeleccionada}, true);
    }
};
ComponenteListado.prototype.onBtnBorrarClick = function(sender){
    if(this.filaSeleccionada === undefined)
    {
        alert('Debes seleccionar un registro.');
    }
    else
    {
        app.eventos.publicar(ComponenteListado.Eventos.OnBtnBorrarClick, {Entidad : this.propiedades.entidad, Fila: this.filaSeleccionada }, true);
    }
};
ComponenteListado.prototype.onBtnCopiarClick = function(sender){
    if(this.filaSeleccionada === undefined)
    {
        alert('Debes seleccionar un registro.');
    }
    else
    {
        app.eventos.publicar(ComponenteListado.Eventos.OnBtnCopiarClick, {Entidad :  this.propiedades.entidad, Fila: this.filaSeleccionada}, true);
    }
};
ComponenteListado.prototype.onBtnNuevaVersion = function(sender){
    if(this.filaSeleccionada === undefined)
    {
        alert('Debes seleccionar un registro.');
    }
    else
    {

        //var id = getIdRegistroSeleccionada();
        //var versiones = _.find(propiedades[ComponenteListado.Propiedades.Datos], function(elemento) {return  elemento.IdDossier == id });

        app.eventos.publicar(ComponenteListado.Eventos.OnBtnNuevaVersion, {Entidad : this.propiedades.entidad, Fila: this.filaSeleccionada}, true);
    }
};
ComponenteListado.prototype.onBtnSeleccionMEClick = function(sender){
    if(this.filaSeleccionada === undefined)
    {
        alert('Debes seleccionar un registro.');
    }
    else
    {
        app.eventos.publicar(ComponenteListado.Eventos.OnBtnSeleccionMEClick, {Entidad:  this.propiedades.entidad, Fila: this.filaSeleccionada}, true);
    }
};
ComponenteListado.prototype.onBtnCancelarMEClick = function(sender){
    app.eventos.publicar(ComponenteListado.Eventos.OnBtnCancelarMEClick, {Entidad:  this.propiedades.entidad}, true);
};

/**** PROPIEDADES ****/
ComponenteListado.Propiedades = {
    Contenedor      : "contenedor",
    Cabecera        : "cabecera",
    Plantilla       : "plantilla",
    Datos           : "datos",
    AccionesEnLinea : "accionesEnLinea"
};
ComponenteListado.Eventos = {
    OnRowClick              : 'onRowClick',

    OnBtnNuevoClick         : 'onBtnNuevoClick',
    OnBtnIrAFichaClick      : 'onBtnIrAFichaClick',
    OnBtnBorrarClick        : 'onBtnBorrarClick',
    OnBtnCopiarClick        : 'onBtnCopiarClick',
    OnBtnNuevaVersion       : 'onBtnNuevaVersion',
    OnBtnCrearLanzamiento   : 'onBtnCrearLanzamiento',

    OnBtnSeleccionMEClick   : 'onBtnSeleccionMEClick',
    OnBtnCancelarMEClick    : 'onBtnCancelarMEClick'
};
