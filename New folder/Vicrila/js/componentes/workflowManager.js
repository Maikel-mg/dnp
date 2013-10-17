var WorkFlowManager = function(options){
    this.propiedades = options;

    this.factoria  = undefined;
    this.dossierDS = undefined;

    this.idDossier = undefined;
    this.dossier = undefined;

    this.tabs = undefined;

    return this;
};

WorkFlowManager.prototype.create = function(){
    var that = this,
        contenedor = "body";

    if(this.propiedades && this.propiedades.contenedor)
        contenedor = this.propiedades.contenedor;

    this.html = $(contenedor).load('../js/componentes/html/workflowManager.html', function(){
        that.inicializarComponentes();
        that.inicializarUI();
        that.inicializarEventos();
    });


};
WorkFlowManager.prototype.inicializarComponentes = function(){
    var that = this;
    this.factoria = new IpkRemoteFactory();
    this.factoria.onGetRemoteDataSource = function(eventArgs){
        that.dossierDS = eventArgs.control;
        that.dossierDS.onBuscar = function(respuesta){
            that.dossier = respuesta.datos[0];
            app.log.debug('onBuscar', respuesta.datos[0]);

            that.cargarSoluciones();
            that.cargarFormas();
        };

        if(that.idDossier)
            that.cargarDossier(that.idDossier);
    };
    this.factoria.getRemoteDataSource('Dossier', 'dossierDS');
};
WorkFlowManager.prototype.inicializarUI = function(){
    this.tabs  = $('#tabsWorkflow').tabs();
    this.dialogo = $('#dialogWorkflow').dialog(
        {
            title       : 'Estado del workflow del dossier',
            autoOpen    : false,
            modal       : true,
            width       : '1000',
            height      : 'auto'
        }
    );

    if(app.seguridad.grupoActual != 'COMERCIAL')
    {
        $('#btnLanzarWorkflow').hide();
    }
};
WorkFlowManager.prototype.inicializarEventos = function(){
    var that = this;

    $(document).delegate('.inlineButton .icon-ok','click', function(){

        var infoElementoPulsado = that.infoElementoPulsado(this);
        var parametros = {
            InfoElemento : {
                Entidad     : infoElementoPulsado.entidad,
                Clave       : 'id' + infoElementoPulsado.entidad,
                IdElemento  : infoElementoPulsado.idElemento,
                IdEstado    : infoElementoPulsado.idEstado,
                IdDossier   : that.dossier.IdDossier,
                Seccion     : infoElementoPulsado.seccion
            }
        };

        app.log.debug('Peticion de validacion del elemento' , parametros);
        app.modelos.especiales.MarcarSeccionCompletada(JSON.stringify(parametros)).done(
            function(res){
                app.log.debug('Datos de vuelta' , app.ajax.procesarRespuesta([res]).datos);

                if(app.ajax.procesarRespuesta([res]).datos.EsValido)
                    that.dossierDS.Buscar({'IdDossier': that.dossier.IdDossier}, true, true);
                else
                    alert('No se puede marcar como "Completada" la sección porque faltan datos por completar');
            }
        );
    });
    $(document).delegate('.inlineButton .icon-remove','click', function(){
        var infoElementoPulsado = that.infoElementoPulsado(this);
        var parametros = {
            InfoElemento : {
                Entidad     : infoElementoPulsado.entidad,
                Clave       : 'id' + infoElementoPulsado.entidad,
                IdElemento  : infoElementoPulsado.idElemento,
                IdEstado    : infoElementoPulsado.idEstado,
                IdDossier   : that.dossier.IdDossier,
                Seccion     : infoElementoPulsado.seccion
            }
        };

        app.log.debug('Marcar elemento como NO completado' , parametros);

        app.modelos.especiales.MarcarSeccionPendiente(JSON.stringify(parametros)).done(
            function(res){
                app.log.debug('Datos de vuelta' , app.ajax.procesarRespuesta([res]).datos);
                that.dossierDS.Buscar({'IdDossier': that.dossier.IdDossier}, true, true);
            }
        );
    });
    $(document).delegate('.inlineButton .icon-envelope','click', function(){

        var infoElementoPulsado = that.infoElementoPulsado(this);
        var parametros = {
            InfoElemento : {
                Entidad     : infoElementoPulsado.entidad,
                Clave       : 'id' + infoElementoPulsado.entidad,
                IdElemento  : infoElementoPulsado.idElemento,
                IdEstado    : infoElementoPulsado.idEstado,
                IdDossier   : that.dossier.IdDossier,
                Seccion     : infoElementoPulsado.seccion
            }
        };


        app.log.debug('Peticion de envio de mail al grupo ' , parametros);
        app.modelos.especiales.EnviarAvisoSeccion(JSON.stringify(parametros)).done(
            function(res){
                app.log.debug('ssss' , app.ajax.procesarRespuesta([res]) );
                alert( app.ajax.procesarRespuesta([res]).mensaje );
            }
        );


    });
    $(document).delegate('.inlineButton .icon-share-alt','click', function(){

        var infoElementoPulsado = that.infoElementoPulsado(this);
        var parametros = {
            InfoElemento : {
                Entidad     : infoElementoPulsado.entidad,
                Clave       : 'id' + infoElementoPulsado.entidad,
                IdElemento  : infoElementoPulsado.idElemento,
                IdEstado    : infoElementoPulsado.idEstado,
                IdDossier   : that.dossier.IdDossier,
                Seccion     : infoElementoPulsado.seccion
            }
        };

        app.log.debug('Peticion de envio de mail al grupo ' , parametros);
        app.modelos.especiales.EnviarAvisoSeccionSiguiente(JSON.stringify(parametros)).done(
            function(res){
                app.log.debug('ssss' , app.ajax.procesarRespuesta([res]) );
                alert( app.ajax.procesarRespuesta([res]).mensaje );
            }
        );

    });

    $('#btnLanzarWorkflow').on('click', function(){
        var parametros = {
            InfoElemento : {
                IdDossier   : that.dossier.IdDossier
            }
        };

        app.log.debug('Peticion de envio de mail al grupo ' , parametros);
        app.modelos.especiales.EnviarAvisoSeccionSiguiente(JSON.stringify(parametros)).done(
            function(res){
                app.log.debug('ssss' , app.ajax.procesarRespuesta([res]) );
                alert( app.ajax.procesarRespuesta([res]).mensaje );
            }
        );
    });

    $(this.propiedades.trigger).on('click', function(){
        that.abrir();
    });


};

WorkFlowManager.prototype.infoElementoPulsado = function(Boton){
    var columna = $(Boton).closest('td');
    var numColumn = columna.parent().children().index(columna);
    var cabecera  = columna.parent().parent().parent().find('thead tr th').eq(numColumn).text();
    var nombreGrupo = cabecera.toLowerCase()[0].toUpperCase() +  cabecera.toLowerCase().substr(1);

    var idfila = $(Boton).closest('tr').attr('id');
    var partes = idfila.split('-');

    return {
        'seccion'    : nombreGrupo,
        'entidad'    : partes[0],
        'idElemento' : parseInt(partes[2]),
        'idEstado'   : parseInt(partes[1])
    };
};

WorkFlowManager.prototype.cargarDossier = function(IdDossier){
    this.idDossier = IdDossier;
    if(this.dossierDS)
        this.dossierDS.Buscar({'IdDossier': IdDossier}, true, true);
};
WorkFlowManager.prototype.cargarSoluciones = function(){
    var soluciones = _.filter(this.dossier.WorkflowEstados, function(e){return e.TipoElemento == "Solucion"; });

    $('#tabSoluciones table tbody tr').remove();
    $('#filaTemplate').tmpl(soluciones).appendTo('#tabSoluciones table tbody');

    $('#tabsWorkflow ul li a').eq(0).text('Soluciones (' + soluciones.length + ')');
};
WorkFlowManager.prototype.cargarFormas = function(){
    var formas = _.filter(this.dossier.WorkflowEstados, function(e){return e.TipoElemento == "FormaArt"; });

    $('#tabFormas table tbody tr').remove();
    $('#filaTemplate').tmpl(formas).appendTo('#tabFormas table tbody');

    $('#tabsWorkflow ul li a').eq(1).text('Formas (' + formas.length + ')');
};

WorkFlowManager.prototype.abrir = function(){
    this.dialogo.dialog('open');
    $(window).height()
};

WorkFlowManager.prototype.cerrar = function(){
    this.dialogo.dialog('close');
};

