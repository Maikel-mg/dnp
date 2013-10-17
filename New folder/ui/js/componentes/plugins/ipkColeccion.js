var Coleccion = function(campo , data,  options){
    this._defaults = {};
    this.configuracion = $.extend( this._defaults , options);
    this.configuracion.requerido = !campo.EsNullable;

    this.tipo = 'coleccion';

    this.campo = campo;                 // Cacheamos la informacion del campo para poder usuarla desde otro lado que no sea el constructor
    this.nombre = campo.Nombre;         // Nombre del campo
    this.fichaContenedor = data;        // Componente ficha que contiene la coleccion (Para acceder a las propiedades suyas)

    this._lista = {};                   // Guarda el componente listado instanciado
    this._listaME = {};                 // Guarda el componente listado ME instanciado
    this.parametrosTabla = {};          // Guarda los parametros con los que se crea el listado
    this.parametrosTablaME = {};          // Guarda los parametros con los que se crea el listado
    this._modelo = {};                  // Cacheamos la informacion del modelo

    this.navegacion = undefined;        // Pestaña del tab para el elemento
    this.placeholder = undefined;       // Contenedor donde se mete el componente listado
    this.dialogoMe = undefined;

    this.idNuevaRelacion = 0;

    this.crearTab();
    this.obtenerModelo();

    this.subcripciones();

    return this;
};

Coleccion.prototype.subcripciones = function(){
    var self = this;
    var nombreContexto = this.nombre;

    app.eventos.escuchar("onBtnBorrarRelacionClick", nombreContexto,  function(e,eventArgs){

        var Datos1 = {
            Entidad : self.fichaContenedor.infoFicha.zz_Modelos.Nombre,
            Clave   : self.fichaContenedor.campoClave(),
            Valor   : self.fichaContenedor.valorClave()
        };
        var Datos2 = {
            Entidad : self.parametrosTabla.infoListado.zz_Modelos.Nombre,
            Clave   : self.fichaContenedor.colecciones[eventArgs.Entidad].campoClave(),
            Valor   : self.fichaContenedor.colecciones[eventArgs.Entidad].getIdRegistroSeleccionada()
        };

        var borrarRelacion = {
            Datos1 : Datos1,
            Datos2 : Datos2
        };

        app.log.debug('Borrar relacion ' , JSON.stringify(borrarRelacion));
        app.servicios.generales.BorrarRelacion(JSON.stringify(borrarRelacion));
    });
    app.eventos.escuchar("onBtnCrearRelacionClick", nombreContexto,  function(e,eventArgs){
        self.dialogoMe.dialog('open');


    });
    app.eventos.escuchar("onBtnSeleccionMEClick", nombreContexto,  function(e,eventArgs){
        app.log.debug('Seleccion de ME' , eventArgs);

        app.log.debug('Fila de ME seleccionada' , self._listaMe.campoClave());
        app.log.debug('Fila de ME seleccionada' , self._listaMe.getIdRegistroSeleccionada());

        var Datos1 = {
            Entidad : self.fichaContenedor.infoFicha.zz_Modelos.Nombre,
            Clave   : self.fichaContenedor.campoClave(),
            Valor   : self.fichaContenedor.valorClave()
        };
        var Datos2 = {
            Entidad : self.parametrosTabla.infoListado.zz_Modelos.Nombre,
            Clave   : self._listaMe.campoClave(),
            Valor   : self._listaMe.getIdRegistroSeleccionada()
        };

        var relacion = {
            Datos1 : Datos1,
            Datos2 : Datos2
        };

        self.idNuevaRelacion = self._listaMe.getIdRegistroSeleccionada();

        app.log.debug('Crear relacion ' , JSON.stringify(relacion));
        app.servicios.generales.CrearRelacion(JSON.stringify(relacion));

        self.dialogoMe.dialog('close');
    });
    app.eventos.escuchar("onBtnCancelarMEClick", nombreContexto,  function(e,eventArgs){
        self.dialogoMe.dialog('close');
    });
    app.eventos.escuchar("CrearRelacion", nombreContexto,  function(event, eventArgs){
        app.log.debug('Se ha creado la relacion ', eventArgs);
        alert(eventArgs.mensaje);

        if(eventArgs.estado == 'OK')
        {
            self.obtenerNuevaRelacion();
        }
    });
    app.eventos.escuchar("BorrarRelacion", nombreContexto,  function(event, eventArgs){
        app.log.debug('Se ha borrado la relacion ', eventArgs);
        self.fichaContenedor.colecciones[eventArgs.entidad].borrarFilaSeleccionada();
        alert('Se ha borrado la relacion ');
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
        self.parametrosTabla.infoListado.EsColeccion = true;

        self.parametrosTablaME.infoListado = _.clone( eventArgs.datos[0] );
        self.parametrosTablaME.infoModelo  = _.clone( eventArgs.datos[0].zz_Modelos );
        self.parametrosTablaME.infoCampos  = _.clone( eventArgs.datos[0].zz_CamposListados );
        self.parametrosTablaME.infoListado.EsME = true;
        self.parametrosTablaME.infoListado.EsColeccion = false;

        self.crearTablaME();
        self.crearTabla();

        self.obtenerDatosListadoME();

        if(self.fichaContenedor.datos[self.nombre] == {})
            self.obtenerDatosListadoME();
        else
        {
            self._lista.setDatos( self.fichaContenedor.datos[self.nombre] );
        }

    });
};
Coleccion.prototype.subcripcionesListado = function(){
    var self = this;

    app.eventos.escuchar("Listado"+ self.nombre , self._modelo.Nombre,  function(e,eventArgs){
        app.log.debug('Coleccion - Listado', eventArgs);

        self._listaMe.setDatos( eventArgs.datos );
    });

    app.eventos.escuchar("GetById"+ self.nombre , self._modelo.Nombre,  function(e,eventArgs){
        app.log.debug('GetById'+ self.nombre , eventArgs);

        self._lista.agregarRegistro(eventArgs.datos );
    });

};

Coleccion.prototype.obtenerModelo = function(){
    var parametros = {
        Entidad : "zz_Modelos",
        Clave   : "IdModelo",
        Valor   : this.campo.IdReferencia,
        Alias   : "GetById" + this.nombre
    };

    app.servicios.generales.GetById(JSON.stringify(parametros));
};
Coleccion.prototype.obtenerListado = function(Nombre){
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
Coleccion.prototype.obtenerDatosListadoME = function(){
    var parametros = {
        Entidad : this.nombre,
        Alias :  "Listado"+ this.nombre
    };

    app.servicios.generales.Listado(JSON.stringify(parametros));
};
Coleccion.prototype.obtenerNuevaRelacion = function(Nombre){
    var parametros = {
        Entidad :  this._modelo.Nombre,
        Clave   : this._listaMe.campoClave(),
        Valor   : this.idNuevaRelacion,
        Alias   : "GetById" + this.nombre
    };

    app.servicios.generales.GetById(JSON.stringify(parametros));
};

Coleccion.prototype.crearTabla = function(){
    this._lista = $(this.placeholder).listado(this.parametrosTabla);
    this.fichaContenedor.colecciones[this.nombre] = this._lista;
};
Coleccion.prototype.crearTab = function(){
    this.crearNavegacionTab();
    this.crearContenedorTab();
    this.crearDialogoMe();
};
Coleccion.prototype.crearNavegacionTab = function(){
    this.navegacion = $("<li><a href='#" + this.nombre  + "' >" + this.nombre  + "</a></li>");
    $('ul', this.fichaContenedor.areaColecciones).append(this.navegacion);
};
Coleccion.prototype.crearContenedorTab = function(){
    if($('#' + this.nombre).length > 0)
        this.placeholder = $('#' + this.nombre);
    else
        this.placeholder = $("<div id='" + this.nombre  + "' class='coleccion listado'></div>");

    $(this.fichaContenedor.areaColecciones).append(this.placeholder);
};
Coleccion.prototype.crearDialogoMe = function(){

    var nombreME = this.nombre  + "_ME";
    var selectorME = "#" + nombreME;
    var selectorTitleBar = "#ui-dialog-title-" + nombreME;

    if($(selectorME).length > 0)
            $(selectorME + " *").remove();
    else{
        this.dialogoMe = $("<div id='" + nombreME + "' class='ME listado'></div>");
        $(this.fichaContenedor.areaColecciones).append(this.dialogoMe);
        this.dialogoMe.dialog({
            autoOpen:false,
            modal : true,
            title : 'Seleccion de ' + this.nombre,
            width: '600px'
        });
        $(selectorTitleBar).closest('div').find('a').hide();
    }
    /*

    */
    //$(this.placeholder).append(this.dialogoMe);
};

Coleccion.prototype.crearTablaME = function(){
    this._listaMe = $(this.dialogoMe).listado(this.parametrosTablaME);
};

