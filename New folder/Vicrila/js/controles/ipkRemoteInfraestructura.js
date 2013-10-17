/**
 * Created by Maikel Merillas
 * User: mg01
 * Date: 17/09/12
 * Time: 10:17
 */

/**
 * Componente para encapsular las llamadas a los metodos del servicio web correspondientes con
 * la configuración del la aplicaión.
 *
 * @class       IpkInfraestructura
 * @name        IpkInfraestructura
 * @constructor
 *
 * @requires    IpkRemoteDataSource
 */
var IpkInfraestructura = function(){

    this.modelosDS = {};
    this.listadosDS = {};
    this.fichasDS = {};

    this.crearModelosDS();
    this.crearListadosDS();
    this.crearFichasDS();
};

/**
 * Funcion interna que crea el IpkRemoteDataSource para consultar zz_Modelos
 *
 * @function
 * @private
 * @memberOf    IpkInfraestructura
 * @name        crearModelosDS
 */
IpkInfraestructura.prototype.crearModelosDS = function(){
    var self = this;
    this.modelosDS = new IpkRemoteDataSource({
        entidad : 'zz_Modelos',
        clave : 'IdModelo'
    });

    this.modelosDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                //app.log.debug('GETMODELOBUSCAR', respuesta.datos);
                self.modelo = respuesta.datos[0];

               // app.log.debug('onGetModelo' , [this, self.modelo]);
                if(self['onGetModelo'])
                    self['onGetModelo'].apply(self, [self.modelo] );
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
/**
 * Ejecuta la busqueda del modelo por los parametros de busqueda indicados
 *
 * @function
 * @private
 * @memberOf    IpkInfraestructura
 * @name        getModeloBy
 * @param       {Object}   Filtro  Objeto clave/valor con las condiciones del filtro
 */
IpkInfraestructura.prototype.getModeloBy = function(Filtro){
    this.modelosDS.Buscar(Filtro , true, true);
};
/**
 * Obtiene a información del modelo indicado
 *
 * @function
 * @public
 * @memberOf    IpkInfraestructura
 * @name        getModeloById
 * @param       {int}   Id  Id del modelo que queremos recuperar la información
 */
IpkInfraestructura.prototype.getModeloById = function(Id){
    var where = {
        "IdModelo" : Id
    };

    this.getModeloBy(where);
};
/**
 * Obtiene a información del modelo indicado
 *
 * @function
 * @public
 * @memberOf    IpkInfraestructura
 * @name        getModeloByName
 * @param       {string}    Nombre  Nombre del modelo que queremos recuperar la información
 */
IpkInfraestructura.prototype.getModeloByName = function(Nombre){
    var where = {
        "Nombre" : "'" + Nombre + "'"
    };
    this.getModeloBy(where);
};

/**
 * Funcion interna que crea el IpkRemoteDataSource para consultar zz_Listados
 *
 * @function
 * @private
 * @memberOf    IpkInfraestructura
 * @name        crearListadosDS
 */
IpkInfraestructura.prototype.crearListadosDS = function(){
    var self = this;
    this.listadosDS = new IpkRemoteDataSource({
        entidad : 'zz_Listados',
        clave : 'IdListado'
    });

    this.listadosDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('GETLISTADOBUSCAR', respuesta.datos);
                self.listado = respuesta.datos[0];

                app.log.debug('onGetListado' , [this, self.listado]);
                if(self['onGetListado'])
                    self['onGetListado'].apply(self, [self.listado] );
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
/**
 * Ejecuta la busqueda del listado por los parametros de busqueda indicados
 *
 * @function
 * @public
 * @memberOf    IpkInfraestructura
 * @name        getListadoBy
 * @param       {Object}   Filtro  Objeto clave/valor con las condiciones del filtro
 */
IpkInfraestructura.prototype.getListadoBy = function(Filtro){
    this.listadosDS.Buscar(Filtro , true, true);
};
/**
 * Obtiene a información del listado indicado
 *
 * @function
 * @public
 * @memberOf    IpkInfraestructura
 * @name        getListadoById
 * @param       {int}   Id  Id del listado que queremos recuperar la información
 */
IpkInfraestructura.prototype.getListadoById = function(Id){
    var where = {
        "IdListado" : Id
    };

    this.getListadoBy(where);
};
/**
 * Obtiene a información del listado indicado
 *
 * @function
 * @public
 * @memberOf    IpkInfraestructura
 * @name        getListadoByName
 * @param       {string}    Nombre  Nombre del listado que queremos recuperar la información
 */
IpkInfraestructura.prototype.getListadoByName = function(Nombre){
    var where = {
        "Nombre" : "'" + Nombre + "'"
    };
    this.getListadoBy(where);
};

/**
 * Funcion interna que crea el IpkRemoteDataSource para consultar zz_Fichas
 *
 * @function
 * @private
 * @memberOf    IpkInfraestructura
 * @name        crearFichasDS
 */
IpkInfraestructura.prototype.crearFichasDS = function(){
    var self = this;
    this.fichasDS = new IpkRemoteDataSource({
        entidad : 'zz_Fichas',
        clave : 'IdFicha'
    });

    this.fichasDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('GETFICHABUSCAR', respuesta.datos);
                self.ficha = respuesta.datos[0];

                app.log.debug('onGetFicha' , [this, self.ficha]);
                if(self['onGetFicha'])
                    self['onGetFicha'].apply(self, [self.ficha] );
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
/**
 * Ejecuta la busqueda de la ficha por los parametros de busqueda indicados
 *
 * @function
 * @private
 * @memberOf    IpkInfraestructura
 * @name        getFichaBy
 * @param       {Object}   Filtro  Objeto clave/valor con las condiciones del filtro
 */
IpkInfraestructura.prototype.getFichaBy = function(Filtro){
    this.fichasDS.Buscar(Filtro , true, true);
};
/**
 * Ejecuta la busqueda de la ficha por los parametros de busqueda indicados
 *
 * @function
 * @public
 * @memberOf    IpkInfraestructura
 * @name        getFichaById
 * @param       {int}   Id  Id de la ficha que queremos recuperar la información
 */
IpkInfraestructura.prototype.getFichaById = function(Id){
    var where = {
        "IdFicha" : Id
    };

    this.getFichaBy(where);
};
/**
 * Obtiene a información de la ficha indicada
 *
 * @function
 * @public
 * @memberOf    getFichaByName
 * @name        getListadoByName
 * @param       {string}    Nombre  Nombre de la ficha  que queremos recuperar la información
 */
IpkInfraestructura.prototype.getFichaByName = function(Nombre){
    var where = {
        "Nombre" : "'" + Nombre + "'"
    };
    this.getFichaBy(where);
};

/**
 * Se lanza cuando se completa la busqueda de la información del modelo
 *
 * @event
 * @name        onGetModelo
 * @memberOf    IpkInfraestructura
 * @param       {Object}    Modelo  Informacion del modelo
 */
IpkInfraestructura.prototype.onGetModelo = function(Modelo){};
/**
 * Se lanza cuando se completa la busqueda de la información del listado
 *
 * @event
 * @name    onGetListado
 * @memberOf    IpkInfraestructura
 * @param   {Object}    Listado  Informacion del listado
 */
IpkInfraestructura.prototype.onGetListado = function(Listado){};
/**
 * Se lanza cuando se completa la busqueda de la información de la ficha
 *
 * @event
 * @name    onGetFicha
 * @memberOf    IpkInfraestructura
 * @param   {Object}    Ficha  Informacion de la ficha
 */
IpkInfraestructura.prototype.onGetFicha = function(Ficha){};

