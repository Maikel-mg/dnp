/**
 * Control Listado que genera una tabla para la entidad
 *
 * @class   IpkRemoteTabla
 * @name    IpkRemoteTabla
 * @namespace   UI.Controles.Remotes
 * @constructor
 *
 * @param   {Object}    configuracion   Configuracion de la ficha
 * @param   {Object}    configuracion.contenedor    Identificador del elemento donde se va a crear el control
 * @param   {Object}    configuracion.nombre    Nombre que se le asigna al contol
 * @param   {Object}    configuracion.modo      Modo en el que se habre por defecto la ficha
 * @param   {Object[]}  datos   Datos para rellenar la tabla
 *
 */
var IpkRemoteTabla = function(configuracion ,datos){
    /**
     * Valores por defecto del contol
     * @type    {Object}
     * @memberOf    IpkRemoteTabla
     */
    this.defaults = {};
    /**
     * Propiedades configurables del control
     * @type    {Object}
     * @memberOf    IpkRemoteTabla
     */
    this.propiedades = $.extend(this.defaults , configuracion);

    /**
     * Informacion del modelo al que pertenece la tabla
     * @type    {Object}
     * @memberOf    IpkRemoteTabla
     */
    this.modelo = {};

    /**
     * Control infraestructura para obtener la configuracion de los componentes
     * @type    {IpkInfraestructura}
     * @memberOf    IpkRemoteTabla
     */
    this.ipkConfiguracion = new IpkInfraestructura();

    /**
     * Control de acceso a datos para la entidad del Listado
     * @type    {IpkRemoteDataSource}
     * @memberOf    IpkRemoteTabla
     */
    this.genericoDS = {};

    /**
     * Elemento HTML del contenedor donde se mete el listado
     * @type    {jQuery}
     * @memberOf    IpkRemoteTabla
     */
    this.contenedor = $('#'+ this.propiedades.contenedor);

    /**
     * Control IpkTabla
     * @type    {IpkTabla}
     * @memberOf    IpkRemoteTabla
     */
    this.tabla = {};

    if(datos)
    {
        /**
         * Datos pasados por parametro para cargar en el listado
         * @type    {Object[]}
         * @memberOf    IpkRemoteTabla
         */
        this.datos = datos;
        /**
         * Datos pasados por parametro para cargar en el listado cechado por si filtramos
         * @type    {Object[]}
         * @memberOf    IpkRemoteTabla
         */
        this.datosPasados = datos;
    }

    this.crearIpkConfiguracion();
    this.crearGenericoDS();
    this.crearTabla();
};

/**
 * Crea el componente IpkInfraestructura para configurar los controles
 *
 * @function
 * @private
 * @name        crearIpkConfiguracion
 * @memberOf    IpkRemoteTabla
 */
IpkRemoteTabla.prototype.crearIpkConfiguracion = function(){
    var self = this;
    this.ipkConfiguracion.onGetListado = function(listado){
        self.tabla.setColumnas(listado.zz_CamposListados);
        self.ipkConfiguracion.getModeloById(listado.zz_Modelos.IdModelo);
    };
    this.ipkConfiguracion.onGetModelo = function(modelo){
        self.modelo = modelo;

        var clave = _.find(self.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;});
        self.genericoDS.CambiarEntidad(self.modelo.Nombre, clave.Nombre);
        self.obtenerDatosListado();
    };
};
/**
 * Crea el componente IpkRemoteDataSource para la entidad del control Listado
 *
 * @function
 * @private
 * @name        crearGenericoDS
 * @memberOf    IpkRemoteTabla
 */
IpkRemoteTabla.prototype.crearGenericoDS = function(){
    var self = this;
    this.genericoDS = new IpkRemoteDataSource({
        entidad : 'zz_Modelos',
        clave : 'IdModelo'
    });

    this.genericoDS.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('GETMODELO IpkTablaConectada  ', respuesta.datos);

                if(self.datosPasados)
                    self.tabla.setDatos(self.datosPasados);
                else
                    self.tabla.setDatos(respuesta.datos);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
/**
 * Configura el componente IpkRemoteDataSource para la entidad del control Listado
 *
 * @function
 * @private
 * @name        configurarGenericoDS
 * @memberOf    IpkRemoteTabla
 */
IpkRemoteTabla.prototype.configurarGenericoDS = function(){
    var clave = _.find(this.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;});
    this.genericoDS.CambiarEntidad(this.modelo.Nombre, clave.Nombre);
};
/**
 * Crea el control IpkTabla y lanza la consulta de su configuracion
 *
 * @function
 * @private
 * @name        crearTabla
 * @memberOf    IpkRemoteTabla
 */
IpkRemoteTabla.prototype.crearTabla = function(){
    var configuracion = {
        contenedor : this.propiedades.contenedor,
        id         : this.propiedades.Nombre
    };

    this.tabla = new IpkTabla(configuracion);

    this.obtenerConfiguracionListado(this.propiedades.Listado);
};

// **** FUNCIONES DATOS *****
/**
 * Lanza la consulta de la configuracion del listado
 *
 * @function
 * @private
 * @name        obtenerConfiguracionListado
 * @memberOf    IpkRemoteTabla
 *
 * @param  {string} nombre  Nombre del listado
 */
IpkRemoteTabla.prototype.obtenerConfiguracionListado = function(nombre){
    this.ipkConfiguracion.getListadoByName(nombre);
};
/**
 * Lanza la consulta de la configuracion del modelo
 *
 * @function
 * @private
 * @name        obtenerConfiguracionModelo
 * @memberOf    IpkRemoteTabla
 * @param       {int}   Id Identifiador del modelo de la tabla
 */
IpkRemoteTabla.prototype.obtenerConfiguracionModelo = function(Id){
    this.ipkConfiguracion.getModeloById(Id);
};

/**
 * Obtiene el listado de todos los registros de la entidad para la que esta configurado el listado
 *
 * @function
 * @public
 * @name        obtenerDatosListado
 * @memberOf    IpkRemoteTabla
 */
IpkRemoteTabla.prototype.obtenerDatosListado = function(){
    this.genericoDS.Listado();
};
/**
 * Coloca los datos pasados en la tabla
 *
 * @function
 * @public
 * @name        setDatos
 * @memberOf    IpkRemoteTabla
 * @param       {Object[]} datos    Datos a poner en la tabla
 */
IpkRemoteTabla.prototype.setDatos = function(datos){
    this.tabla.setDatos(datos);
};




