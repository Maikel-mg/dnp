//TODO: En algun momento implementar una cache
var IpkRemoteDataSourceNavision = function(){
    this.defaults = {};
    /*
    * entidad : nombre de la entidad sobre la que vamos a trabajar
    * clave   : clave de la entidad sobre la que vamos a trabajar
    * */
    this.ultimaPeticion = '';
};

IpkRemoteDataSourceNavision.prototype.EjecutarFiltro = function(Pagina, Filtro, Tamanyo){
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

    this.ultimaPeticion = 'EjecutarFiltro';

    app.modelos.navision.EjecutarFiltro(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSourceNavision.prototype.Paginas = function(){
    var data = {};

    this.ultimaPeticion = 'Paginas';

    app.modelos.navision.Paginas(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};
IpkRemoteDataSourceNavision.prototype.Campos = function(Pagina){
    var data = {
        'Pagina' : Pagina
    };

    this.ultimaPeticion = 'Campos';

    app.modelos.navision.Campos(JSON.stringify(data))
        .done( $.proxy(this.onRemoteDone, this) )
        .fail( $.proxy(this.onRemoteError, this) );
};

IpkRemoteDataSourceNavision.prototype.onRemoteDone = function(){
    app.log.debug('onRemoteDone' , [this, arguments]);

    if(this['on'+ this.ultimaPeticion])
        this['on'+ this.ultimaPeticion].apply(this, [this.procesarRespuesta(arguments)] )
};
IpkRemoteDataSourceNavision.prototype.onRemoteError = function(){
    app.log.debug('onRemoteError' , [this, arguments]);
    alert("Error");
};

IpkRemoteDataSourceNavision.prototype.procesarRespuesta = function(respuesta){
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

