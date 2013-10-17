(function($){
    $.fn.listado = function(options) {
        var self = this;
        self.options = options;

        return new tabla(this , self.options);
    };

    var tabla = function(elemento, options){
        this.defaults = {
            allowNew : true,
            allowDetails : true,
            allowDelete : true,
            allowCopy : true
        };

        /* CAMPOS
        ******************/
        this.propiedades = $.extend(this.defaults, options);
        this.elemento = $(elemento);
        this.nombre = $(elemento).attr('id');

        this.datos = [];
        this.filaSeleccionada = undefined;
        this.plantilla = '';

        this.crear();
        this.configuracionModo();
        this.vincularEventos();

        app.log.debug('Propiedades del la tabla', this.propiedades );

        return this;
    };

    /* FUNCIONES DE CREACION DE LA TABLA
    **************************************************************************/
    tabla.prototype.crear  = function(){
        app.log.debug('Crear', this);
        this.crearTabla();
    };
    tabla.prototype.crearTabla = function(){
        app.log.debug('Crear Tabla', this);

        var _tabla = $('<table class="tabla width100p">');

        this.elemento.append(_tabla);

        this.crearToolbar(_tabla);
        this.crearCabecera(_tabla);
        this.crearCuerpo(_tabla);
        this.crearPie(_tabla);
    };

    tabla.prototype.crearToolbar = function(tabla){
        //var caption = this.elemento.find('.tabla').append('<caption></caption>');
        var caption = $('<caption></caption>');
        var toolbarContainer = $('<div id="toolbar" class="toolbar"></div>');
        var toolbar = $('<ul></ul>');

        app.log.debug('Toolbar', toolbar);

        if(this.propiedades.infoListado.EsColeccion)
        {
            toolbar.append( this.crearToolbarButton("btnCrearRelacion", "Agrega un registro a la coleccion","icon-share", "Crear relacion", 'Coleccion') );
            toolbar.append( this.crearToolbarButton("btnBorrarRelacion", "Quita un registro de la coleccion","icon-remove", "Borrar relacion", 'Coleccion') );
        }
        else
        {
            if(this.propiedades.infoListado.EsME)
            {
                toolbar.append( this.crearToolbarButton("btnSeleccionME", "Seleccionar el registro","icon-share", "Seleccionar", 'ME') );
                toolbar.append( this.crearToolbarButton("btnCancelarME", "Cancelar la seleccion de registro","icon-remove", "Cancelar", 'ME') );
            }
            else
            {
                if(this.propiedades.allowNew)
                    toolbar.append( this.crearToolbarButton("btnNuevoDossier", "A&ntilde;adir nuevo registro","icon-plus-sign", "Crear nuevo", 'Consulta') );
                if(this.propiedades.allowDetails)
                    toolbar.append( this.crearToolbarButton("btnIrAFichar", "r a fichar del registro seleccionado","icon-list-alt", "Ir a ficha", 'Consulta') );
                if(this.propiedades.allowDelete)
                    toolbar.append( this.crearToolbarButton("btnBorrar", "Borrar el registro seleccionado","icon-trash", "Borrar", 'Consulta') );
                if(this.propiedades.allowCopy)
                    toolbar.append( this.crearToolbarButton("btnCopiar", "Copiar el registro seleccionado","icon-repeat", "Copiar", 'Consulta') );
            }
        }

        toolbarContainer.append(toolbar);
        toolbarContainer.append( $('<div class="clearFix"></div>') );
        caption.append(toolbarContainer);
        tabla.append(caption);
    };
    tabla.prototype.crearToolbarButton = function(id, titulo, claseIcono ,texto, tipo ){
        var clase = 'boton';
        switch(tipo){
            case "ME":
                clase += 'ME';
                break;
            case "Coleccion":
                clase += 'Coleccion';
                break;
        }

        return "<li class='"+ clase +"' id='"+ id +"' title='"+ titulo +"'><a href='#'><span class='"+ claseIcono +"'></span><span>"+ texto +"</span></a></li>";
    };

    tabla.prototype.crearCabecera = function(tabla){
        app.log.debug('Crear Cabecera', this);

        var cabecera = $('<thead></thead>');
        this.crearColumnasCabecera(cabecera);

        tabla.append(cabecera);
    };
    tabla.prototype.crearColumnasCabecera = function(cabecera){
        var self = this;
        app.log.debug('Crear Columnas Cabecera', this);

        var columnas  =  "<tr>";
        var alineacion = "textAlignDerecha";

        $.each(this.propiedades.infoCampos, function(k,v){

            if( ! this.EsClave )
            {
                alineacion = self.alineacionTipo(this.Tipo);
                columnas += "<th class='" + alineacion+"' style='width:"+ this.Ancho +"%'>" + this.Titulo + "</th>";
            }

        });

        columnas  +=  "</tr>";

        cabecera.append(columnas);
    };
    tabla.prototype.alineacionTipo = function(tipo){

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

    tabla.prototype.crearCuerpo = function(tabla){
        app.log.debug('Crear Cuerpo', this);

        tabla.append('<tbody></tbody>');
    };

    tabla.prototype.crearPie = function(tabla){
        app.log.debug('Crear Pie', this);
        var pie = $('<tfoot></tfoot>');

        this.crearAreaBusquedaInterna(pie);
        this.crearAccionesPie(pie);

        tabla.append(pie);
    };
    tabla.prototype.crearAreaBusquedaInterna = function(pie){
        var columnas = this.propiedades.infoCampos.length;
        var areaBusqueda = "<tr id='panelFiltro' class='noDisplay'>";
        areaBusqueda += "<td colspan='" + columnas + "'><div>";
        areaBusqueda += "<label for='filtro'>Buscar:</label><input type='text' id='filtroTexto' />";
        areaBusqueda += "<select id='filtroCampo'>";
        $.each(this.propiedades.infoCampos, function(){
            if(this.BusquedaInterna)
                areaBusqueda += "<option value='" + this.Nombre  +"'>" + this.Titulo + "</option>";
        });
        areaBusqueda += "</select><input type='button' id='btnFiltro' value='Buscar' />";
        areaBusqueda += "</div></td></tr>";

        pie.append(areaBusqueda);
    };
    tabla.prototype.crearAccionesPie = function(pie){
        var columnas = this.propiedades.infoCampos.length;

        var accionesPie = "<tr><td colspan='" + columnas + "'><div>";
        accionesPie += "<div id='gridActions' class='floatLeft'><a href='#' id='btnFiltrar' class='inline'><span class='icon-search'>&nbsp;</span></a></div>";
        accionesPie += "<div id='numeroRegistros' class='floatRight'>N&uacute;m Registros:  <span id='count'> 0</span></div>";
        accionesPie += "</div></td></tr>";

        pie.append(accionesPie);
    };

    /* FUNCIONES INTERNAS
     **************************************************************************/
    tabla.prototype.vincularEventos = function(){
        var self = this;

        /* TABLA */
        $(this.elemento).delegate('tbody tr', 'click',  $.proxy(self.onRowClick, self ) );

        /* TOOLBAR */
        $('#btnCrearRelacion', this.elemento).on('click', $.proxy(self.onBtnCrearRelacionClick, self) );
        $('#btnBorrarRelacion', this.elemento).on('click', $.proxy(self.onBtnBorrarRelacionClick, self ) );
        $('#btnSeleccionME', this.elemento).on('click', $.proxy(self.onBtnSeleccionMEClick, self) );
        $('#btnCancelarME', this.elemento).on('click', $.proxy(self.onBtnCancelarMEClick, self ) );
        $('#btnNuevoDossier', this.elemento).on('click', $.proxy(self.onBtnNuevoClick, self) );
        $('#btnIrAFichar', this.elemento).on('click', $.proxy(self.onBtnIrAFichaClick, self) );
        $('#btnBorrar', this.elemento).on('click', $.proxy(self.onBtnBorrarClick, self ) );
        $('#btnCopiar',this.elemento).on('click', $.proxy(self.onBtnCopiarClick, self ) );
        $('#btnNuevaVersion', this.elemento).on('click', $.proxy(self.onBtnNuevaVersion, self ) );
        $('#btnCrearLanzamiento',this.elemento).on('click', $.proxy(self.onBtnCrearLanzamiento, self ) );

        /* ACCIONES GRID */
        $('#btnFiltrar', this.elemento).on('click' , function(){
            $('#panelFiltro', self.elemento).toggleClass('noDisplay');
        });
    };

    tabla.prototype.campoClave = function(){
        var clave = _.find(this.propiedades.infoCampos, function(elemento){return elemento.EsClave == true});
        var nombre = "";
        if(clave === undefined)
            alert('No se ha seleccionado un campo clave para el listado "' + this.propiedades.infoListado.Nombre  + '"');
        else
            nombre = clave.Nombre;

        return nombre;
    };
    tabla.prototype.valorClave = function(){
        return parseInt( $('#'+ this.campoClave()).val() );
    };
    tabla.prototype.crearPlantilla = function(){
        var self = this;
        app.log.debug('Crear plantilla', this);

        //TODO: Poner esto  dinamico
        var script = $('<script type="text/template"></script>');

        var $plantilla  =  $("<tr id='" + this.propiedades.infoListado.Nombre + "-${" + this.campoClave() +"}' ></tr>");
        var alineacion = "textAlignDerecha";

        $.each(this.propiedades.infoCampos, function(k,v){
            alineacion = self.alineacionTipo(this.Tipo);
            if( ! this.EsClave )
            {
                alineacion = self.alineacionTipo(this.Tipo);
                $plantilla.append("<td class='" + alineacion  +"'> ${" + this.Nombre + "}</td>");
            }
        });

        app.log.debug('Plantilla creada', $plantilla);
        return script.append($plantilla);
    };
    tabla.prototype.setDatos = function(datos){

        var cfgDataSource = {
            entidad : this.propiedades.infoModelo.Nombre,
            campoId : this.propiedades.campoId
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
        //this.visibilidadAccionesEnLinea();
    };
    tabla.prototype.setPadre = function(padre){
        this.datosPadre = padre;
    };
    tabla.prototype.refrescar = function(evento , eventArgs ){
        if(eventArgs === undefined || eventArgs.entidad === undefined)
        {
            if(this.datos.data !== undefined)
            {
                app.log.debug('Refrescamos los datos con lo que ya tiene', eventArgs);
                this.setDatos(this.datos.data);
            }
        }
        else if(eventArgs.entidad == this.propiedades.entidad)
        {
            app.log.debug('Refrescamos los datos', eventArgs);
            this.setDatos(eventArgs.datos);
        }

    };
    tabla.prototype.setNumeroRegistros = function() {
        if(this.datos.data != null)
            return $('tfoot #count', this.elemento).text(this.datos.data.length);
    };
    tabla.prototype.getFilaSeleccionada = function(){
        return this.filaSeleccionada;
    };
    tabla.prototype.getIdRegistroSeleccionada = function(){
        var id = undefined;
        if(this.filaSeleccionada === undefined)
        {
            alert('Debes seleccionar un registro.');
        }
        else
        {

            id = $(this.filaSeleccionada).attr('id').replace(this.propiedades.infoListado.Nombre + '-', '');
            id = parseInt(id);
        }

        return id;
    };
    tabla.prototype.configuracionModo = function() {
        if (this.propiedades.infoListado.EsME) {
            $('.toolbar .boton', this.elemento).hide();
            $('.toolbar .botonME', this.elemento).show();
        }
        else {
            $('.toolbar .boton', this.elemento).show();
            $('.toolbar .botonME', this.elemento).hide();
        }

        if (this.propiedades.infoListado.EsColeccion) {
            $('.toolbar .boton', this.elemento).hide();
            $('.toolbar .botonME', this.elemento).hide();
        }


    };
    tabla.prototype.borrarFilaSeleccionada = function(){
        $(this.filaSeleccionada).remove();
        // TODO: Eliminar el registro de los datos en memoria y actualizar el numero de registros del formulario
    };
    tabla.prototype.agregarRegistro = function(datos){

        if(this.datos.data === undefined)
            this.datos.data = [];

        this.datos.data.push(datos);
        this.renderFila(datos);
        //this.visibilidadAccionesEnLinea();
        this.setNumeroRegistros();
    };
    tabla.prototype.renderFila = function(datos){
        var plantilla = this.crearPlantilla();
        var fila = plantilla.tmpl(datos);
        $('table tbody', this.elemento).append(fila);

        return this;
    };

    /* FUNCIONES DE LOS EVENTOS
     **************************************************************************/
    tabla.prototype.onRowClick = function(evento){
        var eventsArgs = {
            Entidad : this.propiedades.infoModelo.Nombre,
            Fila    : this.filaSeleccionada
        };

        $('tr.seleccionado', this.elemento).removeClass('seleccionado');
        $(evento.currentTarget).addClass('seleccionado');

        this.filaSeleccionada = $(evento.currentTarget);

        app.eventos.publicar(tabla.Eventos.OnRowClick, eventsArgs, true)
        app.eventos.lanzar(tabla.Eventos.OnRowClick, this.nombre, eventsArgs, true)
    };
    tabla.prototype.onBtnNuevoClick = function(sender){
        var eventsArgs = {
            Entidad : this.propiedades.infoModelo.Nombre
        };



        app.eventos.publicar(tabla.Eventos.OnBtnNuevoClick, eventsArgs , true);
        app.eventos.lanzar(tabla.Eventos.OnBtnNuevoClick, this.nombre,  eventsArgs , true);
    };
    tabla.prototype.onBtnIrAFichaClick = function(sender){
        app.log.debug('Seleccion', this.filaSeleccionada);
        if(this.filaSeleccionada === undefined)
        {
            alert('Debes seleccionar un registro.');
        }
        else
        {
            var eventsArgs = {
                Entidad : this.propiedades.infoModelo.Nombre,
                Fila    : this.filaSeleccionada
            };

            app.eventos.publicar(tabla.Eventos.OnBtnIrAFichaClick,  eventsArgs, true);
            app.eventos.lanzar(tabla.Eventos.OnBtnIrAFichaClick, this.nombre,  eventsArgs, true);
        }
    };
    tabla.prototype.onBtnBorrarClick = function(sender){
        if(this.filaSeleccionada === undefined)
        {
            alert('Debes seleccionar un registro.');
        }
        else
        {
            var eventsArgs = {
                Entidad : this.propiedades.infoModelo.Nombre,
                Fila    : this.filaSeleccionada
            };
            app.eventos.publicar( tabla.Eventos.OnBtnBorrarClick,  eventsArgs, true);
            app.eventos.lanzar( tabla.Eventos.OnBtnBorrarClick, this.nombre, eventsArgs, true);
        }
    };
    tabla.prototype.onBtnCopiarClick = function(sender){
        if(this.filaSeleccionada === undefined)
        {
            alert('Debes seleccionar un registro.');
        }
        else
        {
            var eventsArgs = {
                Entidad : this.propiedades.infoModelo.Nombre,
                Fila    : this.filaSeleccionada
            };
            app.eventos.publicar( tabla.Eventos.OnBtnCopiarClick, eventsArgs, true);
            app.eventos.lanzar( tabla.Eventos.OnBtnCopiarClick,this.nombre, eventsArgs, true);
        }
    };
    tabla.prototype.onBtnSeleccionMEClick = function(sender){
        if(this.filaSeleccionada === undefined)
        {
            alert('Debes seleccionar un registro.');
        }
        else
        {
            var eventsArgs = {
                Entidad : this.propiedades.infoModelo.Nombre,
                Fila    : this.filaSeleccionada
            };
            app.eventos.publicar( tabla.Eventos.OnBtnSeleccionMEClick, eventsArgs, true);
            app.eventos.lanzar( tabla.Eventos.OnBtnSeleccionMEClick, this.propiedades.infoModelo.Nombre, eventsArgs, true);
        }
    };
    tabla.prototype.onBtnCancelarMEClick = function(sender){
        var eventsArgs = {
            Entidad : this.propiedades.infoModelo.Nombre
        };
        app.eventos.publicar(tabla.Eventos.OnBtnCancelarMEClick, eventsArgs , true);
        app.eventos.lanzar(tabla.Eventos.OnBtnCancelarMEClick, this.propiedades.infoModelo.Nombre, eventsArgs , true);
    };
    tabla.prototype.onBtnCrearRelacionClick = function(sender){
        var eventsArgs = {
            Entidad : this.propiedades.infoModelo.Nombre
        };
        app.eventos.publicar( tabla.Eventos.OnBtnCrearRelacionClick, eventsArgs, true);
        app.eventos.lanzar( tabla.Eventos.OnBtnCrearRelacionClick, this.propiedades.infoModelo.Nombre, eventsArgs, true);

    };
    tabla.prototype.onBtnBorrarRelacionClick = function(sender){
        var eventsArgs = {
            Entidad : this.propiedades.infoModelo.Nombre
        };
        app.eventos.publicar(tabla.Eventos.OnBtnBorrarRelacionClick, eventsArgs , true);
        app.eventos.lanzar(tabla.Eventos.OnBtnBorrarRelacionClick, this.propiedades.infoModelo.Nombre, eventsArgs , true);
    };

    /* DEFINICION DE LOS EVENTOS
     **************************************************************************/
    tabla.Eventos = {
        OnRowClick              : 'onRowClick',

        OnBtnNuevoClick         : 'onBtnNuevoClick',
        OnBtnIrAFichaClick      : 'onBtnIrAFichaClick',
        OnBtnBorrarClick        : 'onBtnBorrarClick',
        OnBtnCopiarClick        : 'onBtnCopiarClick',

        OnBtnSeleccionMEClick   : 'onBtnSeleccionMEClick',
        OnBtnCancelarMEClick    : 'onBtnCancelarMEClick',

        OnBtnCrearRelacionClick   : 'onBtnCrearRelacionClick',
        OnBtnBorrarRelacionClick  : 'onBtnBorrarRelacionClick'
    };
})(jQuery);
