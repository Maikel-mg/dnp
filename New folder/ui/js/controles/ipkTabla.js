var IpkTabla = function(configuracion){
    this.defaults = {};

    /* CAMPOS
     ******************/
    this.propiedades = $.extend(this.defaults, configuracion);
    this.elemento = $('#' + this.propiedades.contenedor);

    this.datos = [];
    this.filaSeleccionada = undefined;
    this.plantilla = '';

    this.crear();
    this.vincularEventos();

    return this;
};

IpkTabla.prototype.render  = function(){
    app.log.debug('render', this);
    $('*' , this.elemento).remove();
    this.crearTabla();
    this.setDatos(this.datos.data);
};
IpkTabla.prototype.crear  = function(){
    app.log.debug('Crear', this);
    this.elemento.addClass('listado');
    this.crearTabla();
};
IpkTabla.prototype.crearTabla = function(){
    app.log.debug('Crear Tabla', this);

    var _tabla = $('<table class="tabla width100p">');

    this.elemento.append(_tabla);


    //this.crearToolbar(_tabla);
    this.crearCabecera(_tabla);
    this.crearCuerpo(_tabla);
    this.crearPie(_tabla);
};
IpkTabla.prototype.crearCabecera = function(tabla){
    app.log.debug('Crear Cabecera', this);

    var cabecera = $('<thead></thead>');
    this.crearColumnasCabecera(cabecera);

    tabla.append(cabecera);
};
IpkTabla.prototype.crearColumnasCabecera = function(cabecera){
    var self = this;
    app.log.debug('Crear Columnas Cabecera', this);

    var columnas  =  "<tr>";
    var alineacion = "textAlignDerecha";

    if(this.propiedades.columnas)
    {
        $.each(this.propiedades.columnas, function(k,v){

            if( ! this.EsClave )
            {
                alineacion = self.alineacionTipo(this.Tipo);
                columnas += "<th class='" + alineacion+"' style='width:"+ this.Ancho +"%'>" + this.Titulo + "</th>";
            }
        });
    }

    columnas  +=  "</tr>";

    cabecera.append(columnas);
};
IpkTabla.prototype.alineacionTipo = function(tipo){

    var alineacion = '';
    switch(tipo){
        case 'Boolean': case  'DateTime':
        alineacion = 'textAlignCentro';
        break;
        case 'String':
            alineacion = 'textAlignIzquierda';
            break;
        default:
            alineacion = 'textAlignDerecha';
            break;
    }
    return alineacion;
};
IpkTabla.prototype.crearCuerpo = function(tabla){
    app.log.debug('Crear Cuerpo', this);

    tabla.append('<tbody></tbody>');
};
IpkTabla.prototype.crearPie = function(tabla){
    app.log.debug('Crear Pie', this);
    var pie = $('<tfoot></tfoot>');

    this.crearAreaBusquedaInterna(pie);
    this.crearAccionesPie(pie);

    tabla.append(pie);
};
IpkTabla.prototype.crearAreaBusquedaInterna = function(pie){
    if(this.propiedades.columnas )
    {
        var columnas = this.propiedades.columnas.length;
        var areaBusqueda = "<tr id='panelFiltro' class='noDisplay'>";
        areaBusqueda += "<td colspan='" + columnas + "'><div>";
        areaBusqueda += "<label for='filtro'>Buscar:</label><input type='text' id='filtroTexto' />";
        areaBusqueda += "<select id='filtroCampo'>";
        $.each(this.propiedades.columnas , function(){
            if(this.BusquedaInterna)
                areaBusqueda += "<option value='" + this.Nombre  +"'>" + this.Titulo + "</option>";
        });
        areaBusqueda += "</select><input type='button' id='btnFiltro' value='Buscar' />";
        areaBusqueda += "</div></td></tr>";

        pie.append(areaBusqueda);
    }
};
IpkTabla.prototype.crearAccionesPie = function(pie){
    if(this.propiedades.columnas)
    {
        var columnas = this.propiedades.columnas.length;

        var accionesPie = "<tr><td colspan='" + columnas + "'><div>";
        accionesPie += "<div id='gridActions' class='floatLeft'><a href='#' id='btnFiltrar' class='inline'><span class='icon-search'>&nbsp;</span></a></div>";
        accionesPie += "<div id='numeroRegistros' class='floatRight'>N&uacute;m Registros:  <span id='count'> 0</span></div>";
        accionesPie += "</div></td></tr>";

        pie.append(accionesPie);
    }
};

IpkTabla.prototype.vincularEventos = function(){
    var self = this;

    /* TABLA */
    $(this.elemento).delegate('tbody tr', 'click',  $.proxy(self.onRowClick, self ) );

    /* ACCIONES GRID */
    $('#btnFiltrar', this.elemento).on('click' , function(){
        $('#panelFiltro', self.elemento).toggleClass('noDisplay');
    });
};
IpkTabla.prototype.setColumnas = function(Columnas){
    this.propiedades.columnas = Columnas;
    this.render();
};

IpkTabla.prototype.campoClave = function(){
    var clave = _.find(this.propiedades.columnas, function(elemento){return elemento.EsClave == true});
    var nombre = "";
    if(clave === undefined)
        alert('No se ha seleccionado un campo clave para el listado "' + this.propiedades.id  + '"');
    else
        nombre = clave.Nombre;

    return nombre;
};
IpkTabla.prototype.valorClave = function(){
    return parseInt( $('#'+ this.campoClave()).val() );
};
IpkTabla.prototype.crearPlantilla = function(){
    if(this.propiedades.columnas)
    {
    var self = this;
    app.log.debug('Crear plantilla', this);

    var script = $('<script type="text/template"></script>');

    var $plantilla  =  $("<tr id='" + this.propiedades.id + "-${" + this.campoClave() +"}' ></tr>");
    var alineacion = "textAlignDerecha";

    $.each(this.propiedades.columnas, function(){
        alineacion = self.alineacionTipo(this.Tipo);
        if( ! this.EsClave )
        {
            alineacion = self.alineacionTipo(this.Tipo);
            $plantilla.append("<td class='" + alineacion  +"'> ${" + this.Nombre + "}</td>");
        }
    });

    app.log.debug('Plantilla creada', $plantilla);
    return script.append($plantilla);
    }
};
IpkTabla.prototype.setDatos = function(datos){
    var cfgDataSource = {
        entidad : this.propiedades.entidad,
        campoId : this.campoClave()
    };

    this.datos = new DataSource(datos, cfgDataSource);
    this.datosCache = datos;
    this.filaSeleccionada = undefined;

    var contexto, plantilla;

    contexto = $('table tbody' , this.elemento);

    plantilla = this.crearPlantilla();

    $('tr', contexto ).remove();
    plantilla.tmpl(datos).appendTo(contexto);

    this.setNumeroRegistros();
};
IpkTabla.prototype.setNumeroRegistros = function() {
    if(this.datos.data != null)
        return $('tfoot #count', this.elemento).text(this.datos.data.length);
};
IpkTabla.prototype.getFilaSeleccionada = function(){
    return this.filaSeleccionada;
};
IpkTabla.prototype.getIdRegistroSeleccionada = function(){
    var id = undefined;
    if(this.filaSeleccionada === undefined)
    {
        alert('Debes seleccionar un registro.');
    }
    else
    {

        id = $(this.filaSeleccionada).attr('id').replace(this.propiedades.id + '-', '');
        id = parseInt(id);
    }

    return id;
};
IpkTabla.prototype.borrarFilaSeleccionada = function(){
    $(this.filaSeleccionada).remove();
    // TODO: Eliminar el registro de los datos en memoria y actualizar el numero de registros del formulario
};
IpkTabla.prototype.agregarRegistro = function(datos){
    this.datos.data.push(datos);
    this.renderFila(datos);
};
IpkTabla.prototype.renderFila = function(datos){
    var plantilla = this.crearPlantilla();
    var fila = plantilla.tmpl(datos);
    $('tbody', this.elemento).append(fila);

    return this;
};

/* FUNCIONES DE LOS EVENTOS
 **************************************************************************/
IpkTabla.prototype.onRowClick = function(evento){
    $('tr.seleccionado', this.elemento).removeClass('seleccionado');
    $(evento.currentTarget).addClass('seleccionado');

    this.filaSeleccionada = $(evento.currentTarget);

    this.onRowClicked();
/*
    if(this['onRowClicked'])
        this['onRowClicked'].apply(this, []);
*/
};
IpkTabla.prototype.onRowClicked = function(){};