var Estructura = function(){
    // DATOS
    this.dossier = {};

    // DATASOURCES
    this.ipkFactory = new IpkFactory();
    this.dossieresDS = new IpkRemoteDataSource({});
    this.solucionesDS = new IpkRemoteDataSource({});
    //this.solucionesDS = new IpkRemoteDataSource({});
    //this.formaArtDS = new IpkRemoteDataSource({});
    //this.formaEmbDS = new IpkRemoteDataSource({});

    // CONTROLES
    this.toolbarMenu = {};
    this.fichaDossier = {};

    this.soluciones = {};
    this.embalajes = {};
    this.articulos = {};
    this.estructura = {};

    this.embalajesME = {};
    this.articulosME = {};

    var self = this;
    this.intervalID = setInterval( function() { self.comprobarCargaDS(); }, 2000);

    this.crearDataSources();
    this.crearToolbarMenu();

    this.crearTablaSoluciones();
    this.crearTablaEmbalajes();
    this.crearTablaArticulos();

    this.crearMostrarElegirEmbalajes();
    this.crearMostrarElegirArticulos();

    this.crearDialogos();

    this.vincularEventos();

    /*

    this.crearDialogos();
    this.subscripciones();
    this.vincularEventos();

    */

    this.crearFichaDossieres();

    return this;
};

Estructura.prototype.comprobarCargaDS = function(){
    if(this.dossieresDS.propiedades.clave)
    {
        this.buscarDossier(parseInt($.QueryString["Id"]));
        clearInterval(this.intervalID);
    }
    else
        app.log.debug('CONTEXTO INTERVAL' , this.dossieresDS.propiedades);
};

Estructura.prototype.crearToolbarMenu = function(){
    var configuracion = {
        contenedor : "toolbarMenu",
        id         : "toolbarMenu"
    };

    this.toolbarMenu = new IpkToolbar(configuracion);

    this.toolbarMenu.agregarBoton({
        nombre : "IrABusquedaDossieres",
        descripcion : "Navega a la busqueda de dossieres",
        clases : "",
        icono : "icon-inbox",
        accessKey : "1",
        texto : "Busqueda Dossieres"
    });

    this.toolbarMenu.onIrABusquedaDossieres = function(){
        document.location = 'Dossieres.html';
    }

};

Estructura.prototype.crearDataSources = function(){
    this.ipkFactory.getDataSource('Dossier', this.dossieresDS);
    this.ipkFactory.getDataSource('Solucion', this.solucionesDS);
    this.eventosDossieresDS();
    this.eventosSolucionDS();
    //this.ipkFactory.getDataSource('Solucion', this.solucionesDS);
    //this.ipkFactory.getDataSource('FormaArt', this.formaArtDS);
    //this.ipkFactory.getDataSource('FormaEmb', this.formaEmbDS);
};

Estructura.prototype.crearFichaDossieres = function(){
    this.crearDialogoFichaDossier();
    var configuracion = {
        contenedor : "contenedorFicha1",
        nombre     : "Dossier",
        ficha      : 'Ficha' ,
        modo       : IpkFicha.Modos.Consulta
    };

    this.fichaDossier = new IpkRemoteFicha( configuracion, [] );
    this.fichaDossier.onGuardarClick = function(){

    };

    //this.ipkFactory.getFicha('Dossier', this.fichaDossier, configuracion);
};
Estructura.prototype.eventosDossieresDS = function(){
    var self = this;

    this.dossieresDS.onBuscar = function(eventArgs){
        if(eventArgs.estado == 'OK')
        {
            app.log.debug('BUSQUEDA DEL DOSSIER DESDE EL EVENTO', eventArgs.datos[0]);
            self.dossier = eventArgs.datos[0];
            self.cargarDatosResumenDossier(self.dossier);
            self.fichaDossier.ficha.setDatos(self.dossier);
            self.soluciones.tabla.setDatos(self.dossier.Solucion);
            self.embalajes.tabla.setDatos(self.dossier.FormaEmb);
            self.articulos.tabla.setDatos(self.dossier.FormaArt);

            self.embalajesME.setDatos(self.dossier.FormaEmb);
            self.articulosME.setDatos(self.dossier.FormaArt);

            self.crearEstructura();
        }
    };
};
Estructura.prototype.eventosSolucionDS = function(){
    var self = this;

    this.solucionesDS.onCrearRelacion = function(eventArgs){
        if(eventArgs.estado == 'OK')
        {
            if(self.idEmbalaje){
                var embalajeSeleccionado = self.embalajesME.tabla.tabla.datos.find('idFormaEmb', self.idEmbalaje);
                self.estructura.agregarEmbalaje(embalajeSeleccionado);
                self.idEmbalaje = undefined
            }
            else{
                var articuloSeleccionado = self.articulosME.tabla.tabla.datos.find('idFormaArt', self.idForma);
                self.estructura.agregarForma(articuloSeleccionado);
                self.idForma= undefined;
            }
            app.log.debug('CREAR RELACION LA SOLUCION', eventArgs.datos);
        }
    };

    this.solucionesDS.onBorrarRelacion = function(eventArgs){
        if(eventArgs.estado == 'OK')
        {
            if(self.idEmbalaje)
            {
                self.estructura.quitarEmbalaje(self.idEmbalaje);
                self.idEmbalaje = undefined;
            }
            else{
                self.estructura.quitarForma(self.idForma);
                self.idForma = undefined;
            }
            alert('Se ha borrado la relacion ');

            app.log.debug('BORRAR  RELACION LA SOLUCION', eventArgs.datos);
        }
    };
};

Estructura.prototype.crearTablaSoluciones = function(){
    var optionsEmb = {
        Listado     : "Solucion",
        contenedor  : 'contenedorTablaSoluciones'
    };

    this.soluciones = new IpkRemoteTabla(optionsEmb,[]);
};
Estructura.prototype.crearTablaEmbalajes = function(){
    var optionsEmb = {
        Listado     : "FormaEmb",
        contenedor  : 'contenedorTablaEmbalajes',
        EsME        : false
    };

    this.embalajes = new IpkRemoteTabla(optionsEmb,[]);
};
Estructura.prototype.crearTablaArticulos = function(){
    var optionsEmb = {
        Listado     : "FormaArt",
        contenedor  : 'contenedorTablaArticulos',
        EsME        : false
    };

    this.articulos = new IpkRemoteTabla(optionsEmb,[]);
};

Estructura.prototype.crearMostrarElegirEmbalajes = function(){
    var optionsEmb = {
        Nombre      : "EmbalajesME",
        Listado     : "EmbalajesME",
        contenedor  : 'listaEmbalajesME'
    };

    var self = this;
    this.embalajesME = new IpkMostrarElegir(optionsEmb);
    this.embalajesME.onSeleccionClick = function(eventArgs){
        var DatosSolucion = {
            Entidad : "Solucion",
            Clave   : "IdSolucion",
            Valor   : self.estructura.solucionSeleccionada.idSolucion
        };
        var DatosEmbalaje= {
            Entidad : self.embalajesME.tabla.modelo.Nombre,
            Clave   : self.embalajesME.tabla.tabla.campoClave(),
            Valor   : self.embalajesME.tabla.tabla.getIdRegistroSeleccionada()
        };

        self.idEmbalaje = self.embalajesME.tabla.tabla.getIdRegistroSeleccionada();
        self.idForma = undefined;

        self.solucionesDS.CrearRelacion(DatosSolucion, DatosEmbalaje);
    };
};
Estructura.prototype.crearMostrarElegirArticulos = function(){
    var optionsArt = {
        Nombre      : "ArticulosME",
        Listado     : "ArticulosME",
        contenedor  : 'listaArticulosME'
    };
    var self = this;

    this.articulosME = new IpkMostrarElegir(optionsArt);
    this.articulosME.onSeleccionClick = function(eventArgs){
        var DatosSolucion = {
            Entidad : "Solucion",
            Clave   : "IdSolucion",
            Valor   : self.estructura.solucionSeleccionada.idSolucion
        };
        var DatosArticulo= {
            Entidad : self.articulosME.tabla.modelo.Nombre,
            Clave   : self.articulosME.tabla.tabla.campoClave(),
            Valor   : self.articulosME.tabla.tabla.getIdRegistroSeleccionada()
        };

        self.idForma = self.articulosME.tabla.tabla.getIdRegistroSeleccionada();
        self.idEmbalaje = undefined;

        self.solucionesDS.CrearRelacion(DatosSolucion, DatosArticulo);
    };
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

    $('#contenedorTablaSoluciones').dialog({
        title : 'Soluciones del dossier ',
        autoOpen : false,
        width : '800px'
    });
};
Estructura.prototype.crearDialogoEmbalajes = function(){
    $('#contenedorTablaEmbalajes').dialog({
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
    $('#contenedorTablaArticulos').dialog({
        title : 'Articulos del dossier ',
        autoOpen : false,
        width : '800px'
    });
};


Estructura.prototype.buscarDossier = function(id){
    var where = {
        'IdDossier' : id
    };
    this.dossieresDS.Buscar(where, true, true);
};

Estructura.prototype.subscripciones = function(){
    var self = this;

    //TODO: Pasar a nuestro nuevo sistema de eventos
    app.eventos.escuchar('OnRecordUpdated', 'contenedorFicha1', function(e, r){
        app.log.debug('Registro actualizado ', r);

        self.cargarDatosResumenDossier( r.datos );
        $('#contenedorFicha1 .areaColecciones').hide();
        $('#contenedorFicha1').dialog('close');
    });

};
Estructura.prototype.vincularEventos = function(){
    var self = this;

    $('#editarDossier').on('click', function(){
        $('#contenedorFicha1 .areaColecciones').hide();
        $('#contenedorFicha1').dialog('open');
    });

    $('#verSoluciones').on('click', function(){
        $('#contenedorTablaSoluciones').dialog('open');
    });
    $('#verEmbalajes').on('click', function(){
        $('#contenedorTablaEmbalajes').dialog('open');
    });
    $('#verArticulos').on('click', function(){
        $('#contenedorTablaArticulos').dialog('open');
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

        self.solucionesDS.BorrarRelacion(Datos1, Datos2);
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

        self.solucionesDS.BorrarRelacion(Datos1, Datos2);
    });

    $('.estructura').delegate('#btnAgregarEmbalaje','click', function(e){
        e.stopPropagation();
        e.preventDefault();

        var solucionHTML = $(this).closest('div.areaSolucion');
        var idSolucion = solucionHTML.attr('id').replace('solucion-', '');

        self.estructura.seleccionarSolucion(idSolucion);
        self.embalajesME.abrir();
    });
    $('.estructura').delegate('#btnAgregarArticulo','click', function(){
        var solucionHTML = $(this).closest('div.areaSolucion');
        var idSolucion = solucionHTML.attr('id').replace('solucion-', '');

        self.estructura.seleccionarSolucion(idSolucion);
        self.articulosME.abrir();
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

Estructura.prototype.setPadreListado = function(listado){
    var padre = {
        Entidad : 'Dossier',
        Clave   : this.fichaDossier.ficha.campoClave(),
        Valor   : this.fichaDossier.ficha.valorClave()
    };

    listado.tabla.setPadre(padre);
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

var IpkFactory = function(){
    this.datasources = [];
    this.listados = [];
    this.fichas = [];
    this.fichasConfiguracion = [];
    this.ipkConfiguracion = new IpkInfraestructura();

    return this;
};
IpkFactory.prototype.getDataSource = function(nombreModelo , datasource){
    this.datasources[nombreModelo] = datasource;

    var self = this;
    this.ipkConfiguracion.getModeloByName(nombreModelo);
    this.ipkConfiguracion.onGetModelo = function(modelo){
        var clave = _.find(modelo.zz_CamposModelos, function(elemento){return elemento.EsClave == true}).Nombre;
        self.datasources[modelo.Nombre].CambiarEntidad(modelo.Nombre, clave);
    };
};
IpkFactory.prototype.getFicha = function(nombreFicha , ficha, configuracion){
    this.fichas[nombreFicha] = ficha;
    this.fichasConfiguracion[nombreFicha] = configuracion;

    var self = this;
    this.ipkConfiguracion.getFichaByName(nombreFicha);
    this.ipkConfiguracion.onGetFicha = function(ficha){

        var fichaNueva = new IpkRemoteFicha( self.fichasConfiguracion[ficha.Nombre], [] );

        app.log.debug('onGetFicha Nueva' , fichaNueva);
    };
};