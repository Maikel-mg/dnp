//TODO: En algun momento implementar una cache

/**
 *
 *
 * @version     1.0
 * @class       IpkRemoteDataSource
 * @name        IpkRemoteDataSource
 * @param       {Object} configuracion          Objeto con las opciones del Componente
 * @param       {String} configuracion.entidad  Nombre de la entidad sobre la que vamos a trabajar
 * @param       {String} configuracion.clave    Clave de la entidad sobre la que vamos a trabajar
 */
var IpkRemoteDataSource = function(configuracion){
    /**
     *  Valores por defecto del control
     * @type {Object}
     * @memberOf IpkRemoteDataSource
     */
    this.defaults = {};
    /**
    * Propiedades configurables de la aplicación
    *
    * @type {Object}
    * @memberOf IpkRemoteDataSource
    * */
    this.propiedades = $.extend(this.defaults, configuracion);
    /**
     * Nombre de la ultima operación realizada
     * @type {string}
     * @memberOf IpkRemoteDataSource
     */
    this.ultimaPeticion = '';
};

/**
 * Cambia la entidad sobre la que trabja el DataSource una vez creado
 *
 * @function
 * @public
 * @name CambiarEntidad
 * @memberOf IpkRemoteDataSource
 * @param {String} Entidad  Nombre de la entidad sobre la que vamos a trabajar
 * @param {String} Clave    Clave de la entidad sobre la que vamos a trabajar
 */
IpkRemoteDataSource.prototype.CambiarEntidad = function(Entidad, Clave){
    this.propiedades.entidad = Entidad;
    this.propiedades.clave = Clave;
};

IpkRemoteDataSource.prototype.Listado = function(){
    var data = {
        Entidad : this.propiedades.entidad
    };

    this.ultimaPeticion = 'Listado';

    app.modelos.generales.Listado(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.GetById = function(Id){
    var data = {
        Entidad : this.propiedades.entidad,
        Clave   : this.propiedades.clave,
        Valor   : Id
    };

    this.ultimaPeticion = 'GetById';

    app.modelos.generales.GetById(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Buscar  = function(Where, Referencias, Colecciones){
    var data = {
        Entidad     : this.propiedades.entidad,
        Where       : Where,
        Referencias : Referencias,
        Colecciones : Colecciones

    };

    this.ultimaPeticion = 'Buscar';

    app.modelos.generales.Buscar(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Filtrar = function(Where){
    var data = {
        Entidad     : this.propiedades.entidad,
        Where       : Where
    };

    this.ultimaPeticion = 'Filtrar';

    app.modelos.generales.Filtrar(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Update  = function(Datos){
    var clave =  {
        Clave: this.propiedades.clave,
        Valor: Datos[this.propiedades.clave]
    };

    var data = {
        Entidad     : this.propiedades.entidad,
        Clave       : clave,
        Datos       : Datos,
        Grupo       : app.seguridad.grupoActual
    };

    this.ultimaPeticion = 'Update';

    app.modelos.generales.Update(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Insert  = function(Datos){
    var data = {
        Entidad     : this.propiedades.entidad,
        Datos       : Datos
    };

    this.ultimaPeticion = 'Insert';

    app.modelos.generales.Insert(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.InsertHijo  = function(Datos, DatosPadre){
    var data = {
        Entidad     : this.propiedades.entidad,
        Datos       : Datos,
        DatosPadre  : DatosPadre
    };

    this.ultimaPeticion = 'InsertHijo';

    app.modelos.generales.InsertHijo(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Delete = function(Id){
    var data = {
        Entidad : this.propiedades.entidad,
        Clave   : this.propiedades.clave,
        Valor   : Id
    };

    this.ultimaPeticion = 'Delete';

    app.modelos.generales.Delete(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Copiar  = function(Id, Datos){
    var data = {
        Entidad     : this.propiedades.entidad,
        Clave       : this.propiedades.clave,
        Valor       : Id,
        Datos       : Datos
    };

    this.ultimaPeticion = 'Copiar';

    app.modelos.generales.Copiar(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.CrearRelacion = function(Datos1, Datos2){
    var data = {
        Datos1 : Datos1,
        Datos2 : Datos2
    } ;

    this.ultimaPeticion = 'CrearRelacion';

    app.modelos.generales.CrearRelacion(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.BorrarRelacion = function(Datos1, Datos2){
    var data = {
        Datos1 : Datos1,
        Datos2 : Datos2
    } ;

    this.ultimaPeticion = 'BorrarRelacion';

    app.modelos.generales.BorrarRelacion(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Estructura = function(){
    var data = {
        Entidad     : this.propiedades.entidad
    };

    this.ultimaPeticion = 'Estructura';

    app.modelos.generales.Estructura(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Navision = function(Pagina, Filtro, Tamanyo){
    var dataF = {
        Pagina          : 'ItemValues',
        Filtro          : {
            'Tipo_tabla' : '27'
        },
        TamanyoPagina   : 0

    };

    var data = {
        Pagina          : Pagina,
        Filtro          : Filtro,
        TamanyoPagina   : Tamanyo

    };

    this.ultimaPeticion = 'Navision';

    app.modelos.navision.EjecutarFiltro(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Paginas = function(){
    var data = {};

    this.ultimaPeticion = 'Paginas';

    app.modelos.navision.Paginas(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.Campos = function(Pagina){
    var data = {
        'Pagina' : Pagina
    };

    this.ultimaPeticion = 'Campos';

    app.modelos.navision.Campos(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSource.prototype.ValidarSeccion = function(Id, Grupo){
    var clave =  {
        Clave: this.propiedades.clave,
        Valor: Id
    };

    var data = {
        Entidad : this.propiedades.entidad,
        Clave   : clave,
        Grupo   : Grupo
    };

    this.ultimaPeticion = 'ValidarSeccion';

    app.modelos.ValidarSeccion(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};

IpkRemoteDataSource.prototype.onRemoteDone = function(){
    app.log.debug('onRemoteDone' , [this, arguments]);

    if(this['on'+ this.ultimaPeticion])
        this['on'+ this.ultimaPeticion].apply(this, [this.procesarRespuesta(arguments)] )
};
IpkRemoteDataSource.prototype.onRemoteError = function(){
    app.log.debug('onRemoteError' , [this, arguments]);
    alert("Error");
};

IpkRemoteDataSource.prototype.procesarRespuesta = function(respuesta){
    var respuestaJSON = JSON.parse(respuesta[0].d);

    var resultado = {};
    resultado.estado = respuestaJSON["Estado"];
    resultado.entidad = respuesta.entidad;
    resultado.tieneDatos = false;
    resultado.mensaje = '';


    if(resultado.estado === 'OK')
    {
        resultado.tieneDatos = true;
        resultado.datos = JSON.parse(respuestaJSON["Datos"]);
        resultado.mensaje = respuestaJSON["Mensaje"];
    }
    else if( resultado.estado === 'Empty')
    {
        resultado.mensaje = 'No se han obtenido resultados para la contulta';
    }
    else if( resultado.estado === 'Error')
    {
        resultado.mensaje = 'Ha ocurrido un error: \n ' + respuestaJSON["Mensaje"];
        alert(resultado.mensaje);
    }

    return resultado;
};

