var CreacionDossierPage = function(){
    var self = this;

    this.ficha = {};
    this.factory = new IpkRemoteFactory();
    this.factory.onGetFicha = function(eventArgs){
        if(self[eventArgs.propiedad])
        {
            self[eventArgs.propiedad] = eventArgs.control;

            if(self[eventArgs.propiedad + 'Eventos'])
                self[eventArgs.propiedad + 'Eventos']();
        }
    };


    this.inicializarLayout();

    this.crearToolbarMenu();
    this.crearFicha();
};

CreacionDossierPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        },
        south : {
            resizable  : false,
            closable : false,
            size: '220'
        }
    });
};

CreacionDossierPage.prototype.fichaEventos = function(){
    var self = this;
    this.ficha.onGuardarClick = function(){
        //setTimeout(function(){ window.location = 'Inicio.html'; }, 2000);

    };
    this.ficha.onCancelarClick = function(){
        window.location = 'Inicio.html';
    };

    this.ficha.onRecordInserted = function(){
        //window.location = 'Inicio.html';
    };
};

CreacionDossierPage.prototype.crearToolbarMenu = function(){
    app.configuracion.navegacion();
};
CreacionDossierPage.prototype.crearFicha = function(){
    //var configuracion = { contenedor : "fichaPlaceholder" , nombre : "Dossier" , modo : IpkFicha.Modos.Alta};
    //this.factory.getFicha('Dossier', 'ficha', configuracion);

    var configuracion = { contenedor : "fichaPlaceholder" , nombre : "Dossier" , modo : IpkFicha.Modos.Alta};
    this.factory.getFicha('Dossier', 'ficha', configuracion);
};

