var normalize = function (str){
    str = str.replace('\u00e1','a');
    str = str.replace('\u00e9','e');
    str = str.replace('\u00ed','i');
    str = str.replace('\u00f3','o');
    str = str.replace('\u00fa','u');

    str = str.replace('\u00c1','A');
    str = str.replace('\u00c9','E');
    str = str.replace('\u00cd','I');
    str = str.replace('\u00d3','O');
    str = str.replace('\u00da','U');

    str = str.replace('\u00f1','ñ');
    str = str.replace('\u00d1','Ñ');
    return str;
};

var ComboNavision = function(campo, options, ficha){
    this._defaults = {
        Tamano : 250
    };
    this.configuracion = $.extend( this._defaults , options);
    this.configuracion.requerido = !campo.EsNullable;
    this.ficha = ficha;
    this.campo = campo;

    this.valor = '';
    if(options.valor)
        this.valor = options.valor;

    this.fuente = {};
    this.fuentesNavisionDS = {};
    this.navisionDS = {};

    this.tipo = 'ComboNavision';
    this.nombre = campo.Nombre;

    this.errores = [];
    this._control = undefined;

    this._control = this.render(campo);
    this.select = $('select', this._control);
    this.indicadorValido  = $('.noValido', this._control).hide();

    if(this.configuracion.requerido)
        this.select.closest('div').addClass('requerido');

    app.utils.extenderControl( this.select, campo.Eventos, this);
    this.inicializarEventos();
    this.crearNavisionDS();
    this.crearFuentesNavisionDS();
    this.obtenerFuente(campo.IdReferencia);

    return this;
};


ComboNavision.prototype.getValor = function(){
    return this.select.val();
};
ComboNavision.prototype.setValor = function(valor){
    this.select.val(valor);
};

ComboNavision.prototype.plantilla = function(){
    var plantilla = "<script type='text/template' id='campoTemplate'>";
    plantilla += "<div class='formElementWrapper medium comboNavision'>";
    plantilla += "<label class='formElementLabel' for='${Nombre}'>${Titulo} </label>";
    plantilla += "<span class='formElementRequiredIndicator'>&nbsp;</span>";
    plantilla += "<select class='formElement ${Tipo}' name='${Nombre}' id='${Nombre}' class='${Tipo}' disabled='disabled'></select>";
    plantilla += "<span class='formElementType indicadorTipo'>";
    plantilla += "<i class='fam find'></i>";
    plantilla += "</span>";
    plantilla += "<span class='formElementErrorInfo noValido'>";
    plantilla += "<i class='fam error'></i>";
    plantilla += "</span>";
    plantilla += "<div class='clearFix'></div>";
    plantilla += "</div>";
    plantilla += "</script>";

    return plantilla;
};
ComboNavision.prototype.render = function(datos){
    var $elemento = $(this.plantilla()).tmpl(datos);

    $elemento.find('.noValido').hide();

    return $elemento;
};
ComboNavision.prototype.inicializarEventos = function(){
    var self = this;

    $(this.select).on('blur', function(){
        self.validar();
    });
};
ComboNavision.prototype.mensajeErrores = function(strString){
    var cadenaErrores  = '';

    $(this.errores).each(function(){
        cadenaErrores += this ;
        cadenaErrores += '\n\n';

    });

    return cadenaErrores;
};
ComboNavision.prototype.validar = function(){
    this.errores = [];

    var valor = $(this.select).val();

    if(valor == -1)
    {
        if(this.configuracion.requerido)
        {
            this.errores.push('Debe seleccionar un valor.');

            this.indicadorValido.show();
            this.indicadorValido.attr('alt', this.mensajeErrores());
            this.indicadorValido.attr('title', this.mensajeErrores());

            $(this.select).closest('div').addClass('noValido');
            $(this.select).closest('div').addClass('error');
        }
    }
    else
    {
        this.indicadorValido.hide();
        this.indicadorValido.attr('alt', '');
        this.indicadorValido.attr('title', '');
        $(this.select).closest('div').removeClass('noValido');
        $(this.select).closest('div').removeClass('error');
    }

    return (this.errores.length == 0);
};

ComboNavision.prototype.limpiarDatos = function(datos){
    var self = this;
    var datosLimpios = [];

    datosLimpios = _.filter(datos, function(registro){ return $.trim(registro[self.fuente.CampoMostrar]) !== ''; });

    return datosLimpios;
};
ComboNavision.prototype.cargarCombo = function(datos){
    var self = this;
    var plantilla = "" ;
    if(this.fuente.Concatenar)
        plantilla =  "<script type'text/template'><option value='${" + this.fuente.CampoValor + "}'>${" + this.fuente.CampoValor + "} - ${" + this.fuente.CampoMostrar +"}</option></script>";
    else
        plantilla =  "<script type'text/template'><option value='${" + this.fuente.CampoValor + "}'>${"+ this.fuente.CampoMostrar +"}</option></script>";

    datos  = this.limpiarDatos(datos);
    datos = this.ordenarDatos(datos);

    $(plantilla).tmpl(datos).appendTo(this.select);

    //if(this.configuracion.requerido)
        this.select.prepend('<option value="-1" selected="selected">Selecciona una opci&oacute;n</option>');


    if(this.valor !='')
        this.setValor(this.valor);
    else
        this.setValor('-1');

};
ComboNavision.prototype.ordenarDatos = function(datos){
    var self = this;
    var datosOrdenados = [];

    _.each(datos, function(registro){ return registro[self.fuente.CampoMostrar + '_orderByField'] = normalize(registro[self.fuente.CampoMostrar]); });
    datosOrdenados= _.sortBy(datos, function(registro){ return normalize(registro[self.fuente.CampoMostrar + '_orderByField']); });

    return datosOrdenados;
};

ComboNavision.prototype.crearNavisionDS = function(){
    var self = this;

    this.navisionDS= new IpkRemoteDataSourceNavision();
    this.navisionDS.onEjecutarFiltro = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.cargarCombo(respuesta.datos);
            }

        }
        else
            alert(respuesta.mensaje);
    };
};
ComboNavision.prototype.crearFuentesNavisionDS = function(){
    var self = this;
    this.fuentesNavisionDS = new IpkRemoteDataSource(
        {
            entidad : 'zz_FuentesNavision',
            clave   : 'IdFuente'
        }
    );
    this.fuentesNavisionDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.fuente = respuesta.datos[0];
                self.fuente.Configuracion = JSON.parse(self.fuente.Configuracion);

                self.navisionDS.EjecutarFiltro(self.fuente.Configuracion.Pagina, self.fuente.Configuracion.Filtro, self.fuente.Configuracion.Tamanyo)
            }


        }
        else
            alert(respuesta.mensaje);
    };
};
ComboNavision.prototype.obtenerFuente = function(Id){
    var where = {
        IdFuente : Id
    };

    this.fuentesNavisionDS.Buscar(where, false, false);
};
