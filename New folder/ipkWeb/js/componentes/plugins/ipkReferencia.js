var Referencia = function(campo , ficha,  options){
    this._defaults = {};
    this.configuracion = $.extend( this._defaults , options);
    this.configuracion.requerido = !campo.EsNullable;

    this.tipo = 'referencia';

    this.campo = campo;                 // Cacheamos la informacion del campo para poder usuarla desde otro lado que no sea el constructor
    this.nombre = campo.Nombre;         // Nombre del campo
    this.controles = ficha;

    this._control = undefined;
    this.nombre = campo.Nombre;

    //this._control = this.render(campo);

    this.subcripciones();
    this.obtenerModelo();

    return this;
};

Referencia.prototype.subcripciones = function(){
    var self = this;

    app.eventos.escuchar("GetById" + this.nombre, "zz_Modelos",  function(e,eventArgs){
        self._modelo = eventArgs.datos;

        self.subcripcionesListado(self);
        self.obtenerDatos();
    });
};

Referencia.prototype.obtenerDatos = function(){
    var parametros = {
        Entidad : this._modelo.Nombre,
        Alias :  "Listado"+ this.nombre
    };

    app.servicios.generales.Listado(JSON.stringify(parametros));
};
Referencia.prototype.subcripcionesListado = function(contexto){
    var self = contexto;

    app.eventos.escuchar("Listado" + self.nombre,  self._modelo.Nombre,  function(e,eventArgs){
        var placeholder = $("select", self._control);

        if(placeholder.length == 0)
        {
            self._control = self.render(self.campo);
            placeholder = $("select", self._control);
        }

        var plantilla = self.plantillaOption();
        var datos = $(plantilla).tmpl(eventArgs.datos);

        app.log.debug('control', self._control);
        app.log.debug('placeholder', placeholder);
        app.log.debug('Plantilla', plantilla);
        app.log.debug('Combo', $(datos));

        $(placeholder).append(datos);
        self.controles.append(self._control);

        app.log.debug('Referencia - Listado_' + self.nombre, eventArgs);
    });
};

Referencia.prototype.obtenerModelo = function(){
    var parametros = {
        Entidad : "zz_Modelos",
        Clave   : "IdModelo",
        Valor   : this.campo.IdReferencia,
        Alias   : "GetById" + this.nombre
    };

    app.servicios.generales.GetById(JSON.stringify(parametros));
};

Referencia.prototype.plantilla = function(){
    var plantilla = "<script type='text/template' id='campoTemplate'>";
    plantilla += "<div class='textboxNumerico' >";
    plantilla += "<label for='${Titulo}' class=''>${Titulo}</label>";
    plantilla += "<select name='${Nombre}' id='${Nombre}' class='${Tipo}' ></select>";
    plantilla += "</div>";
    plantilla += "</script>";

    return plantilla;
};
Referencia.prototype.render = function(datos){
    return $(this.plantilla()).tmpl(datos);
};
Referencia.prototype.plantillaOption = function(){
    var plantilla = "<script type='text/template' id='campoTemplate'>";
    plantilla += "<option value='${IdCliente}'>${Nombre}</option>";
    return plantilla;
};
