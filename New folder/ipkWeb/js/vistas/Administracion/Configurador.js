var ConfiguradorController = function(){
    var self = this;

    this.bd = {};

    this.subcripciones();
    this.vincularEventos();

    this.inicializarModelos();
    this.inicializarGrid();

};

ConfiguradorController.prototype.subcripciones = function(){
    var self = this;

    app.eventos.escuchar("Listado", "zz_Modelos", function(evento, eventArgs){
        app.log.debug('Listado -- ', [evento, eventArgs]);
        if(eventArgs.estado == 'OK')
        {
            if(eventArgs.entidad == 'zz_Modelos')
                self.grupos.setData( eventArgs.datos , true);
            //else
            //self.grid.setDatos( eventArgs.datos , true);
        }
    });
    app.eventos.escuchar("Insert", "zz_Modelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.datos.add( eventArgs.datos);
        }
    });
    app.eventos.escuchar("InsertHijo", "zz_CamposModelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.datos.add( eventArgs.datos);
        }
    });
    app.eventos.escuchar("Update", "zz_Modelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grupos.datos.update( eventArgs.datos);
        }
    });
    app.eventos.escuchar("Update", "zz_CamposModelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.refrescar({}, {});
        }
    });
    app.eventos.escuchar("Delete", "zz_Modelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            if(eventArgs.entidad == 'zz_Modelos')
                self.grupos.datos.remove(self.registroActivo[self.options.campoId]);
        }
    });
    app.eventos.escuchar("Delete", "zz_CamposModelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.borrarFilaSeleccionada();
        }
    });
    app.eventos.escuchar("Filtrar", "zz_CamposModelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.setGridData( eventArgs.datos );
        }
    });
    app.eventos.escuchar("Copiar", "zz_CamposModelos", function(evento, eventArgs){
        if(eventArgs.estado == 'OK')
        {
            self.grid.datos.add(eventArgs.datos);

        }
    });

    /* EVENTOS MODELOS */
    app.eventos.subscribir(controlGrupos.Eventos.OnDataChange,  function(evento, eventArgs){
        self.rellenarReferencias();
    });
    app.eventos.subscribir(controlGrupos.Eventos.OnSeleccion, function(evento, eventArgs){
        self.registroActivo = eventArgs.datos;
        self.obtenerCamposModelo();
    });
    app.eventos.subscribir(controlGrupos.Eventos.OnEdicionClick, function(evento, eventArgs){
        app.log.debug('Edicion', eventArgs);
        self.editarModelo(eventArgs.datos);
    });
    app.eventos.subscribir(controlGrupos.Eventos.OnBorrarClick, function(evento, eventArgs){
        self.eliminarModelo(eventArgs.datos);
    });
    app.eventos.subscribir(controlGrupos.Eventos.OnNuevoClick, function(evento, eventArgs){
        self.crearModelo();
    });

    /* EVENTOS GRID */
    app.eventos.subscribir(ComponenteListado.Eventos.OnRowClick, function(evento, eventArgs){
        self.setCampoData();
        $('#tipoCampo').change();
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnNuevoClick, function(evento, eventArgs){
        self.crearCampo();
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnIrAFichaClick, function(evento, eventArgs){
        app.log.debug('OnRowClik sin implementar', eventArgs);
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnBorrarClick, function(evento, eventArgs){
        self.eliminarCampo();
    });
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnCopiarClick, function(evento, eventArgs){
        self.copiarCampo();
    });
};
ConfiguradorController.prototype.vincularEventos = function(){
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

/* FUNCIONES MODELOS */
ConfiguradorController.prototype.inicializarModelos = function(){
    var self = this;

    this.options = {
        contenedor      : $("#grupos"),
        plantilla       : $("#lateralTemplate"),
        tipoPlantilla   : "li",
        entidad         : "zz_Modelos",
        campoId         : "IdModelo"
    };
    this.grupos = new controlGrupos( this.options );

    this.cargarModelos();
};
ConfiguradorController.prototype.cargarModelos = function(){
    var listadoModelos = {
        Entidad: this.options.entidad
    };

    var listadoCamposModelos = {
        Entidad: "zz_CamposModelos"
    };

    app.servicios.generales.Listado( JSON.stringify(listadoModelos) );
    app.servicios.generales.Listado( JSON.stringify(listadoCamposModelos) );
};
ConfiguradorController.prototype.crearModelo = function(modelo){
    var nuevo = prompt ("Nombre del nuevo modelo: ");
    if(nuevo != "" && nuevo != undefined)
    {

        var nuevoModelo = {
            Nombre : nuevo
        };

        var parametros = {
            Entidad : this.options.entidad,
            Datos : nuevoModelo
        };

        app.servicios.generales.Insert( JSON.stringify(parametros) );

        //this.grupos.datos.add( nuevoModelo );
    }
};
ConfiguradorController.prototype.editarModelo = function(modelo){
    var nombreActual = modelo.Nombre;
    var nombreNuevo = prompt ("Cambie el nombre del modelo", nombreActual );
    if(nombreNuevo != "" && nombreNuevo != nombreActual)
    {
        var clave = this.options.campoId;

        var datos = {
            Nombre : nombreNuevo
        };
        var where = {
            Clave : clave,
            Valor : modelo[clave]
        };

        var parametros = {
            Entidad : this.options.entidad,
            Clave   : where,
            Datos   : datos
        };

        app.servicios.generales.Update( JSON.stringify( parametros ) );
        //modelo.Nombre = nombreNuevo;
        //this.grupos.setData( this.bd.modelos, true );
    }
};
ConfiguradorController.prototype.eliminarModelo = function(modelo){
    var respuesta = confirm ("Desea eliminar el modelo '" + modelo.Nombre + "'");

    if(respuesta)
    {
        var clave = this.options.campoId;

        var parametros = {
            Entidad : this.options.entidad,
            Clave   : clave,
            Valor   : modelo[clave]
        };

        app.servicios.generales.Delete( JSON.stringify(parametros) );

        //this.grupos.datos.remove(this.options.campoId, modelo.IdModelo);
        //this.grupos.setData( this.bd.modelos, true );
    }
};
ConfiguradorController.prototype.obtenerCamposModelo = function(){
    var self = this;

    var parametros = {
        Entidad : "zz_CamposModelos",
        Where   : " it.zz_Modelos.IdModelo = " + self.registroActivo[self.options.campoId]
    };

    app.servicios.generales.Filtrar( JSON.stringify(parametros) );
};
ConfiguradorController.prototype.setGridData = function(datos){
    $('#tituloCentro').text( this.registroActivo.Nombre.toUpperCase() );
    this.grid.setDatos(datos);
};

/* FUNCIONES GRID */
ConfiguradorController.prototype.inicializarGrid = function(){
    this.optionsListado = {
        entidad         : "zz_CamposModelos",
        campoId         : "IdCampoModelo",
        cabecera        : ["Nombre", "Tipo","Clave","Indice", "Nullable"],
        contenedor      : $("#listado"),
        plantilla       : $("#centroTemplate"),
        esMe            : false,
        accionesEnLinea : false,
        sufijo          : "zz_CamposModelos-"
    };

    this.grid = new ComponenteListado(this.optionsListado);
    this.grid.render();
};
ConfiguradorController.prototype.crearCampo = function(){

    var nuevoCampo = {
        "Nombre"    : '',
        "Tipo"      : "String",
        "EsClave"  : false,
        "EsIndice"  : false,
        "EsNullable"  : false
    };

    var datosPadre = {
        Entidad : this.options.entidad,
        Clave   : this.options.campoId,
        Valor   : this.registroActivo.IdModelo
    };


    var parametros = {
        Entidad     : this.optionsListado.entidad,
        Datos       : nuevoCampo,
        DatosPadre  : datosPadre
    };

    app.servicios.generales.InsertHijo( JSON.stringify( parametros ) );

    //this.bd.camposModelos.push(nuevo);
    //this.grid.datos.add(nuevo);

/*
    var nuevo = {
        "IdCampo"   : 0,
        "IdModelo"  : this.registroActivo.IdModelo,
        "Nombre"    : '',
        "Tipo"      : "String",
        "EsClave"  : false,
        "EsIndice"  : false,
        "Nullable"  : false
    };

    this.bd.camposModelos.push(nuevo);
    this.grid.datos.add(nuevo);
*/
};
ConfiguradorController.prototype.eliminarCampo = function(){

    var confirmacion = confirm("¿Desea borra el registro seleccionado?");
    if(confirmacion){


        var parametros = {
            Entidad : this.optionsListado.entidad,
            Clave   : this.optionsListado.campoId,
            Valor   : this.grid.getIdRegistroSeleccionada()
        };

        app.servicios.generales.Delete( JSON.stringify(parametros) );

        //this.grid.datos.remove(this.grid.getIdRegistroSeleccionada());
    }
};
ConfiguradorController.prototype.copiarCampo = function(modelo){

    var parametros = {
        Entidad : this.optionsListado.entidad,
        Clave   : this.optionsListado.campoId,
        Valor   : this.grid.getIdRegistroSeleccionada(),
        Datos   : {}
    };

    app.servicios.generales.Copiar( JSON.stringify(parametros) );

    /*
    var seleccion =  this.grid.datos.find(this.optionsListado.campoId, this.grid.getIdRegistroSeleccionada());
    var copia = _.clone(seleccion);

    this.bd.camposModelos.push(copia);
    this.grid.datos.add(copia, this.optionsListado.campoId);
    */
};
ConfiguradorController.prototype.guardarCampo = function(modelo){

    var seleccion =  this.grid.datos.find(this.optionsListado.campoId, this.grid.getIdRegistroSeleccionada());
    seleccion.Nombre = $('#nombreCampo').val();
    seleccion.Tipo = $('#tipoCampo').val();
    seleccion.EsClave = ($('#esClave').attr('checked') == 'checked');
    seleccion.EsIndice = ($('#esIndice').attr('checked') == 'checked');
    seleccion.EsNullable = ($('#obligatorio').attr('checked') == 'checked');

    if(seleccion.Tipo == 'Reference' || seleccion.Tipo == 'Collection' )
        seleccion.IdReferencia = $('#referencia').val();


    var where = {
        Clave : this.optionsListado.campoId,
        Valor : this.grid.getIdRegistroSeleccionada()
    };

    var parametros = {
        Entidad : this.optionsListado.entidad,
        Clave   : where,
        Datos   : seleccion
    };

    app.servicios.generales.Update( JSON.stringify( parametros ) );

    //this.grid.refrescar({}, {});
};
ConfiguradorController.prototype.setCampoData = function(){
    var seleccion =  this.grid.datos.find(this.optionsListado.campoId, this.grid.getIdRegistroSeleccionada());

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
ConfiguradorController.prototype.rellenarReferencias = function(){
    $('#referencia option').remove();
    $('#comboReferenciasTemplate').tmpl(this.grupos.datos.data).appendTo('#referencia');
};


