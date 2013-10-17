/**
 * Created by Maikel Merillas
 * User: mg01
 * Date: 4/10/12
 * Time: 16:12
 */

/**
 *
 * @class       Clase que encapsula la creacion de los componetes que leen la configuración de la aplicaion (Modelos, Listado, Fichas)
 * @version     1.0
 * @name        IpkRemoteFactory
 * @constructor
 *
 * @requires    IpkInfraestructura
 * @requires    IpkRemoteDataSource
 * @requires    IpkRemoteTabla
 * @requires    IpkRemoteFicha
 */
var IpkRemoteFactory = function(){

    /**
     * Array con la colección de IpkRemoteDataSource con los DataSources que se van creando
     * @type {Object[]}
     * @memberOf IpkFactory
     */
    this.datasources = {};
    /**
     * Array con la colección de IpkRemoteTabla con las tablas que se van creando
     * @type {Object[]}
     * @memberOf IpkFactory
     */
    this.listados = {};
    /**
     * Array con la colección de IpkRemoteFicha con las fichas que se van creando
     * @type {Object[]}
     * @memberOf IpkFactory
     */
    this.fichas = {};
    /**
     * Array con la colección de configuraciones de los listados que se van creando para cuando se obtengan los datos completarlos y usarlas
     * @type     {Object[]}
     * @memberOf IpkFactory
     */
    this.listadosConfiguracion = {};
    /**
     * Array con la colección de configuraciones de las fichas que se van creando para cuando se obtengan los datos completarlos y usarlas
     * @type {Object[]}
     * @memberOf IpkFactory
     */
    this.fichasConfiguracion = {};

    /**
     * @type {IpkInfraestructura}
     * @see IpkInfraestructura
     * @memberOf IpkFactory
     */
    this.ipkConfiguracion = new IpkInfraestructura();

    return this;
};

/**
 * Lanza la consulta de los datos del modelo para el que se quiere crear el IpkRemoteDataSource y almacena el componente en la coleccion
 * para modificarlo cuando se tengan los datos
 *
 * @function
 * @public
 * @name  getRemoteDataSource
 * @memberOf    IpkRemoteFactory
 * @param       {String}            nombreModelo    Nombre del modelo para el que se quiere obtener el IpkRemoteDataSource
 * @param       {String}            propiedad       Nombre de la propiedad del control donde se va a almacenar el control
 */
IpkRemoteFactory.prototype.getRemoteDataSource = function(nombreModelo , propiedad){
    //this.datasources[nombreModelo] = datasource;
    this.datasources[nombreModelo] = {};

    var self = this;
    this.ipkConfiguracion.getModeloByName(nombreModelo);
    this.ipkConfiguracion.onGetModelo = function(modelo){
        var clave = _.find(modelo.zz_CamposModelos, function(elemento){return elemento.EsClave == true}).Nombre;
        self.datasources[nombreModelo] = new IpkRemoteDataSource({
            'entidad' : modelo.Nombre,
            'clave'   : clave
        });

        var eventArgs = {
            propiedad : propiedad,
            control   : self.datasources[nombreModelo]
        };
        self.onGetRemoteDataSource(eventArgs);
    };
};
/**
 * Lanza la consulta de los datos de la IpkRemoteTabla para la que se quiere crear y almacena el componente en la coleccion
 * para modificarlo cuando se tengan los datos
 *
 * @function
 * @public
 * @name        getTabla
 * @memberOf    IpkRemoteFactory
 * @param       {String}            NombreListado               Nombre del listado que se quiere crear
 * @param       {String}            control                     Nombre de la propiedad del control donde se va a almacenar el control
 * @param       {Object}            configuracion               Configuración de la tabla
 * @param       {String}            configuracion.contenedor    Elemento html donde se va ha crear la ficha
 * @param       {String}            configuracion.Nombre        Nombre que se le da internamente al control
 * @param       {String}            configuracion.Listado       Clave del listado que se quiere crear
 * @param       {[Boolean]}         configuracion.autoLoad      Si es true se carga el listado completo, si es false sale vacio
 */
IpkRemoteFactory.prototype.getTabla = function(NombreListado , control, configuracion){
    this.listados[NombreListado] = {};
    this.listadosConfiguracion[NombreListado] = configuracion;

    var self = this;
    this.ipkConfiguracion.getListadoByName(NombreListado);
    this.ipkConfiguracion.onGetListado = function(Listado){
        if(configuracion.autoLoad)
            self.listados[NombreListado] = new IpkRemoteTabla(self.listadosConfiguracion[NombreListado]);
        else
            self.listados[NombreListado] = new IpkRemoteTabla(self.listadosConfiguracion[NombreListado], []);

        var eventArgs = {
            propiedad : control,
            control   : self.listados[NombreListado]
        };
        self.onGetListado(eventArgs);
    };

};
/**
 * Lanza la consulta de los datos de la tabla que se quiere crear y almacena el componente en la coleccion
 * para modificarlo cuando se tengan los datos
 *
 * @function
 * @public
 * @name        getTablaEditable
 * @memberOf    IpkRemoteFactory
 * @param       {String}            NombreListado     Nombre del listado que se quiere crear
 * @param       {String}            control                     Nombre de la propiedad del control donde se va a almacenar el control
 * @param       {Object}            configuracion               Configuración de la tabla
 * @param       {String}            configuracion.contenedor    Elemento html donde se va ha crear la ficha
 * @param       {String}            configuracion.Nombre        Nombre que se le da internamente al control
 * @param       {String}            configuracion.Listado       Clave del listado que se quiere crear
 * @param       {String}            configuracion.Ficha         Clave de la ficha que vamos al a crear en la tabla editable
 */
IpkRemoteFactory.prototype.getTablaEditable = function(NombreListado , control, configuracion){
    this.listados[NombreListado] = {};
    //this.listados[NombreListado] = control;
    this.listadosConfiguracion[NombreListado] = configuracion;

    var self = this;
    this.ipkConfiguracion.getListadoByName(NombreListado);
    this.ipkConfiguracion.onGetListado = function(Listado){
        self.listados[NombreListado] = new IpkTablaEditable(self.listadosConfiguracion[NombreListado]);
        //self.listados[Nombre.setColumnas(Listado.zz_CamposListados);stados);

        app.log.debug('onGetListado Nuevo]', self.listados[NombreListado]);

        var eventArgs = {
            propiedad : control,
            control   : self.listados[NombreListado]

        };

        self.onGetListado(eventArgs);
    };

};
/**
 * Lanza la consulta de los datos de la ficha para la que se quiere crear y almacena el componente en la coleccion
 * para modificarlo cuando se tengan los datos
 *
 * @function
 * @public
 * @name  getFicha
 * @memberOf    IpkRemoteFactory
 * @param          {string}         NombreFicha                 Nombre de la ficha que se quiere crear
 * @param          {string}         Control                     Nombre de la propiedad del control donde se va a almacenar el control
 * @param          {Object}         Configuracion               Configuracon de la ficha
 * @param          {string}         Configuracion.contenedor    Elemento html donde se va ha crearcha
 * @param          {string}         Configuracion.nombre        Nombre de la ficha que se quiere crear
 */
IpkRemoteFactory.prototype.getFicha = function(NombreFicha, Control, Configuracion){
    this.fichas[NombreFicha] = {};
    this.fichasConfiguracion[NombreFicha] = Configuracion;

    var self = this;
    this.ipkConfiguracion.getFichaByName(NombreFicha);
    this.ipkConfiguracion.onGetFicha = function(ficha){
        self.fichas[NombreFicha] = new IpkRemoteFicha( self.fichasConfiguracion[ficha.Nombre] );

        var eventArgs = {
            propiedad : Control,
            control   : self.fichas[NombreFicha]
        };

        self.onGetFicha(eventArgs);
    };
};


/**
 * Se lanza cuando se obtiene el resultado de la configuracion del IpkRemoteDataSource
 *
 * @event
 * @name        onGetRemoteDataSource
 * @memberOf    IpkRemoteFactory
 * @param       {Object}                 eventArgs             Datos del evento
 * @param       {String}                 eventArgs.propiedad   Nombre de la propiedad donde se va ha almacenar el control
 * @param       {IpkRemoteDataSource}    eventArgs.control     Control instanciado listo para usarse
 */
IpkRemoteFactory.prototype.onGetRemoteDataSource = function(eventArgs){
    //TODO: 05/10/2012 Determinar cuando se lanza este evento y programarlo
};
/**
 * Se lanza cuando se obtiene el resultado de la configuracion del IpkRemoteDataSource
 *
 * @event
 * @name        onGetListado
 * @memberOf    IpkRemoteFactory
 * @param       {Object}            eventArgs             Datos del evento
 * @param       {String}            eventArgs.propiedad   Nombre de la propiedad donde se va ha almacenar el control
 * @param       {IpkRemoteTabla}    eventArgs.control     Control instanciado listo para usarse
 */
IpkRemoteFactory.prototype.onGetListado = function(eventArgs){
    //TODO: 05/10/2012 Determinar cuando se lanza este evento y programarlo
};
/**
 * Se lanza cuando se obtiene el resultado de la configuracion del IpkRemoteDataSource
 *
 * @event
 * @name        onGetFicha
 * @memberOf    IpkRemoteFactory
 * @param       eventArgs
 */
IpkRemoteFactory.prototype.onGetFicha = function(eventArgs){
    //TODO: 05/10/2012 Determinar cuando se lanza este evento y programarlo
};