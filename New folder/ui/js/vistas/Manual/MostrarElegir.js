var MostrarElegirManualPage = function(){
    this.tabla = {};
    this.mostrarElegir = {};

    this.crearTabla();
    this.crearMostrarElegir();

    var self = this;
    $('#btnVerDatos').on('click', function(){
        self.mostrarElegir.abrir();
    });
};

MostrarElegirManualPage.prototype.crearTabla = function(){
    var configuracion = {
        contenedor   : "contenedorTabla",
        Nombre       : "Dossieres",
        Listado      : "Dossier"
    };

    var datos = [];

    this.tabla = new IpkRemoteTabla(configuracion , datos);
};

MostrarElegirManualPage.prototype.crearMostrarElegir = function(){
    var configuracion = {
        contenedor : "contenedorME",
        Nombre   : "Dossier",
        Listado   : "Dossier"
    };

    var self = this;
    this.mostrarElegir = new IpkMostrarElegir(configuracion);
    this.mostrarElegir.onSeleccionClick = function(eventArgs){
        var datos = self.tabla.datos;
        datos.push(eventArgs.seleccion);
        self.tabla.setDatos(datos);
        app.log.debug('Seleccion de fila' , eventArgs);

    }
};


