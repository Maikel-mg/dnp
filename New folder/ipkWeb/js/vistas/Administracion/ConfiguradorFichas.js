var ConfiguradorController = function(){
    var self = this;

    this.bd = {};

    this.cache();
    this.subcripciones();
    this.vincularEventos();

    this.obtenerModelos();

    this.inicializarFichas();
    this.inicializarGrid();
    this.inicalizarDialogos();
    this.inicializarDialogoCampos();
};

ConfiguradorController.prototype.cache = function(){
    this.TituloCentro = $('#tituloCentro');
    this.DesrcipcionCentro = $('#tituloDescripcion');

    this.NombreListado = $('#nombre');
    this.ClaveListado = $('#clave');
    this.DescripcionListado = $('#descripcion');
    this.EsMeListado = $('#esME');

    /* DIALOGO ALTA LISTADO */
    this.NombreAlta = $('#nombreAlta');
    this.ModeloAlta = $('#modeloAlta');
    this.ComboModelosPlantilla = $('#comboModeloTemplate');

    /* DIALOGO ALTA CAMPO */
    this.TituloCampo =  $('#textoColumna');
    this.ModeloCampo =  $('#camposModelo');
    this.EsCampoBusqueda =  $('#busquedaInterna');
    this.ComboCamposPlantilla = $('#campoModeloTemplate');
};
ConfiguradorController.prototype.subcripciones = function(){
    var self = this;

    app.eventos.escuchar("GetById", 'zz_Modelos', function(evento, eventArgs){
        self.cargarComboModelo(eventArgs.datos);
    });
    app.eventos.escuchar("GetById", "zz_Fichas",  function(evento, eventArgs){
        self.fichaSeleccionadoa= eventArgs.datos;
        self.colocarInfoFicha(eventArgs.datos);
    });
    app.eventos.escuchar("Listado", "zz_Modelos",  function(evento, eventArgs){
        self.cargarComboModelo(eventArgs.datos);
        self.rellenarReferencias(eventArgs.datos);
    });
    app.eventos.escuchar("Listado", "zz_Fichas", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.setData( eventArgs.datos , true);
        }
    });
    app.eventos.escuchar("InsertHijo", "zz_CamposFichas", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
                self.grid.datos.add( eventArgs.datos);
        }
    });
    app.eventos.escuchar("InsertHijo", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            if(eventArgs.entidad == 'zz_Fichas')
                self.grupos.datos.add( eventArgs.datos);
            else
                self.grid.datos.add( eventArgs.datos);
        }
    });
    app.eventos.escuchar("Update", "zz_Fichas", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.datos.update( eventArgs.datos);
        }
    });
    app.eventos.escuchar("Update", "zz_CamposFichas", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.refrescar({}, {});

        }
    });
    app.eventos.escuchar("Delete", "zz_Fichas", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.datos.remove(self.registroActivo[self.options.campoId]);
        }
    });
    app.eventos.escuchar("Delete", "zz_CamposFichas", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.borrarFilaSeleccionada();
        }
    });
    app.eventos.escuchar("Filtrar", "zz_CamposFichas", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.setDatos(eventArgs.datos);
        }
    });
    app.eventos.escuchar("Filtrar", "zz_CamposModelos",  function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.camposFichaSeleccionada = eventArgs.datos;
            self.cargarComboCamposModelo(eventArgs.datos)
        }
    });
    app.eventos.escuchar("Copiar",  "zz_CamposFichas",  function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.datos.add(eventArgs.datos);

        }
    });

    /* EVENTOS FICHAS */
    app.eventos.subscribir(controlGrupos.Eventos.OnSeleccion, function(evento, eventArgs){
        self.registroActivo = eventArgs.datos;

        self.obtenerInfoFichas();
        self.obtenerCamposFicha();
    });
    app.eventos.subscribir(controlGrupos.Eventos.OnEdicionClick, function(evento, eventArgs){
        app.log.debug('Edicion', eventArgs);
        var nombreActual = eventArgs.datos.Nombre;
        var nombreNuevo = prompt ("Cambie el nombre del modelo", nombreActual );
        if(nombreNuevo != "" && nombreNuevo != nombreActual)
        {
            eventArgs.datos.Nombre = nombreNuevo;
            app.log.debug('BD',bd.modelos);
            self.grupos.setData( self.bd.modelos, true );
        }
    });
    app.eventos.subscribir(controlGrupos.Eventos.OnBorrarClick, function(evento, eventArgs){
        self.borrarFicha(eventArgs.datos);
    });
    app.eventos.subscribir(controlGrupos.Eventos.OnNuevoClick, function(evento, eventArgs){
        self.dialogoListado.dialog('open');
    });

    /* EVENTOS GRID */
    app.eventos.subscribir(ComponenteListado.Eventos.OnRowClick,function(evento, eventArgs){
        self.setCampoData();
        $('#tipoCampo').change();
        var seleccion =  self.grid.datos.find(self.optionsListado.campoId, self.grid.getIdRegistroSeleccionada());

        $('#nombreCampo').val( seleccion.Nombre );
        $('#tipoCampo').val( seleccion.Tipo );
        $('#obligatorio').attr('checked', seleccion.Nullable);

        app.log.debug('Estamos en ello ', seleccion);
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnNuevoClick,function(evento, eventArgs){
        self.dialogoCampos.dialog('open');
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnIrAFichaClick,function(evento, eventArgs){
        self.editarCampoFicha();
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnBorrarClick,function(evento, eventArgs){
        self.borrarCampoFicha(self.grid.getIdRegistroSeleccionada());
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnCopiarClick,function(evento, eventArgs){
        var seleccion =  self.grid.datos.find(self.optionsListado.campoId, self.grid.getIdRegistroSeleccionada());
        var copia = _.clone(seleccion);

        /*
        self.bd.camposModelo.push(copia);
        self.grid.datos.add(copia, self.optionsListado.campoId);
        */
    });
};
ConfiguradorController.prototype.vincularEventos = function(){
    var self = this;

    $('#btnGuardar').on('click', function(){
        self.actualizarFicha();
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


/* FUNCIONES LISTADOS */
ConfiguradorController.prototype.inicializarFichas = function(){
    var self = this;

    this.options = {
        contenedor      : $("#grupos"),
        plantilla       : $("#lateralTemplate"),
        tipoPlantilla   : "li",
        entidad         : "zz_Fichas",
        campoId         : "IdFicha"
    };

    this.grupos = new controlGrupos( this.options );
    this.obtenerFichas();
};
ConfiguradorController.prototype.crearFicha = function(){
    var nombre = this.NombreAlta.val();
    var clave = this.NombreAlta.val();
    var modelo = this.ModeloAlta.val();

    if(nombre != "" && nombre != undefined && clave != "" && clave != undefined  )
    {
        var nuevo = {
            Nombre : nombre,
            Clave  : clave
        };

        this.insertarFicha( parseInt(modelo) , nuevo);
    }
};
ConfiguradorController.prototype.colocarInfoFicha = function(datos){

    // COLOCAMOS LOS CAMPOS EN LOS INPUTS
    this.TituloCentro.text( datos.Nombre.toUpperCase() );
    this.DesrcipcionCentro.text( "(Basado en la entidad " + datos.zz_Modelos.Nombre.toUpperCase() + ")" );

    this.NombreListado.val( datos.Nombre);
    this.ClaveListado.val( datos.Clave );
    this.DescripcionListado.val( datos.Descripcion );
    this.EsMeListado.attr('checked',  datos.EsME);

    this.obtenerCamposModelo(datos.zz_Modelos.IdModelo);
};

/* FUNCIONES CAMPOS LISTADO */
ConfiguradorController.prototype.crearCampoFicha = function(){
    var self = this;
    var texto = this.TituloCampo.val();
    var idCampo =  this.ModeloCampo.val();

    var datosCampos = _.find(self.camposFichaSeleccionada, function(elemento){ return elemento.IdCampoModelo == parseInt(idCampo) });

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

        self.insertarCampoFicha(nuevoCampo);
    }
};
ConfiguradorController.prototype.editarCampoFicha = function(){
    var self = this;
    var campo = _.filter(self.bd.camposListados, function(elemento){ return elemento[self.optionsListado.campoId] == self.grid.getIdRegistroSeleccionada()});

    app.log.debug('Campo a editar', campo);
};

/* FUNCIONES GRID CAMPOS */
ConfiguradorController.prototype.inicializarGrid = function(){
    this.optionsListado = {
        entidad         : "zz_CamposFichas",
        campoId         : "IdCampoFicha",
        cabecera        : ["Nombre", "Titulo", "Tipo", "Clave"],
        contenedor      : $("#listado"),
        plantilla       : $("#centroTemplate"),
        esMe            : false,
        accionesEnLinea : false,
        sufijo          : "zz_CamposFichas-"
    };

    this.grid = new ComponenteListado(this.optionsListado);
    this.grid.render();
};

/* FUNCIONES DIALOGO LISTADOS */
ConfiguradorController.prototype.inicalizarDialogos = function(){
    var self = this;

    this.dialogoListado = $('#dlgAltaListado').dialog({
                                modal : true,
                                autoOpen : false,
                                title    : "Nueva Ficha",
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
ConfiguradorController.prototype.obtenerModelos = function(){
    var parametros = {
        Entidad : "zz_Modelos"
    };

    app.servicios.generales.Listado( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.cargarComboModelo = function(datos){
    $('option', this.ModeloAlta).remove();
    this.ComboModelosPlantilla.tmpl(datos).appendTo(this.ModeloAlta);
};

/* FUNCIONES DIALOGO CAMPOS GRID*/
ConfiguradorController.prototype.inicializarDialogoCampos = function(){
    var self = this;

    this.dialogoCampos = $('#dlgAltaCampoListado').dialog({
        modal : true,
        autoOpen : false,
        title    : "Nuevo Campo Ficha",
        width    : '350px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){
                    self.crearCampoFicha();
                    $('input,select', this).each(function(){ $(this).val("") });
                    $(this).dialog('close');
                }
            },
            {
                'text' :'Cancelar' ,
                'click': function(){
                    $('input,select', this).each(function(){ $(this).val("") });
                    $(this).dialog('close');
                }
            }
        ]
    });

};
ConfiguradorController.prototype.obtenerCamposModelo = function(idModelo){
    var self = this;

    var parametros = {
        Entidad : "zz_CamposModelos",
        Where   : " it.zz_Modelos.IdModelo = " + idModelo
    };

    app.servicios.generales.Filtrar( JSON.stringify(parametros) );

};
ConfiguradorController.prototype.cargarComboCamposModelo = function(datos){

    self.camposFichaSeleccionada = datos;

    $('option',this.ModeloCampo).remove();
    this.ComboCamposPlantilla.tmpl(datos).appendTo(this.ModeloCampo);
};
ConfiguradorController.prototype.setCampoData = function(){
    var seleccion =  this.grid.datos.find(this.optionsListado.campoId, this.grid.getIdRegistroSeleccionada());

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
ConfiguradorController.prototype.rellenarReferencias = function(datos){
    $('#referencia option').remove();
    $('#comboReferenciasTemplate').tmpl(datos).appendTo('#referencia');
};


/* FUNCIONES ACCESO A DATOS
*********************************************/
ConfiguradorController.prototype.obtenerFichas  = function(){
    var parametros = {
        Entidad: this.options.entidad
    };

    app.servicios.generales.Listado( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.obtenerInfoFichas  = function(){
    var parametros = {
        Entidad : this.options.entidad,
        Clave   : this.options.campoId,
        Valor   : this.registroActivo[this.options.campoId]
    };

    app.servicios.generales.GetById( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.insertarFicha = function(idModelo, registro){
    var datosPadre = {
        Entidad     : "zz_Modelos",
        Clave       : "IdModelo",
        Valor       : idModelo
    };

    var parametros = {
        Entidad     : this.options.entidad,
        Datos       : registro,
        DatosPadre  : datosPadre
    };

    app.servicios.generales.InsertHijo( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.actualizarFicha = function(){
    var clave = {
        Clave       : this.options.campoId,
        Valor       : this.registroActivo[this.options.campoId]
    };

    var datos = {
        Nombre      : this.NombreListado.val(),
        Clave       : this.ClaveListado.val(),
        Descripcion : this.DescripcionListado.val()
    };

    var parametros = {
        Entidad     : this.options.entidad,
        Clave       : clave,
        Datos       : datos
    };

    app.servicios.generales.Update( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.borrarFicha = function(listado){
    var respuesta = confirm ("Desea eliminar la ficha '" + this.registroActivo.Nombre + "'");

    if(respuesta)
    {
        var clave = this.options.campoId;

        var parametros = {
            Entidad : this.options.entidad,
            Clave   : clave,
            Valor   : listado[clave]
        };

        app.servicios.generales.Delete( JSON.stringify(parametros) );

        //this.grupos.datos.remove(this.options.campoId, this.registroActivo[this.options.campoId]);
        //this.grupos.setData( this.bd.listados, true );
    }
};

ConfiguradorController.prototype.actualizarCampoFicha = function(registro){
    var self = this;

    var seleccion =  this.grid.datos.find(this.optionsListado.campoId, this.grid.getIdRegistroSeleccionada());
    seleccion.Nombre = $('#nombreCampo').val();
    seleccion.Titulo= $('#tituloCampo').val();
    seleccion.Tipo = $('#tipoCampo').val();
    seleccion.EsClave = ($('#esClave').attr('checked') == 'checked');
    seleccion.EsIndice = ($('#esIndice').attr('checked') == 'checked');
    seleccion.EsNullable = ($('#esNullable').attr('checked') == 'checked');
    seleccion.EsLectura = ($('#esLectura').attr('checked') == 'checked');

    if(seleccion.Tipo == 'Reference' || seleccion.Tipo == 'Collection' )
    {
        seleccion.IdReferencia = $('#referencia').val();
        if(seleccion.Tipo == 'Reference')
            seleccion.EsPadre = ($('#esPadre').attr('checked') == 'checked');
        else
            seleccion.SonHijos = ($('#sonHijos').attr('checked') == 'checked');
    }

    var where = {
        Clave : this.optionsListado.campoId,
        Valor : this.grid.getIdRegistroSeleccionada()
    };

    var parametros = {
        Entidad : this.optionsListado.entidad,
        Clave   : where,
        Datos   : seleccion
    };


    app.servicios.generales.Update( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.insertarCampoFicha = function(registro){
    var self = this;

    var datosPadre = {
        Entidad     : self.options.entidad,
        Clave       : self.options.campoId,
        Valor       : self.registroActivo[self.options.campoId]
    };

    var parametros = {
        Entidad     : this.optionsListado.entidad,
        Datos       : registro,
        DatosPadre  : datosPadre
    };

    app.servicios.generales.InsertHijo( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.obtenerCamposFicha = function(){
    var self = this;

    var parametros = {
        Entidad : "zz_CamposFichas",
        Where   : " it.zz_Fichas.IdFicha = " + self.registroActivo[self.options.campoId]
    };

    app.servicios.generales.Filtrar( JSON.stringify(parametros) );

};
ConfiguradorController.prototype.borrarCampoFicha = function(registro){
    var self = this;
    var campo = _.find(self.grid.datos.data, function(elemento){return elemento[self.optionsListado.campoId] == registro });

    var respuesta = confirm ("Desea eliminar el campo '" + campo.Nombre + "' de la ficha.");

    if(respuesta)
    {
        var clave = this.optionsListado.campoId;

        var parametros = {
            Entidad : self.optionsListado.entidad,
            Clave   : clave,
            Valor   : registro
        };

        app.servicios.generales.Delete( JSON.stringify(parametros) );

        //this.grupos.datos.remove(this.options.campoId, this.registroActivo[this.options.campoId]);
        //this.grupos.setData( this.bd.listados, true );
    }
};