var ModelosPage = function(){
    this.toolbar = {};
    this.lista = {};
    this.tabla = {};

    this.crearDSModelos();
    this.crearDSCamposModelos();

    this.inicializarLayout();

    this.crearToolbar();
    this.crearAccionesTabla();
    this.crearLista();
    this.crearTabla();

    var self = this;
    $('#btnGuardar').on('click', function(){
        self.guardarCampo();
    });
    $('#tipoCampo').on('change', function(){
        if( $(this).val() == 'Reference' || $(this).val() == 'Collection')
        {
            $('#referencia').removeClass('noDisplay');
        }
        else
        {
            $('#referencia').addClass('noDisplay');
        }
    });
};

ModelosPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        }
    });
};

/******** REMOTES *************/
ModelosPage.prototype.crearDSModelos = function(){
    var self = this;
    this.modelosStore = new IpkRemoteDataSource(
        {
            entidad : 'zz_Modelos',
            clave   : 'IdModelo'
        }
    );

    this.modelosStore.onListado = function(respuesta){
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
    this.modelosStore.onGetById = function(respuesta){
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
    this.modelosStore.onInsert = function(respuesta){
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
    this.modelosStore.onUpdate = function(respuesta){
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
    this.modelosStore.onDelete = function(respuesta){
        alert(respuesta.mensaje);
        self.lista.borrarFilaSeleccionada();
    };
    this.modelosStore.onCopiar = function(respuesta){
        alert(respuesta.mensaje);
    };
};
ModelosPage.prototype.crearDSCamposModelos = function(){
    var self = this;
    this.camposModelosStore = new IpkRemoteDataSource(
        {
            entidad : 'zz_CamposModelos',
            clave   : 'IdCampoModelo'
        }
    );

    this.camposModelosStore.onFiltrar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.tabla.setDatos(respuesta.datos);
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.camposModelosStore.onInsertHijo = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien insertando el registro hijo");
            else
            {
                alert(respuesta.mensaje);
                self.tabla.datos.add( respuesta.datos);
                self.tabla.render();
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.camposModelosStore.onUpdate = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien actualizando el registro");
            else
            {
                alert(respuesta.mensaje);
                self.tabla.render( {}, {} );
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.camposModelosStore.onDelete = function(respuesta){
        alert(respuesta.mensaje);
        self.tabla.borrarFilaSeleccionada();
    };
    this.camposModelosStore.onCopiar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien copiando el registro.");
            else
            {
                alert(respuesta.mensaje);
                self.tabla.datos.add( respuesta.datos);
                self.tabla.render();
            }
        }
        else
            alert(respuesta.mensaje);
    };
};

/******** CONFIGURAR NAVEGACION *************/
ModelosPage.prototype.crearToolbar = function(){
    var configuracion = {
        contenedor : "menuPlaceholder",
        id         : "menu"
    };

    this.toolbar = new IpkToolbar(configuracion);
    this.crearComandosToolbar();
    this.crearAccionesToolbar();
};
ModelosPage.prototype.crearComandosToolbar = function(){
    this.toolbar.agregarBoton({
        nombre : "navModelos",
        descripcion : "Administracio de los modelos de la aplicación",
        clases : "",
        icono : "icon-Book",
        texto : "Modelos"
    });
    this.toolbar.agregarBoton({
        nombre : "navListados",
        descripcion : "Administracio de los listados de la aplicación",
        clases : "",
        icono : "icon-Book",
        texto : "Listados"
    });
    this.toolbar.agregarBoton({
        nombre : "navFichas",
        descripcion : "Administración de las fichas de la aplicación",
        clases : "",
        icono : "icon-Book",
        texto : "Fichas"
    });
};
ModelosPage.prototype.crearAccionesToolbar = function(){
    var self = this;

    this.toolbar.onnavModelos = function(){
        window.location = 'Modelos.html'
    };
    this.toolbar.onnavListados = function(){
        window.location = 'Listados.html'
    };
    this.toolbar.onnavFichas = function(){
        window.location = 'Fichas.html'
    };

};

/******** CONFIGURAR ACCIONES TABLA *************/
ModelosPage.prototype.crearAccionesTabla = function(){
    var configuracion = {
        contenedor : "accionesTablaPlaceholder",
        id         : "accionesTabla"
    };

    this.accionesTabla = new IpkToolbar(configuracion);
    this.crearComandosAccionesTabla();
    this.crearEventosAccionesTabla();
};
ModelosPage.prototype.crearComandosAccionesTabla= function(){
    this.accionesTabla.agregarBoton({
        nombre : "AddCampo",
        descripcion : "Agregar un nuevo campo",
        clases : "",
        icono : "icon-plus",
        texto : "Nuevo Campo"
    });
    this.accionesTabla.agregarBoton({
        nombre : "BorrarCampo",
        descripcion : "Borra el campo seleccionado",
        clases : "",
        icono : "icon-trash",
        texto : "Borrar"
    });
    this.accionesTabla.agregarBoton({
        nombre : "CopiarCampo",
        descripcion : "Copia el campo seleccionado",
        clases : "",
        icono : "icon-repeat",
        texto : "Copiar"
    });
};
ModelosPage.prototype.crearEventosAccionesTabla = function(){
    var self = this;

    this.accionesTabla.onAddCampo = function(){
        alert('Crear un nuevo campo');
        self.crearCampo();
    };
    this.accionesTabla.onBorrarCampo = function(){
        alert('Borrar el campo seleccionado');
        self.eliminarCampo();
    };
    this.accionesTabla.onCopiarCampo = function(){
        alert('Copia el campo seleccionado');
        self.copiarCampo();
    };

};

/******** CONFIGURAR LISTA *************/
ModelosPage.prototype.crearLista = function(){
    var configuracion = {
        contenedor  : "listaPlaceholder",
        id          : "listaModelos",
        titulo      : "Modelos",
        campoId     : "IdModelo",
        campo       : "Nombre",
        allowNew    : true,
        allowDelete : false,
        allowEdit   : true
    };

    this.lista = new IpkLista(configuracion);
    this.configurarEventosLista();
    this.obtenerModelos();
};
ModelosPage.prototype.configurarEventosLista = function(){
    var self = this;

    this.lista.onDataChange = function(){
        self.rellenarReferencias();
    };
    this.lista.onSeleccion = function(){
        app.log.debug('Contexto del row clicked' , this);
        app.log.debug('Fila Seleccionada' , this.getFilaSeleccionada());
        app.log.debug('Id Fila Seleccionada' , this.getIdRegistroSeleccionada());

        self.obtenerCamposModelos(this.getIdRegistroSeleccionada());

    };
    this.lista.onNuevoClick = function(){
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

/******** CONFIGURAR TABLA *************/
ModelosPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        id         : "camposModelo"
    };

    this.tabla = new IpkTabla(configuracion);
    this.configurarColumnasTabla();
    this.configurarEventosTabla();
};
ModelosPage.prototype.configurarColumnasTabla = function(){
    var columnas = [
        {
            Nombre: 'IdCampoModelo',
            Titulo: 'IdCampoModelo',
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
        },
        {
            Nombre: 'Tipo',
            Titulo: 'Tipo',
            Tipo :  'String',
            Ancho : '200',
            EsClave: false,
            BusquedaInterna: true
        },
        {
            Nombre: 'IdReferencia',
            Titulo: 'IdReferencia',
            Tipo :  'Int32',
            Ancho : '50',
            EsClave: false,
            BusquedaInterna: false
        },
        {
            Nombre: 'EsClave',
            Titulo: 'EsClave',
            Tipo :  'Boolean',
            Ancho : '50',
            EsClave: false,
            BusquedaInterna: false
        },
        {
            Nombre: 'EsIndice',
            Titulo: 'EsIndice',
            Tipo :  'Boolean',
            Ancho : '50',
            EsClave: false,
            BusquedaInterna: false
        },
        {
            Nombre: 'EsNullable',
            Titulo: 'EsNullable',
            Tipo :  'Boolean',
            Ancho : '50',
            EsClave: false,
            BusquedaInterna: false
        }
    ];

    this.tabla.setColumnas(columnas);
};
ModelosPage.prototype.configurarEventosTabla = function(){
    this.tabla.onRowClicked = function(){
        var seleccion =  this.datos.find("IdCampoModelo", this.getIdRegistroSeleccionada());

        $('#nombreCampo').val( seleccion.Nombre );
        $('#tipoCampo').val( seleccion.Tipo );
        $('#esClave').attr('checked', seleccion.EsClave);
        $('#esIndice').attr('checked', seleccion.EsIndice);
        $('#obligatorio').attr('checked', seleccion.EsNullable);
        if(seleccion.IdReferencia !== undefined)
        {
            $('#referencia').val(seleccion.IdReferencia);
        }
    };
};

/******** FUNCIONES MODELOS *************/
ModelosPage.prototype.obtenerModelos = function(){
    this.modelosStore.Listado();
};
ModelosPage.prototype.crearRegistro = function(){
    var nombre = prompt('Nombre del nuevo modelo', '');
    if(nombre !== undefined && nombre !== '')
        this.modelosStore.Insert({ Nombre : nombre });
};

ModelosPage.prototype.actualizarRegistro = function(){
    var id = this.lista.getIdRegistroSeleccionada();
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del modelo', '');
        if(nombre !== undefined && nombre !== '')
            this.modelosStore.Update({IdModelo: parseInt(id),  Nombre : nombre });
    }
};
ModelosPage.prototype.eliminarRegistro = function(id){
    if(id !== undefined && id !== '')
    {
        this.modelosStore.Delete(parseInt(id));
    }
};
ModelosPage.prototype.copiarRegistro = function(){
    var id = prompt('Id del registro a copiar', '');
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del modelo', '');
        if(nombre !== undefined && nombre !== '')
            this.modelosStore.Copiar( parseInt(id) , { Nombre : nombre });
    }
};

/******** FUNCIONES CAMPOS MODELOS *************/
ModelosPage.prototype.obtenerCamposModelos = function(idModelo){
    this.camposModelosStore.Filtrar("it.zz_Modelos.IdModelo = " + idModelo);
};
ModelosPage.prototype.crearCampo = function(){
    var nuevoCampo = {
        "Nombre"    : '',
        "Tipo"      : "String",
        "EsClave"  : false,
        "EsIndice"  : false,
        "EsNullable"  : false
    };

    var datosPadre = {
        Entidad : "zz_Modelos",
        Clave   : "IdModelo",
        Valor   : this.lista.getIdRegistroSeleccionada()
    };

    this.camposModelosStore.InsertHijo(nuevoCampo, datosPadre);
};
ModelosPage.prototype.eliminarCampo = function(){
    this.camposModelosStore.Delete(this.tabla.getIdRegistroSeleccionada());
};
ModelosPage.prototype.copiarCampo = function(){
    this.camposModelosStore.Copiar(this.tabla.getIdRegistroSeleccionada(), {});
};
ModelosPage.prototype.guardarCampo = function(){

    var seleccion =  this.tabla.datos.find("IdCampoModelo", this.tabla.getIdRegistroSeleccionada());
    seleccion.Nombre = $('#nombreCampo').val();
    seleccion.Tipo = $('#tipoCampo').val();
    seleccion.EsClave = ($('#esClave').attr('checked') == 'checked');
    seleccion.EsIndice = ($('#esIndice').attr('checked') == 'checked');
    seleccion.EsNullable = ($('#obligatorio').attr('checked') == 'checked');

    if(seleccion.Tipo == 'Reference' || seleccion.Tipo == 'Collection' )
        seleccion.IdReferencia = $('#referencia').val();

    this.camposModelosStore.Update(seleccion);
};
ModelosPage.prototype.rellenarReferencias = function(){
    $('#referencia option').remove();
    $('#comboReferenciasTemplate').tmpl(this.lista.datos.data).appendTo('#referencia');
};

