var ColeccionHijos = function(campo , data,  options){
    this._defaults = {};
    this.configuracion = $.extend( this._defaults , options);
    this.configuracion.requerido = !campo.EsNullable;

    this.tipo = 'coleccionHijos';

    this.campo = campo;                 // Cacheamos la informacion del campo para poder usuarla desde otro lado que no sea el constructor
    this.nombre = campo.Nombre;         // Nombre del campo
    this.fichaContenedor = data;        // Componente ficha que contiene la coleccion (Para acceder a las propiedades suyas)

    this._lista = {};                   // Guarda el componente listado instanciado
    this.parametrosTabla = {};          // Guarda los parametros con los que se crea el listado
    this._modelo = {};                  // Cacheamos la informacion del modelo

    this.navegacion = undefined;        // Pestaña del tab para el elemento
    this.placeholder = undefined;       // Contenedor donde se mete el componente listado
    this.dialogoFicha = undefined;

    this.idNuevaRelacion = 0;

    this.crearTab();
    this.obtenerModelo();

    this.subcripciones();

    return this;
};

ColeccionHijos.prototype.subcripciones = function(){
    var self = this;
    var nombreContexto = this.nombre;

    app.eventos.escuchar("onBtnNuevoClick", nombreContexto,  function(e,eventArgs){
        self.dialogoFicha.dialog('open');

        var padre = {
            Entidad : self.fichaContenedor.infoModelo.Nombre,
            Clave : self.fichaContenedor.campoClave(),
            Valor : self.fichaContenedor.valorClave()
        };

        //location = '../Ficha/Proyectos.html?padre='+ JSON.stringify(padre);
    });
    app.eventos.escuchar("onBtnIrAFichaClick", nombreContexto,  function(e,eventArgs){
        //location = '../Ficha/'+self._modelo.Nombre+'.html?Id=' + self._lista.getIdRegistroSeleccionada();
        location = '../Ficha/Ficha.html?Ficha='+self._modelo.Nombre+'&Id=' + self._lista.getIdRegistroSeleccionada();
    });
    app.eventos.escuchar("onBtnBorrarClick", nombreContexto,  function(e,eventArgs){
        var Datos = {
            Entidad : self.parametrosTabla.infoListado.zz_Modelos.Nombre,
            Clave   : self.fichaContenedor.colecciones[eventArgs.Entidad].campoClave(),
            Valor   : self.fichaContenedor.colecciones[eventArgs.Entidad].getIdRegistroSeleccionada()
        };

        app.log.debug('Borrar hijo ' , JSON.stringify(Datos));
        app.servicios.generales.Delete(JSON.stringify(Datos));
    });

    app.eventos.escuchar("Delete", nombreContexto,  function(event, eventArgs){
        app.log.debug('Se ha borrado el hijo', eventArgs);
        self.fichaContenedor.colecciones[eventArgs.entidad].borrarFilaSeleccionada();
        alert('Se ha borrado el hijo ');
    });
    app.eventos.escuchar("GetById" + nombreContexto, "zz_Modelos",  function(e,eventArgs){
        self._modelo = eventArgs.datos;

        self.subcripcionesListado();
        self.obtenerListado();
    });
    app.eventos.escuchar("BuscarColeccion" + nombreContexto, "zz_Listados",  function(event, eventArgs){

        app.log.debug('Busqueda Listados', eventArgs.datos[0]);
        self.parametrosTabla.infoListado = eventArgs.datos[0];
        self.parametrosTabla.infoModelo = eventArgs.datos[0].zz_Modelos;
        self.parametrosTabla.infoCampos = eventArgs.datos[0].zz_CamposListados;
        self.parametrosTabla.allowCopy = false;
        //self.parametrosTabla.infoListado.EsColeccion = true;

        self.crearTabla();
        self.obtenerFicha();

        self.subcripcionesFicha();

        if( !$.isEmptyObject( self.fichaContenedor.datos[self.nombre]))
        {
            self._lista.setDatos( self.fichaContenedor.datos[self.nombre] );
        }

    });
};
ColeccionHijos.prototype.subcripcionesFicha = function(){
    var self = this;
    app.eventos.escuchar("OnBtnCancelarClick", this.nombre  + "_Ficha",  function(e,eventArgs){
        self.dialogoFicha.dialog('close');
    });
    app.eventos.escuchar("OnRecordInserted", this.nombre  + "_Ficha",  function(e,eventArgs){
        self._lista.agregarRegistro(eventArgs.datos);
        self.dialogoFicha.dialog('close');
    });
};
ColeccionHijos.prototype.subcripcionesListado = function(){
    var self = this;
    app.eventos.escuchar("Listado"+ self.nombre , self._modelo.Nombre,  function(e,eventArgs){
        app.log.debug('Coleccion - Listado', eventArgs);

        //self._listaMe.setDatos( eventArgs.datos );
    });
    app.eventos.escuchar("GetById"+ self.nombre , self._modelo.Nombre,  function(e,eventArgs){
        app.log.debug('GetById'+ self.nombre , eventArgs);

        self._lista.agregarRegistro(eventArgs.datos );
    });
};

ColeccionHijos.prototype.obtenerModelo = function(){
    var parametros = {
        Entidad : "zz_Modelos",
        Clave   : "IdModelo",
        Valor   : this.campo.IdReferencia,
        Alias   : "GetById" + this.nombre
    };

    app.servicios.generales.GetById(JSON.stringify(parametros));
};
ColeccionHijos.prototype.obtenerListado = function(Nombre){
    var where = {
        "Clave" : "'"+ this._modelo.Nombre +"'"
    };

    var parametros = {
        Entidad : "zz_Listados",
        Where   : where,
        Referencias : true,
        Colecciones : true,
        Alias : "BuscarColeccion" + this.nombre
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};
ColeccionHijos.prototype.obtenerFicha = function(){

    var padre = {
        Entidad : this.fichaContenedor.infoModelo.Nombre,
        Clave   : this.fichaContenedor.campoClave(),
        Valor   : this.fichaContenedor.valorClave()
    };

    var options = {
        Ficha       : this._modelo.Nombre,
        Id          : 0,
        contenedor  : this.nombre  + "_Ficha",
        padre       : padre
    };

    this._ficha = new FichaController(options);

};
ColeccionHijos.prototype.obtenerDatosListadoME = function(){
    var parametros = {
        Entidad : this.nombre,
        Alias :  "Listado"+ this.nombre
    };

    app.servicios.generales.Listado(JSON.stringify(parametros));
};
ColeccionHijos.prototype.obtenerNuevaRelacion = function(Nombre){
    var parametros = {
        Entidad :  this._modelo.Nombre,
        Clave   : this._listaMe.campoClave(),
        Valor   : this.idNuevaRelacion,
        Alias   : "GetById" + this.nombre
    };

    app.servicios.generales.GetById(JSON.stringify(parametros));
};

ColeccionHijos.prototype.crearTabla = function(){
    this._lista = $(this.placeholder).listado(this.parametrosTabla);
    this.fichaContenedor.colecciones[this.nombre] = this._lista;
};
ColeccionHijos.prototype.crearTab = function(){
    this.crearNavegacionTab();
    this.crearContenedorTab();
    this.crearDialogoFicha();
};
ColeccionHijos.prototype.crearNavegacionTab = function(){
    this.navegacion = $("<li><a href='#" + this.nombre  + "' >" + this.nombre  + "</a></li>");
    $('ul', this.fichaContenedor.areaColecciones).append(this.navegacion);
};
ColeccionHijos.prototype.crearContenedorTab = function(){
    if($('#' + this.nombre).length > 0)
        this.placeholder = $('#' + this.nombre);
    else
        this.placeholder = $("<div id='" + this.nombre  + "' class='coleccion listado'></div>");

    $(this.fichaContenedor.areaColecciones).append(this.placeholder);
};
ColeccionHijos.prototype.crearDialogoFicha = function(){
    var nombre = this.nombre  + "_Ficha";
    var selector = "#" + nombre;
    var selectorTitleBar = "#ui-dialog-title-" + nombre;

    if($(selector).length > 0)
            $(selector + " *").remove();
    else{
        this.dialogoFicha = $("<div id='" + nombre + "' class='ficha'></div>");
        $(this.fichaContenedor.areaColecciones).append(this.dialogoFicha);
        this.dialogoFicha.dialog({
            autoOpen    : false,
            modal       : true,
            title       : 'Ficha de ' + this.nombre,
            width       : '800px'

        });
        $(selectorTitleBar).closest('div').find('a').hide();
    }
};



