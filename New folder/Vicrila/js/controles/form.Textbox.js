var Textbox = function(campo, options){
    this._defaults = {
        Tamano : 250
    };
    this.configuracion = $.extend( this._defaults , options);
    this.configuracion.requerido = !campo.EsNullable;

    this.tipo = 'textbox';
    this.nombre = campo.Nombre;

    this.errores = [];
    this._control = undefined;

    this._control = this.render(campo);
    this.input = $('input', this._control);
    this.indicadorValido  = $('.noValido', this._control).hide();
    this.indicadorTipo = $('#indicadorTipo', this._control);

    if(typeof campo.comportamientos == "string")
    {
        campo.comportamientos = JSON.parse(campo.comportamientos);
        this.comportamiento = new ComportamientosManager();
        this.comportamiento.Create(campo.comportamientos);
    }

    $(this.indicadorTipo).attr('alt' , this.textoHoverTipo());
    $(this.indicadorTipo).attr('title' , this.textoHoverTipo());

    this.inicializarEventos();

    return this;
};


Textbox.prototype.getValor = function(){
    return this.input.val();
};
Textbox.prototype.setValor = function(valor){
    this.input.val(valor);
};

Textbox.prototype.plantilla = function(){
    var plantilla = '<script	type="text/template" id="campoTemplate">';
    plantilla += '<div class="textboxNumerico">';
    plantilla += '<label for="${Titulo}" class="">${Titulo}</label>';
    plantilla += "<span class='noValido'><span class='icon-warning-sign icon-white'>&nbsp;</span></span>";
    plantilla += '<input type="text" name="${Nombre}" id="${Nombre}" class="${Tipo}" readonly="readonly" disabled="disabled"/>';
    plantilla += '<span class = "indicadorTipo"><i class="icon-font"></i></span>';
    plantilla += '</div>';
    plantilla += '</script>';

    return plantilla;
};
Textbox.prototype.render = function(datos){
    return $(this.plantilla()).tmpl(datos);
};
Textbox.prototype.inicializarEventos = function(){
    var self = this;

    $(this.input).on('blur', function(){
        self.errores = [];

        var valor = $(this).val();

        if(valor.length > 0)
        {
            if(self.configuracion.tamano>0 && valor.length > self.configuracion.tamano ) self.errores.push('Tama\u00f1o Maximo de ' + self.configuracion.tamano + ' caracteres.');
        }
        else
        {
            if(self.configuracion.requerido) self.errores.push('El campo no puede ser vacio');
        }

        if(self.errores.length > 0)
        {
            app.log.debug('validate', self.errores);
            self.indicadorValido.show();
            self.indicadorValido.attr('alt', self.mensajeErrores());
            self.indicadorValido.attr('title', self.mensajeErrores());
            $(self.input).closest('div').addClass('noValido');
        }

        else
        {
            app.log.debug('validate', 'OK');
            self.indicadorValido.hide();
            self.indicadorValido.attr('alt', '');
            self.indicadorValido.attr('title', '');
            $(self.input).closest('div').removeClass('noValido');
        }

    });

};
Textbox.prototype.serializar = function(){
    var serializado = {};
    serializado[this.nombre] = "'" + this.getValor() + "'";

    return serializado;
};

Textbox.prototype.textoHoverTipo = function(){
    var txtAcepta = "Texto";
    if(this.configuracion.tamano)
        txtAcepta += "\n- Tama\u00f1o Maximo: " + this.configuracion.tamano;

    return txtAcepta;
};
Textbox.prototype.mensajeErrores = function(strString){
    var cadenaErrores  = '';

    $(this.errores).each(function(){
        cadenaErrores += this ;
        cadenaErrores += '\n\n';

    });

    return cadenaErrores;
};

