/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13/06/12
 * Time: 17:04
 * To change this template use File | Settings | File Templates.
 */
var DataSource = function(data, options){

    this.entidad = options.entidad;
    this.campoId = options.campoId;

    // TODO: Pasar por parametro la clave del conjunto de datos
    if(data !== undefined) this.data = data;

    return this;
};

/*
 * FUNCIONES
 */
DataSource.prototype.setData = function(data){
    this.data = data;
    this.onDataChange(this.data);
};

DataSource.prototype.find = function(campo, valor){
    var selecccion;
    seleccion = _.find(this.data, function(registro){ return registro[campo] == valor});

    return seleccion;
};

DataSource.prototype.add = function(elemento, generarId){
    var self = this;

    if(generarId)
    {
        var nuevoId = 0;

        if(this.data.length > 0)
            nuevoId = parseInt(_.max(this.data , function(elemento){ return elemento[self.campoId]; })[self.campoId]) + 1;
        else
            nuevoId = 1;

        app.log.debug('campo max' , nuevoId);

        elemento[self.campoId] = nuevoId;
    }

    this.data.push(elemento);
    this.onDataChange(this.data);
};
DataSource.prototype.update = function(elemento){
    var self = this;
    var seleccion;
    seleccion = _.find(this.data, function(registro){ return registro[self.campoId] == elemento[self.campoId] });
    _.extend(seleccion, elemento);

    this.onDataChange(this.data);
};
DataSource.prototype.remove = function(valor){
    var self = this;

    this.data = _.reject(this.data, function(registro){ return registro[self.campoId] == valor});
    this.onDataChange(this.data);
};

/*
 * HANDLERS EVENTOS
 */
DataSource.prototype.onDataChange = function(datos){
    var eventArgs = {
        datos   : datos,
        entidad : this.entidad
    };

    app.eventos.publicar(DataSource.Eventos.OnDataChange, eventArgs, true);
};

DataSource.Eventos = {
    OnDataChange   : 'onDataChange'
};