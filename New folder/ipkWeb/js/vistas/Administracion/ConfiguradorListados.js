var ConfiguradorController = function(){
    var self = this;

    this.bd = {};

    this.cache();
    this.subcripciones();
    this.vincularEventos();

    this.obtenerModelos();
    //this.obtenerCamposModelo();

    this.inicializarListados();
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
    this.EsClave=  $('#esClave');
    this.EsDescripcion =  $('#esDescripcion');
    this.ComboCamposPlantilla = $('#campoModeloTemplate');
};
ConfiguradorController.prototype.subcripciones = function(){
    var self = this;

    app.eventos.escuchar("GetById", "zz_Modelos",  function(evento, eventArgs){

        if(eventArgs.estado == 'OK')
        {
            self.cargarComboModelo(eventArgs.datos);
        }
    });
    app.eventos.escuchar("GetById", "zz_Listados", function(evento, eventArgs){

        if(eventArgs.estado == 'OK')
        {
            self.listadoSeleccionado = eventArgs.datos;
            self.colocarInfoListado(eventArgs.datos);
        }
    });
    app.eventos.escuchar("Listado", "zz_Modelos", function(evento, eventArgs){

        if(eventArgs.estado == 'OK')
        {
            self.cargarComboModelo(eventArgs.datos);
        }
    });
    app.eventos.escuchar("Listado","zz_Listados", function(evento, eventArgs){

        if(eventArgs.estado == 'OK')
        {
            self.grupos.setData( eventArgs.datos , true);
        }
    });
    app.eventos.escuchar("Insert", "zz_Listados", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.datos.add( eventArgs.datos);
        }
    });
    app.eventos.escuchar("InsertHijo", "zz_Listados",  function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.datos.add( eventArgs.datos);
        }
    });
    app.eventos.escuchar("InsertHijo", "zz_CamposListados",  function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.datos.add( eventArgs.datos);
        }
    });
    app.eventos.escuchar("Update", "zz_Listados", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.datos.update( eventArgs.datos);
        }
    });
    app.eventos.escuchar("Update","zz_CamposListados", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.refrescar({}, {});
        }
    });
    app.eventos.escuchar("Delete", "zz_Listados", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.datos.remove(self.registroActivo[self.options.campoId]);
        }
    });
    app.eventos.escuchar("Delete", "zz_CamposListados", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.borrarFilaSeleccionada();
        }
    });
    app.eventos.escuchar("Filtrar", "zz_CamposModelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.camposListadoSeleccionado = eventArgs.datos;
            self.cargarComboCamposModelo(eventArgs.datos)
        }
    });
    app.eventos.escuchar("Filtrar", "zz_CamposListados", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.setDatos(eventArgs.datos);
        }
    });
    app.eventos.escuchar("Copiar", "zz_CamposListados", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.datos.add(eventArgs.datos);

        }
    });

    /* EVENTOS MODELOS */
    app.eventos.subscribir(controlGrupos.Eventos.OnSeleccion, function(evento, eventArgs){
        self.registroActivo = eventArgs.datos;

        self.obtenerInfoListado();
        self.obtenerCamposListado();
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
        //self.eliminarListado();
        //app.log.debug('Borrar registro', eventArgs);
        self.borrarListado(eventArgs.datos);
    });
    app.eventos.subscribir(controlGrupos.Eventos.OnNuevoClick, function(evento, eventArgs){
        self.dialogoListado.dialog('open');
    });

    /* EVENTOS GRID */
    app.eventos.subscribir(ComponenteListado.Eventos.OnRowClick,function(evento, eventArgs){
        var seleccion =  self.grid.datos.find(self.optionsListado.campoId, self.grid.getIdRegistroSeleccionada());

        $('#nombreCampo').val( seleccion.Nombre );
        $('#tipoCampo').val( seleccion.Tipo );
        $('#obligatorio').attr('checked', seleccion.Nullable);

        app.log.debug('Estamos en ello ', seleccion);
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnNuevoClick,function(evento, eventArgs){

        self.dialogoCampos.dialog('open');/*
        var nuevo = {
            "IdCampo"   : 0,
            "IdModelo"  : self.registroActivo.IdModelo,
            "Nombre"    : '',
            "Tipo"      : "String",
            "Nullable"  : true
        };

        self.bd.camposModelo.push(nuevo);
        self.grid.datos.add(nuevo);*/
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnIrAFichaClick,function(evento, eventArgs){
        self.editarCampoListado();
        app.log.debug('OnRowClik sin implementar', eventArgs);
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnBorrarClick,function(evento, eventArgs){
        self.borrarCampoListado(self.grid.getIdRegistroSeleccionada());
        /*var confirmacion = confirm("¿Desea borra el registro seleccionado?");
        if(confirmacion){
            self.grid.datos.remove();
        }*/
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnCopiarClick,function(evento, eventArgs){
        var seleccion =  self.grid.datos.find(self.optionsListado.campoId, self.grid.getIdRegistroSeleccionada());
        var copia = _.clone(seleccion);

        self.bd.camposModelo.push(copia);
        self.grid.datos.add(copia, self.optionsListado.campoId);
    });
};
ConfiguradorController.prototype.vincularEventos = function(){
    var self = this;

    $('#btnGuardar').on('click', function(){
        //self.editarListado();
        self.actualizarListado();
    });

};


/* FUNCIONES LISTADOS */
ConfiguradorController.prototype.inicializarListados = function(){
    var self = this;

    this.options = {
        contenedor      : $("#grupos"),
        plantilla       : $("#lateralTemplate"),
        tipoPlantilla   : "li",
        entidad         : "zz_Listados",
        campoId         : "IdListado"
    };

    this.grupos = new controlGrupos( this.options );
    this.obtenerListados();
};
ConfiguradorController.prototype.crearListado = function(){
    var nombre = this.NombreAlta.val();
    var clave = this.NombreAlta.val();
    var modelo = this.ModeloAlta.val();

    if(nombre != "" && nombre != undefined && clave != "" && clave != undefined  )
    {
        var nuevoListado = {
            Nombre : nombre,
            Clave  : clave
        };

        this.insertarListado( parseInt(modelo) , nuevoListado);
    }
};
ConfiguradorController.prototype.colocarInfoListado = function(datos){

    // COLOCAMOS LOS CAMPOS EN LOS INPUTS
    this.TituloCentro.text( datos.Nombre.toUpperCase() );
    this.DesrcipcionCentro.text( "(Basado en la entidad " + datos.zz_Modelos.Nombre.toUpperCase() + ")" );

    this.NombreListado.val( datos.Nombre);
    this.ClaveListado.val( datos.Clave );
    this.DescripcionListado.val( datos.Descripcion );
    this.EsMeListado.attr('checked',  datos.EsME);

    this.obtenerCamposModelo(datos.zz_Modelos.IdModelo);

    // COlOCAMOS LOS CAMPOS DE LA ENTIDAD EN EL GRID
    //self.grid.setDatos(camposListado);
};

/* FUNCIONES CAMPOS LISTADO */
ConfiguradorController.prototype.crearCampoListado = function(){
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

        self.insertarCampoListado(nuevoCampo);
    }
};
ConfiguradorController.prototype.editarCampoListado = function(){
    var self = this;
    var campo = _.filter(self.bd.camposListados, function(elemento){ return elemento[self.optionsListado.campoId] == self.grid.getIdRegistroSeleccionada()});

    app.log.debug('Campo a editar', campo);
};
ConfiguradorController.prototype.eliminarCampoListado = function(){
    var self = this;
    var campo = _.filter(self.bd.camposListados, function(elemento){ return elemento[self.optionsListado.campoId] == self.grid.getIdRegistroSeleccionada()});
    var respuesta = confirm ("Desea eliminar el campo del listado '" + campo.Nombre + "'");

    if(respuesta)
    {
        this.grid.datos.remove(this.optionsListado.campoId, campo[this.optionsListado.campoId]);
        this.grid.setData( this.bd.camposListados, true );
    }
};

/* FUNCIONES GRID CAMPOS */
ConfiguradorController.prototype.inicializarGrid = function(){
    this.optionsListado = {
        entidad         : "zz_CamposListados",
        campoId         : "IdCampoListado",
        cabecera        : ["Nombre", "Titulo", "Tipo", "Busqueda"],
        contenedor      : $("#listado"),
        plantilla       : $("#centroTemplate"),
        esMe            : false,
        accionesEnLinea : false,
        sufijo          : "zz_CamposListados-"
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
                                title    : "Nuevo Listado",
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
ConfiguradorController.prototype.obtenerModelos = function(){
    var parametros = {
        Entidad : "zz_Modelos"
    };

    app.servicios.generales.Listado( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.cargarComboModelo = function(datos)
{
    $('option', this.ModeloAlta).remove();
    this.ComboModelosPlantilla.tmpl(datos).appendTo(this.ModeloAlta);
};

/* FUNCIONES DIALOGO CAMPOS GRID*/
ConfiguradorController.prototype.inicializarDialogoCampos = function(){
    var self = this;

    this.dialogoCampos = $('#dlgAltaCampoListado').dialog({
        modal : true,
        autoOpen : false,
        title    : "Nuevo Campo Listado",
        width    : '350px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){
                    self.crearCampoListado();
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
    /*var self = this;

    var entidad =  _.find(self.bd.modelos, function(elemento){ return elemento.IdModelo == self.registroActivo.Entidad});
    var camposModelo = _.filter(self.bd.camposModelos, function(elemento){ return elemento.IdModelo == entidad.IdModelo});
*/
    self.camposListadoSelecciondo = datos;

    $('option',this.ModeloCampo).remove();
    this.ComboCamposPlantilla.tmpl(datos).appendTo(this.ModeloCampo);
};


/* FUNCIONES ACCESO A DATOS
*********************************************/
ConfiguradorController.prototype.obtenerListados  = function(){
    var parametros = {
        Entidad: this.options.entidad
    };

    app.servicios.generales.Listado( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.obtenerInfoListado  = function(){
    var parametros = {
        Entidad : this.options.entidad,
        Clave   : this.options.campoId,
        Valor   : this.registroActivo[this.options.campoId]
    };

    app.servicios.generales.GetById( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.insertarListado = function(idModelo, registro){
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
ConfiguradorController.prototype.actualizarListado = function(){
    var clave = {
        Clave       : this.options.campoId,
        Valor       : this.registroActivo[this.options.campoId]
    };

    var datos = {
        Nombre      : this.NombreListado.val(),
        Clave       : this.ClaveListado.val(),
        EsME        : (this.EsMeListado.attr('checked'))? true: false,
        Descripcion : this.DescripcionListado.val()
    };

    var parametros = {
        Entidad     : this.options.entidad,
        Clave       : clave,
        Datos       : datos
    };

    app.servicios.generales.Update( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.borrarListado = function(listado){
    var respuesta = confirm ("Desea eliminar el listado '" + this.registroActivo.Nombre + "'");

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

ConfiguradorController.prototype.insertarCampoListado = function(registro){
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
ConfiguradorController.prototype.obtenerCamposListado = function(){
    var self = this;

    var parametros = {
        Entidad : "zz_CamposListados",
        Where   : " it.zz_Listados.IdListado = " + self.registroActivo[self.options.campoId]
    };

    app.servicios.generales.Filtrar( JSON.stringify(parametros) );

};
ConfiguradorController.prototype.borrarCampoListado = function(registro){
    var self = this;
    var campo = _.find(self.grid.datos.data, function(elemento){return elemento[self.optionsListado.campoId] == registro });

    var respuesta = confirm ("Desea eliminar el campo '" + campo.Nombre + "' del listado.");

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