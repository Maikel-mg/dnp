var TablaPage = function(){
    this.toolbar = {};
    this.tabla = {};

    this.crearDSModelos();

    this.inicializarLayout();
    this.crearToolbar();
    this.crearTabla();
};

TablaPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        }
    });
};

/******** REMOTES *************/
TablaPage.prototype.crearDSModelos = function(){
    var self = this;
    this.infraestructuraStore = new IpkRemoteDataSource(
        {
            entidad : 'zz_Modelos',
            clave   : 'IdModelo'
        }
    );

    this.infraestructuraStore.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
                self.tabla.setDatos(respuesta.datos);
        }
        else
            alert(respuesta.mensaje);
    };
    this.infraestructuraStore.onGetById = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
                alert(respuesta.mensaje + ' --> (' + respuesta.datos.Nombre +')');
        }
        else
            alert(respuesta.mensaje);
    };
    this.infraestructuraStore.onInsert = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien insertando el registro");
            else
                alert(respuesta.mensaje);
        }
        else
            alert(respuesta.mensaje);
    };
    this.infraestructuraStore.onUpdate = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien actualizando el registro");
            else
                alert(respuesta.mensaje + ' \n Nuevo nombre: ' + respuesta.datos.Nombre);
        }
        else
            alert(respuesta.mensaje);
    };
    this.infraestructuraStore.onDelete = function(respuesta){
        alert(respuesta.mensaje);
    };
    this.infraestructuraStore.onCopiar = function(respuesta){
        alert(respuesta.mensaje);
    };
};

/******** CONFIGURAR TOOLBAR *************/
TablaPage.prototype.crearToolbar = function(){
    var configuracion = {
        contenedor : "menuPlaceholder",
        id         : "menu"
    };

    this.toolbar = new IpkToolbar(configuracion);
    this.crearComandosToolbar();
    this.crearAccionesToolbar();
};
TablaPage.prototype.crearComandosToolbar = function(){
    this.toolbar.agregarBoton({
        nombre : "AddNew",
        descripcion : "Crear un nuevo registro",
        clases : "",
        icono : "icon-plus",
        texto : "Nuevo"
    });

    this.toolbar.agregarBoton({
        nombre : "Edit",
        descripcion : "Editar un registro",
        clases : "",
        icono : "icon-pencil",
        texto : "Editar"
    });

    this.toolbar.agregarBoton({
        nombre : "Eliminar",
        descripcion : "Eliminar un registro",
        clases : "",
        icono : "icon-trash",
        texto : "Eliminar"
    });

    this.toolbar.agregarBoton({
        nombre : "Copiar",
        descripcion : "Copia un registro",
        clases : "",
        icono : "icon-repeat",
        texto : "Copiar"
    });
};
TablaPage.prototype.crearAccionesToolbar = function(){
    var self = this;
    this.toolbar.onAddNew = function(){
        app.log.debug('onAddNew', arguments);
        self.crearRegistro();
    };
    this.toolbar.onEdit = function(){
        app.log.debug('onEdit', arguments);
        self.actualizarRegistro();
    };
    this.toolbar.onEliminar = function(){
        var respuesta = confirm('¿ Confirma la eliminación del registro ?');
        if(respuesta)
        {
            app.log.debug('onEliminar', arguments);
            self.eliminarRegistro();
        }
    };
    this.toolbar.onCopiar = function(){
        app.log.debug('onCopiar', arguments);
        self.copiarRegistro();
    };
};

/******** FUNCIONES TOOLBAR *************/
TablaPage.prototype.crearRegistro = function(){
    var nombre = prompt('Nombre del nuevo remote', '');
    if(nombre !== undefined && nombre !== '')
        this.remoteStore.Insert({ Nombre : nombre });
};
TablaPage.prototype.actualizarRegistro = function(){
    var id = prompt('Id del registro a actualizar', '');
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del remote', '');
        if(nombre !== undefined && nombre !== '')
            this.remoteStore.Update({IdRemote: parseInt(id),  Nombre : nombre });
    }
};
TablaPage.prototype.eliminarRegistro = function(){
    var id = prompt('Id del registro a eliminar', '');
    if(id !== undefined && id !== '')
    {
        this.remoteStore.Delete(parseInt(id));
    }
};
TablaPage.prototype.copiarRegistro = function(){
    var id = prompt('Id del registro a copiar', '');
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del remote', '');
        if(nombre !== undefined && nombre !== '')
           this.remoteStore.Copiar( parseInt(id) , { Nombre : nombre });
    }
};

/******** CONFIGURAR TABLA *************/
TablaPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        id         : "tablaRemotes"
    };

    this.tabla = new IpkTabla(configuracion);
    this.configurarColumnasTabla();
    this.configurarEventosTabla();
    this.obtenerModelos();
};
TablaPage.prototype.configurarColumnasTabla = function(){
    var columnas = [
        {
            Nombre: 'IdModelo',
            Titulo: 'IdModelo',
            Tipo :  'Int32',
            Ancho : '50',
            EsClave: true,
            BusquedaInterna: false
        },
        {
            Nombre: 'Nombre',
            Titulo: 'Nombre',
            Tipo :  'String',
            Ancho : '200',
            EsClave: false,
            BusquedaInterna: true
        }
    ];

    this.tabla.setColumnas(columnas);
};
TablaPage.prototype.configurarEventosTabla = function(){
    this.tabla.onRowClicked = function(){
        app.log.debug('Contexto del row clicked' , this);
        app.log.debug('Fila Seleccionada' , this.getIdRegistroSeleccionada());

    };
};

/******** FUNCIONES TABLA *************/


/******** FUNCIONES MODELOS *************/
TablaPage.prototype.obtenerModelos = function(){
    this.infraestructuraStore.Listado();
};


