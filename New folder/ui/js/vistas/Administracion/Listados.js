var ListadosPage = function(){
    this.navegacion = {};
    this.lista = {};
    this.tabla = {};
    this.accionesTabla = {};

    this.crearDSModelos();
    this.crearDSCamposModelo();
    this.crearDSListados();
    this.crearDSCamposListado();

    this.inicializarLayout();

    this.crearNavegacion();
    this.crearAccionesTabla();
    this.crearLista();
    this.crearTabla();
    this.crearDialogoAltaListado();
    this.crearDialogoAltaCampoListado();

};

ListadosPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        },
        west: {
            resizable  : false,
            closable : false
        }
    });

    this.TituloCentro = $('#tituloCentro');
    this.DesrcipcionCentro = $('#tituloDescripcion');

    this.NombreListado = $('#nombre');
    this.ClaveListado = $('#clave');
    this.DescripcionListado = $('#descripcion');
    this.EsMeListado = $('#esME');

    /* DIALOGO ALTA LISTADO */
    this.NombreAlta = $('#nombreAlta');
    this.ClaveAlta = $('#claveAlta');
    this.ModeloAlta = $('#modeloAlta');
    this.ComboModelosPlantilla = $('#comboModeloTemplate');

    /* DIALOGO ALTA CAMPO */
    this.TituloCampo =  $('#textoColumna');
    this.ModeloCampo =  $('#camposModelo');
    this.EsCampoBusqueda =  $('#busquedaInterna');
    this.EsClave=  $('#esClave');
    this.EsDescripcion =  $('#esDescripcion');
    this.ComboCamposPlantilla = $('#campoModeloTemplate');
};

//******** REMOTES *************
ListadosPage.prototype.crearDSModelos = function(){
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
                self.cargarComboModelos(respuesta.datos);
        }
        else
            alert(respuesta.mensaje);
    };
};
ListadosPage.prototype.crearDSCamposModelo = function(){
    var self = this;
    this.camposModelosStore = new IpkRemoteDataSource(
        {
            entidad : 'zz_CamposModelos',
            clave   : 'IdCampModelo'
        }
    );

    this.camposModelosStore.onFiltrar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.camposListadoSeleccionado = respuesta.datos;
                self.cargarComboCamposModelos(respuesta.datos);
            }
        }
        else
            alert(respuesta.mensaje);
    };


};
ListadosPage.prototype.crearDSListados = function(){
    var self = this;
    this.listadosStore = new IpkRemoteDataSource(
        {
            entidad : 'zz_Listados',
            clave   : 'IdListado'
        }
    );

    this.listadosStore.onListado = function(respuesta){
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
    this.listadosStore.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {

                self.DesrcipcionCentro.text( "(Basado en la entidad " + respuesta.datos[0].zz_Modelos.Nombre.toUpperCase() + ")" );
                self.camposModelosStore.Filtrar('it.zz_Modelos.IdModelo = ' + respuesta.datos[0].zz_Modelos.IdModelo)
            }


        }
        else
            alert(respuesta.mensaje);
    };
    this.listadosStore.onInsert = function(respuesta){
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
    this.listadosStore.onInsertHijo = function(respuesta){
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
    this.listadosStore.onUpdate = function(respuesta){
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
    this.listadosStore.onDelete = function(respuesta){
        alert(respuesta.mensaje);

        self.lista.borrarFilaSeleccionada();
    };
};
ListadosPage.prototype.crearDSCamposListado = function(){
    var self = this;
    this.camposListadoStore = new IpkRemoteDataSource(
        {
            entidad : 'zz_CamposListados',
            clave   : 'IdCampoListado'
        }
    );

    this.camposListadoStore.onFiltrar = function(respuesta){
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
    this.camposListadoStore.onInsertHijo = function(respuesta){
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
    this.camposListadoStore.onDelete = function(respuesta){
        alert(respuesta.mensaje);
        self.tabla.borrarFilaSeleccionada();
    };
    this.camposListadoStore.onCopiar = function(respuesta){
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

//******** CONFIGURAR NAVEGACION ************
ListadosPage.prototype.crearNavegacion = function(){
    var configuracion = {
        contenedor : "navegacionPlaceholder",
        id         : "navegacion"
    };

    this.toolbar = new IpkToolbar(configuracion);
    this.crearBotonesNavegacion();
    this.crearEventosNavegacion();
};
ListadosPage.prototype.crearBotonesNavegacion = function(){
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
ListadosPage.prototype.crearEventosNavegacion = function(){
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

//******** CONFIGURAR ACCIONES TABLA *************
ListadosPage.prototype.crearAccionesTabla = function(){
    var configuracion = {
        contenedor : "accionesTablaPlaceholder",
        id         : "accionesTabla"
    };

    this.accionesTabla = new IpkToolbar(configuracion);
    this.crearComandosAccionesTabla();
    this.crearEventosAccionesTabla();
};
ListadosPage.prototype.crearComandosAccionesTabla= function(){
    this.accionesTabla.agregarBoton({
        nombre : "AddCampo",
        descripcion : "Agregar un nuevo campo al listado",
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
};
ListadosPage.prototype.crearEventosAccionesTabla = function(){
    var self = this;

    this.accionesTabla.onAddCampo = function(){
        self.dlgAltaCampoListado.dialog('open');
    };
    this.accionesTabla.onBorrarCampo = function(){
        self.eliminarCampo();
    };
};

//******** CONFIGURAR LISTA *************
ListadosPage.prototype.crearLista = function(){
    var configuracion = {
        contenedor  : "listadosPlaceholder",
        id          : "listaListados",
        titulo      : "Listados",
        campoId     : "IdListado",
        campo       : "Nombre",
        allowNew    : true,
        allowDelete : true,
        allowEdit   : false
    };

    this.lista = new IpkLista(configuracion);
    this.configurarEventosLista();

    this.obtenerListados();
    this.obtenerModelos();
};
ListadosPage.prototype.configurarEventosLista = function(){
    var self = this;

    this.lista.onDataChange = function(){
        //self.rellenarReferencias();
    };
    this.lista.onSeleccion = function(){
        var seleccion = this.datos.find( this.propiedades.campoId , this.getIdRegistroSeleccionada());
        self.obtenerCamposListado(this.getIdRegistroSeleccionada());
        self.obtenerListadoPorId(this.getIdRegistroSeleccionada());
        self.cargarListadoEnCampos(seleccion);
    };
    this.lista.onNuevoClick = function(){
        self.dlgAltaListado.dialog('open');
    };
    this.lista.onBorrarClick = function(eventArgs){
        app.log.debug('Borrar click', eventArgs);
        self.eliminarListado(eventArgs.datos[this.propiedades.campoId]);
    };
};
ListadosPage.prototype.cargarListadoEnCampos = function(seleccion){
    app.log.debug('cargarListadoEnCampos ', seleccion);

    // COLOCAMOS LOS CAMPOS EN LOS INPUTS
    this.TituloCentro.text( seleccion.Nombre.toUpperCase() );
    //this.DesrcipcionCentro.text( "(Basado en la entidad " + seleccion.zz_Modelos.Nombre.toUpperCase() + ")" );

    this.NombreListado.val( seleccion.Nombre);
    this.ClaveListado.val( seleccion.Clave );
    this.DescripcionListado.val( seleccion.Descripcion );
    this.EsMeListado.attr('checked',  seleccion.EsME);
};
ListadosPage.prototype.cargarComboModelos = function(modelos){
    $('option' , this.ModeloAlta).remove();
    this.ComboModelosPlantilla.tmpl(modelos).appendTo(this.ModeloAlta);
};
ListadosPage.prototype.cargarComboCamposModelos = function(camposModelo){
    $('option' , this.ModeloCampo).remove();
    this.ComboCamposPlantilla.tmpl(camposModelo).appendTo(this.ModeloCampo);
};

//******** CONFIGURAR TABLA *************
ListadosPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        id         : "camposListado"
    };

    this.tabla = new IpkTabla(configuracion);
    this.configurarColumnasTabla();
    this.configurarEventosTabla();
};
ListadosPage.prototype.configurarColumnasTabla = function(){
    var columnas = [
        {
            Nombre: 'IdCampoListado',
            Titulo: 'IdCampoListado',
            Tipo :  'Int32',
            Ancho : '50',
            EsClave: true,
            BusquedaInterna: false
        },
        {
            Nombre: 'Nombre',
            Titulo: 'Nombre',
            Tipo :  'String',
            Ancho : '35',
            EsClave: false,
            BusquedaInterna: true
        },
        {
            Nombre: 'Titulo',
            Titulo: 'Titulo',
            Tipo :  'String',
            Ancho : '35',
            EsClave: false,
            BusquedaInterna: true
        },
        {
            Nombre: 'Tipo',
            Titulo: 'Tipo',
            Tipo :  'String',
            Ancho : '20',
            EsClave: false,
            BusquedaInterna: true
        },
        {
            Nombre: 'BusquedaInterna',
            Titulo: 'Busqueda Interna',
            Tipo :  'Boolean',
            Ancho : '10',
            EsClave: false,
            BusquedaInterna: false
        }
    ];

    this.tabla.setColumnas(columnas);
};
ListadosPage.prototype.configurarEventosTabla = function(){};

//******** CONFIGURAR DIALOGO ALTA LISTADO *************
ListadosPage.prototype.crearDialogoAltaListado = function(){
    var self = this;
    this.dlgAltaListado = $('#dlgAltaListado').dialog({
        title : 'Nuevo listado',
        modal : true,
        autoOpen: false,
        width    : '350px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){
                    self.crearListado();
                    $('input,select', this).each(function(){ $(this).val("") });
                    $(this).dialog('close');
                }
            },
            {
                'text' :'Cancelar' ,
                'click': function(){
                    app.log.debug('Contexto de cerra dialogo', this);
                    $('input,select', this).each(function(){ $(this).val("") });
                    $(this).dialog('close');
                }
            }
        ]
    });
};

//******** CONFIGURAR DIALOGO ALTA LISTADO *************
ListadosPage.prototype.crearDialogoAltaCampoListado = function(){
    var self = this;
    this.dlgAltaCampoListado = $('#dlgAltaCampoListado').dialog({
        title : 'Nuevo campo listado',
        modal : true,
        autoOpen: false,
        width    : '350px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){
                    self.crearCampo();
                    $('input,select', this).each(function(){ $(this).val("") });
                    $(this).dialog('close');
                }
            },
            {
                'text' :'Cancelar' ,
                'click': function(){
                    app.log.debug('Contexto de cerra dialogo', this);
                    $('input,select', this).each(function(){ $(this).val("") });
                    $(this).dialog('close');
                }
            }
        ]
    });
};

//******** FUNCIONES DATOS -> MODELOS *************
ListadosPage.prototype.obtenerModelos = function(){
    this.modelosStore.Listado();
};

//******** FUNCIONES DATOS -> LISTADOS *************
ListadosPage.prototype.obtenerListados = function(){
    this.listadosStore.Listado();
};
ListadosPage.prototype.crearListado = function(){
    var nombre = this.NombreAlta.val();
    var clave = this.NombreAlta.val();
    var modelo = parseInt(this.ModeloAlta.val());

    if(nombre != "" && nombre != undefined && clave != "" && clave != undefined  )
    {
        var datosPadre = {
            Entidad     : "zz_Modelos",
            Clave       : "IdModelo",
            Valor       : modelo
        };

        var nuevoListado = {
            Nombre : nombre,
            Clave  : clave
        };

        this.listadosStore.InsertHijo ( nuevoListado,  datosPadre);
    }
};
ListadosPage.prototype.actualizarListado = function(){
    var id = this.lista.getIdRegistroSeleccionada();
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del modelo', '');
        if(nombre !== undefined && nombre !== '')
            this.modelosStore.Update(parseInt(id) , { Nombre : nombre });
    }
};
ListadosPage.prototype.eliminarListado = function(id){
    if(id !== undefined && id !== '')
    {
        this.listadosStore.Delete(parseInt(id));
    }
};
ListadosPage.prototype.obtenerListadoPorId = function(idListado){
    this.listadosStore.Buscar({'IdListado' : idListado} , true, true);
};

//******** FUNCIONES CAMPOS LISTADO *************
ListadosPage.prototype.obtenerCamposListado = function(idListado){
    this.camposListadoStore.Filtrar("it.zz_Listados.idListado = " + idListado);
};
ListadosPage.prototype.crearCampo = function(){
    var self = this;
    var texto = this.TituloCampo.val();
    var idCampo =  this.ModeloCampo.val();
    var busqueda = (this.EsCampoBusqueda.attr('checked'))? true: false;
    var clave = (this.EsClave.attr('checked'))? true: false;
    var esDescripcion = (this.EsDescripcion.attr('checked'))? true: false;

    var datosCampos = _.find(self.camposListadoSeleccionado, function(elemento){ return elemento.IdCampoModelo == parseInt(idCampo) });

    if(texto != "" && texto != undefined)
    {
        var nuevoCampo = {

            Nombre : datosCampos.Nombre,
            Titulo : texto,
            Tipo   : datosCampos.Tipo,
            BusquedaInterna : busqueda,
            EsClave : clave,
            EsDescripcion : esDescripcion
        };

        var datosPadre = {
            Entidad     : "zz_Listados",
            Clave       : self.lista.propiedades.campoId,
            Valor       : self.lista.getIdRegistroSeleccionada()
        };

        app.log.debug('Insercion de un nuevo campo en el listado en edicion ' , [nuevoCampo, datosPadre]);

        this.camposListadoStore.InsertHijo(nuevoCampo, datosPadre);
    }
};
ListadosPage.prototype.eliminarCampo = function(){
    var respuesta = confirm ("Desea eliminar el campo del listado ");

    if(respuesta)
    {
        this.camposListadoStore.Delete(this.tabla.getIdRegistroSeleccionada());
    }
};
ListadosPage.prototype.copiarCampo = function(){
    this.camposModelosStore.Copiar(this.tabla.getIdRegistroSeleccionada(), {});
};
