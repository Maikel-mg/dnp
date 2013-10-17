var Estructura = function(){
    this.dossier = {};

    // CONTROLES
    this.soluciones = {};
    this.embalajes = {};
    this.articulos = {};
    this.estructura = {};

    this.embalajesME = {};
    this.articulosME = {};


    this.crearDialogos();

    this.subscripciones();
    this.vincularEventos();

    return this;
};

Estructura.prototype.subscripciones = function(){
    var self = this;
    app.eventos.escuchar('BuscarDossierPagina', 'Dossier',  function(e,r){
        if(r.estado == 'OK')
        {
            self.dossier = r.datos[0];

            self.cargarDatosResumenDossier(self.dossier);
            self.crearFichaDossier();
            self.crearListadoSoluciones();
            self.crearListadoEmbalajes();
            self.crearListadoEmbalajesME();
            self.crearListadoArticulos();
            self.crearListadoArticulosME();
            self.crearEstructura();
            app.log.debug('Datos de la busqueda ...' , r);
        }
    });

    app.eventos.escuchar('OnRecordUpdated', 'contenedorFicha1', function(e, r){
        app.log.debug('Registro actualizado ', r);
        self.cargarDatosResumenDossier( r.datos );
        $('#contenedorFicha1 .areaColecciones').hide();
        $('#contenedorFicha1').dialog('close');
    });

    app.eventos.escuchar('onBtnSeleccionMEClick', 'FormaEmb', function(e, r){
        var DatosSolucion = {
            Entidad : "Solucion",
            Clave   : "IdSolucion",
            Valor   : self.estructura.solucionSeleccionada.idSolucion
        };
        var DatosEmbalaje= {
            Entidad : r.Entidad,
            Clave   : self.embalajesME._lista.campoClave(),
            Valor   : self.embalajesME._lista.getIdRegistroSeleccionada()
        };

        var relacion = {
            Datos1 : DatosSolucion,
            Datos2 : DatosEmbalaje
        };

        app.servicios.generales.CrearRelacion(JSON.stringify(relacion));
        $('#listaEmbalajesME').dialog('close');
    });
    app.eventos.escuchar('onBtnCancelarMEClick', 'FormaEmb', function(){
        $('#listaEmbalajesME').dialog('close');
    });
    app.eventos.escuchar("CrearRelacion", 'FormaEmb',  function(event, eventArgs){
        alert(eventArgs.mensaje);

        if(eventArgs.estado == 'OK')
        {
            var idEmbalajeSeleccionado =  self.embalajesME._lista.getIdRegistroSeleccionada();
            var embalajeSeleccionado = self.embalajesME._lista.datos.find('idFormaEmb', idEmbalajeSeleccionado);
            self.estructura.agregarEmbalaje(embalajeSeleccionado);
        }
    });
    app.eventos.escuchar("BorrarRelacion", 'FormaEmb',  function(event, eventArgs){
        self.estructura.quitarEmbalaje(self.idEmbalaje);
        self.idEmbalaje = undefined;
        alert('Se ha borrado la relacion ');
    });

    app.eventos.escuchar('onBtnSeleccionMEClick', 'FormaArt', function(e, r){
        var DatosSolucion = {
            Entidad : "Solucion",
            Clave   : "IdSolucion",
            Valor   : self.estructura.solucionSeleccionada.idSolucion
        };
        var DatosForma = {
            Entidad : r.Entidad,
            Clave   : self.articulosME._lista.campoClave(),
            Valor   : self.articulosME._lista.getIdRegistroSeleccionada()
        };

        var relacion = {
            Datos1 : DatosSolucion,
            Datos2 : DatosForma
        };

        app.servicios.generales.CrearRelacion(JSON.stringify(relacion));
        $('#listaArticulosME').dialog('close');
    });
    app.eventos.escuchar('onBtnCancelarMEClick', 'FormaArt', function(){
        $('#listaArticulosME').dialog('close');
    });
    app.eventos.escuchar("CrearRelacion", 'FormaArt',  function(event, eventArgs){
        alert(eventArgs.mensaje);

        if(eventArgs.estado == 'OK')
        {
           var idFormaSeleccionada =  self.articulosME._lista.getIdRegistroSeleccionada();
           var formaSeleccionada = self.articulosME._lista.datos.find('idFormaArt', idFormaSeleccionada);
           self.estructura.agregarForma(formaSeleccionada);
        }
    });
    app.eventos.escuchar("BorrarRelacion", 'FormaArt',  function(event, eventArgs){
        self.estructura.quitarForma(self.idForma);
        self.idForma = undefined;
        alert('Se ha borrado la relacion ');
    });
};
Estructura.prototype.vincularEventos = function(){
    var self = this;

    $('#editarDossier').on('click', function(){
        $('#contenedorFicha1 .areaColecciones').hide();
        $('#contenedorFicha1').dialog('open');
    });

    $('#verSoluciones').on('click', function(){
        self.soluciones.setDatos(self.dossier.Solucion);
        self.setPadreListado(self.soluciones);

        $('#contenedorLista').dialog('open');
    });
    $('#verEmbalajes').on('click', function(){
        self.embalajes.setDatos(self.dossier.FormaEmb);

        self.setPadreListado(self.embalajes);
        $('#contenedorLista2').dialog('open');
    });
    $('#verArticulos').on('click', function(){
        self.articulos.setDatos(self.dossier.FormaArt);
        self.setPadreListado(self.articulos);
        $('#contenedorLista3').dialog('open');
    });

    $('.estructura').delegate('.btnQuitarForma','click', function(e){
        var formaHTML = $(this).closest('li');
        var idForma = formaHTML.attr('id').replace('forma-', '');
        var solucionHTML = $(this).closest('div.areaSolucion');
        var idSolucion = solucionHTML.attr('id').replace('solucion-', '');

        self.estructura.seleccionarSolucion(idSolucion);
        self.idForma = idForma;

        var Datos1  = {
            Entidad : "Solucion",
            Clave   : "IdSolucion",
            Valor   : self.estructura.solucionSeleccionada.idSolucion
        };
        var Datos2 = {
            Entidad : "FormaArt",
            Clave   : "IdFormaArt",
            Valor   : idForma
        };

        var borrarRelacion = {
            Datos1 : Datos1,
            Datos2 : Datos2
        };

        app.log.debug('Borrar relacion ' , JSON.stringify(borrarRelacion));
        app.servicios.generales.BorrarRelacion(JSON.stringify(borrarRelacion));
    });
    $('.estructura').delegate('.btnQuitarEmbalaje','click', function(e){

        var embalajeHTML = $(this).closest('li');
        var idEmbalaje = embalajeHTML.attr('id').replace('embalaje-', '');
        var solucionHTML = $(this).closest('div.areaSolucion');
        var idSolucion = solucionHTML.attr('id').replace('solucion-', '');

        self.estructura.seleccionarSolucion(idSolucion);
        self.idEmbalaje = idEmbalaje;

        var Datos1  = {
            Entidad : "Solucion",
            Clave   : "IdSolucion",
            Valor   : self.estructura.solucionSeleccionada.idSolucion
        };
        var Datos2 = {
            Entidad : "FormaEmb",
            Clave   : "IdFormaEmb",
            Valor   : idEmbalaje
        };

        var borrarRelacion = {
            Datos1 : Datos1,
            Datos2 : Datos2
        };

        app.servicios.generales.BorrarRelacion(JSON.stringify(borrarRelacion));
    });

    $('.estructura').delegate('#btnAgregarEmbalaje','click', function(e){
        e.stopPropagation();
        e.preventDefault();

        var solucionHTML = $(this).closest('div.areaSolucion');
        var idSolucion = solucionHTML.attr('id').replace('solucion-', '');

        self.estructura.seleccionarSolucion(idSolucion);
        self.embalajesME.setDatos(self.dossier.FormaEmb);

        $('#listaEmbalajesME').dialog('open');

    });
    $('.estructura').delegate('#btnAgregarArticulo','click', function(){
        var solucionHTML = $(this).closest('div.areaSolucion');
        var idSolucion = solucionHTML.attr('id').replace('solucion-', '');

        self.estructura.seleccionarSolucion(idSolucion);
        self.articulosME.setDatos(self.dossier.FormaArt);
        $('#listaArticulosME').dialog('open');

    });
    $('.estructura').delegate('#btnAceptarSolucion','click', function(){
        var solucionHTML = $(this).closest('div.areaSolucion');
        var idSolucion = solucionHTML.attr('id').replace('solucion-', '');
        self.estructura.seleccionarSolucion(idSolucion);

        var parametros = {
          IdSolucion :  idSolucion
        };

        app.servicios.especiales.AceptarSolucion(JSON.stringify(parametros));
    });
    $('.estructura').delegate('#btnRechazarSolucion','click', function(){
        var solucionHTML = $(this).closest('div.areaSolucion');
        var idSolucion = solucionHTML.attr('id').replace('solucion-', '');
        self.estructura.seleccionarSolucion(idSolucion);

        var parametros = {
            IdSolucion :  idSolucion
        };

        app.servicios.especiales.RechazarSolucion(JSON.stringify(parametros));

    });
};

Estructura.prototype.crearFichaDossier = function(){
    var options = {
        Ficha      : 'Dossier',
        contenedor : 'contenedorFicha1',
        Id         : this.dossier.IdDossier
    };

    this.fichaDossier = new FichaController(options);

};
Estructura.prototype.crearListadoSoluciones = function(){
    var optionsListado = {
        Listado          : "Solucion",
        contenedor : 'contenedorLista'
    };

    app.log.debug('Datos del padre de la pagina', this.fichaDossier._ficha);

    this.soluciones = new ListadoController(optionsListado);
};
Estructura.prototype.crearListadoEmbalajes = function(){
    var optionsEmb = {
        Listado          : "FormaEmb",
        contenedor : 'contenedorLista2'
    };

    this.embalajes = new ListadoController(optionsEmb);
};
Estructura.prototype.crearListadoEmbalajesME = function(){
    var optionsEmb = {
        Listado     : "EmbalajesME",
        contenedor  : 'listaEmbalajesME',
        EsME        : true
    };

    this.embalajesME = new ListadoController(optionsEmb);
};

Estructura.prototype.crearListadoArticulosME = function(){
    var optionsArt = {
        Listado     : "ArticulosME",
        contenedor  : 'listaArticulosME',
        EsME        : true
    };

    this.articulosME = new ListadoController(optionsArt);
};
Estructura.prototype.crearListadoArticulos = function(){
    var optionsArt = {
        Listado          : "FormaArt",
        contenedor : 'contenedorLista3'
    };

    this.articulos = new ListadoController(optionsArt);
};
Estructura.prototype.setPadreListado = function(listado){
    var padre = {
        Entidad : this.fichaDossier._ficha.infoModelo.Nombre,
        Clave   : this.fichaDossier._ficha.campoClave(),
        Valor   : this.fichaDossier._ficha.valorClave()
    };

    listado._lista.setPadre(padre);
};

Estructura.prototype.crearDialogos = function(){
    this.crearDialogoFichaDossier ();
    this.crearDialogoSoluciones();
    this.crearDialogoEmbalajes();
    this.crearDialogoArticulos();

    this.crearDialogoEmbalajesMe();
    this.crearDialogoArticulosMe();
};
Estructura.prototype.crearDialogoFichaDossier = function(){

    $('#contenedorFicha1').dialog({
        title : 'Ficha del dossier ',
        autoOpen : false,
        modal : true,
        width : '1200px',
        maxHeight: '800'
    });
};
Estructura.prototype.crearDialogoSoluciones = function(){

    $('#contenedorLista').dialog({
        title : 'Soluciones del dossier ',
        autoOpen : false,
        width : '800px'
    });
};
Estructura.prototype.crearDialogoEmbalajes = function(){
    $('#contenedorLista2').dialog({
        title : 'Embalajes del dossier ',
        autoOpen : false,
        width : '800px'
    });
};
Estructura.prototype.crearDialogoEmbalajesMe = function(){
    $('#listaEmbalajesME').dialog({
        title : 'Seleccion de embalajes de la solucion',
        autoOpen : false,
        modal : true,
        width : '800px'
    });
};
Estructura.prototype.crearDialogoArticulosMe = function(){
    $('#listaArticulosME').dialog({
        title : 'Seleccion de articulos de la solucion',
        autoOpen : false,
        modal : true,
        width : '800px'
    });
};
Estructura.prototype.crearDialogoArticulos = function(){
    $('#contenedorLista3').dialog({
        title : 'Articulos del dossier ',
        autoOpen : false,
        width : '800px'
    });
};

Estructura.prototype.crearEstructura = function(){
    var configuracion = {
        contenedor : 'estructura',
        plantilla  : '#plantillaSolucion'
    };

    this.estructura = new arbolEstructura(configuracion);
    this.estructura.cargarDossier(this.dossier);
};

Estructura.prototype.cargarDatosResumenDossier = function(dossier){
    $('#rsNumDossier').text(dossier.NumDossier);
    $('#rsTipoDossier').text(dossier.TipoDossier);
    $('#rsFechaCreacion').text(dossier.FechaCreacion);
    $('#rsFechaCierre').text(dossier.FechaCierre);
    $('#rsEstado').text(dossier.Estado);

    $('#rsDescripcion').text(dossier.DescripcionArt);
    $('#rsObservaciones').text(dossier.Observaciones);
};

Estructura.prototype.obtenerDossier = function(id){
    var where = {};
    where["IdDossier"] = id;

    var parametros = {
        Entidad : "Dossier",
        Where   : where,
        Referencias : true,
        Colecciones : true,
        Alias       : "BuscarDossierPagina"
    };

    app.servicios.generales.Buscar(JSON.stringify(parametros));
};