var SimplePage = function(){
    this.toolbar = {};

    this.inicializarLayout();
    this.crearToolbar();

    this.crearDSRemote();
};

SimplePage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        }
    });
};
SimplePage.prototype.crearToolbar = function(){
    var configuracion = {
        contenedor : "menuPlaceholder",
        id         : "menu"
    };

    this.toolbar = new IpkToolbar(configuracion);
    this.crearComandosToolbar();
    this.crearAccionesToolbar();
};

SimplePage.prototype.crearDSRemote = function(){
    this.remoteStore = new IpkRemoteDataSource(
        {
            entidad : 'remote',
            clave   : 'IdRemote'
        }
    );

    this.remoteHijosStore = new IpkRemoteDataSource(
        {
            entidad : 'HijosRemote',
            clave   : 'IdHijoRemote'
        }
    );

    this.remoteResidenciasStore = new IpkRemoteDataSource(
        {
            entidad : 'ResidenciasRemote',
            clave   : 'IdResidenciaRemote'
        }
    );

    this.remoteStore.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
                alert(respuesta.mensaje + ' --> (' + respuesta.datos.length +')');
        }
        else
            alert(respuesta.mensaje);
    };
    this.remoteStore.onGetById = function(respuesta){
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
    this.remoteStore.onInsert = function(respuesta){
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
    this.remoteStore.onUpdate = function(respuesta){
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
    this.remoteStore.onDelete = function(respuesta){
        alert(respuesta.mensaje);
    };
    this.remoteStore.onCopiar = function(respuesta){
        alert(respuesta.mensaje);
    };
};

SimplePage.prototype.crearComandosToolbar = function(){
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
SimplePage.prototype.crearAccionesToolbar = function(){
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

SimplePage.prototype.crearRegistro = function(){
    var nombre = prompt('Nombre del nuevo remote', '');
    if(nombre !== undefined && nombre !== '')
        this.remoteStore.Insert({ Nombre : nombre });
};
SimplePage.prototype.actualizarRegistro = function(){
    var id = prompt('Id del registro a actualizar', '');
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del remote', '');
        if(nombre !== undefined && nombre !== '')
            this.remoteStore.Update({IdRemote: parseInt(id),  Nombre : nombre });
    }
};
SimplePage.prototype.eliminarRegistro = function(){
    var id = prompt('Id del registro a eliminar', '');
    if(id !== undefined && id !== '')
    {
        this.remoteStore.Delete(parseInt(id));
    }
};
SimplePage.prototype.copiarRegistro = function(){
    var id = prompt('Id del registro a copiar', '');
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del remote', '');
        if(nombre !== undefined && nombre !== '')
           this.remoteStore.Copiar( parseInt(id) , { Nombre : nombre });
    }
};

