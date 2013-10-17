var FichasPage = function(){
    var self = this;
    this.navegacion = {};
    this.lista = {};
    this.tabla = {};

    this.editorExtension = undefined;
    this.editorEventosFicha = undefined;

    this.accionesTabla = {};
    this.crearDSModelos();
    this.crearDSCamposModelo();
    this.crearDSFichas();

    this.crearDSCamposFichas();
    this.inicializarLayout();
    this.propiedadesCampo = new EditorCampo({contenedor:'#prop'});
    this.propiedadesCampo.onGuardar = function(){
        self.actualizarCampoFicha();
    };

    this.configuradorAccesos = new ConfiguradorAccesos({contenedor: '#configuradorAccesos'});

    var dialogoAccesosCfg = {
        autoOpen:false,
        modal : true,
        width: '800',
        height: '300',
        title : 'Configurador de permisos'
    };
    this.dialogoAccesos = $('#configuradorAccesos').dialog(dialogoAccesosCfg);

    this.editorExtension = new CodeEditor();
    this.editorExtension.Crear('dlgEditorExtension');
    this.editorExtension.onGuardar = function(eventArgs){
        self.fichaSeleccionada.Extension = eventArgs.control.getValue();
        self.fichasStore.Update(_.pick(pagina.fichaSeleccionada, _.filter(_.keys(pagina.fichaSeleccionada), function(e){ return e.substr(0, 3) !== "zz_";})));
    };
    this.editorEventosFicha = new CodeEditor();
    this.editorEventosFicha.Crear('dlgEditorEventosFicha');
    this.editorEventosFicha.onGuardar = function(eventArgs){
        self.fichaSeleccionada.Eventos = eventArgs.control.getValue();
        self.fichasStore.Update(_.pick(pagina.fichaSeleccionada, _.filter(_.keys(pagina.fichaSeleccionada), function(e){ return e.substr(0, 3) !== "zz_";})));
    };

    this.dlgEditorExtension = undefined;
    this.dlgEditorEventosFicha = undefined;
    this.dlgEditorExtension =  $('#dlgEditorExtension').dialog({
        autoOpen : false,
        title : 'Editor de codigo de la ficha',
        height : '700',
        width : '1000'
    });
    this.dlgEditorEventosFicha =  $('#dlgEditorEventosFicha').dialog({
        autoOpen : false,
        title : 'Editor de eventos de la ficha',
        height : '700',
        width : '1000'
    });

    app.configuracion.navegacionAdministracion();

    this.crearAccionesTabla();
    this.crearLista();
    this.crearTabla();
    this.crearDialogoAltaFicha();
    this.crearDialogoAltaCampoFicha();

    $('#btnGuardar').on('click', function(){
        self.guardarCampo();
    });
    $('#btnGuardarCampo').on('click', function(){
        self.actualizarCampoFicha();
    });
    $('#tipoCampo').on('change', function(){
        if( $(this).val() == 'Reference' || $(this).val() == 'Collection')
        {
            $('#referencia').removeClass('noDisplay');

            if( $(this).val() == 'Reference' )
            {
                $('#propiedadesReferencia').removeClass('noDisplay');
                $('#propiedadesColeccion').addClass('noDisplay');
            }
            else
            {
                $('#propiedadesReferencia').addClass('noDisplay');
                $('#propiedadesColeccion').removeClass('noDisplay');
            }
        }
        else
        {
            $('#referencia').addClass('noDisplay');
            $('#propiedadesReferencia').addClass('noDisplay');
            $('#propiedadesColeccion').addClass('noDisplay');
            $('#propiedadesComboNavision').addClass('noDisplay');

            if( $(this).val() == 'ComboNavision')
            {
                $('#propiedadesComboNavision').removeClass('noDisplay');
            }
        }
    });
};

FichasPage.prototype.inicializarLayout = function(){
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

    //********* DIALOGO ALTA LISTADO *********
    this.NombreAlta = $('#nombreAlta');
    this.ClaveAlta = $('#claveAlta');
    this.ModeloAlta = $('#modeloAlta');
    this.ComboModelosPlantilla = $('#comboModeloTemplate');

    //********* DIALOGO ALTA CAMPO *********
    this.TituloCampo =  $('#textoColumna');
    this.ModeloCampo =  $('#camposModelo');
    this.EsCampoBusqueda =  $('#busquedaInterna');
    this.ComboCamposPlantilla = $('#campoModeloTemplate');
};

//******** REMOTES *************
FichasPage.prototype.crearDSModelos = function(){
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
FichasPage.prototype.crearDSCamposModelo = function(){
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
FichasPage.prototype.crearDSFichas = function(){
    var self = this;
    this.fichasStore = new IpkRemoteDataSource(
        {
            entidad : 'zz_Fichas',
            clave   : 'IdFicha'
        }
    );

    this.fichasStore.onListado = function(respuesta){
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
    this.fichasStore.onBuscar = function(respuesta){
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
    this.fichasStore.onInsert = function(respuesta){
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
    this.fichasStore.onInsertHijo = function(respuesta){
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
    this.fichasStore.onUpdate = function(respuesta){
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
    this.fichasStore.onDelete = function(respuesta){
        alert(respuesta.mensaje);

        self.lista.borrarFilaSeleccionada();
    };
};
FichasPage.prototype.crearDSCamposFichas = function(){
    var self = this;
    this.camposListadoStore = new IpkRemoteDataSource(
        {
            entidad : 'zz_CamposFichas',
            clave   : 'IdCampoFicha'
        }
    );

    this.ipkConfiguracion = new IpkInfraestructura();
    this.ipkConfiguracion.onGetFicha = function(ficha){
        app.log.debug('onGetFicha Ficha' , ficha);

        self.DesrcipcionCentro.text( "(Basado en la entidad " + ficha.zz_Modelos.Nombre.toUpperCase() + ")" );
        self.camposModelosStore.Filtrar('it.zz_Modelos.IdModelo = ' + ficha.zz_Modelos.IdModelo);

        ficha.zz_CamposFichas  = _.sortBy(ficha.zz_CamposFichas, function(e){ return e.Orden; });

        self.tabla.setDatos(ficha.zz_CamposFichas);
        self.ipkConfiguracion.getModeloById(ficha.zz_Modelos.IdModelo);
    };
    this.ipkConfiguracion.onGetModelo = function(modelo){

        app.log.debug('onGetModelo FICHA' , modelo);
        self.configuradorAccesos.limpiarPermisosEnTabla();

        if(modelo.zz_Accesos.length > 0)
            self.configuradorAccesos.setAccesos(modelo.zz_Accesos[0]);
        /*
            else
            self.accionesTabla.visibilidad('configurarAccesos' , false);
        */
    };

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
    this.camposListadoStore.onUpdate = function(respuesta){
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
FichasPage.prototype.crearNavegacion = function(){
    var configuracion = {
        contenedor : "navegacionPlaceholder",
        id         : "navegacion"
    };

    this.toolbar = new IpkToolbar(configuracion);
    this.crearBotonesNavegacion();
    this.crearEventosNavegacion();
};
FichasPage.prototype.crearBotonesNavegacion = function(){
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
    this.toolbar.agregarBoton({
        nombre : "navFuentesNavision",
        descripcion : "Administración de las fuentes de datos de navision",
        clases : "",
        icono : "icon-Book",
        texto : "Fuentes Navision"
    });
};
FichasPage.prototype.crearEventosNavegacion = function(){
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
    this.toolbar.onnavFuentesNavision = function(){
        window.location = 'FuentesNavision.html'
    };
};

//******** CONFIGURAR ACCIONES TABLA *************
FichasPage.prototype.crearAccionesTabla = function(){
    var configuracion = {
        contenedor : "accionesTablaPlaceholder",
        id         : "accionesTabla"
    };

    this.accionesTabla = new IpkToolbar(configuracion);
    this.crearComandosAccionesTabla();
    this.crearEventosAccionesTabla();
};
FichasPage.prototype.crearComandosAccionesTabla= function(){
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
    this.accionesTabla.agregarBoton({
        nombre : "ConfigurarAccesos",
        descripcion : "Establecer los accesos a la ficha",
        clases : "",
        icono : "icon-user",
        texto : "Accesos"
    });
    this.accionesTabla.agregarBoton({
        nombre : "Codigo",
        descripcion : "Edita el código de extensión del formulario",
        clases : "",
        icono : "icon-file",
        texto : "Codigo"
    });
    this.accionesTabla.agregarBoton({
        nombre : "Eventos",
        descripcion : "Edita los eventos del formulario",
        clases : "",
        icono : "icon-fire",
        texto : "Eventos"
    });
};
FichasPage.prototype.crearEventosAccionesTabla = function(){
    var self = this;

    this.accionesTabla.onAddCampo = function(){
        self.dlgAltaCampoListado.dialog('open');
    };
    this.accionesTabla.onBorrarCampo = function(){
        self.eliminarCampo();
    };
    this.accionesTabla.onConfigurarAccesos = function(){
        self.dialogoAccesos.dialog('open');
    };
    this.accionesTabla.onCodigo = function(){
        self.dlgEditorExtension.dialog('open');
        if(!self.fichaSeleccionada.Extension)
            self.fichaSeleccionada.Extension = '{ \n }';


        self.editorExtension.setValue(self.fichaSeleccionada.Extension);

    };
    this.accionesTabla.onEventos = function(){
        self.dlgEditorEventosFicha.dialog('open');

        if(!self.fichaSeleccionada.Eventos)
            self.fichaSeleccionada.Eventos = '{ \n }';

        self.editorEventosFicha.setValue(self.fichaSeleccionada.Eventos);
    };
};

//******** CONFIGURAR LISTA *************
FichasPage.prototype.crearLista = function(){
    var configuracion = {
        contenedor  : "listadosPlaceholder",
        id          : "listaFichas",
        titulo      : "Fichas",
        campoId     : "IdFicha",
        campo       : "Nombre",
        allowNew    : true,
        allowDelete : true,
        allowEdit   : false
    };

    this.lista = new IpkLista(configuracion);
    this.configurarEventosLista();

    this.obtenerFichas();
    this.obtenerModelos();
};
FichasPage.prototype.configurarEventosLista = function(){
    var self = this;

    this.lista.onDataChange = function(){
        self.rellenarReferencias();
    };
    this.lista.onSeleccion = function(){
        var seleccion = this.datos.find( this.propiedades.campoId , this.getIdRegistroSeleccionada());

        self.fichaSeleccionada = seleccion;

        self.ipkConfiguracion.getFichaById(this.getIdRegistroSeleccionada());
        //self.obtenerCamposFicha(this.getIdRegistroSeleccionada());
        //self.obtenerFichasPorId(this.getIdRegistroSeleccionada());

        console.log('Esta es la seleccion' , seleccion);

        self.cargarFichasEnCampos(seleccion);
    };
    this.lista.onNuevoClick = function(){
        self.dlgAltaListado.dialog('open');
    };
    this.lista.onBorrarClick = function(eventArgs){
        self.eliminarFichas(eventArgs.datos[this.propiedades.campoId]);
    };
};
FichasPage.prototype.cargarFichasEnCampos = function(seleccion){
    // COLOCAMOS LOS CAMPOS EN LOS INPUTS
    this.TituloCentro.text( seleccion.Nombre.toUpperCase() );

    this.NombreListado.val( seleccion.Nombre);
    this.ClaveListado.val( seleccion.Clave );
    this.DescripcionListado.val( seleccion.Descripcion );
};
FichasPage.prototype.cargarComboModelos = function(modelos){
    $('option' , this.ModeloAlta).remove();
    this.ComboModelosPlantilla.tmpl(modelos).appendTo(this.ModeloAlta);
};
FichasPage.prototype.cargarComboCamposModelos = function(camposModelo){
    $('option' , this.ModeloCampo).remove();
    this.ComboCamposPlantilla.tmpl(camposModelo).appendTo(this.ModeloCampo);
};

//******** CONFIGURAR TABLA *************
FichasPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : "tablaPlaceholder",
        id         : "camposFicha"
    };

    this.tabla = new IpkTabla(configuracion);
    this.configurarColumnasTabla();
    this.configurarEventosTabla();
};
FichasPage.prototype.configurarColumnasTabla = function(){
    var columnas = [
        {
            Nombre: 'IdCampoFicha',
            Titulo: 'IdCampoFicha',
            Tipo :  'Int32',
            Ancho : '50',
            Orden : 1,
            EsClave: true,
            BusquedaInterna: false
        },
        {
            Nombre: 'Nombre',
            Titulo: 'Nombre',
            Tipo :  'String',
            Ancho : '35',
            Orden : 2,
            EsClave: false,
            BusquedaInterna: true
        },
        {
            Nombre: 'Titulo',
            Titulo: 'Titulo',
            Tipo :  'String',
            Ancho : '35',
            Orden : 3,
            EsClave: false,
            BusquedaInterna: true
        },
        {
            Nombre: 'Tipo',
            Titulo: 'Tipo',
            Tipo :  'String',
            Ancho : '20',
            Orden : 4,
            EsClave: false,
            BusquedaInterna: true
        },
        {
            Nombre: 'EsNullable',
            Titulo: 'Obligatorio',
            Tipo :  'Boolean',
            Ancho : '15',
            Orden : 5,
            EsClave: false,
            BusquedaInterna: true
        },
        {
            Nombre: 'EsClave',
            Titulo: 'EsClave',
            Tipo :  'Boolean',
            Ancho : '10',
            Orden : 5,
            EsClave: false,
            BusquedaInterna: false
        },
        {
            Nombre: 'Orden',
            Titulo: 'Orden',
            Tipo :  'Int32',
            Ancho : '10',
            Orden : 6,
            EsClave: false,
            BusquedaInterna: false
        },
        {
            Nombre: 'Grupo',
            Titulo: 'Grupo',
            Tipo :  'String',
            Ancho : '35',
            Orden : 7,
            EsClave: false,
            BusquedaInterna: true
        }
    ];

    this.tabla.setColumnas(columnas);
};
FichasPage.prototype.configurarEventosTabla = function(){
    var self= this;

    this.tabla.onRowClicked = function(){
        var seleccion =  this.datos.find("IdCampoFicha", this.getIdRegistroSeleccionada());
        self.propiedadesCampo.cargarCampo(seleccion);
        self.propiedadesCampo.setControles(this.datos.data);

        /*
        $('#nombreCampo').val( seleccion.Nombre );
        $('#tituloCampo').val( seleccion.Titulo );
        $('#tipoCampo').val( seleccion.Tipo );
        $('#esClave').attr('checked', seleccion.EsClave);
        $('#esIndice').attr('checked', seleccion.EsIndice);
        $('#esNullable').attr('checked', seleccion.EsNullable);
        $('#esLectura').attr('checked', seleccion.EsLectura);
        if(seleccion.IdReferencia !== undefined && seleccion.IdReferencia != 0)
        {
            $('#referencia').val(seleccion.IdReferencia);
            $('#esPadre').attr('checked', seleccion.EsPadre);
            $('#sonHijos').attr('checked', seleccion.SonHijos);
        }
        if( seleccion.Tipo == 'ComboNavision' )
        {
            app.log.debug('Seleccion del GRID', seleccion);
            $('#fuenteNavision').val(seleccion.IdReferencia);
        }

        $('#referencia').addClass('noDisplay');
        $('#propiedadesReferencia').addClass('noDisplay');
        $('#propiedadesColeccion').addClass('noDisplay');
        $('#propiedadesComboNavision').addClass('noDisplay');

        if( seleccion.Tipo == 'Reference' )
        {
            $('#referencia').removeClass('noDisplay');
            $('#propiedadesReferencia').removeClass('noDisplay');
        }
        if( seleccion.Tipo== 'Collection' )
        {
            $('#referencia').removeClass('noDisplay');
            $('#propiedadesColeccion').removeClass('noDisplay');
        }

        if( seleccion.Tipo== 'ComboNavision' )
        {
            $('#propiedadesComboNavision').removeClass('noDisplay');
        }
        */
    };
};

//******** CONFIGURAR DIALOGO ALTA LISTADO *************
FichasPage.prototype.crearDialogoAltaFicha = function(){
    var self = this;
    this.dlgAltaListado = $('#dlgAltaListado').dialog({
        title : 'Nueva ficha',
        modal : true,
        autoOpen: false,
        width    : '350px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){
                    self.crearFicha();
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
FichasPage.prototype.crearDialogoAltaCampoFicha = function(){
    var self = this;
    this.dlgAltaCampoListado = $('#dlgAltaCampoListado').dialog({
        title : 'Nuevo campo ficha',
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
FichasPage.prototype.obtenerModelos = function(){
    this.modelosStore.Listado();
};

//******** FUNCIONES DATOS -> LISTADOS *************
FichasPage.prototype.obtenerFichas = function(){
    this.fichasStore.Listado();
};
FichasPage.prototype.crearFicha = function(){
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

        this.fichasStore.InsertHijo ( nuevoListado,  datosPadre);
    }
};
FichasPage.prototype.actualizarFicha = function(){
    var id = this.lista.getIdRegistroSeleccionada();
    if(id !== undefined && id !== '')
    {
        var nombre = prompt('Nuevo nombre del modelo', '');
        if(nombre !== undefined && nombre !== '')
            this.fichasStore.Update({IdModelo: parseInt(id),  Nombre : nombre });
    }
};
FichasPage.prototype.eliminarFichas = function(id){
    if(id !== undefined && id !== '')
    {
        this.fichasStore.Delete(parseInt(id));
    }
};
FichasPage.prototype.obtenerFichasPorId = function(idFicha){
    this.fichasStore.Buscar({'IdFicha' : idFicha} , true, true);
};

//******** FUNCIONES CAMPOS LISTADO *************
FichasPage.prototype.obtenerCamposFicha = function(idListado){
    this.camposListadoStore.Filtrar("it.zz_Fichas.idFicha = " + idListado);
};
FichasPage.prototype.crearCampo = function(){
    var self = this;
    var texto = this.TituloCampo.val();
    var idCampo =  this.ModeloCampo.val();

    var datosCampos = _.find(self.camposListadoSeleccionado, function(elemento){ return elemento.IdCampoModelo == parseInt(idCampo) });

    if(texto != "" && texto != undefined)
    {
        var nuevoCampo = {

            Nombre : datosCampos.Nombre,
            Titulo : texto ,
            Tipo   : datosCampos.Tipo,
            EsClave : datosCampos.EsClave,
            EsLectura : datosCampos.EsClave,
            EsNullable : datosCampos.EsNullable
        };

        if(datosCampos.Tipo == 'Reference')
        {
            nuevoCampo.IdReferencia = datosCampos.IdReferencia;
            nuevoCampo.EsPadre = datosCampos.EsPadre;
        }

        if(datosCampos.Tipo == 'Collection')
        {
            nuevoCampo.IdReferencia = datosCampos.IdReferencia;
            nuevoCampo.SonHijos = datosCampos.SonHijos;
        }

        if(datosCampos.Tipo == 'ComboNavision')
        {
            nuevoCampo.IdReferencia = datosCampos.IdReferencia;
        }


        var datosPadre = {
            Entidad     : "zz_Fichas",
            Clave       : self.lista.propiedades.campoId,
            Valor       : self.lista.getIdRegistroSeleccionada()
        };

        this.camposListadoStore.InsertHijo(nuevoCampo, datosPadre);
    }
};
FichasPage.prototype.eliminarCampo = function(){
    var respuesta = confirm ("Desea eliminar el campo del listado ");

    if(respuesta)
    {
        this.camposListadoStore.Delete(this.tabla.getIdRegistroSeleccionada());
    }
};
FichasPage.prototype.actualizarCampoFicha = function(){
    var self = this;
    var actualizacion =  this.tabla.datos.find("IdCampoFicha", this.tabla.getIdRegistroSeleccionada());

    actualizacion = this.propiedadesCampo.actualizarCampo();
    this.camposListadoStore.Update(actualizacion);
    if(actualizacion.comportamientos)
        actualizacion.comportamientos = JSON.parse(actualizacion.comportamientos);
};
FichasPage.prototype.copiarCampo = function(){
    this.camposModelosStore.Copiar(this.tabla.getIdRegistroSeleccionada(), {});
};
FichasPage.prototype.rellenarReferencias = function(){
    //$('#referencia option').remove();
    //$('#comboReferenciasTemplate').tmpl(this.lista.datos.data).appendTo('#referencia');
};