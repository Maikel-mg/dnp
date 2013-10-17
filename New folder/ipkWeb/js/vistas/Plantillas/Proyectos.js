var ProyectosController = function(options){
    this._lista = {};
    this._ficha = {};
    this.propiedades = $.extend({}, options);

    this.parametrosTabla = {};
    this.parametrosFicha = {};

    this.vincularEventos();

    this.obtenerConfiguracionLista();
    this.cargarConfiguracionFicha();

    this.subscripciones();
};

ProyectosController.prototype.vincularEventos = function(){};
ProyectosController.prototype.subscripciones = function(){
    var self = this;

    /*    EVENTOS DATOS
    *****************************/
    app.eventos.escuchar("Buscar", "zz_Listados",  function(event, eventArgs){
        app.log.debug('Busqueda Listados', eventArgs.datos[0]);

        self.parametrosTabla.infoListado = eventArgs.datos[0];
        self.parametrosTabla.infoModelo = eventArgs.datos[0].zz_Modelos;
        self.parametrosTabla.infoCampos = eventArgs.datos[0].zz_CamposListados;

        self.subscripcionesListado();

        self.inicializarLista();
        self.cargarDatosLista();
    });
    app.eventos.escuchar("Buscar", "zz_Fichas",  function(event, eventArgs){
        app.log.debug('Busqueda Ficha', eventArgs.datos[0]);
        self.parametrosFicha.infoFicha = eventArgs.datos[0];
        self.parametrosFicha.infoModelo = eventArgs.datos[0].zz_Modelos;
        self.parametrosFicha.infoCampos = eventArgs.datos[0].zz_CamposFichas;

        self.subscripcionesFichas();

        self.inicializarFicha();
    });

};
ProyectosController.prototype.subscripcionesListado = function(){
    var self = this;

    /*    EVENTOS DATOS
     *****************************/
    app.eventos.escuchar("Listado", this.parametrosTabla.infoModelo.Nombre,  function(event, eventArgs){
        app.log.debug('Listado de los datos del listado', eventArgs);

        self._lista.setDatos(eventArgs.datos);
    });

    /*    EVENTOS LISTA
     *****************************/
    app.eventos.escuchar("onSeleccion", "contenedorLista",  function(e,v){
        app.log.debug('Lanzado con ', [e,v]);
        app.log.debug('Seleccion', v.datos);
        self.cargarDatosFicha(v.datos[self._lista.propiedades.campoId]);
    });
    app.eventos.escuchar("onNuevoClick", "contenedorLista", function(e,v){
        self._lista.removeSeleccion();
        self._ficha.limpiar();
        self._ficha.entrarModoEdicion();
    });
};
ProyectosController.prototype.subscripcionesFichas = function(){
    var self = this;

    /*    EVENTOS DATOS
     *****************************/
    app.eventos.escuchar("Buscar", this.parametrosFicha.infoModelo.Nombre ,  function(event, eventArgs){
        app.log.debug('Buscamos los datos de la ficha', eventArgs);
        self._ficha.setData(eventArgs.datos);
        self._ficha.render();
    });

    /*    EVENTOS FICHA
     *****************************/
    app.eventos.escuchar("OnRecordUpdated", "contenedorFicha", function(e,v){
        self._lista.datos.update(v.datos);
        self._lista.refrescar();
        self.cargarDatosFicha(v.datos[self._lista.propiedades.campoId]);
    });
    app.eventos.escuchar("OnRecordInserted", "contenedorFicha", function(e,v){
        self._lista.agregarRegistro(v.datos);
        self._lista.setSeleccionPorId(v.datos[self._lista.propiedades.campoId]);
        self.cargarDatosFicha(v.datos[self._lista.propiedades.campoId]);
    });
    app.eventos.escuchar("OnRecordDeleted","contenedorFicha", function(e,v){
        self._lista.borrarFilaSeleccionada();
        self._ficha.limpiar();
    });
    app.eventos.escuchar("OnRecordCopied", "contenedorFicha", function(e,v){
        self._lista.agregarRegistro(v.datos);
    });
};

ProyectosController.prototype.obtenerConfiguracionLista = function(){
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
ProyectosController.prototype.cargarConfiguracionFicha = function(){
    var where = {
        "Clave" : "'"+ this.propiedades.Ficha  +"'"
    };

    var parametros = {
        Entidad : "zz_Fichas",
        Where   : where,
        Referencias : true,
        Colecciones : true
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};

ProyectosController.prototype.cargarDatosLista = function(){
    var parametros = {
        Entidad : this.parametrosTabla.infoModelo.Nombre
    };

    app.servicios.generales.Listado(JSON.stringify(parametros));
};
ProyectosController.prototype.cargarDatosFicha = function(id){
    var where = {};
    where[this._lista.propiedades.campoId] = id;

    var parametros = {
        Entidad : this._ficha.infoModelo.Nombre,
        Where   : where,
        Referencias : true,
        Colecciones : true,
        Alias       : "Buscar"
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};

ProyectosController.prototype.inicializarLista = function(){
    var campoClave = _.find(this.parametrosTabla.infoCampos, function(campo){return campo.EsClave == true;});
    var campoDescripcion = _.find(this.parametrosTabla.infoCampos, function(campo){return campo.EsDescripcion == true;});

    if(campoClave !== undefined)
    {
        if(campoDescripcion !== undefined)
        {
            //TODO: Meter esto dentro del control y pasarle los parametros de la tabla
            var opcionesLista = {
                nombre : this.parametrosTabla.infoModelo.Nombre,
                titulo : this.parametrosTabla.infoModelo.Nombre,
                campo  : campoDescripcion.Nombre,
                campoId  : campoClave.Nombre,
                allowNew: true
            };

            this._lista = $('#contenedorLista').lista(opcionesLista);
        }
        else
        {
            alert('No se ha especificado un campo descripcioon para el listado "' + this.parametrosTabla.infoListado.Nombre + '"');
        }
    }
    else{
        alert('No se ha especificado una clave para el listado "' + this.parametrosTabla.infoListado.Nombre + '"');
    }

};
ProyectosController.prototype.inicializarFicha = function(){
    this._ficha = $('#contenedorFicha').ficha({});
    this._ficha.setEstructura(this.parametrosFicha);
};




