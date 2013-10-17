/**
 * Prueba del componente IpkInfraestructura
 *
 * @class IpkConfiguracion_Test_Page
 * @name IpkConfiguracion_Test_Page
 * @constructor
 */
var IpkConfiguracion_Test_Page = function(){
    var self = this;

    this.genericDS = new IpkRemoteDataSource();
    this.infraestructura = new IpkInfraestructura();
    this.infraestructura.onGetModelo = function(Modelo){
        app.log.debug('IpkConfiguracion_Test_Page onGetModelo' , Modelo);

        self.modelo = Modelo;
    };
    this.infraestructura.onGetListado = function(Listado){
        self.tabla.setColumnas(Listado.zz_CamposListados);
        app.log.debug('IpkConfiguracion_Test_Page onGetListado' , Listado);
        self.infraestructura.getModeloById(Listado.zz_Modelos.IdModelo);
    };
    this.infraestructura.onGetFicha = function(Ficha){
        app.log.debug('IpkConfiguracion_Test_Page -- Ficha' , Ficha);
        self.infraestructura.getModeloById(Ficha.zz_Modelos.IdModelo);
    };
};

/**
 * Obtiene la informacion de un modelo por nombre
 *
 * @function
 * @public
 * @name     ObtenerModeloPorNombre
 * @memberOf IpkConfiguracion_Test_Page
 * @param {String} Modelo Nombre del modelo del que queremos obtener la informacion
 */
IpkConfiguracion_Test_Page.prototype.ObtenerModeloPorNombre = function(Modelo){
    this.infraestructura.getModeloByName(Modelo);
};

/**
 * Obtiene la informacion de un modelo por nombre
 *
 * @function
 * @public
 * @name     ObtenerModeloPorNombre
 * @memberOf IpkConfiguracion_Test_Page
 * @param    {int}   Id   Id del modelo del que queremos obtener la informacion
 */
IpkConfiguracion_Test_Page.prototype.ObtenerModeloPorId = function(Id){
    this.infraestructura.getModeloById(Id);
};

/**
 * Obtiene la informacion del listado por nombre
 *
 * @function
 * @public
 * @name         ObtenerListadoPorNombre
 * @memberOf     IpkConfiguracion_Test_Page
 * @param        {String}   Listado     Nombre del listado del que queremos obtener la informacion
 */
IpkConfiguracion_Test_Page.prototype.ObtenerListadoPorNombre = function(Listado){
    this.infraestructura.getListadoByName(Listado);
};

/**
 * Obtiene la informacion de un listado por id
 *
 * @function
 * @public
 * @name     ObtenerListadoPorId
 * @memberOf IpkConfiguracion_Test_Page
 * @param    {int}   Id   Id del listado del que queremos obtener la informacion
 */
IpkConfiguracion_Test_Page.prototype.ObtenerListadoPorId = function(Id){
    this.infraestructura.getListadoById(Id);
};

/**
 * Obtiene la informacion de la ficha por nombre
 *
 * @function
 * @public
 * @name         ObtenerFichaPorNombre
 * @memberOf     IpkConfiguracion_Test_Page
 * @param        {String}   Ficha     Nombre de la ficha del que queremos obtener la informacion
 */
IpkConfiguracion_Test_Page.prototype.ObtenerFichaPorNombre = function(Ficha){
    this.infraestructura.getFichaByName(Ficha);
};

/**
 * Obtiene la informacion de la ficha por id
 *
 * @function
 * @public
 * @name     ObtenerFichaPorId
 * @memberOf IpkConfiguracion_Test_Page
 * @param    {int}   Id   Id de la ficha del que queremos obtener la informacion
 */
IpkConfiguracion_Test_Page.prototype.ObtenerFichaPorId = function(Id){
    this.infraestructura.getFichaById(Id);
};

