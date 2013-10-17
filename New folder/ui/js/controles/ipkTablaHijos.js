var IpkTablaHijos = function(ficha , configuracion ,datos){
    this.defaults = {};
    this.propiedades = $.extend(this.defaults , configuracion);

    this.modelo = {};

    this.ficha = ficha;
    this.tabla = {};
    this.toolbar = {};

    if(datos)
        this.datos = datos;

    this.crearTab();
    this.crearTabla();
};

IpkTablaHijos.prototype.crearTabla = function(){
    var contenedorTabla = this.propiedades.Nombre  + "_Tabla";
    var toolbarContainer = $('<div id="' + contenedorTabla + '"></div>');
    this.placeholder.append(toolbarContainer);

    this.propiedades.contenedor = contenedorTabla;
    this.propiedades.Listado = this.propiedades.Nombre;

    this.tabla = new IpkRemoteTabla(this.propiedades ,this.datos);
};

IpkTablaHijos.prototype.crearTab = function(){
    this.crearNavegacionTab();
    this.crearContenedorTab();
    this.crearToolbar();
};
IpkTablaHijos.prototype.crearNavegacionTab = function(){
    app.log.debug('crearNavegacionTab ', this.propiedades);
    this.navegacion = $("<li><a href='#" + this.propiedades.Nombre  + "' >" + this.propiedades.Nombre + "</a></li>");
    this.ficha.areaColecciones.find('ul').eq(0).append(this.navegacion);
    //$('ul', this.ficha.areaColecciones).append(this.navegacion);
};
IpkTablaHijos.prototype.crearContenedorTab = function(){
    if($('#' + this.nombre).length > 0)
        this.placeholder = $('#' + this.propiedades.Nombre);
    else
        this.placeholder = $("<div id='" +  this.propiedades.Nombre  + "' class='coleccion listado'></div>");

    $(this.ficha.areaColecciones).append(this.placeholder);
};

IpkTablaHijos.prototype.crearToolbar = function(){
    var idToolbar = 'toolbar' + this.propiedades.Nombre ;
    var toolbarContainer = $('<div id="' + idToolbar  + '"></div>');
    this.placeholder.append(toolbarContainer);

    this.toolbar = new IpkToolbar({
        contenedor : idToolbar ,
        id         : idToolbar
    });

    this.toolbar.agregarBoton({
        nombre : "CrearNuevo",
        descripcion : "Añade un nuevo registro",
        clases : "",
        icono : "icon-ok",
        texto : "Crear Nuevo"
    });
    this.toolbar.agregarBoton({
        nombre : "IrAFicha",
        descripcion : "Ir a la ficha del registro seleccionado",
        clases : "",
        icono : "icon-list-alt",
        texto : "Ir a ficha"
    });
    this.toolbar.agregarBoton({
        nombre : "Borrar",
        descripcion : "Borrar el registro seleccionado",
        clases : "",
        icono : "icon-trash",
        texto : "Borrar"
    });
    this.toolbar.agregarBoton({
        nombre : "Copiar",
        descripcion : "Copia el registro seleccionado",
        clases : "",
        icono : "icon-repeat",
        texto : "Copiar"
    });

    var self = this;
    this.toolbar.onCrearNuevo = function(){
        alert('Nuevo');
    };
    this.toolbar.onIrAFicha = function(){
        alert('Ir a ficha');
    };
    this.toolbar.onBorrar = function(){
        alert('Borrar');
    };
    this.toolbar.onCopiar = function(){
        alert('Copiar');
    };
};

// **** FUNCIONES DATOS *****
IpkTablaHijos.prototype.setDatos = function(datos){
    this.tabla.setDatos(datos);
};


/*
 var IpkTablaHijos = function(ficha , configuracion ,datos){
 this.defaults = {};
 this.propiedades = $.extend(this.defaults , configuracion);

 this.modelo = {};

 this.modelosDS = {};
 this.listadosDS = {};
 this.genericoDS = {};

 this.ficha = ficha;
 this.tabla = {};
 this.tablaME = {};
 this.toolbar = {};

 if(datos)
 this.datos = datos;

 this.crearGenericoDS();
 this.crearModelosDS();
 this.crearListadosDS();

 this.crearTab();
 this.crearTabla();

 this.obtenerConfiguracionModelo();
 };

 IpkTablaHijos.prototype.crearGenericoDS = function(){
 var self = this;
 this.genericoDS = new IpkRemoteDataSource({
 entidad : 'zz_Modelos',
 clave : 'IdModelo'
 });

 this.genericoDS.onListado = function(respuesta){
 if(respuesta.estado = 'OK')
 {
 if(respuesta.datos.length == 0)
 alert("No hay resultados para la consulta");
 else
 {
 alert("genericoDS.onListado");

 app.log.debug('GETMODELO', respuesta.datos);


 self.tablaME.setDatos(respuesta.datos);

 if(self.datos)
 self.tabla.setDatos(self.datos);

 }

 }
 else
 alert(respuesta.mensaje);
 };
 };
 IpkTablaHijos.prototype.crearModelosDS = function(){
 var self = this;
 this.modelosDS = new IpkRemoteDataSource({
 entidad : 'zz_Modelos',
 clave : 'IdModelo'
 });

 this.modelosDS.onGetById = function(respuesta){
 if(respuesta.estado = 'OK')
 {
 if(respuesta.datos.length == 0)
 alert("No hay resultados para la consulta");
 else
 {
 app.log.debug('GETMODELO', respuesta.datos);
 self.modelo = respuesta.datos;
 self.obtenerConfiguracionListado(respuesta.datos.Nombre);
 }

 }
 else
 alert(respuesta.mensaje);
 };
 this.modelosDS.onBuscar = function(respuesta){
 if(respuesta.estado = 'OK')
 {
 if(respuesta.datos.length == 0)
 alert("No hay resultados para la consulta");
 else
 {
 app.log.debug('GETMODELOBUSCAR', respuesta.datos);
 self.modelo = respuesta.datos[0];
 self.configurarGenericoDS();
 self.obtenerConfiguracionListado(respuesta.datos[0].Nombre);
 }
 }
 else
 alert(respuesta.mensaje);
 };
 };
 IpkTablaHijos.prototype.crearListadosDS = function(){
 var self = this;
 this.listadosDS = new IpkRemoteDataSource({
 entidad : 'zz_Listados',
 clave : 'IdListado'
 });

 this.listadosDS.onBuscar = function(respuesta){
 if(respuesta.estado = 'OK')
 {
 if(respuesta.datos.length == 0)
 alert("No hay resultados para la consulta");
 else
 {
 var camposListado = respuesta.datos[0].zz_CamposListados;
 self.tabla.setColumnas(camposListado);
 self.tablaME.setColumnas(camposListado);
 self.obtenerListado();
 }
 }
 else
 alert(respuesta.mensaje);
 };
 };
 IpkTablaHijos.prototype.configurarGenericoDS = function(){
 var clave = _.find(this.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;})
 this.genericoDS.CambiarEntidad(this.modelo.Nombre, clave.Nombre);
 };

 IpkTablaHijos.prototype.crearTabla = function(){

 var configuracion = {
 contenedor : this.propiedades.Nombre,
 id         : this.propiedades.Nombre
 };

 this.tabla = new IpkTabla(configuracion);

var configuracionME = {
    contenedor : this.propiedades.Nombre  + "_ME",
    id         : this.propiedades.Nombre
};

this.tablaME = new IpkTabla(configuracionME);
};

IpkTablaHijos.prototype.crearTab = function(){
    this.crearNavegacionTab();
    this.crearContenedorTab();
    this.crearToolbar();
    this.crearDialogoMe();
};
IpkTablaHijos.prototype.crearNavegacionTab = function(){
    app.log.debug('crearNavegacionTab ', this.propiedades);
    this.navegacion = $("<li><a href='#" + this.propiedades.Nombre  + "' >" + this.propiedades.Nombre + "</a></li>");
    this.ficha.areaColecciones.find('ul').eq(0).append(this.navegacion);
    //$('ul', this.ficha.areaColecciones).append(this.navegacion);
};
IpkTablaHijos.prototype.crearContenedorTab = function(){
    if($('#' + this.nombre).length > 0)
        this.placeholder = $('#' + this.propiedades.Nombre);
    else
        this.placeholder = $("<div id='" +  this.propiedades.Nombre  + "' class='coleccion listado'></div>");

    $(this.ficha.areaColecciones).append(this.placeholder);
};
IpkTablaHijos.prototype.crearDialogoMe = function(){

    var nombreME = this.propiedades.Nombre  + "_ME";
    var selectorME = "#" + nombreME;
    var selectorTitleBar = "#ui-dialog-title-" + nombreME;

    if($(selectorME).length > 0)
        $(selectorME + " *").remove();
    else{
        this.dialogoMe = $("<div id='" + nombreME + "' class='ME listado'></div>");
        $(this.ficha.areaColecciones).append(this.dialogoMe);
        this.dialogoMe.dialog({
            autoOpen:false,
            modal : true,
            title : 'Seleccion de ' + this.propiedades.Nombre,
            width: '600px'
        });
        $(selectorTitleBar).closest('div').find('a').hide();
    }
};

IpkTablaHijos.prototype.crearToolbar = function(){
    var idToolbar = 'toolbar' + this.propiedades.Nombre ;
    var toolbarContainer = $('<div id="' + idToolbar  + '"></div>');
    this.placeholder.append(toolbarContainer);

    this.toolbar = new IpkToolbar({
        contenedor : idToolbar ,
        id         : idToolbar
    });

    this.toolbar.agregarBoton({
        nombre : "CrearNuevo",
        descripcion : "Añade un nuevo registro",
        clases : "",
        icono : "icon-ok",
        texto : "Crear Nuevo"
    });
    this.toolbar.agregarBoton({
        nombre : "IrAFicha",
        descripcion : "Ir a la ficha del registro seleccionado",
        clases : "",
        icono : "icon-list-alt",
        texto : "Ir a ficha"
    });
    this.toolbar.agregarBoton({
        nombre : "Borrar",
        descripcion : "Borrar el registro seleccionado",
        clases : "",
        icono : "icon-trash",
        texto : "Borrar"
    });
    this.toolbar.agregarBoton({
        nombre : "Copiar",
        descripcion : "Copia el registro seleccionado",
        clases : "",
        icono : "icon-repeat",
        texto : "Copiar"
    });

    var self = this;
    this.toolbar.onCrearNuevo = function(){
        alert('Nuevo');
    };
    this.toolbar.onIrAFicha = function(){
        alert('Ir a ficha');
    };
    this.toolbar.onBorrar = function(){
        alert('Borrar');
    };
    this.toolbar.onCopiar = function(){
        alert('Copiar');
    };
};

// **** FUNCIONES DATOS *****
IpkTablaHijos.prototype.obtenerConfiguracionListado = function(nombre){
    alert(nombre + ' - Clave');

    var where = {
        "Clave" : "'" + nombre + "'"
    };

    this.listadosDS.Buscar(where , true, true);
};
IpkTablaHijos.prototype.obtenerConfiguracionModelo = function(){
    var where = {
        "IdModelo" : this.propiedades.IdReferencia
    };

    this.modelosDS.Buscar(where , true, true);
    //this.modelosDS.GetById(this.propiedades.IdReferencia);
};

IpkTablaHijos.prototype.obtenerListado = function(){
    this.genericoDS.Listado();
};
IpkTablaHijos.prototype.setDatos = function(datos){
    this.tabla.setDatos(datos);
};

 */