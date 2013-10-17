var DossieresEnCursoPage = function(){
    this.navegacion = {};
    this.accionesTabla = {};
    this.tabla = {};
    this.accionesFiltro = {};
    this.ficha = {};

    this.dossieresDS = {};

    this.crearDataSources();

    this.inicializarLayout();

    this.crearTabla();
    this.crearToolbarTabla();
    this.crearToolbarMenu();

    this.crearFicha();
};

DossieresEnCursoPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        }
    });
};

DossieresEnCursoPage.prototype.crearDataSources = function(){
    this.crearDossieresDS();
};
DossieresEnCursoPage.prototype.crearDossieresDS = function(){
    var self = this;

    this.dossieresDS= new IpkRemoteDataSource({
        entidad : "Dossier",
        clave   : "IdDossier"
    });
    this.dossieresDS.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Listado de dossieres', respuesta.datos);
                self.tabla.setDatos(respuesta.datos);
            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.dossieresDS.onFiltrar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Filtrado de dossieres', respuesta.datos);
                self.tabla.setDatos(respuesta.datos);
            }

        }
        else
            alert(respuesta.mensaje);
    };
};

DossieresEnCursoPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        Nombre     : "Dossieres",
        Listado    : "Dossier"
    };

    this.tabla = new IpkRemoteTabla(configuracion, []);
    var self = this;
    setTimeout(function(){ self.aplicarFiltro();}, 3000);

};
DossieresEnCursoPage.prototype.crearToolbarTabla = function(){
    var configuracion = {
        contenedor : "accionesTabla",
        id         : "accionesTabla"
    };

    this.accionesTabla = new IpkToolbar(configuracion);
    this.accionesTabla.agregarBoton({
        nombre : "Detalle",
        descripcion : "Ver el detalle del dossier (ALT + V)",
        clases : "",
        icono : "icon-list-alt",
        accessKey : "v",
        texto : "Ver detalle"
    });
    this.accionesTabla.agregarBoton({
        nombre : "Estructura",
        descripcion : "Ver la estructura del dossier (ALT + S)",
        clases : "",
        icono : "icon-list-alt",
        accessKey : "s",
        texto : "Estructura"
    });


    var self = this;

    this.accionesTabla.onEstructura = function(){
        var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();

        if(idRegistro)
            window.location = "Estructura.html?Ficha=Dossier&Id=" + idRegistro;

            //window.location = "../../ipkWeb/site/Cotizacion/Ficha/Estructura.html?Ficha=Dossier&Id=" + idRegistro;
    };
    this.accionesTabla.onDetalle = function(){
        var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();

        if(idRegistro){
            self.ficha.ficha.limpiar();
            self.ficha.ficha.setModo(IpkFicha.Modos.Consulta);
            self.ficha.cargarRegistro(idRegistro);
            self.dialogoFicha.dialog('open');
        }
    };


};

DossieresEnCursoPage.prototype.crearToolbarMenu = function(){
    app.configuracion.navegacion();
};

DossieresEnCursoPage.prototype.crearFicha = function(){
    var configuracion = {
        contenedor : "fichaPlaceholder",
        nombre     : "Dossier",
        ficha      : 'Ficha' ,
        modo       : IpkFicha.Modos.Consulta
    };

    var self = this;
    this.ficha = new IpkRemoteFicha(configuracion, []);
    this.ficha.onGuardarClick = function(){
        //setTimeout( function(){self.aplicarFiltro()}, 3000 );
    };
    this.ficha.onRecordUpdated = function(e){
        self.aplicarFiltro();
    };
    this.ficha.onRecordDeleted = function(e){
        self.ficha.ficha.limpiar();
        self.dialogoFicha.dialog('close');
        self.aplicarFiltro();
    };
    this.dialogoFicha = $('#' + configuracion.contenedor).dialog({
        width     : '1000',
        height    : '700',
        autoOpen  : false,
        modal     : true,
        title     : 'Ficha de dossier'
    });
       // .height("auto");

};

// **** FUNCIONES DATOS *****
DossieresEnCursoPage.prototype.obtenerDossieres = function(){
    this.aplicarFiltro();
};

DossieresEnCursoPage.prototype.aplicarFiltro = function(){
    var cadena = '';
    cadena += " it.Estado <> 'Aceptado' AND it.Estado <> 'Rechazado'";
    this.dossieresDS.Filtrar(cadena);
};
DossieresEnCursoPage.prototype.limpiarFiltro = function(){
    //this.tabla.setDatos([]);
};


var IpkFactory = function(){
    this.datasources = [];
    this.listados = [];
    this.fichas = [];
    this.ipkConfiguracion = new IpkInfraestructura();

    return this;
};
IpkFactory.prototype.getDataSource = function(nombreModelo , DS){
    this.datasources[nombreModelo] = DS;

    var self = this;
    this.ipkConfiguracion.getModeloByName(nombreModelo);
    this.ipkConfiguracion.onGetModelo = function(modelo){
        var clave = _.find(modelo.zz_CamposModelos, function(elemento){return elemento.EsClave == true}).Nombre;
        self.datasources[modelo.Nombre].CambiarEntidad(modelo.Nombre, clave);

    };
};