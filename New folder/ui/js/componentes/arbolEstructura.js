/*
    Control que muestra el contenido del dossier en modo arbol.
    + Solucion 1
        + FORMAS
            + Forma 1
        + EMBLAJES
            + Nivel 1
                + Embalaje 1
    + Solucion 1
        + FORMAS
            + Forma 1
        + EMBLAJES
            + Nivel 1
                + Embalaje 1
------------------------------------------------------------------------------------------------

    campos
        .propiedades                -->  Datos que se le pasan por parametro al control
            .contenedor             -->  Id del elemento HTML que va a contener el arbol
        .elemento                   -->  Cache el control
        .dossier                    -->  Datos del dossier que se esta mostrando

    metodos
        .crear                      -->  Crea el control dentro del contenedor que se le indique

 */
var arbolEstructura = function(configuracion){
    this.defaults = {};
    this.propiedades = $.extend( this.defaults, configuracion );

    this.elemento = {};
    this.dossier = {};
    this.soluciones = {};

    this.crear();

    this.subscripciones();
    this.vincularEventos();

    return this;
};


arbolEstructura.prototype.subscripciones = function(){
    var self = this;
    app.eventos.escuchar('BuscarEstructuraSolucion', 'Solucion', function(evento, respuesta){
        app.log.debug('BuscarEstructuraSolucion Maikel', respuesta);
        if(respuesta.estado ='OK')
        {
            var solucion = respuesta.datos[0];
            self.soluciones[solucion.idSolucion] = solucion;
            self.renderFormas(solucion.idSolucion);
            self.renderEmbalajes(solucion.idSolucion);
        }
        else
            alert(respuesta.mensaje);
    });

};
arbolEstructura.prototype.vincularEventos = function(){
    $(this.elemento).delegate('.headerSolucion','click', function(){

        if($(this).next().is(':visible'))
            $(this).next().hide();
        else
            $(this).next().show();
    });
    $(this.elemento).delegate('.headerFormas','click', function(){

        if($(this).next().is(':visible'))
            $(this).next().hide();
        else
            $(this).next().show();
    });
    $(this.elemento).delegate('.headerEmbalajes','click', function(){

        if($(this).next().is(':visible'))
            $(this).next().hide();
        else
            $(this).next().show();
    });



};

arbolEstructura.prototype.crear = function(){
    var contenedor = $('#'+ this.propiedades.contenedor);
    this.elemento = $('<div class="arbolEstructura"></div>');

    //this.crearToolbar(this.elemento);
    this.crearAreaContenido(this.elemento);
    contenedor.append(this.elemento);
};
arbolEstructura.prototype.crearAreaContenido = function(div){
    var areaContenido = $('<div id="arbolEstructuraContenido" ></div>');
    div.append(areaContenido);
};
arbolEstructura.prototype.crearToolbar = function(div){
    var toolbarContainer = $('<div id="toolbar" class="toolbar"></div>');
    var toolbar = $('<ul></ul>');

    toolbar.append( this.crearToolbarButton("btnAddForma", "Editar el registro","icon-plus", "Agregar Forma", "botonConsulta") );
    toolbar.append( this.crearToolbarButton("btnRemoveForma", "Borrar el registro","icon-remove", "Quitar Forma", "botonConsulta") );
    toolbar.append( this.crearToolbarButton("btnAddEmbalaje", "Copiar el registro","icon-plus", "Agregar Embalaje", "botonConsulta") );
    toolbar.append( this.crearToolbarButton("btnRemoveEmbalaje", "Guardar el registro","icon-remove", "Quitar Embalaje", "botonEdicion") );
    toolbar.append( this.crearToolbarButton("btnAceptarSolucion", "Cancelar la edicion del registro","icon-ok", "Aceptar Solucion", "botonEdicion") );
    toolbar.append( this.crearToolbarButton("btnRechazarSolucion", "Cancelar la edicion del registro","icon-trash", "Rechazar Solucion", "botonEdicion") );

    toolbarContainer.append(toolbar);
    toolbarContainer.append( $('<div class="clearFix"></div>') );
    div.append(toolbarContainer);
};
arbolEstructura.prototype.crearToolbarButton = function(id, titulo, claseIcono ,texto, clase ){

    return "<li class='"+ clase +" " + id +"' id='"+ id +"' title='"+ titulo +"'><a href='#" + id + "'><span class='"+ claseIcono +"'></span><span>"+ texto +"</span></a></li>";
};

arbolEstructura.prototype.render = function(){
    var self = this;
    var soluciones = this.dossier.Solucion;
    var solucionElement = {};

    $.each(soluciones, function(k,v){
        solucionElement = $(self.propiedades.plantilla).tmpl(this).appendTo(self.elemento);
    });

};
arbolEstructura.prototype.renderFormas = function(idSolucion){
    var formas = this.soluciones[idSolucion].FormaArt;
    var destino = $('.contentFormas ul',  '#solucion-' + idSolucion);

    $('#solucion-' + idSolucion).find('.numeroFormas').text('('+ formas.length +')');

    $('.contentFormas ul *',  '#solucion-' + idSolucion).remove();
    $('#plantillaForma').tmpl(formas).appendTo(destino);
};
arbolEstructura.prototype.renderEmbalajes = function(idSolucion){
    var formas = this.soluciones[idSolucion].FormaEmb;
    var $solucion = $('#solucion-' + idSolucion);
    var $destino = $('.contentEmbalajes ul',  $solucion);
    var $numeroEmbalajes = $solucion.find('.numeroEmbalajes');

    var niveles = _.pluck(formas, 'nNivel');
    var porNiveles = _.groupBy(formas, function(embalaje){ return embalaje.nNivel; });

    app.log.debug('Niveles',  niveles );
    app.log.debug('Por niveles',   porNiveles);

    $numeroEmbalajes.text('('+ formas.length +')');

    $('.contentEmbalajes ul *',  $solucion).remove();
    if(niveles.length > 0)
    {
        var $grupoNivel = {};
        $.each(niveles, function(k,v){

            $grupoNivel = $("<div class='nivel'>Nivel " + v + "</div>");
            $destino.append($grupoNivel);

            $('#plantillaEmbalaje').tmpl(porNiveles[v]).appendTo($grupoNivel);
        });
    }
};

arbolEstructura.prototype.cargarDossier = function(dossier){
    var self = this;
    this.dossier = dossier;
    this.render();

    $.each(this.dossier.Solucion, function(){
        if(this !== undefined)
            self.cargarSolucion(this);
    });

    $('.estructura .contentSolucion').hide();
};
arbolEstructura.prototype.cargarSolucion = function(solucion){
    var where = {
        IdSolucion : solucion.idSolucion
    };

    var parametros = {
        Entidad : "Solucion",
        Where   : where,
        Referencias :false,
        Colecciones : true,
        Alias   : "BuscarEstructuraSolucion"
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));

    app.log.debug('IdSolucion', solucion.idSolucion);
};
arbolEstructura.prototype.agregarForma = function(forma){
    this.solucionSeleccionada.FormaArt.push(forma);
    this.renderFormas( this.solucionSeleccionada.idSolucion );
};
arbolEstructura.prototype.quitarForma = function(idForma){
    this.solucionSeleccionada.FormaArt = _.reject(this.solucionSeleccionada.FormaArt, function(registro){ return registro["idFormaArt"] == idForma});
    this.renderFormas( this.solucionSeleccionada.idSolucion );
};
arbolEstructura.prototype.agregarEmbalaje = function(forma){
    this.solucionSeleccionada.FormaEmb.push(forma);
    this.renderEmbalajes( this.solucionSeleccionada.idSolucion );
};
arbolEstructura.prototype.quitarEmbalaje= function(idEmbalaje){
    this.solucionSeleccionada.FormaEmb = _.reject(this.solucionSeleccionada.FormaEmb, function(registro){ return registro["idFormaEmb"] == idEmbalaje});
    this.renderEmbalajes( this.solucionSeleccionada.idSolucion );
};

arbolEstructura.prototype.seleccionarSolucion = function(idSolucion){
    this.solucionSeleccionada = this.soluciones[idSolucion];
};



