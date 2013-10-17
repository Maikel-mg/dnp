var Ficha = function(parametros){
    var self = this;
    this.entidad      = parametros.Entidad;
    this.claveEntidad = parametros.Clave;
    this.servicio     = app.servicios.generales;

    if($.QueryString["id"])
    {
        this.idRegistro = parseInt( $.QueryString["id"] );
        this.modo = Ficha.Modos.Consulta;
    }
    else
    {
        this.idRegistro = 0;
        this.modo = Ficha.Modos.Alta;
    }

    /* INICIALIZACION */
    this.cache();
    this.subcripciones();
    this.configurarFichaModelos();

    /* CARGA DATOS */
    if( this.modo == Ficha.Modos.Consulta)
    {
        this.fetchModelo();
    }
    else
    {

        this.getEstructura();
    }

    this.modoConsulta();
};

Ficha.prototype.cache = function(){
    /* CONTENEDOR */
    this.ctrlFormulario = $('#ctrlFormulario');

};
Ficha.prototype.subcripciones = function(){

    app.eventos.subscribir('GetById',    $.proxy(this.getEstructura, this) );
    app.eventos.subscribir('Insert',     $.proxy(this.inserted, this) );
    app.eventos.subscribir('Delete',     $.proxy(this.deleted, this) );
    app.eventos.subscribir('Copiar',     $.proxy(this.getEstructura, this) );
    app.eventos.subscribir('Update',     $.proxy(this.getEstructura, this) );
    app.eventos.subscribir('Estructura', $.proxy(this.render, this) );

    /* EVENTOS FICHA */
    app.eventos.subscribir(ComponenteFicha.Eventos.OnBtnEditarClick   ,  $.proxy(this.entrarModoEdicion, this) );
    app.eventos.subscribir(ComponenteFicha.Eventos.OnBtnBorrarClick   ,  $.proxy(this.borraModelo, this) );
    app.eventos.subscribir(ComponenteFicha.Eventos.OnBtnCopiarClick   ,  $.proxy(this.copiarModelo, this) );
    app.eventos.subscribir(ComponenteFicha.Eventos.OnBtnGuardarClick  ,  $.proxy(this.guardarModelo, this) );
    app.eventos.subscribir(ComponenteFicha.Eventos.OnBtnCancelarClick ,  $.proxy(this.salirModoEdicion, this) );
	app.eventos.subscribir(ComponenteFicha.Eventos.OnBtnVolverClick   ,  $.proxy(this.Volver, this) );
};

Ficha.prototype.configurarFichaModelos = function(){

    var ficha = {
        entidad : this.entidad,
        contenedor : 'ctrlFormulario',
        campoClave : this.claveEntidad
    };

    this.ficha = new ComponenteFicha( ficha );

};
Ficha.prototype.fetchModelo = function(){
    var filtrofetch = {
        'Entidad': this.entidad ,
        'Clave': this.claveEntidad,
        'Valor': this.idRegistro
    };

    var filtro = JSON.stringify(filtrofetch);

    this.servicio.GetById(filtro);
};
Ficha.prototype.render = function(evento, respuesta){
    var self = this;

    this.ficha.setEstructura(respuesta.datos);

    $('*' ,this.ctrlFormulario).remove();

    $(respuesta.datos).each(function(){
        if(this.Tipo == "Boolean")
        {
            var check = $('#booleanTemplate').tmpl(this);
            $(self.ctrlFormulario).append(check);
            $('#' + this.Nombre).attr('checked',self.ficha.data[this.Nombre]);
        }
        else if(this.Tipo == "Reference"){
            $('#referenciaTemplate').tmpl(this).appendTo(self.ctrlFormulario);
            var ref = $('#' + this.Nombre + '-enlace').attr('href') + "&id=" + self.ficha.data[this.Nombre];
            $('#' + this.Nombre + '-enlace').attr('href', ref);
        }
        else
        {
            var campo = $('#campoTemplate').tmpl(this);
            if(self.ficha.data[this.Nombre])
                $(campo).val(self.ficha.data[this.Nombre]);

            $(self.ctrlFormulario).append(campo);
            if(this.Tipo == "DateTime")
            {
                $.datepicker.regional['es'] = {
                    closeText: 'Cerrar',
                    prevText: '<Ant',
                    nextText: 'Sig>',
                    currentText: 'Hoy',
                    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
                    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                    dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
                    dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
                    weekHeader: 'Sm',
                    dateFormat: 'dd/mm/yy',
                    firstDay: 1,
                    isRTL: false,
                    showMonthAfterYear: false,
                    yearSuffix: ''};
                $.datepicker.setDefaults($.datepicker.regional['es']);
                $('#' + this.Nombre).datepicker({
                    showButtonPanel: true,
                    changeMonth: true,
                    changeYear: true,
                    buttonImage: "../../img/calendario.png",
                    buttonImageOnly: true
                });
            }
        }
    });

    if( this.modo == Ficha.Modos.Consulta)
        this.modoConsulta();
    else
        this.modoEdicion();
};
Ficha.prototype.getEstructura = function(evento, respuesta){

    if(respuesta)
    {
        app.log.debug('Maikeleeeeeeeeeeeeeeeeeeeeeeeeeeeee' , respuesta);

        var registro = respuesta.datos;
        if(registro !== undefined)
        {
            app.log.debug('Ya tenemos los datos', registro);
            this.ficha.setData(registro);
        }
        else
        {
            alert('No se ha encontrado ningún modelo con el Id indicado');
        }
    }


    var estructura = {
        Entidad : this.entidad
    };

    this.servicio.Estructura(JSON.stringify(estructura));
};
Ficha.prototype.inserted = function(evento, respuesta){

    if(respuesta)
    {
        var registro = respuesta.datos;
        if(registro !== undefined)
        {
            this.idRegistro =  registro.IdModelo;

            alert(respuesta.mensaje);
            this.getEstructura(evento, respuesta);
        }
        else
        {
            alert(respuesta.mensaje);
        }
    }

};
Ficha.prototype.deleted = function(evento, respuesta){

    if(respuesta)
    {
        app.log.debug('respuesta', respuesta);

        var estado = respuesta.estado;
        alert(respuesta.mensaje);
        if(estado == "OK")
        {
            //window.location = "Listado.html";
            window.location = "Listado.html?entidad="+  this.entidad  +"&clave="+ claveEntidad;
        }
    }

};

Ficha.prototype.borraModelo = function(evento, respuesta){
    var eliminacion = {
        'Entidad': this.entidad,
        'Clave': this.claveEntidad,
        'Valor': this.idRegistro

    };

    this.servicio.Delete(JSON.stringify(eliminacion));
};

Ficha.prototype.Volver = function(evento, respuesta){
	/*var objeto = {
        'Entidad': this.entidad,
        'Clave': this.claveEntidad,
        'Valor': this.idRegistro

    };

	alert (this.entidad);
	*/
	window.location = "Listado.html?entidad=" + this.entidad + "&clave=" + this.claveEntidad;
};

Ficha.prototype.copiarModelo = function(evento, respuesta){
    var copia = {
        'Entidad': this.entidad,
        'Clave':this.claveEntidad,
        'Valor': this.idRegistro,
        'Datos' : {}
    };

    this.servicio.Copiar(JSON.stringify(copia));
};
Ficha.prototype.guardarModelo = function(evento, respuesta){
    if(this.idRegistro == 0)
    {
        var insercion = {
            'Entidad': this.entidad,
            'Datos': this.ficha.Serializar()
        };

        this.servicio.Insert( JSON.stringify(insercion) );
    }
    else
    {
        var actualizacion = {
            'Entidad': this.entidad,
            'Clave': {
                'Clave': this.claveEntidad,
                'Valor': this.idRegistro
            },
            'Datos': this.ficha.Serializar()
        };

        this.servicio.Update( JSON.stringify(actualizacion) );
    }
    this.modo = Ficha.Modos.Consulta;
};
Ficha.prototype.entrarModoEdicion = function(evento, respuesta){
    //TODO: Guardar una copia de los datos actuales para el caso de deshacer
    this.modo = Ficha.Modos.Edicion;
    this.modoEdicion();
};
Ficha.prototype.salirModoEdicion = function(evento, respuesta){

    this.modo = Ficha.Modos.Consulta;
    this.modoConsulta();
};

Ficha.prototype.modoConsulta = function(){
    $('input').attr('readonly', true);

    $('.botonEdicion').hide();
    $('.botonConsulta').show();
};
Ficha.prototype.modoEdicion = function(){
    $('input').attr('readonly', false);

    $('.botonEdicion').show();
    $('.botonConsulta').hide();
};

Ficha.Modos = {
    Consulta : "Consulta",
    Edicion  : "Edicion",
    Alta     : "Alta"
};
