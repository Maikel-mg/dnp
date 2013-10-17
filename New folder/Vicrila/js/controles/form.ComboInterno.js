var ComboInterno = function(campo, options){
    this._defaults = {
        Tamano : 250
    };
    this.configuracion = $.extend( this._defaults , options);
    this.configuracion.requerido = !campo.EsNullable;

    this.valor = '';
    if(options.valor)
        this.valor = options.valor;

    this.fuente = {};
    this.fuentesInternasDS = {};

    this.tipo = 'ComboInterno';
    this.nombre = campo.Nombre;

    this.errores = [];
    this._control = undefined;


    this._control = this.render(campo);
    this.select = $('select', this._control);
    this.indicadorValido  = $('.noValido', this._control).hide();

    console.log(campo);

    if(typeof campo.comportamientos == "string")
    {
        campo.comportamientos = JSON.parse(campo.comportamientos);
        this.comportamiento = new ComportamientosManager();
        this.comportamiento.Create(campo.comportamientos);
    }

    app.utils.extenderControl( this.select, campo.Eventos);
    this.inicializarEventos();
    this.crearFuentesInternasDS();
    this.obtenerFuente(campo.IdReferencia);

    return this;
};

ComboInterno.prototype.getValor = function(){
    return this.select.val();
};
ComboInterno.prototype.setValor = function(valor){
    this.select.val(valor);
};

ComboInterno.prototype.plantilla = function(){
    var plantilla = '<script	type="text/template" id="campoTemplate">';
    plantilla += '<div class="ComboInterno floatLeft">';
    plantilla += '<label for="${Nombre}" class="">${Titulo}</label>';
    plantilla += "<span class='noValido'><span class='icon-warning-sign icon-white'>&nbsp;</span></span>";
    plantilla += '<select name="${Nombre}" id="${Nombre}" class="${Tipo}" disabled="disabled"></select>';
    plantilla += '</div>';
    plantilla += '</script>';

    return plantilla;
};
ComboInterno.prototype.render = function(datos){
    return $(this.plantilla()).tmpl(datos);
};
ComboInterno.prototype.inicializarEventos = function(){
    var self = this;

    $(this.select).on('blur', function(){
        self.errores = [];

        var valor = $(this).val();

        if(valor == -1)
        {
            if(self.configuracion.requerido)
            {
                self.errores.push('Debe seleccionar un valor.');

                self.indicadorValido.show();
                self.indicadorValido.attr('alt', self.mensajeErrores());
                self.indicadorValido.attr('title', self.mensajeErrores());

                $(self.select).closest('div').addClass('noValido');
            }
        }
        else
        {
            app.log.debug('validate', 'OK');
            self.indicadorValido.hide();
            self.indicadorValido.attr('alt', '');
            self.indicadorValido.attr('title', '');
            $(self.select).closest('div').removeClass('noValido');
        }

    });
};
ComboInterno.prototype.mensajeErrores = function(strString){
    var cadenaErrores  = '';

    $(this.errores).each(function(){
        cadenaErrores += this ;
        cadenaErrores += '\n\n';

    });

    return cadenaErrores;
};

ComboInterno.prototype.cargarCombo = function(datos){
    var self = this;
    var plantilla = "<script type'text/template'><option value='${Valor}'>${Texto}</option></script>";

    datos = this.limpiarDatos(datos);
    datos = this.ordenarDatos(datos);

    $(plantilla).tmpl(datos).appendTo(this.select);

    if(this.configuracion.requerido)
        this.select.prepend('<option value="-1">Selecciona una opci&oacute;n</option>');

    if(this.valor !='')
        this.setValor(this.valor);

};
ComboInterno.prototype.limpiarDatos = function(datos){
    var self = this;
    var datosLimpios = [];

    datosLimpios = _.filter(datos, function(registro){ return $.trim(registro["Valor"]) !== ''; });

    return datosLimpios;
};
ComboInterno.prototype.ordenarDatos = function(datos){
    var self = this;
    var datosOrdenados = [];

    datosOrdenados= _.sortBy(datos, function(registro){ return registro["Valor"]; });

    return datosOrdenados;
};

ComboInterno.prototype.crearFuentesInternasDS = function(){
    var self = this;
    this.fuentesInternasDS = new IpkRemoteDataSource(
        {
            entidad : 'zz_FuentesInternas',
            clave   : 'IdFuente'
        }
    );
    this.fuentesInternasDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.fuente = respuesta.datos[0];
                self.fuente.Datos = JSON.parse(self.fuente.Datos);
                self.fuente.Configuracion = JSON.parse(self.fuente.Configuracion);

                self.cargarCombo(self.fuente.Datos);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
ComboInterno.prototype.obtenerFuente = function(Id){
    var where = {
        IdFuente : Id
    };

    this.fuentesInternasDS.Buscar(where, false, false);
};
