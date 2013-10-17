var FichasPage = function(){
    this.navegacion = {};
    this.lista = {};
    this.tabla = {};
    this.accionesTabla = {};

    this.crearDSModelos();
    this.crearDSCamposModelo();
    this.crearDSFichas();
    this.crearDSCamposFichas();

    this.inicializarLayout();

    this.crearNavegacion();
    this.crearAccionesTabla();
    this.crearLista();
    this.crearTabla();
    this.crearDialogoAltaFicha();
    this.crearDialogoAltaCampoFicha();

    var self = this;
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
};
FichasPage.prototype.crearEventosAccionesTabla = function(){
    var self = this;

    this.accionesTabla.onAddCampo = function(){
        self.dlgAltaCampoListado.dialog('open');
    };
    this.accionesTabla.onBorrarCampo = function(){
        self.eliminarCampo();
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
        self.obtenerCamposFicha(this.getIdRegistroSeleccionada());
        self.obtenerFichasPorId(this.getIdRegistroSeleccionada());
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
            Nombre: 'EsClave',
            Titulo: 'EsClave',
            Tipo :  'Boolean',
            Ancho : '10',
            EsClave: false,
            BusquedaInterna: false
        }
    ];

    this.tabla.setColumnas(columnas);
};
FichasPage.prototype.configurarEventosTabla = function(){
    this.tabla.onRowClicked = function(){
        var seleccion =  this.datos.find("IdCampoFicha", this.getIdRegistroSeleccionada());

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
    };
};
FichasPage.prototype.colocarInfoCampo = function(seleccion){
    var seleccion =  this.grid.datos.find(this.optionsListado.campoId, this.grid.getIdRegistroSeleccionada());

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
FichasPage.prototype.actualizarCampoFicha = function(registro){
    var self = this;
    var actualizacion =  this.tabla.datos.find("IdCampoFicha", this.tabla.getIdRegistroSeleccionada());

    actualizacion.Nombre = $('#nombreCampo').val();
    actualizacion.Titulo= $('#tituloCampo').val();
    actualizacion.Tipo = $('#tipoCampo').val();
    actualizacion.EsClave = ($('#esClave').attr('checked') == 'checked');
    actualizacion.EsIndice = ($('#esIndice').attr('checked') == 'checked');
    actualizacion.EsNullable = ($('#esNullable').attr('checked') == 'checked');
    actualizacion.EsLectura = ($('#esLectura').attr('checked') == 'checked');

    if(actualizacion.Tipo == 'Reference' || actualizacion.Tipo == 'Collection' )
    {
        actualizacion.IdReferencia = parseInt($('#referencia').val());
        if(actualizacion.Tipo == 'Reference')
            actualizacion.EsPadre = ($('#esPadre').attr('checked') == 'checked');
        else
            actualizacion.SonHijos = ($('#sonHijos').attr('checked') == 'checked');
    }

    this.camposListadoStore.Update(actualizacion);
};
FichasPage.prototype.copiarCampo = function(){
    this.camposModelosStore.Copiar(this.tabla.getIdRegistroSeleccionada(), {});
};
FichasPage.prototype.rellenarReferencias = function(){
    $('#referencia option').remove();
    $('#comboReferenciasTemplate').tmpl(this.lista.datos.data).appendTo('#referencia');
};