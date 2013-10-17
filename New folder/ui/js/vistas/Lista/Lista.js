var ListaPage = function(){
    this.toolbar = {};
    this.lista = {};

    this.crearDSModelos();

    this.inicializarLayout();
    this.crearToolbar();
    this.crearLista();
};

ListaPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        }
    });
};

/******** REMOTES *************/
ListaPage.prototype.crearDSModelos = function(){
    var self = this;
    this.infraestructuraStore = new IpkRemoteDataSource(
        {
            entidad : 'remote',
            clave   : 'IdRemote'
        }
    );

    this.infraestructuraStore.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
                self.lista.setDatos(respuesta.datos);
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
            {
                alert(respuesta.mensaje);
                self.lista.agregarRegistro(respuesta.datos);
            }
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
            {
                alert(respuesta.mensaje);
                self.lista.seleccion = respuesta.datos;
                self.lista.refrescar();

            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.infraestructuraStore.onDelete = function(respuesta){
        alert(respuesta.mensaje);
        self.lista.borrarFilaSeleccionada();
    };
    this.infraestructuraStore.onCopiar = function(respuesta){
        alert(respuesta.mensaje);
    };
};

/******** CONFIGURAR TOOLBAR *************/
ListaPage.prototype.crearToolbar = function(){
    var configuracion = {
        contenedor : "menuPlaceholder",
        id         : "menu"
    };

    this.toolbar = new IpkToolbar(configuracion);
    this.crearComandosToolbar();
    this.crearAccionesToolbar();
};
ListaPage.prototype.crearComandosToolbar = function(){
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
ListaPage.prototype.crearAccionesToolbar = function(){
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
ListaPage.prototype.crearRegistro = function(){
    var nombre = prompt('Nombre del nuevo remote', '');
    if(nombre !== undefined && nombre !== '')
        this.infraestructuraStore.Insert({ Nombre : nombre });
};
ListaPage.prototype.actualizarRegistro = function(){
    var id = this.lista.getIdRegistroSeleccionada();
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del remote', '');
        if(nombre !== undefined && nombre !== '')
            this.infraestructuraStore.Update({IdRemote: parseInt(id),  Nombre : nombre });
    }
};
ListaPage.prototype.eliminarRegistro = function(id){
    if(id !== undefined && id !== '')
    {
        this.infraestructuraStore.Delete(parseInt(id));
    }
};
ListaPage.prototype.copiarRegistro = function(){
    var id = prompt('Id del registro a copiar', '');
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del remote', '');
        if(nombre !== undefined && nombre !== '')
           this.infraestructuraStore.Copiar( parseInt(id) , { Nombre : nombre });
    }
};

/******** CONFIGURAR TABLA *************/
ListaPage.prototype.crearLista = function(){
    var configuracion = {
        contenedor  : "listaPlaceholder",
        id          : "listaModelos",
        titulo      : "Remotes ss",
        campoId     : "IdRemote",
        campo       : "Nombre",
        allowNew    : true,
        allowDelete : true,
        allowEdit   : true
    };

    this.lista = new IpkLista(configuracion);
    this.configurarEventosTabla();
    this.obtenerModelos();
};

ListaPage.prototype.configurarEventosTabla = function(){
    var self = this;
    this.lista.onSeleccion = function(){
        app.log.debug('Contexto del row clicked' , this);
        app.log.debug('Fila Seleccionada' , this.getFilaSeleccionada());
        app.log.debug('Id Fila Seleccionada' , this.getIdRegistroSeleccionada());

    };
    this.lista.onNuevoClick = function(eventArgs){
        self.crearRegistro();
    };
    this.lista.onEdicionClick = function(eventArgs){
        app.log.debug('Edicion click', arguments);
        self.actualizarRegistro();
    };
    this.lista.onBorrarClick = function(eventArgs){
        app.log.debug('Borrar click', eventArgs);
        self.eliminarRegistro(eventArgs.datos[this.propiedades.campoId]);
    };
};

/******** FUNCIONES TABLA *************/


/******** FUNCIONES MODELOS *************/
ListaPage.prototype.obtenerModelos = function(){
    this.infraestructuraStore.Listado();
};


