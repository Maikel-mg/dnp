/**
 * Created by Maikel.
 * User: mg01
 * Date: 3/10/12
 * Time: 9:03
 */

/**
 * Control que gestiona los premisos que tienen los grupos sobre un determinado modelo
 * @version     1.0
 * @class       ConfiguradorAccesos
 * @name        ConfiguradorAccesos
 * @param       {Object} options Objeto con las opciones del control
 * @param       {String} options.contenedor Identificador del contendor donde se va a insertar el control
 * @constructor
 */
var ConfiguradorAccesos = function(options){
    //PROPIEDADES

    /**
     *  Configuracion por defecto del componente
     *  @type {Object}
     *  @memberOf ConfiguradorAccesos
     * */
    this.defaults = {};
    /**
     * Prpiedades por configurables del componente
     * @type {Object}
     *  @memberOf ConfiguradorAccesos
     * */
    this.propiedades = $.extend( this.defaults , options);
    /**
     *Html con el contenido del control
     * @type {jQuery}
     * @memberOf ConfiguradorAccesos
     * */
    this.html = undefined;
    /**
     * Tabla que contiene sobre la que se configuran los permisos
     *  @type {jQuery}
     *  @memberOf ConfiguradorAccesos
     *  */
    this.tablaAccesos = undefined;
    /**
     * Objeto que contiene los permisos que se están configurando
     * @type {Object}
     *  @memberOf ConfiguradorAccesos
     * */
    this.permisos = undefined;
    /**
     * Objeto que contiene el registro de zz_Accesos que vamos a modificar
     * @type {Object}
     * @memberOf ConfiguradorAccesos
     * */
    this.permisos = undefined;
    /**
     * Control de accesos a datos para la tabla zz_Accesos
     * @private
     * @type {IpkRemoteDataSource}
     * @see IpkRemoteDataSource
     * @memberOf ConfiguradorAccesos
     * */
    this.accesosDS = {};
    /**
     * Id del intervalo que comprueba si ya se ha creado la Tabla para dibujar los permisos
     * @internal
     * @type {int}
     * @memberOf ConfiguradorAccesos
     * */
    this.interval = undefined;

    this.crearControl();

    return this;
};

/**
 * Carga el html del control
 *
 * @function
 * @private
 * @name        crearControl
 * @memberOf ConfiguradorAccesos
 *
 */
ConfiguradorAccesos.prototype.crearControl = function(){
    var self = this;
    this.html = $(this.propiedades.contenedor).load('../js/componentes/html/configuradorAccesos.html', function(){
        self.tablaAccesos = $('#tablaAccesos', self.html);
        self.vincularEventos();
        self.crearAccesosDS();
    });
};

/**
 * Crea los eventos del formulario
 *
 * @function
 * @private
 * @name        vincularEventos
 * @memberOf    ConfiguradorAccesos
 */
ConfiguradorAccesos.prototype.vincularEventos = function(){
    var self = this;
    $('input' , this.tablaAccesos).on('click' , function(){
        self.modificarPermisos(this);
    });
};

/**
 * Crea el componente de acceso a datos para zz_Accesos
 *
 * @function
 * @private
 * @name        crearAccesosDS
 * @memberOf    ConfiguradorAccesos
 */
ConfiguradorAccesos.prototype.crearAccesosDS = function(){
    this.accesosDS = new IpkRemoteDataSource({
        entidad : 'zz_Accesos',
        clave : 'IdAcceso'
    });

    this.accesosDS.onUpdate = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('UPDATE zz_Accesos', respuesta.datos);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};

/**
 * Estable la  propiedad acceso configuracion de los accesos a mostrar
 * @function
 * @public
 * @name        setAccesos
 * @param       {object} AccesoCfg - Objeto con los datos a mostrar
 * @param       {int} AccesoCfg.IdAccesso - Id del registro
 * @param       {object} AccesoCfg.Json - Configuracion Json con los permisos definidos
 * @memberOf    ConfiguradorAccesos
 */
ConfiguradorAccesos.prototype.setAccesos = function(AccesoCfg){
    this.acceso = AccesoCfg;
    this.acceso.Json = JSON.parse(AccesoCfg.Json);
    this.setPermisos(this.acceso.Json);
};

/**
 * Establece la propiedad <b>permisos</b> con el valor pasado por parámetro y crea un intervalo que espera a que <b>tablaAccesos</b> este creada para dibujar en ella los permisos
 *
 * @function
 * @public
 * @name        setPermisos
 * @param       {object} Permisos - Objeto con los permisos a dibujar
 * @memberOf    ConfiguradorAccesos
 */
ConfiguradorAccesos.prototype.setPermisos = function(Permisos){
    this.permisos = Permisos;
    this.interval = setInterval($.proxy(this.cargarPermisosEnTabla, this), 500);
};

/**
 * Comprueba si la tabla está creada, borra los datos si los tiene y dibuja los permisos de la propiedad <b>permisos</b>
 *
 * @function
 * @private
 * @name        cargarPermisosEnTabla
 * @memberOf    ConfiguradorAccesos
 */
ConfiguradorAccesos.prototype.cargarPermisosEnTabla = function(){
    if(this.tablaAccesos){
        this.limpiarPermisosEnTabla();

        var celdasCabeceras = $('th', this.tablaAccesos);
        var filasPermisos = $('tbody tr', this.tablaAccesos);

        var indiceCabecera = 0;
        var valoresPermisos = [];

        $.each(this.permisos, function (k,v){
            indiceCabecera = celdasCabeceras.index( $('#'+ k) ) - 1 ;
            valoresPermisos = v;

            $.each(valoresPermisos, function(k,v){
                filasPermisos.eq(k).find('td').eq(indiceCabecera).find('input').attr('checked', (v != 0) );
            });

        });

        if(this.interval)
        {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
};

/**
 * Pone todos los checkbox de la tabla a false
 *
 * @function
 * @private
 * @name        limpiarPermisosEnTabla
 * @memberOf    ConfiguradorAccesos
 */
ConfiguradorAccesos.prototype.limpiarPermisosEnTabla = function(){
    $('input' ,this.tablaAccesos).attr('checked', false);
};

/**
 * Cambia el valor del elemento pulsado en la coleccion de permisos actuales y lo guarda en la BD
 *
 * @function
 * @private
 * @name        modificarPermisos
 * @param       {jQuery} elementoPulsado Input pulsado en la tabla de permisos
 */
ConfiguradorAccesos.prototype.modificarPermisos = function(elementoPulsado){
    var filas = $('tr' ,this.tablaAccesos);
    var celdaPulsada = $(elementoPulsado).parent('td');
    var filaPulsada = celdaPulsada.parent('tr');
    var celdas = filaPulsada.children();

    var indexCelda = celdas.index(celdaPulsada);
    var indexFila  = filas.index(filaPulsada) - 1;

    var grupo = $('th', this.tablaAccesos).eq(indexCelda).attr('id');
    var valorNuevo = (($(elementoPulsado).attr('checked') == 'checked') ? 1 : 0);

    this.permisos[grupo][indexFila] = valorNuevo;

    this.acceso.Json = JSON.stringify(this.permisos);
    this.accesosDS.Update(this.acceso);
};



