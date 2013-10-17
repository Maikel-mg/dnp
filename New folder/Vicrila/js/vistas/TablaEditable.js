var DossieresPage = function(){
    this.navegacion = {};
    this.accionesTabla = {};
    this.tabla = {};
    this.accionesFiltro = {};
    this.ficha = {};

    this.tablaEditable = {};

    this.dossieresDS = {};

    this.crearDataSources();
    this.inicializarLayout();
    this.crearTablaEditable();
    this.crearToolbarFiltro();

};

DossieresPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        },
        south : {
            resizable  : false,
            closable : false,
            size: '220'
        }
    });
};
DossieresPage.prototype.eventos = function(){
    var self = this;
};

DossieresPage.prototype.crearDataSources = function(){
    this.crearDossieresDS();
};
DossieresPage.prototype.crearDossieresDS = function(){
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
                //self.tablaEditable.setDatos(respuesta.datos);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};

DossieresPage.prototype.crearTablaEditable = function(){
    var configuracion = {
        contenedor : "tablaEditablePlaceholder",
        Nombre     : "Dossieres",
        Listado    : "Dossier",
        Ficha      : "Dossier"
    };

    this.tabla = new IpkTablaEditable(configuracion, []);
};

DossieresPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        Nombre     : "Dossieres",
        Listado    : "Dossier"
    };

    this.tabla = new IpkRemoteTabla(configuracion, []);
};
DossieresPage.prototype.crearToolbarTabla = function(){
    var configuracion = {
        contenedor : "accionesTabla",
        id         : "accionesTabla"
    };

    this.accionesTabla = new IpkToolbar(configuracion);

    this.accionesTabla.agregarBoton({
        nombre : "Crear",
        descripcion : "Abre el formulario de creación de Dossier (ALT + C)",
        clases : "",
        icono : "icon-plus",
        accessKey : "c",
        texto : "Crear Dossier"
    });
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
    this.accionesTabla.agregarBoton({
        nombre : "Borrar",
        descripcion : "Borrar el dossier seleccionado (ALT + B)",
        clases : "",
        icono : "icon-trash",
        accessKey : "d",
        texto : "Eliminar"
    });
    this.accionesTabla.agregarBoton({
        nombre : "Copiar",
        descripcion : "Copia el dossier seleccionado (ALT + Y)",
        clases : "",
        icono : "icon-repeat",
        accessKey : "y",
        texto : "Copiar"
    });

    var self = this;
    this.accionesTabla.onCrear = function(){

        self.ficha.ficha.setModo(IpkFicha.Modos.Alta);
        self.ficha.ficha.limpiar();
        self.dialogoFicha.dialog('open');
    };
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
    this.accionesTabla.onBorrar = function(){
        var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();

        if(idRegistro){
            var resultado = confirm('¿Está segura de que desea borrar el registro ?');
            if(resultado )
            {
                self.dossieresDS.Delete(idRegistro);
                self.tabla.tabla.borrarFilaSeleccionada();
            }
        }
    };
    this.accionesTabla.onCopiar = function(){
        var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();

        self.ficha.ficha.limpiar();
        self.ficha.ficha.setModo(IpkFicha.Modos.Consulta);
        self.ficha.cargarRegistro(idRegistro);
        self.dialogoFicha.dialog('open');
    };

};
DossieresPage.prototype.crearToolbarFiltro = function(){
    var configuracion = {
        contenedor : "accionesFiltro",
        id         : "accionesFiltro"
    };

    this.accionesFiltro = new IpkToolbar(configuracion);

    this.accionesFiltro.agregarBoton({
        nombre : "AplicarFiltro",
        descripcion : "Filtra el listado de los dossieres (ALT + B)",
        clases : "",
        icono : "icon-search",
        accessKey : "b",
        texto : "Filtrar"
    });
    this.accionesFiltro.agregarBoton({
        nombre : "LimpiarFiltro",
        descripcion : "Limpia los resultado del listado (ALT + L)",
        clases : "",
        icono : "icon-remove-circle",
        accessKey : "l",
        texto : "Limpiar"
    });

    this.accionesFiltro.onAplicarFiltro = $.proxy(this.aplicarFiltro, this);
    this.accionesFiltro.onLimpiarFiltro = $.proxy(this.limpiarFiltro ,this);
};

DossieresPage.prototype.crearFicha = function(){
    var configuracion = {
        contenedor : "fichaPlaceholder",
        nombre     : "Dossier",
        ficha      : 'Ficha' ,
        modo       : IpkFicha.Modos.Consulta
    };

    var self = this;
    this.ficha = new IpkRemoteFicha(configuracion, []);
    this.ficha.onGuardarClick = function(){
        setTimeout( function(){self.aplicarFiltro()}, 3000 );
    };
    this.dialogoFicha = $('#' + configuracion.contenedor).dialog({
        width     : '1200',
        height    : '900',
        autoOpen  : false,
        modal     : true,
        title     : 'Ficha de dossier'
    });
};

// **** FUNCIONES DATOS *****
DossieresPage.prototype.obtenerDossieres = function(){
    this.dossieresDS.Listado();
};

DossieresPage.prototype.aplicarFiltro = function(){
    var cadena = '';
    var marca = $('#Marca');
    var cliente = $('#Cliente');
    var numDossier = $('#NumDossier');
    var tipoDossier = $('#TipoDossier');

    if(marca.val() !== "")
        cadena += " it.Marca Like '%" + marca.val() + "%'";

    if(cliente.val() !== "")
    {
        if(cadena !== "") cadena += " OR ";
        cadena += " it.NombreClteSolicitante Like '%" + cliente.val() + "%'";
    }

    if(numDossier.val() !== "")
    {
        if(cadena !== "") cadena += " OR ";
        cadena += " it.NumDossier Like '%" + numDossier.val() + "%'";
    }

    if(tipoDossier.val() !== "")
    {
        if(cadena !== "") cadena += " OR ";
        cadena += " it.TipoDossier Like '%" + tipoDossier.val() + "%'";
    }

    if(cadena !== "")
    {
        this.dossieresDS.Filtrar(cadena);
    }
};
DossieresPage.prototype.limpiarFiltro = function(){
    this.tabla.setDatos([]);
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