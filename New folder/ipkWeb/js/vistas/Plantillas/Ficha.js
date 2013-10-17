var FichaController = function(options){
    this._lista = {};
    this._ficha = {};
    this.propiedades = $.extend({}, options);

    this.parametrosFicha = {};

    this.vincularEventos();

    this.cargarConfiguracionFicha();

    this.subscripciones();

    return this;
};

FichaController.prototype.vincularEventos = function(){};
FichaController.prototype.subscripciones = function(){
    var self = this;

    /*    EVENTOS DATOS
    *****************************/
    app.eventos.escuchar("Buscar" + this.propiedades.Ficha, "zz_Fichas",  function(event, eventArgs){
        app.log.debug('Busqueda Ficha', eventArgs.datos[0]);
        self.parametrosFicha.infoFicha = eventArgs.datos[0];
        self.parametrosFicha.infoModelo = eventArgs.datos[0].zz_Modelos;
        self.parametrosFicha.infoCampos = eventArgs.datos[0].zz_CamposFichas;

        self.subscripcionesFichas();

        self.inicializarFicha();
    });

};
FichaController.prototype.subscripcionesFichas = function(){
    var self = this;

    /*    EVENTOS DATOS
     *****************************/
    app.eventos.escuchar("Buscar", this.parametrosFicha.infoModelo.Nombre ,  function(event, eventArgs){
        app.log.debug('Buscamos los datos de la ficha', eventArgs);
        self._ficha.setData(eventArgs.datos);
        //self._ficha.render();
    });

    /*    EVENTOS FICHA
     *****************************/
    app.eventos.escuchar("OnRecordUpdated" , this.propiedades.contenedor, function(e,v){
        self._lista.datos.update(v.datos);
        self._lista.refrescar();
        self.cargarDatosFicha(v.datos[self._lista.propiedades.campoId]);
    });
    app.eventos.escuchar("OnRecordInserted", this.propiedades.contenedor, function(e,v){
        self._lista.agregarRegistro(v.datos);
        self._lista.setSeleccionPorId(v.datos[self._lista.propiedades.campoId]);
        self.cargarDatosFicha(v.datos[self._lista.propiedades.campoId]);
    });
    app.eventos.escuchar("OnRecordDeleted" , this.propiedades.contenedor, function(e,v){
        self._lista.borrarFilaSeleccionada();
        self._ficha.limpiar();
    });
    app.eventos.escuchar("OnRecordCopied"  , this.propiedades.contenedor, function(e,v){
        self._lista.agregarRegistro(v.datos);
    });
};

FichaController.prototype.cargarConfiguracionFicha = function(){
    var where = {
        "Clave" : "'"+ this.propiedades.Ficha  +"'"
    };

    var parametros = {
        Entidad : "zz_Fichas",
        Where   : where,
        Referencias : true,
        Colecciones : true,
        Alias       : "Buscar"+  this.propiedades.Ficha
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};
FichaController.prototype.cargarDatosFicha = function(id){
    var where = {};
    where[this._ficha.campoClave()] = id;

    var parametros = {
        Entidad : this._ficha.infoModelo.Nombre,
        Where   : where,
        Referencias : true,
        Colecciones : true,
        Alias       : "Buscar"
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};
FichaController.prototype.inicializarFicha = function(){
    this._ficha = $('#' + this.propiedades.contenedor).ficha({});
    this._ficha.setEstructura(this.parametrosFicha);

    if(this.propiedades.padre)
        this._ficha.setPadre(this.propiedades.padre);

    if(this.propiedades.Id !== 0)
        this.cargarDatosFicha(this.propiedades.Id);
    else
        this._ficha.modoEdicion();
};




