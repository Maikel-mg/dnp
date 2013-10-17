var TextboxCalendario = function(campo, options){
    this._defaults = {
    };
    this.configuracion = $.extend( this._defaults , options);
    this.configuracion.requerido = !campo.EsNullable;

    this.tipo = 'textboxFecha';
    this.nombre = campo.Nombre;

    this.errores = [];
    this._control = undefined;

    this._control = this.render(campo);
    this.input = $('input', this._control);
    this.indicadorValido  = $('.noValido', this._control).hide();
    this.indicadorTipo = $('#indicadorTipo', this._control);

    $(this.indicadorTipo).attr('alt' , this.textoHoverTipo());
    $(this.indicadorTipo).attr('title' , this.textoHoverTipo());

    this.inicializarEventos();

    return this;
};

TextboxCalendario.prototype.plantilla = function(){
    var plantilla = '<script	type="text/template" id="campoTemplate">';
    plantilla += '<div class="textboxNumerico">';
    plantilla += '<label for="${Titulo}" class="">${Titulo}</label>';
    plantilla += "<span class='noValido'><span class='icon-warning-sign icon-white'>&nbsp;</span></span>";
    plantilla += '<input type="text" name="${Nombre}" id="${Nombre}" class="${Tipo}" />';
    plantilla += '<span class = "indicadorTipo" ><i class="icon-calendar"></i></span>';
    plantilla += '</div>';
    plantilla += '</script>';

    return plantilla;
};
TextboxCalendario.prototype.render = function(datos){
    var control = $(this.plantilla()).tmpl(datos);

    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['es']);
    $('#' + datos.Nombre, control).datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        buttonImage: "../../img/calendario.png",
        buttonImageOnly: true,
        onSelect: function(dateText){
            $('#' + datos.Nombre, control).blur();
        }
    });



    return control;
};
TextboxCalendario.prototype.getValor = function(){
    return this.input.val();
};
TextboxCalendario.prototype.setValor = function(valor){
    this.input.val(valor);
};

TextboxCalendario.prototype.inicializarEventos = function(){
    var self = this;

    $(this.input).on('blur', function(){
        self.errores = [];
        var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

        var valor = $(this).val();

        if(valor.length > 0)
        {
            if (valor.match(re)==null) self.errores.push('El campo no tiene el formato correcto.');
        }
        else
        {
            if(self.configuracion.requerido) self.errores.push('El campo no puede ser vacio.');
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

TextboxCalendario.prototype.textoHoverTipo = function(){
    var txtAcepta = "Fecha";

    return txtAcepta;
};
TextboxCalendario.prototype.mensajeErrores = function(strString){
    var cadenaErrores  = '';

    $(this.errores).each(function(){
        cadenaErrores += this ;
        cadenaErrores += '\n\n';

    });

    return cadenaErrores;
};
