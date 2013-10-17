var HojaCotizacionCliente = function(options){
    this.propiedades = options;

    this.factoria  = undefined;
    this.solucionesDS = undefined;

    this.idSolucion = undefined;
    this.solucion = undefined;

    this.tabs = undefined;

    return this;
};

/**
 *  Obtiene la plantilla del componente la carga en el contenedor y inicializa el componente
 */
HojaCotizacionCliente.prototype.create = function(){
    var that = this,
        contenedor = "body";

    if(this.propiedades && this.propiedades.contenedor)
        contenedor = this.propiedades.contenedor;

    this.html = $(contenedor).load('../js/componentes/html/hojaCotizacionCliente.html', function(){
        that.inicializarComponentes();
        that.inicializarUI();
        that.inicializarEventos();
    });


};
HojaCotizacionCliente.prototype.inicializarComponentes = function(){
    var that = this;
    this.factoria = new IpkRemoteFactory();
    this.factoria.onGetRemoteDataSource = function(eventArgs){
        that.solucionesDS = eventArgs.control;
        that.solucionesDS.onBuscar = function(respuesta){
            that.solucion = respuesta.datos[0];
            app.log.debug('onBuscar', respuesta.datos[0]);

            that.cargarDatosSolucion();
        };

        if(that.idSolucion)
            that.cargarSolucion(that.idSolucion);
    };
    this.factoria.getRemoteDataSource('Solucion', 'SolucionDS');
};
HojaCotizacionCliente.prototype.inicializarUI = function(){
    this.btnExportar =  $("#btnExportar");
    this.dialogo = $('#dlgHojaCotizacion').dialog(
        {
            title       : 'Hoja de cotización cliente',
            autoOpen    : false,
            modal       : true,
            width       : '1000',
            height      : 'auto'
        }
    );
};
HojaCotizacionCliente.prototype.inicializarEventos = function(){
    var that = this;

    $(this.btnExportar).on('click', function(){
        $('#htmlHeader').remove();
        $('#excelHeader').show();
        that.write_to_excel('tabla', 'Hoja Cotizacion');
    });
    $(this.propiedades.trigger).on('click', function(){
        that.abrir();
    });
};

HojaCotizacionCliente.prototype.cargarSolucion = function(Id){
    this.idSolucion = Id;
    if(this.solucionesDS)
        this.solucionesDS.Buscar({'IdSolucion': Id}, true, true);
};
HojaCotizacionCliente.prototype.cargarDatosSolucion = function(){
    $('#tabla *').remove();
    $('#hojaCotizacionClienteTemplate').tmpl(this.formatearDatos()).appendTo('#tabla');
};
HojaCotizacionCliente.prototype.formatearDatos = function(){
    var dossier = this.solucion.dosssier[0];
    var datos = {};

    datos.NumDemanda = dossier.NumDemanda;
    datos.NumDossier = dossier.NumDossier;
    datos.FechaCreacion = dossier.FechaCreacion;
    datos.FechaCierre = dossier.FechaCierre;

    datos.DescripcionArt = dossier.DescripcionArt;
    datos.NombreClteSolicitante = dossier.NombreClteSolicitante;
    datos.CodCliente = dossier.CodCliente;

    datos.Descripcion = this.solucion.Descripcion;
    datos.UnidadMedidaVenta = dossier.UnidadMedidaVenta;
    datos.PrecioCotizacion = this.solucion.PrecioCotizacion;
    datos.Incoterm = dossier.Incoterm;
    datos.FechaCierre = dossier.FechaCierre;
    datos.CantidadAFabricar = dossier.CantidadAFabricar;
    datos.Tolerancia = dossier.Tolerancia;
    datos.Entregas = dossier.Entregas;
    datos.Observaciones = dossier.Observaciones;
    datos.FechaDisponibilidadNecesaria = dossier.FechaDisponibilidadNecesaria;
    datos.DisponibilidadFabricacion = dossier.DisponibilidadFabricacion;

    return datos;
};


HojaCotizacionCliente.prototype.write_to_excel = function(table, name) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        };

    if (!table.nodeType)
        table = document.getElementById(table);

    var ctx = {
        worksheet: name || 'Worksheet',
        table: table.innerHTML
    };
    window.location.href = uri + base64(format(template, ctx))
};

HojaCotizacionCliente.prototype.abrir = function(){
    this.dialogo.dialog('open');
    $(window).height()
};
HojaCotizacionCliente.prototype.cerrar = function(){
    this.dialogo.dialog('close');
};


