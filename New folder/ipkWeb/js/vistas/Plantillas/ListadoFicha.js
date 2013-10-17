var ListadoFichaController = function(options){
    this._lista = {};
    this._ficha = {};
    this.propiedades = $.extend({}, options);
    this.parametrosTabla = {};
    this.parametrosFicha = {};

    this.vincularEventos();
    this.subscripciones();

    this.cargarConfiguracionLista();
    this.cargarConfiguracionFicha();
};

ListadoFichaController.prototype.vincularEventos = function(){};
ListadoFichaController.prototype.subscripciones = function(){
    var self = this;

    /*    EVENTOS DATOS
    *****************************/
    app.eventos.escuchar("Listado", self.propiedades.Listado ,  function(event, eventArgs){
        app.log.debug('Listado de los datos del listado', eventArgs);
        self._lista.setDatos(eventArgs.datos);
    });
    app.eventos.escuchar("Buscar", "zz_Listados", function(event, eventArgs){
        app.log.debug('Busqueda Listados', eventArgs.datos[0]);
        self.parametrosTabla.infoListado = eventArgs.datos[0];
        self.parametrosTabla.infoModelo = eventArgs.datos[0].zz_Modelos;
        self.parametrosTabla.infoCampos = eventArgs.datos[0].zz_CamposListados;

        self.inicializarLista();
        self.cargarDatosLista();
    });
    app.eventos.escuchar("Buscar", "zz_Fichas", function(event, eventArgs){
        app.log.debug('Busqueda Ficha', eventArgs.datos[0]);
        self.parametrosFicha.infoFicha = eventArgs.datos[0];
        self.parametrosFicha.infoModelo = eventArgs.datos[0].zz_Modelos;
        self.parametrosFicha.infoCampos = eventArgs.datos[0].zz_CamposFichas;

        self.inicializarFicha();
    });
    app.eventos.escuchar("Buscar", self.propiedades.Ficha , function(event, eventArgs){
        app.log.debug('Buscamos los datos de la ficha', eventArgs);
        self._ficha.setData(eventArgs.datos);
        self._ficha.render();
    });

    /*    EVENTOS LISTA
     *****************************/
    app.eventos.escuchar("onRowClick", "contenedorLista", function(e,v){
        app.log.debug('Selccion', v);
        var seleccion = self._lista.getIdRegistroSeleccionada();
        self.cargarDatosFicha(seleccion);
    });
    app.eventos.escuchar("onNuevoClick", "contenedorLista", function(e,v){
        self._lista.removeSeleccion();
        self._ficha.limpiar();
        self._ficha.entrarModoEdicion();
    });

    /*    EVENTOS FICHA
     *****************************/
    app.eventos.escuchar("OnRecordUpdated", "contenedorFicha",  function(e,v){
        self._lista.datos.update(v.datos);
        self._lista.refrescar();
        self.cargarDatosFicha(v.datos[self._lista.propiedades.campoId]);
    });
    app.eventos.escuchar("OnRecordInserted", "contenedorFicha", function(e,v){
        self._lista.agregarRegistro(v.datos);
        self._lista.setSeleccionPorId(v.datos[self._lista.propiedades.campoId]);
        self.cargarDatosFicha(v.datos[self._lista.propiedades.campoId]);
    });
    app.eventos.escuchar("OnRecordDeleted", "contenedorFicha", function(e,v){
        self._lista.borrarFilaSeleccionada();
        self._ficha.limpiar();
    });
    app.eventos.escuchar("OnRecordCopied", "contenedorFicha", function(e,v){
        self._lista.agregarRegistro(v.datos);
    });
};

ListadoFichaController.prototype.cargarConfiguracionLista = function(){
    var where = {
        "Clave" : "'"+ this.propiedades.Listado +"'"
    };

    var parametros = {
        Entidad : "zz_Listados",
        Where   : where,
        Referencias : true,
        Colecciones : true
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};
ListadoFichaController.prototype.cargarConfiguracionFicha = function(){
    var where = {
        "Clave" : "'"+ this.propiedades.Ficha +"'"
    };

    var parametros = {
        Entidad : "zz_Fichas",
        Where   : where,
        Referencias : true,
        Colecciones : true
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};

ListadoFichaController.prototype.cargarDatosLista = function(){
    var parametros = {
        Entidad : this.propiedades.Listado
    };

    app.servicios.generales.Listado(JSON.stringify(parametros));
};
ListadoFichaController.prototype.cargarDatosFicha = function(id){
    var where = {};
    where[this.propiedades.campoId] = id;

    var parametros = {
        Entidad : this._ficha.infoModelo.Nombre,
        Where   : where,
        Referencias : true,
        Colecciones : true
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};

ListadoFichaController.prototype.inicializarLista = function(){

    var opcionesLista = {
        nombre : this.parametrosTabla.infoModelo.Nombre,
        titulo : this.parametrosTabla.infoModelo.Nombre,
        campo  : this.propiedades.campo,
        campoId  : this.propiedades.campoId,
        allowNew: true
    };

    this._lista = $('#contenedorLista').listado(this.parametrosTabla);
};
ListadoFichaController.prototype.inicializarFicha = function(){
    this._ficha = $('#contenedorFicha').ficha({});
    this._ficha.setEstructura(this.parametrosFicha);
};




