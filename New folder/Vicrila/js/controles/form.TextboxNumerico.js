/**
 *
 *
 * @param campo
 * @param campo.Nombre
 * @param campo.Titulo
 * @param campo.EsNullable
 * @param campo.Tipo
 * @param options
 * @param options.aceptaDecimales
 * @param options.aceptaNegativos
 */
var TextboxNumerico = function(campo , options){
    this._defaults = {
        aceptaDecimales : true,
        aceptaNegativos : true
    };
    this.configuracion = $.extend( this._defaults , options);
    //this.configuracion.requerido = $(this.input).hasClass('requerido');
    this.configuracion.requerido = !campo.EsNullable;

    this.tipo = 'textboxNumerico';
    this.nombre = campo.Nombre;

    this.errores = [];
    this._control = undefined;

    this._control = this.render(campo);
    this.input = $('input', this._control);
    this.indicadorValido  = $('.noValido', this._control).hide();
    this.indicadorTipo = $('.indicadorTipo', this._control);

    $(this.indicadorTipo).attr('alt' , this.textoHoverTipo());
    $(this.indicadorTipo).attr('title' , this.textoHoverTipo());

    this.inicializarEventos();

    return this;
};

TextboxNumerico.prototype.plantilla = function(){
    var plantilla = "<script type='text/template' id='campoTemplate'>";
    plantilla += "<div class='textboxNumerico' >";
    plantilla += "<label for='${Titulo}' class=''>${Titulo}</label>";
    plantilla += "<span class='noValido'><span class='icon-warning-sign icon-white'>&nbsp;</span></span>";
    plantilla += "<input type='text' name='${Nombre}' id='${Nombre}' class='${Tipo}' readonly='readonly' disabled='disabled' />";
    plantilla += "<span class='indicadorTipo'>#</span>";
    plantilla += "</div>";
    plantilla += "</script>";

    return plantilla;
};
TextboxNumerico.prototype.render = function(datos){
    return $(this.plantilla()).tmpl(datos);
};
TextboxNumerico.prototype.getValor = function(){
    return this.input.val();
};
TextboxNumerico.prototype.setValor = function(valor){
    this.input.val(valor);
};
TextboxNumerico.prototype.serializar = function(){
    var serializado = {};
    serializado[this.nombre] = this.getValor();

    return serializado;
};


TextboxNumerico.prototype.textoHoverTipo = function(){
    var txtAcepta = "N\u00FAmerico\n";
    if(this.configuracion.aceptaDecimales)
        txtAcepta += "\n- Acepta decimales";
    if(this.configuracion.aceptaNegativos)
        txtAcepta += "\n- Acepta negativos";

    return txtAcepta;
};
TextboxNumerico.prototype.inicializarEventos = function(){
    var self = this;

    $(this.input).on('blur', function(){
        self.errores = [];

        var valor = $(this).val();

        if(valor.length > 0)
        {
            if( ! self.validarNumeros( valor  ) ) self.errores.push('Solo se permiten n\u00FAmeros');
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

TextboxNumerico.prototype.mensajeErrores = function(strString){
    var cadenaErrores  = '';

    $(this.errores).each(function(){
        cadenaErrores += this ;
        cadenaErrores += '\n\n';

    });

    return cadenaErrores;
};
TextboxNumerico.prototype.validarNumeros = function(strString){
    var strValidChars = "0123456789";
    var strChar;
    var blnResult = true;

    if( this.configuracion.aceptaDecimales )  strValidChars+=".";
    if( this.configuracion.aceptaNegativos )  strValidChars+="-";

    if (strString.length == 0) return false;

    for (i = 0; i < strString.length && blnResult == true; i++)
    {
        strChar = strString.charAt(i);
        if (strValidChars.indexOf(strChar) == -1)
        {
            blnResult = false;
        }
    }

    return blnResult;
};
