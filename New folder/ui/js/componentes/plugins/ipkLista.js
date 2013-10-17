(function($){
    $.fn.lista = function(options) {
        var self = this;
        self.options = options;

        //return this.each(function() {
            return new lista(this , self.options);
        //});
    };

    var lista = function(elemento, options){
        this.defaults = {
            allowNew : false,
            allowDelete : false,
            allowEdit : false
        };

        /* CAMPOS
        ******************/
        this.propiedades = $.extend(this.defaults, options);
        this.elemento = $(elemento);
        this.nombre = $(elemento).attr('id');

        this.datos = [];
        this.seleccion = {};
        this.seleccionHTML = {};
        this.plantilla = '';

        this.crear();
        this.vincularEventos();

        app.log.debug('Propiedades del la lista ', this.propiedades );

        return this;
    };

    /* FUNCIONES DE CREACION DE LA TABLA
    **************************************************************************/
    lista.prototype.crear  = function(){
        app.log.debug('Crear Lista', this);
        this.crearLista();
    };
    lista.prototype.crearLista = function(){
        app.log.debug('Crear Lista', this);

        var _lista = $('<div class="ipkLista"></div>');

        this.elemento.append(_lista);

        this.crearCabecera(_lista);
        this.crearCuerpo(_lista);
        this.crearPie(_lista);
    };

    lista.prototype.crearToolbar = function(pie){

        var toolbarContainer = $('<div id="toolbar" class="miniToolbar"></div>');
        var toolbar = $('<ul></ul>');

        app.log.debug('Toolbar', toolbar);

        if(this.propiedades.allowNew)
            toolbar.append( this.crearToolbarButton("btnNuevoGrupo", "A&ntilde;adir nuevo registro","ui-icon ui-icon-plusthick" ) );
        /*
        if(this.propiedades.allowDetails)
            toolbar.append( this.crearToolbarButton("btnIrAFichar", "r a fichar del r   egistro seleccionado","icon-list-alt", "Ir a ficha", false) );
        if(this.propiedades.allowDelete)
            toolbar.append( this.crearToolbarButton("btnBorrar", "Borrar el registro seleccionado","icon-trash", "Borrar", false) );
        if(this.propiedades.allowCopy)
            toolbar.append( this.crearToolbarButton("btnCopiar", "Copiar el registro seleccionado","icon-repeat", "Copiar", false) );
        */


        toolbarContainer.append(toolbar);
        toolbarContainer.append( $('<div class="clearFix"></div>') );
        pie.append(toolbarContainer);
    };
    lista.prototype.crearToolbarButton = function(id, titulo, claseIcono  ){
        var clase = 'boton';

        return "<li class='"+ clase +"' id='"+ id +"' title='"+ titulo +"'><a href='#'><span class='"+ claseIcono +"'></span></a></li>";
    };

    lista.prototype.crearCabecera = function(lista){
        app.log.debug('Crear Cabecera', this);

        var cabecera = $('<div class="head"></div>');
        var titulo = $("<span class='block-Title'>"+ this.propiedades.titulo +"</span>");

        cabecera.append(titulo);

        lista.append(cabecera);
    };

    lista.prototype.crearCuerpo = function(tabla){
        app.log.debug('Crear Cuerpo', this);

        tabla.append('<div class="cuerpo"></div>');
    };

    lista.prototype.crearPie = function(tabla){
        app.log.debug('Crear Pie', this);
        var pie = $('<div class="pie"></div>');

        this.crearToolbar(pie);

        tabla.append(pie);
    };

    /*
     * EVENTOS
     */
    lista.prototype.vincularEventos = function(){
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
            var id = $(this).closest('li').attr('id').replace(self.propiedades.nombre + "-", '');

            var eventArgs = {
                elemento : this,
                datos    : self.datos.find(self.campoId, id)
            };

            self.onEdicionClick(eventArgs);
        });
        $(this.elemento).delegate('.cuerpo ul.datos li a.btnEliminar', 'click' , function(){
            var id = $(this).closest('li').attr('id').replace(self.propiedades.nombre + "-", '');

            var eventArgs = {
                elemento : this,
                datos    : self.datos.find(self.campoId, id)
            };

            self.onBorrarClick(eventArgs);
        });
        $('#btnNuevoGrupo', this.elemento).on('click', function(){
            self.onNuevoClick();
        });
    };

    lista.prototype.crearPlantilla = function(){
        var self = this;
        app.log.debug('Crear plantilla', this);

        var script = $('<script type="text/template"></script>');
        var $plantilla  =  $("<li id='" + this.propiedades.nombre + "-${" + this.propiedades.campoId +"}'></li>");

        $plantilla.append("<a href='#'>${" + this.propiedades.campo + "}</a>");

        if(this.propiedades.allowDelete)
           $plantilla.append("<a href='#' class='ui-icon ui-icon-trash btnEliminar' style='float: right' ></a>");

        if(this.propiedades.allowEdit)
            $plantilla.append("<a href='#' class='ui-icon ui-icon-pencil btnEditar' style='float: right' ></a>");


        app.log.debug('Plantilla creada', $plantilla);
        return script.append($plantilla);
    };
    lista.prototype.setDatos = function(datos, render){
        var cfgDataSource = {
            entidad : this.propiedades.entidad,
            campoId : this.propiedades.campoId
        };

        this.datos = new DataSource(datos, cfgDataSource);
        this.datosCache = datos;
        this.filaSeleccionada = undefined;
        //this.onDataChange(datos);

        //if(render) this.render();
        this.render();



        //this.setNumeroRegistros();

        return this;
    };
    lista.prototype.render = function(evento , eventArgs ){
        var contexto, listaDatos, plantilla;

        contexto = $('.cuerpo' , this.elemento);
        $('ul', contexto ).remove();

        listaDatos = $('<ul class="datos"></ul>');

        plantilla = this.crearPlantilla();
        plantilla.tmpl(this.datos.data).appendTo(listaDatos);

        contexto.append(listaDatos);
    };
    lista.prototype.refrescar = function(evento , eventArgs ){
        if(eventArgs === undefined || eventArgs.entidad === undefined)
        {
            if(this.datos.data !== undefined)
            {
                app.log.debug('Refrescamos los datos con lo que ya tiene', eventArgs);
                this.setDatos(this.datos.data);
                this.setSeleccion($("#"+this.propiedades.nombre + "-" + this.getIdRegistroSeleccionada()) );
            }
        }
        else if(eventArgs.entidad == this.propiedades.entidad)
        {
            app.log.debug('Refrescamos los datos', eventArgs);
            this.setDatos(eventArgs.datos);
        }

    };

    lista.prototype.setSeleccionPorId = function(id){
        $('.cuerpo ul.datos li.seleccionado', this.elemento).removeClass('seleccionado');

        var elementoHTML = $("#" +this.propiedades.nombre + "-" + id);
        $(elementoHTML).addClass('seleccionado');
        this.seleccion  = this.datos.find(this.propiedades.campoId, parseInt(id));
        this.seleccionHTML = elementoHTML;
    };
    lista.prototype.setSeleccion = function(elementoHTML){
        $('.cuerpo ul.datos li.seleccionado', this.elemento).removeClass('seleccionado');
        $(elementoHTML).addClass('seleccionado');

        var idSeleccion = $(elementoHTML).attr('id').replace(this.propiedades.nombre + "-", '');
        this.seleccion  = this.datos.find(this.propiedades.campoId, idSeleccion);
        this.seleccionHTML = elementoHTML;
    };
    lista.prototype.removeSeleccion = function(){
        this.seleccion  = undefined;
        this.seleccionHTML = undefined;
        $('.cuerpo ul.datos li.seleccionado', this.elemento).removeClass('seleccionado');
    };
    lista.prototype.getFilaSeleccionada = function(){
        return this.seleccionHTML;
    };
    lista.prototype.getIdRegistroSeleccionada = function(){
        var id = undefined;
        if(this.seleccionHTML === undefined)
        {
            alert('Debes seleccionar un registro.');
        }
        else
        {
            id = $(this.seleccionHTML).attr('id').replace(this.propiedades.nombre + '-', '');
            id = parseInt(id);
        }

        return id;
    };
    lista.prototype.configuracionModo = function() {
        if (this.propiedades.infoListado.EsME) {
            $('.toolbar .boton', this.elemento).hide();
            $('.toolbar .botonME', this.elemento).show();
        }
        else {
            $('.toolbar .boton', this.elemento).show();
            $('.toolbar .botonME', this.elemento).hide();
        }
    };
    lista.prototype.borrarFilaSeleccionada = function(){
        $(this.seleccionHTML).remove();
        this.datos.remove(parseInt(this.seleccion[this.propiedades.campoId]));
    };
    lista.prototype.agregarRegistro = function(datos){
        this.datos.data.push(datos);
        this.renderFila(datos);
    };
    lista.prototype.renderFila = function(datos){
        var plantilla = this.crearPlantilla();
        var fila = plantilla.tmpl(datos);
        $('.cuerpo ul.datos', this.elemento).append(fila);

        return this;
    };

    /* FUNCIONES DE LOS EVENTOS
     **************************************************************************/
    lista.prototype.onRender = function(){
        app.eventos.lanzar(lista.Eventos.OnSeleccion, this.nombre, [] ,true);
        //app.eventos.publicar(lista.Eventos.OnRender,[] ,true);
    };
    lista.prototype.onDataChange = function(datos){
        app.eventos.lanzar(lista.Eventos.OnDataChange, this.nombre, datos ,true);
        //app.eventos.publicar(lista.Eventos.OnDataChange,datos ,true);
    };
    lista.prototype.onSeleccion = function(eventArgs){
        app.eventos.lanzar(lista.Eventos.OnSeleccion, this.nombre, eventArgs ,true);
        //app.eventos.publicar(lista.Eventos.OnSeleccion, eventArgs ,true);
    };
    lista.prototype.onNuevoClick = function(){
        app.eventos.lanzar(lista.Eventos.OnNuevoClick, this.nombre, [] ,true);
        //app.eventos.publicar(lista.Eventos.OnNuevoClick, [] ,true);
    };
    lista.prototype.onEdicionClick = function(eventArgs){
        app.eventos.lanzar(lista.Eventos.OnEdicionClick, this.nombre, eventArgs ,true);
        //app.eventos.publicar(lista.Eventos.OnEdicionClick, eventArgs ,true);
    };
    lista.prototype.onBorrarClick = function(eventArgs){
        app.eventos.lanzar(lista.Eventos.OnBorrarClick, this.nombre, eventArgs ,true);
        //app.eventos.publicar(lista.Eventos.OnBorrarClick, eventArgs,true);
    };

    /* DEFINICION DE LOS EVENTOS
     **************************************************************************/
    lista.Eventos = {
        OnRender       : 'onRender',
        OnDataChange   : 'onDataChange',
        OnSeleccion    : 'onSeleccion',
        OnNuevoClick   : 'onNuevoClick',
        OnEdicionClick : 'onEdicionClick',
        OnBorrarClick  : 'onBorrarClick'
    };
})(jQuery);