var ListadoController = function(options){
    this._lista = {};
    this._ficha = {};
    this.propiedades = $.extend({}, options);

    this.parametrosTabla = {};
    this.parametrosFicha = {};

    this.vincularEventos();

    this.obtenerConfiguracionLista();

    this.subscripciones();
};

ListadoController.prototype.vincularEventos = function(){
    var self = this;
    $('#btnFiltrar').on('click', function(){
        self.aplicarFiltro();
    });
    $('#btnLimpiarFiltror').on('click', function(){
        self.cargarDatosLista();
    });
};
ListadoController.prototype.prepararFiltro = function(){
    var cadena = "";
    return cadena;
};
ListadoController.prototype.aplicarFiltro = function(){
    var cadena = this.prepararFiltro();

    if(cadena !== "")
    {
        var parametros = {
            Entidad : this.parametrosTabla.infoModelo.Nombre,
            Where   : cadena,
            Alias : "Filtrar" + this.parametrosTabla.infoModelo.Nombre
        };

        app.servicios.generales.Filtrar( JSON.stringify(parametros) );
    }
};
ListadoController.prototype.setDatos = function(datos){
    this._lista.setDatos(datos);
};


ListadoController.prototype.subscripciones = function(){
    var self = this;

    /*    EVENTOS DATOS
    *****************************/
    app.eventos.escuchar("Buscar" + this.propiedades.Listado , "zz_Listados",  function(event, eventArgs){
        app.log.debug('Busqueda Listados', eventArgs.datos[0]);

        self.parametrosTabla.infoListado = eventArgs.datos[0];
        self.parametrosTabla.infoModelo = eventArgs.datos[0].zz_Modelos;
        self.parametrosTabla.infoCampos = eventArgs.datos[0].zz_CamposListados;

        self.subscripcionesListado();

        self.inicializarLista();
        self.cargarDatosLista();
    });

};
ListadoController.prototype.subscripcionesListado = function(){
    var self = this;

    /*    EVENTOS DATOS
     *****************************/
    app.eventos.escuchar("Listado" + this.parametrosTabla.infoModelo.Nombre, this.parametrosTabla.infoModelo.Nombre,  function(event, eventArgs){
        app.log.debug('Listado de los datos del listado', eventArgs);

        self._lista.setDatos(eventArgs.datos);
    });
    app.eventos.escuchar("Filtrar" + this.parametrosTabla.infoModelo.Nombre, this.parametrosTabla.infoModelo.Nombre,  function(event, eventArgs){
        alert('Filtrado de los datos correcto');
        app.log.debug('Filtrado de los datos', eventArgs);

        self._lista.setDatos(eventArgs.datos);
    });

    /*    EVENTOS LISTA
     *****************************/
    app.eventos.escuchar("onSeleccion", this.propiedades.contenedor,  function(e,v){
        app.log.debug('Lanzado con ', [e,v]);
        app.log.debug('Seleccion', v.datos);
    });
    app.eventos.escuchar("onBtnNuevoClick", this.propiedades.contenedor, function(e,v){
        var direccion = '';

        if(self.propiedades.DireccionCreacion)
            direccion = self.propiedades.DireccionCreacion;
        else
        {
            direccion = '../Ficha/Ficha.html?Ficha=' + self.parametrosTabla.infoModelo.Nombre;
            if(self._lista.datosPadre !== undefined)
                direccion += "&padre=" + JSON.stringify(self._lista.datosPadre);
        }

        location = direccion;
    });
    app.eventos.escuchar("onBtnIrAFichaClick", this.propiedades.contenedor, function(e,v){
        var direccion = '';

        if(self.propiedades.DireccionEdicion)
        {
            direccion = self.propiedades.DireccionEdicion + '?Id=' + self._lista.getIdRegistroSeleccionada();
        }
        else
        {
            direccion = '../Ficha/Ficha.html?Ficha=' + self.parametrosTabla.infoModelo.Nombre + '&Id=' + self._lista.getIdRegistroSeleccionada();

            if(self._lista.datosPadre !== undefined)
                direccion += "&padre=" + JSON.stringify(self._lista.datosPadre);
        }
            
        location = direccion;
        //location = '../Ficha/' + self.parametrosTabla.infoModelo.Nombre + '.html?Id=' + self._lista.getIdRegistroSeleccionada();

    });
};

ListadoController.prototype.obtenerConfiguracionLista = function(){
    var where = {
        "Clave" : "'"+ this.propiedades.Listado +"'"
    };

    var parametros = {
        Entidad : "zz_Listados",
        Where   : where,
        Referencias : true,
        Colecciones : true,
        Alias : "Buscar" + this.propiedades.Listado
    };



    app.servicios.generales.Buscar(JSON.stringify(parametros));
};

ListadoController.prototype.cargarDatosLista = function(){
    var parametros = {
        Entidad : this.parametrosTabla.infoModelo.Nombre,
        Alias : "Listado" + this.parametrosTabla.infoModelo.Nombre
    };

    app.servicios.generales.Listado(JSON.stringify(parametros));
};

ListadoController.prototype.inicializarLista = function(){
    this._lista = $('#' + this.propiedades.contenedor ).listado(this.parametrosTabla);
};





