/**
 * Created by Maikel
 * User: mg01
 * Date: 01/10/2012
 * Time: 12:00
 * Control de ficha para el campo de las fichas
 */
var EditorCampoListado = function(options){
    var self = this;
    this.defaults = {
        contenedor: 'body'
    };
    this.propiedades = $.extend(this.defaults,  options);
    this.campo = {};

    this.html = $(this.propiedades.contenedor).load('../js/componentes/html/editorCampoListado.html', function(){
        self.cachearElementos();
        self.vincularEventos();
    });

    return this;
};

EditorCampoListado.prototype.cachearElementos = function(){
    this.control = $('div#propiedades', this.html);

    this.textoColumna = $('input#textoColumna', this.html);
    this.camposModelo = $('select#camposModelo', this.html);
    this.ordenColumna = $('input#ordenColumna', this.html);

    this.busquedaInterna = $('input#busquedaInterna', this.html);
    this.esClave = $('input#esClave', this.html);
    this.esDescripcion = $('input#esDescripcion', this.html);

    this.plantillaCampos = $('<script type="text/template" id="campoModeloTemplate"><option value="${Nombre}">${Nombre} - ${Tipo}</option></script>');
};
EditorCampoListado.prototype.vincularEventos = function(){
    var self = this;

    $('#btnGuardarCampo').on('click', function(){
        self.onGuardar();
    });
};
EditorCampoListado.prototype.reset = function(){
    this.textoColumna.val('');
    this.camposModelo.val('');
    this.ordenColumna.val('');

    this.busquedaInterna.attr('checked', false);
    this.esClave.attr('checked', false);
    this.esDescripcion.attr('checked', false);
};

EditorCampoListado.prototype.cargarCampo = function(Campo){
    this.campo = Campo;

    this.textoColumna.val( Campo.Titulo);
    this.camposModelo.val( Campo.Nombre );
    this.ordenColumna.val( Campo.Orden );

    this.busquedaInterna.attr('checked', Campo.BusquedaInterna);
    this.esClave.attr('checked', Campo.EsClave);
    this.esDescripcion.attr('checked', Campo.EsDescripcion);
};
EditorCampoListado.prototype.actualizarCampo = function(){
    this.campo.Titulo = this.textoColumna.val();
    this.campo.Nombre = this.camposModelo.val();
    this.campo.Orden = (this.ordenColumna.val() == '') ? 0 : this.ordenColumna.val();

    this.campo.EsClave = (this.esClave.attr('checked') == 'checked');
    this.campo.EsDescripcion = (this.esDescripcion.attr('checked') == 'checked');
    this.campo.BusquedaInterna = (this.busquedaInterna.attr('checked') == 'checked');

    return this.campo;
};
EditorCampoListado.prototype.cargarComboCamposModelos = function(camposModelo){
    $('option' , this.camposModelo).remove();
    var ordenados = _.sortBy(camposModelo, function(e){ return e.Nombre; } );
    this.plantillaCampos.tmpl(ordenados).appendTo(this.camposModelo);
};

/**
 * Se lanza cuando se pulsa el boton guardar del componente
 *
 * @event   onGuardar
 * @public
 * @name    onGuardar
 */
EditorCampoListado.prototype.onGuardar = function(){};


