/**
 * Prueba del componente IpkFactory
 *
 * @class Factoria_Test_Page
 * @name Factoria_Test_Page
 * @constructor
 */
var Factoria_Test_Page = function(){
    this.dossieresDS =  new IpkRemoteDataSource();
    this.dossieresTabla = {};
    this.solucionesTabla = {};

    this.ficha = { control : {} };
    this.factory = new IpkRemoteFactory();
    var self = this;
    this.factory.onGetListado = function(eventArgs){
        app.log.debug('Capturado ' , eventArgs);
        if(self[eventArgs.propiedad])
        {
            self[eventArgs.propiedad] = eventArgs.control;
            if([eventArgs.propiedad + 'Eventos'])
                self[eventArgs.propiedad + 'Eventos']();
        }
    };
    this.factory.onGetRemoteDataSource = function(eventArgs){
        app.log.debug('Capturado IpkRemoteDataSource' , eventArgs);
        self[eventArgs.propiedad] = eventArgs.control;
        self[eventArgs.propiedad + 'Eventos']();
    }
};

Factoria_Test_Page.prototype.dossieresDSEventos = function(){
    var self = this;
    this.dossieresDS.onListado = function(){
        alert('sdfsdfsdfsdf');
    };
};

Factoria_Test_Page.prototype.dossieresTablaEventos = function(){
    var self = this;
    this.dossieresTabla.tabla.onRowClicked = function(){
        app.log.debug('kikikikiki' , [this.campoClave(), this.getIdRegistroSeleccionada()]);
    };
};

/**
 * Configura un IpkRemoteDataSource para trabajar sobre el modelo que se le indica
 *
 * @function
 * @public
 * @name     configurar_DS_Modelo
 * @memberOf Factoria_Test_Page
 * @param {String} Modelo Nombre del modelo con el que queremos configurar el IpkRemoteDataSource
 */
Factoria_Test_Page.prototype.configurar_DS_Modelo = function(Modelo){
    this.factory.getRemoteDataSource(Modelo, 'dossieresDS');
};

/**
 * Configura una IpkTabla obteniendo su configuración
 *
 * @function
 * @public
 * @name        configurar_Tabla
 * @memberOf    Factoria_Test_Page
 * @param       {String}     Listado    Nombre de la tabla
 */
Factoria_Test_Page.prototype.configurar_Tabla = function(Listado , Contenedor){

    //this.factory.getTabla(Listado , 'dossieresTabla' , {contenedor: Contenedor, Nombre: Listado, 'Listado': Listado});
    this.factory.getTablaEditable(Listado , 'dossieresTabla' , {contenedor: Contenedor, Nombre: Listado, 'Listado': Listado, 'Ficha': Listado});
    //this.factory.getTabla('Solucion' , 'solucionesTabla' , {contenedor: 'soluciones', Nombre: 'Solucion', 'Listado': 'Solucion'});
};

/**
 * Configura un IpkRemoteDataSource para trabajar sobre el modelo que se le indica
 *
 * @function
 * @public
 * @name     configurar_Ficha
 * @memberOf Factoria_Test_Page
 * @param {String} Ficha Nombre de la ficha
 */
Factoria_Test_Page.prototype.configurar_Ficha = function(Ficha, Contenedor){
    this.factory.getFicha(Ficha, this.ficha , { contenedor : Contenedor , nombre : Ficha , modo : IpkFicha.Modos.Consulta});
};
