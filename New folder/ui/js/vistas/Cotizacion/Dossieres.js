var DossieresPage = function(){
    this.navegacion = {};
    this.accionesTabla = {};
    this.tabla = {};
    this.accionesFiltro = {};

    this.listadosDS = {};
    this.dossieresDS = {};

    this.crearDataSources();

    this.inicializarLayout();

    this.crearTabla();
    this.crearToolbarTabla();
    this.crearToolbarFiltro();

    this.obtenerConfiguracionListado();
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
    this.crearListadosDS();
    this.crearDossieresDS();
};
DossieresPage.prototype.crearListadosDS = function(){
    var self = this;

    this.listadosDS = new IpkRemoteDataSource({
        entidad : "zz_Listados",
        clave   : "IdListado"
    });

    this.listadosDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Configuracion del listado', respuesta.datos);

                var camposListado = respuesta.datos[0].zz_CamposListados;
                self.tabla.setColumnas(camposListado);
                self.obtenerDossieres();
            }

        }
        else
            alert(respuesta.mensaje);
    };
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
            }

        }
        else
            alert(respuesta.mensaje);
    };
};

DossieresPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        id         : "dossieres"
    };

    this.tabla = new IpkTabla(configuracion);
};
DossieresPage.prototype.crearToolbarTabla = function(){
    var configuracion = {
        contenedor : "accionesTabla",
        id         : "accionesTabla"
    };

    this.accionesTabla = new IpkToolbar(configuracion);

    this.accionesTabla.agregarBoton({
        nombre : "Crear",
        descripcion : "Abre el formulario de creación de Dossier",
        clases : "",
        icono : "icon-plus",
        accessKey : "c",
        texto : "Crear Dossier"
    });
    this.accionesTabla.agregarBoton({
        nombre : "Detalle",
        descripcion : "Ver el detalle del dossier",
        clases : "",
        icono : "icon-list-alt",
        accessKey : "d",
        texto : "Ver detalle"
    });
    this.accionesTabla.agregarBoton({
        nombre : "Borrar",
        descripcion : "Borrar el dossier seleccionado",
        clases : "",
        icono : "icon-trash",
        accessKey : "b",
        texto : "Eliminar"
    });
    this.accionesTabla.agregarBoton({
        nombre : "Copiar",
        descripcion : "Copia el dossier seleccionado",
        clases : "",
        icono : "icon-repeat",
        accessKey : "y",
        texto : "Copiar"
    });

    this.accionesTabla.onCrear = function(){
        window.location = "../Ficha/Ficha.html?Ficha=Dossier";
    }

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

// **** FUNCIONES DATOS *****
DossieresPage.prototype.obtenerConfiguracionListado = function(){
    var where = {
        "Clave" : "'Dossier'"
    };

    this.listadosDS.Buscar(where , true, true);
};
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