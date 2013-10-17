var Checkbox = function(campo, options){
    this._defaults = {};
    this.configuracion = $.extend( this._defaults , options);
    this.configuracion.requerido = !campo.EsNullable;

    this.tipo = 'checkbox';
    this.nombre = campo.Nombre;

    this._control = this.render(campo);
    this.input = $('input', this._control);

    this.inicializarEventos();

    return this;
};

Checkbox.prototype.plantilla = function(){
    var plantilla = "<script type='text/template' id='booleanTemplate'>";
    plantilla += '<div class="textboxNumerico">';
    plantilla += "<label for='${Titulo}' class=''>${Titulo}</label>";
    plantilla += "<input type='checkbox' name='${Nombre}' id='${Nombre}' class='${Tipo}' readonly='readonly' disabled='disabled' style='width: 265px' />";
    plantilla += "<br>";
    plantilla += '</div>';
    plantilla += "</script>";

    return plantilla;
};
Checkbox.prototype.render = function(datos){
    return $(this.plantilla()).tmpl(datos);
};
Checkbox.prototype.setValor = function(valor){
    this.input.attr('checked', valor);
};
Checkbox.prototype.getValor = function(valor){
    return this.input.attr('checked') == 'checked' ? true : false;
};

Checkbox.prototype.serializar = function(){
    var serializado = {};
    serializado[this.nombre] = this.getValor();

    return serializado;
};


Checkbox.prototype.inicializarEventos = function(){
    var self = this;

};
