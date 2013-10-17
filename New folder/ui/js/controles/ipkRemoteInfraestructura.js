/**
 * Created by Maikel Merillas
 * User: mg01
 * Date: 17/09/12
 * Time: 10:17
 *
 * Componente para encapsular las llamadas a los metodos del servicio web correspondientes con
 * la configuración del la aplicaión.
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
 *  MODELOS
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
                app.log.debug('GETMODELOBUSCAR', respuesta.datos);
                self.modelo = respuesta.datos[0];

                app.log.debug('onGetModelo' , [this, self.modelo]);
                if(self['onGetModelo'])
                    self['onGetModelo'].apply(self, [self.modelo] );
            }
        }
        else
            alert(respuesta.mensaje);
    };
};

IpkInfraestructura.prototype.getModeloBy = function(Filtro){
    this.modelosDS.Buscar(Filtro , true, true);
};
IpkInfraestructura.prototype.getModeloById = function(IdModelo){
    var where = {
        "IdModelo" : IdModelo
    };

    this.getModeloBy(where);
    //this.modelosDS.Buscar(where , true, true);
};
IpkInfraestructura.prototype.getModeloByName = function(Nombre){
    var where = {
        "Nombre" : "'" + Nombre + "'"
    };
    this.getModeloBy(where);
    //this.modelosDS.Buscar(where , true, true);
};

/**
 * LISTADOS
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

IpkInfraestructura.prototype.getListadoBy = function(Filtro){
    this.listadosDS.Buscar(Filtro , true, true);
};
IpkInfraestructura.prototype.getListadoById = function(IdListado){
    var where = {
        "IdListado" : IdListado
    };

    this.getListadoBy(where);
};
IpkInfraestructura.prototype.getListadoByName = function(Nombre){
    var where = {
        "Nombre" : "'" + Nombre + "'"
    };
    this.getListadoBy(where);
};

/**
 * FICHAS
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
IpkInfraestructura.prototype.getFichaBy = function(Filtro){
    this.fichasDS.Buscar(Filtro , true, true);
};
IpkInfraestructura.prototype.getFichaById = function(IdFicha){
    var where = {
        "IdFicha" : IdFicha
    };

    this.getFichaBy(where);
};
IpkInfraestructura.prototype.getFichaByName = function(Nombre){
    var where = {
        "Nombre" : "'" + Nombre + "'"
    };
    this.getFichaBy(where);
};

