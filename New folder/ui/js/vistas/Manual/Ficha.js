var FichaManualPage = function(){
    this.ficha = {};

    this.crearFicha();
};

FichaManualPage.prototype.crearFicha = function(){
    var self = this;
    var configuracion = {
        contenedor   : 'contenedor',
        nombre       : 'Dossier' ,
        ficha        : 'Ficha' ,
        modo         : IpkFicha.Modos.Consulta
    };

    this.ficha = new IpkRemoteFicha(configuracion);
};


