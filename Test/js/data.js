
/**
 * Comportamiento para proporcionar la capacidad de gestionar eventos
 * @type {Object}
 */
WhithEvents = {
    /**
     * Configura un evento para lanzarlo mas tarde
     *
     * @param {string}   event - Nombre del evento
     * @param {Function} callback - Funcion que se va a ejcutar cuando el evento sea lanzado
     * @param [{Object}]   context - Contexto en el que se ejecuta el evento
     */
    on : function(event, callback, context){
        this.publications = this.publications || [];

        if(this.publications[event])
            this.publications[event].push({'context' : context, 'callback' :  callback });
        else{
            this.publications[event] = [];
            this.publications[event].push({'context' : context, 'callback' :  callback });
        }
    },

    /**
     * Desactiva en e evento indicado
     *
     * @param {string} event - Nombre del evento que se quiere desactivar
     */
    off : function(event){
        if(this.publications[event])
            this.publications[event] = [];
    },

    /**
     * Lanza el evento indicado
     *
     * @param {string} event - Nombre del evento que se quiere lanzar
     * @param {Object} args  - Argumentos que se le van a pasar a la llamada del evento
     */
    trigger : function(event, args){
        if(this.publications &&  this.publications[event])
        {
            var evento = undefined;
            for(var i in this.publications[event])
            {
                evento = this.publications[event][i];
                evento.callback.apply(this, [args, evento.context]);
            }
        }
    },

    /**
     * Agrega los eventos a la instancia que lo llama
     *
     * @param {Array.<{Object<string, Function>}>} events - Evento que se quieren añadir a la instancia
     */
    addEvents : function(events){
        if(events)
        {
            for(var event in events)
            {
                this.on(event, _.bind(events[event], this),  this);
            }
        }
    }
};

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/**
 * Representa la estructura y el comportamiento de una entidad sobre la que trabajar
 * Los modelos contienen informacion de la entidad sus campos
 *
 * @class Model
 * @type {Model}
 */
Model = Class.extend({
    include: WhithEvents,
    /**
     * Constructor
     * @constructor
     * @this  {Model}
     * @param {Object} params Parametros de configuracion del registro
     */
    initialize : function(params, data){
        this.config = params;

        this.camposIniciales = {};
        this.campos = {};
        this.metodos = {};

        this.hasChanged = false;

        $.extend(this.camposIniciales, this.config.campos);
        $.extend(this.campos, this.config.campos);

        $.extend(this , this.config.metodos);
        /*
        if(data.metodos && data.metodos != "")
            $.extend(this , eval('( function(){ return ' + data.metodos + '  })()'));
          */
        if(this.config.eventos && typeof this.config.eventos == "string")
            this.config.eventos = this.config.eventos.trim();

        if(this.config.eventos !== "{}" && this.config.eventos !== "{ }")
            this.addEvents(this.config.eventos);


        //TODO : TEST check it out

        //this.instantiate();

        /*
        if(data)
            this.campos = $.extend({ id : guid()}, this.campos, data);
        else
            this.campos = $.extend({}, { id : guid()}, this.campos);
      */
        if(data)
            this.setData(data);

        this.trigger('initialized', this);

    },

    /**
     * Nombre de la clase
     *
     * @returns {string}
     */
    toString : function(){
        return "Clase ";
    },

    /**
     * Devuelve el valor de un campo, comprueba que ese campo no tenga una funcion asociada para devolver algo distinto onGet_XXXXXXX en cuyo caso ejecuta esta
     *
     * @function
     * @public
     *
     * @param   {String}    campo   Nombre del campo
     * @returns {*}
     */
    get : function(campo){
        var result = undefined;
        if(this['onGet_' + campo])
            result = this['onGet_' + campo]();
        else
            result = this.campos[campo];

        return result;
    },

    /**
     * Da valor a un campo del modelo
     *
     * @function
     * @public
     *
     * @throws changed
     * @throws Collection#dataChanged
     *
     * @param {String}  campo - Nombre del campo al que se le quiere dar valor
     * @param {*}       valor - Valor que se le va a asignar al campo
     * @returns {*}
     */
    set : function(campo , valor){
        var log = {
            'campo' : campo,
            'old'   : this.campos[campo],
            'nuevo' : valor
        };
        this.campos[campo] = valor;
        if(this.campos[campo] !== this.camposIniciales[campo])
        {
            this.hasChanged = true;
            this.trigger('changed', log, this);
            if(this.coleccion)
                this.coleccion.trigger('dataChanged', this , this.coleccion);
        }

        return this;
    },

    /**
     * Carga los datos en los campos del modelo
     *
     * @function
     * @public
     *
     * @throws setData
     *
     * @param {object} data - Datos a cargar en el modelo
     */
    setData : function(data){
        if(data)
        {
            this._loadData(data);

            this.trigger('changed', this);
            this.trigger('setData', this);
        }

        return this;
    },
    _loadData : function(data){
        var modeloInfo = this.config;
        if(data && !data.id)
            data.id = guid();

        var camposBasicos = _.filter(modeloInfo.configuracion.campos, function(registro){
            return registro.tipo != enums.TipoCampoModelo.Coleccion && registro.tipo != 'referencia' && registro.tipo != 'guid';
        });
        var colecciones = _.filter(modeloInfo.configuracion.campos, function(registro){
            return registro.tipo == enums.TipoCampoModelo.Coleccion;
        });
        var referencias = _.filter(modeloInfo.configuracion.campos, function(registro){
            return registro.tipo == 'referencia';
        });
        var guids = _.filter(modeloInfo.configuracion.campos, function(registro){
            return registro.tipo == 'guid';
        });

        var that = this;

        _.each(camposBasicos, function(campo){
            if(campo.tipo == enums.TipoCampoModelo.Boolean)
                that.campos[campo.nombre] = data[campo.nombre];
            else
            {
                if(data[campo.nombre])
                    that.campos[campo.nombre] = data[campo.nombre];
            }
        });
        _.each(colecciones, function(coleccion){

            //that.campos[coleccion.nombre] = CollectionStore.crear(coleccion.relacion.modelo, data[coleccion.nombre]);
            that.campos[coleccion.nombre] = Env.CollectionStore.crear(coleccion.idReferencia, data[coleccion.nombre]);
            that.campos[coleccion.nombre].on('dataChanged', function(){
                that.trigger('changed', this , that);
            });


        });
        _.each(referencias, function(refencia){
            that.campos[refencia.nombre] = Env.ModelStore.crear(refencia.relacion.modelo,  data[coleccion.nombre]);
            that.campos[refencia.nombre].on('changed', function(){
                that.trigger('changed', this , that);
            });
        });
        _.each(guids, function(coleccion){
            if(data[coleccion.nombre])
                that.campos[coleccion.nombre] = data[coleccion.nombre];
            else
                that.campos[coleccion.nombre] = guid();

        });
    },

    setFieldsData : function(data){
        if(data)
        {
            var modeloInfo = this.config;
            if(data && !data.id)
                data.id = guid();

            var camposBasicos = _.filter(modeloInfo.configuracion.campos, function(registro){
                return registro.tipo != enums.TipoCampoModelo.Coleccion && registro.tipo != 'referencia' && registro.tipo != 'guid';
            });
            var colecciones = _.filter(modeloInfo.configuracion.campos, function(registro){
                return registro.tipo == enums.TipoCampoModelo.Coleccion;
            });
            var referencias = _.filter(modeloInfo.configuracion.campos, function(registro){
                return registro.tipo == 'referencia';
            });
            var guids = _.filter(modeloInfo.configuracion.campos, function(registro){
                return registro.tipo == 'guid';
            });

            var that = this;

            _.each(camposBasicos, function(campo){
                if(data[campo.nombre])
                    that.campos[campo.nombre] = data[campo.nombre];

                if(data[campo.nombre])
                    that.fields[campo.nombre].set(  data[campo.nombre] );
            });
            _.each(colecciones, function(coleccion){

                //that.campos[coleccion.nombre] = CollectionStore.crear(coleccion.relacion.modelo, data[coleccion.nombre]);
                that.campos[coleccion.nombre] = Env.CollectionStore.crear(coleccion.idReferencia, data[coleccion.nombre]);
                that.campos[coleccion.nombre].on('dataChanged', function(){
                    that.trigger('changed', this , that);
                });

                var col =  Env.colecciones(coleccion.idReferencia, data[coleccion.nombre]);
                col.on('dataChanged', function(){
                    that.trigger('changed', this , that);
                });
                that.fields[coleccion.nombre].set(col);

            });
            _.each(referencias, function(refencia){
                that.campos[refencia.nombre] = Env.ModelStore.crear(refencia.relacion.modelo,  data[coleccion.nombre]);
                that.campos[refencia.nombre].on('changed', function(){
                    that.trigger('changed', this , that);
                });
            });
            _.each(guids, function(coleccion){
                if(data[coleccion.nombre])
                    that.campos[coleccion.nombre] = data[coleccion.nombre];
                else
                    that.campos[coleccion.nombre] = guid();

                if(data[coleccion.nombre])
                    that.fields[coleccion.nombre].set(  data[coleccion.nombre] );
                else
                    that.campos[coleccion.nombre].set( guid() );
            });

            this.trigger('changed', this);
            this.trigger('setData', this);

        }

        return this;
    },
    instantiate: function(){
        this.fields = {};
        var modeloInfo = this.config.configuracion;
        var tipo ="";
        var that = this;
        _.each(modeloInfo.campos , function(element){
            switch (element.tipo)
            {

                case 'string' :
                    tipo = "Texto";
                    break;
                case 'int' :
                    tipo = "Numerico";
                    break;
                default :
                    tipo = element.tipo.charAt(0).toUpperCase() + element.tipo.slice(1);

                    break;
            }
            console.log(tipo);
            that.fields[element.nombre] = new Types[tipo]();
        });


    },

    /**
     * Funcion abstracta a implementar por todos los modelos que tengan validacion
     *
     * @function
     * @public
     *
     * @returns {boolean} Indica si la validacion es correcto o no
     */
    validate : function(){
        return true;
    },

    /**
     * Indica si el model es un modelo nuevo, no una recuperacion de uno ya creado
     *
     * @function
     * @public
     *
     * @returns {boolean}
     */
    isNew : function(){
        return !(this.campos.id && this.campos.id > 0);
    },

    inicializar : function(campos){
        this.campos = campos;
        this.initializated(this);
        return this;
    },

    /**
     * Devuelve los campos del modelo un registro plano de formato JSON
     *
     * @funtion
     * @public
     *
     * @param   campos
     * @returns {Object}
     */
    to_JSON : function(campos){
        var serializado = {};

        _.each(this.campos , function(valor, nombre, registro){
            if(typeof valor === 'object'){
                if(valor.config)
                {
                    var p = valor;
                    if(p.registros && p.registros.length > 0)
                        serializado[nombre] = p.to_JSON();
                }

            }
            else{
                serializado[nombre] = valor;
            }
        });

        return serializado;
    },

    /**
     * Busca un modelo en el Store remoto si esta configurado
     *
     * @private
     *
     * @param campo
     * @param valor
     */
    find: function (campo , valor) {
        var ocurrencia = _.find(encuestasBD.IPK_Encuestas, function (e) { return e[campo] == valor; });
        if (ocurrencia)
        {
            this.setData(ocurrencia);
            var that = this;
            var colecciones = _.filter(ModelStore.enumerarCampos(this.config.configuracion.nombre), function (e) { return e.tipo == 'coleccion' });
            _.each(colecciones, function (e) {
                console.log(that.get(e.nombre));
                console.log(e);
            }); 
        }
        else
        {
            alert('No se ha encontrado el elemento especificado');
        }
    }
});

/**
 * Gestor de los modelos cargados en la aplicacion
 *
 * @class ModelManager
 * @mixin {WhithEvents}
 * @type {ModelManager}
 */
ModelManager = Class.extend({
    include: WhithEvents,

    /**
     * Constructor
     *
     * @constructor
     * @this  {Model}
     * @param {ModeloConfiguration} params Parametros de configuracion del registro
     */
    initialize : function(params){
        this.config = params;
        this.modelos = {};
        this.trigger('initialized', this);
    },

    /**
     * Devuelve el nombre del tipo la Clase
     *
     * @return {String}
     */
    toString : function(){
        return "ModelManager ";
    },

    /**
     * Carga los modelos que se encuentren en la coleccion que se le pasa por parametro
     *
     * @param {Array} contexto
     */
    load : function(contexto){
        for(var i in contexto)
        {
            this.importar(contexto[i]);
        }
    },

    /**
     * Carga el modelo que se le pasa por parametro
     *
     * @param {Object} informacionModelo Informacion del modelo que se le pasa por parametro
     */
    importar : function(informacionModelo){

        if(!this.modelos[informacionModelo.nombre]){
            var modelo = {};

            if(informacionModelo.metodos)
                informacionModelo.metodos  =  $.extend({} , eval('( function(){ return ' + informacionModelo.metodos + '  })()'));

            informacionModelo.eventos  = informacionModelo.eventos || {};

            _.each(informacionModelo.campos , function(campo){
                var valorDefecto = undefined;
                switch (campo.tipo)
                {
                    case "datetime":
                        valorDefecto = "";
                        break;
                    case "string":
                        valorDefecto = "";
                        break;
                    case "int":
                        valorDefecto = 0;
                        break;
                    case "guid":
                        valorDefecto = 0;
                        break;
                    case "boolean":
                        valorDefecto = false;
                        break;
                    case "coleccion":
                        valorDefecto = new Collection(campo.relacion);
                        valorDefecto = "";
                        break;
                    case "referencia":
                        valorDefecto = Env.ModelStore.crear(campo.relacion.modelo);
                        valorDefecto = "";
                        break;
            }

                modelo[campo.nombre] = valorDefecto;
            });

            var infoModelo = {
                configuracion : informacionModelo,
                esquema : modelo,
                campos : modelo,
                metodos : informacionModelo.metodos ||{},
                eventos: informacionModelo.eventos || {}
            };
            this.registrar(informacionModelo.nombre, infoModelo);

        }
    },

    importarFromUI : function(informacionModelo){},
    importarFromJSON : function(informacionModelo){
        if(!this.modelos[informacionModelo.nombre]){
            var modelo = {};

            informacionModelo.metodos  = informacionModelo.metodos || {};
            informacionModelo.eventos  = informacionModelo.eventos || {};

            _.each(informacionModelo.campos , function(campo){
                var valorDefecto = undefined;
                switch (campo.tipo)
                {
                    case "datetime":
                        valorDefecto = "";
                        break;
                    case "string":
                        valorDefecto = "";
                        break;
                    case "int":
                        valorDefecto = 0;
                        break;
                    case "guid":
                        valorDefecto = 0;
                        break;
                    case "boolean":
                        valorDefecto = false;
                        break;
                    case "coleccion":
                        valorDefecto = new Collection(campo.relacion);
                        valorDefecto = "";
                        break;
                    case "referencia":
                        valorDefecto = ModelStore.crear(campo.relacion.modelo);
                        valorDefecto = "";
                        break;
                }

                modelo[campo.nombre] = valorDefecto;
            });
            var infoModelo = {
                configuracion : informacionModelo,
                esquema : modelo,
                campos : modelo,
                metodos : informacionModelo.metodos ||{},
                eventos: informacionModelo.eventos || {}
            };
            this.registrar(informacionModelo.nombre, infoModelo);
            console.log('El modelo ' + informacionModelo.nombre + ' se ha cargado.');
        }

    },

    /**
     * Registra la informacion del modelo en la coleccion interna para crealo cuando se necesite
     *
     * @function
     * @private
     *
     * @param {String}   nombre     Nombre con el que se va a acceder mas tarde al modelo
     * @param {Object}   extension  Información para crear el modelo
     */
    registrar : function(nombre, extension){
        this.modelos[nombre] = extension;
    },

    /**
     * Crea una instancia del tipo de modelo que se le indica y con los datos que se le pasan por parametro
     *
     * @param {String} nombre - Nombre del modelo que se quiere instanciar
     * @param {Object} data   - Datos a cargar en la instancia del objecto
     * @returns {Model}
     */
    crear : function(nombre, data){
        var modeloInfo = this.buscarModelo(nombre);
        var modelo = new Model(modeloInfo, data);

        return modelo;
    },

    buscarModelo :  function (valor, campo){
        if(!campo)
            campo = 'nombre';

        return _.find(this.modelos, function(registro){
            return registro.configuracion[campo]== valor;
        });
    },

    /**
     * Devuelve los nombres de los modelos que estan cargados
     *
     * @function
     * @public
     *
     * @return {Array} Coleccion con los nombres de los modelos que estan cargados
     */
    enumerarModelos : function (){
        var resultado = [];
        _.each(this.modelos, function(modelo, nombre){

            resultado.push( { id: modelo.configuracion.id, nombre : nombre});
        });
        return resultado;
    } ,

    /**
     * Devuelve los campos de el modelo que se indica por parametro
     *
     * @function
     * @public
     *
     * @param  {String} modelo Nombre del modelo del cual queremos obtener los campos
     *
     * @return {Array}  Coleccion con los nombres de los modelos que estan cargados
     */
    enumerarCampos: function (modelo){
        return this.buscarModelo(modelo).configuracion.campos;
    },

    /**
     * Devuelve los metodos de el modelo que se indica por parametro
     *
     * @function
     * @public
     *
     * @param  {String} modelo Nombre del modelo del cual queremos obtener los metodos
     *
     * @return {Array}  Coleccion con los nombres de los metodos
     */
    enumerarMetodos : function (modelo){
        return this.buscarModelo(modelo).configuracion.metodos;
    },

    generateColumns: function (modelo) {
        var campos = this.enumerarCampos(modelo);
        var columnas = [];

        _.each(campos, function (campo) {
            columnas.push({
                propiedad: campo.nombre,
                nombre: campo.nombre,
                titulo: campo.nombre,
                tipoInterno: campo.tipoInterno || campo.tipo,
                esClave: campo.esClave,
                esBusquedaInterna: campo.esBusquedaInterna || false
            })
        });

        return columnas;
    }
});

/**
 * @class   ModelStore
 * @type    {ModelManager}
 *
 */
ModelStore = new ModelManager();

/**
 * Coleccion de modelos que proporciona funciones basicas de busqueda
 *
 * @class
 * @type {Collection}
 */
Collection = Class.extend({
    include: WhithEvents,
    /**
     * Constructor
     * @constructor
     * @this  {Collection}
     * @param {Object} params Parametros de configuracion del registro
     */
    initialize : function(params, data , modelStore){
        this.config = params;

        this.registros = [];
        this.hasChanged = false;
        this.dataHasChanged = function(){};
        this.modelStore = modelStore;

        if(data)
            this.setData(data);

        if(this.config && this.config.eventos)
            this.addEvents(this.config.eventos);

        this.trigger('initialized', this);
        return this;
    },
    toString : function(){
        return "Coleccion ";
    },

    /**
     * Crea una instancia del modelo para el que esta configurada la instancia de la coleccion, con los datos que se le pasen.
     *
     * @throws   dataChanged
     * @throws   Model#changed
     *
     * @param {Object} datos Datos de inicializacion de la instancia
     * @returns {Model}
     */
    crear : function(datos){
        var nuevo = undefined;

        if(this.config.modelo)
        {
            nuevo =  this.modelStore.crear(this.config.modelo, datos);
            nuevo.coleccion = this;
            var that = this;
            nuevo.on('changed', function(){
                that.trigger('dataChanged', nuevo , that);
            });
            this.registros.push(nuevo);
            this.trigger('inserted', nuevo , this);
            this.trigger('dataChanged', nuevo , this);
        }
        return nuevo;
    },

    fetch : function(){
        this.makeFetch();
    },
    query : function(params){
        this.makeQuery(params);
    },

    /**
     * Inserta el registro en la coleccion, si el parametro es un JSON se crea una instancia del modelo para el que esta configurada la coleccion
     *
     * @throws   dataChanged
     * @throws   Model#changed
     *
     * @param {Object|Model} datos - Registro a insertar en la coleccion
     * @returns {Collection}
     */
    insertar: function (datos) {
        if (datos.toString() == "Clase ")
        {
            nuevo = datos;
        }
        else if(this.config.modelo) {
            nuevo =  this.modelStore.crear(this.config.modelo, datos);
        }

        nuevo.coleccion = this;
        var that = this;
        nuevo.on('changed', function () {
            that.trigger('dataChanged', nuevo, that);
        });
        this.registros.push(nuevo);
        this.trigger('inserted', nuevo , this);
        this.trigger('dataChanged', nuevo, this);

        return this;
    },

    /**
     * Elimina el registro de la coleccion buscandolo por el filtro indicado
     *
     * @function
     * @public
     *
     * @param {string} campo - Nombre del campo por el que se va a realizar la busqueda
     * @param {*}      valor - Valor del campo por el que se va a realizar la busqueda
     *
     */
    eliminar : function(campo , valor){
        var posicion = this.buscarPosicion(campo, valor);
        var registroEliminado ;
        if(posicion !== -1)
        {
            registroEliminado = this.registros[posicion];

            delete this.registros[posicion];

            this.trigger('deleted', registroEliminado , this);
            this.trigger('dataChanged', {});
        }
    },

    /**
     * Elimina el registro de la coleccion buscandolo por el filtro indicado
     *
     * @function
     * @public
     *
     * @param {string} campo - Nombre del campo por el que se va a realizar la busqueda
     * @param {*}      valor - Valor del campo por el que se va a realizar la busqueda
     *
     */
    actualizar : function(campo , valor , datos){

        var registro = this.buscar(campo, valor);
        var nuevosDatos;

        if(registro)
        {
            nuevosDatos = $.extend({} , registro.to_JSON() , datos);
            registro.setData(nuevosDatos);

            this.trigger('updated', registro , this);
        }
    },

    /**
     * Busca la posicion del elemento dentro de la coleccion por el filtro indicado
     *
     * @name    buscarPosicion
     * @function
     * @public
     *
     * @param {string} campo - Nombre del campo por el que se va a realizar la busqueda
     * @param {*}      valor - Valor del campo por el que se va a realizar la busqueda
     * @returns {number} Devuelve el la posicion en base 0 del registro o -1 si no se encuentra
     */
    buscarPosicion : function(campo , valor){
        var posicion = 0 , encontrado = false;

        _.each(this.registros, function(r){
                if(r.get(campo) == valor)
                {
                    if(!encontrado)
                        encontrado = true;
                }
                else
                {
                    if(!encontrado)
                        posicion++;
                }

            }
        );

        return (encontrado)? posicion : -1;
    },

    /**
     * Devuelve el registro en la posicion indicada
     *
     * @param {number} posicion - Posicion del registro a recuperar
     * @returns {Model}
     */
    enPosicion : function(posicion){
        var resultado = undefined;
        if(posicion >= 0)
        {
            var cuenta = this.registros.length - 1;
            if(cuenta >= 0 && cuenta >= posicion)
                resultado = _.toArray(this.registros)[posicion];
        }
        else
        {
            alert('La posicion debe ser 0 o mayor.');
        }
        return resultado;
    },

    /**
     * Busca un registro en la coleccion que coincida con los parametros de busqueda
     *
     * @param {string} campo - Nombre del campo por el que se va a realizar la busqueda
     * @param {*}      valor - Valor del campo por el que se va a realizar la busqueda
     * @returns {Model}
     */
    buscar: function (campo , valor) {
        var ocurrencia = _.find(this.registros, function (e) { return e.get(campo) == valor; });
        if (ocurrencia)
        {
            console.log(ocurrencia);
        }
        else
        {
            alert('No se ha encontrado el elemento especificado');
        }

        return ocurrencia;
    },

    /**
     * Inicializa la coleccion con los regisrto que se le pasan por parametro
     *
     * @throws   dataChanged
     *
     * @param {Array.<Object>} data Datos a incluir en la coleccion
     */
    setData : function(data, silent){
        var that = this;

        if(data)
        {
            that.registros = [];

            if(this.config.modelo)
            {
                var nuevo;
                _.each(data, function(registro){
                    nuevo =  that.modelStore.crear(that.config.modelo, registro);

                    nuevo.coleccion = that;
                    nuevo.on('changed', function(){
                        that.trigger('dataChanged', nuevo , that);
                    });
                    that.registros.push(nuevo);
                });
            }
            else
                this.registros = data;

            if(!silent)
            {
                this.trigger('dataLoaded', data, this);
                this.trigger('dataChanged', data, this);
            }
        }
    },

    /**
     * Convierte la coleccion en un array de objetos JSON
     *
     * @returns {Array.<Object>}
     */
    to_JSON : function() {
        var serializado = [];

        if(this.registros.length > 0)
            _.each(this.registros, function(registro){
                serializado.push(registro.to_JSON());
            });

        return serializado;
    },

    /**
     * Ejecuta sobre los registros de la coleccion una funcion de la libreria Underscore.js
     * El primer parametro es el nombre de la funciones que se va a ejecutar
     * Los demas  parametros de la funcion son los mismo que los de la fucnion Undescore.js
     *
     * @returns {*}
     */
    operation : function(){
        var operacion = arguments[0];
        var newArguments = [].slice.call(arguments, 1, arguments.length);
        newArguments.unshift(this.registros);

        return _[operacion].apply(_, newArguments);
    },

    //TODO : Refactorizar esto sacandolo de la coleccion
    makePersistible : function(params){
        this.service = params.service;
        this.table = params.table;

        this.on('updated' , _.bind(this.makeUpdate, this));
        this.on('inserted', _.bind(this.makeInsert, this));
        this.on('deleted' , _.bind(this.makeDelete, this));
    },
    makeFetch : function(){
        var that = this;
        this.service.execute({operation: 'listado', params : { table: this.table}})
            .done(function(data){ that.trigger('post-fetch', data);});
    },
    makeQuery : function(params){
        var that = this;
        this.service.execute( { operation: 'buscar', params : { table : this.table, query : params.query, Referencias: params.referencias || false, Colecciones: params.colecciones || false}})
            .done(function(data){ that.trigger('post-query', data);});
    },
    makeInsert : function(registro){
        var that = this;
        this.service.execute( { operation: 'insert', params : { table: this.table, datos: registro.to_JSON()} } )
            .done(function(data){ that.trigger('post-inserted', data);});
    },
    makeUpdate : function(registro){
        var actualizacion =  registro.to_JSON();
        delete actualizacion.id;
        var that = this;

        this.service.execute( { operation: 'update', params : { table: this.table, clave : {Clave : 'id', Valor : registro.get('id')}, datos: actualizacion, grupo : '' } } )
            .done(function(data){ that.trigger('post-updated', data);});
    },
    makeDelete : function(registro){
        var that = this;
        this.service.execute( { operation: 'delete', params : { table:this.table, clave : 'id', valor: registro.get('id') } } )
            .done(function(data){ that.trigger('post-deleted', data);});
    }
});
CollectionManager = Class.extend({
    include: WhithEvents,
    /**
     * Constructor
     * @constructor
     *
     * @throws    initialized
     *
     *
     * @this  {CollectionManager}
     * @param {Object} params Parametros de configuración del registro
     */
    initialize : function(params){
        this.config = params;

        this.modelos = {};
        this.trigger('initialized', this);
    },

    /**
     * Devuelve el nombre de la clase
     *
     * @returns {string}
     */
    toString : function(){
        return "ColectionManager ";
    },

    /**
     * Crear una instancia de una Collection para el modelo indicado
     *
     * @param {string} nombre - Nombre del modelo para crear la Collection
     * @param {Array.<Object>} data - Datos con los que incializar la coleccion
     *
     * @returns {Collection}
     */
    crear : function(nombre, data){
        return new Collection( {modelo: nombre}, data ,this.config.modelStore);
    }
});

/**
 * @class CollectionStore
 * @type {CollectionManager}
 */
CollectionStore = new CollectionManager({modelStore:ModelStore});

Service = Class.extend({
    initialize : function(params){
        this.proxy = new  window["Proxy" + params.proxy](params);
    },
    execute  : function(command){
        return this.proxy[command.operation](command.params);
    }
});
ProxyLocalStorage = Class.extend({
    initialize : function(params){
        this.config = params;
        this.dbName = params.dbName;
        this.db = this.loadDatabase();
    },
    loadDatabase : function(){
        return JSON.parse(localStorage[this.dbName]);
    },
    getTable : function(params, shallow){
        var result = undefined;
        if(shallow)
            result = this.db[params.table];
        else
            result = JSON.parse(JSON.stringify(this.db[params.table]));

        return  result;
    },
    saveTable : function(params){
        console.log(this.db[params.table]);
        localStorage[this.dbName] = JSON.stringify(this.db);
    },
    query : function(params){
        var tabla = this.getTable(params);
        var results = [];

        if(!params.fields)
        {
            results = _.filter(tabla, function(row){
                return row[params.field] == params.value;
            });
        }
        else
        {
            results = _.findWhere(tabla, params.fields);
        }

        return  JSON.parse(JSON.stringify(results || []));
    },
    insert   : function(params){
        this.getTable(params, true).push(params.row);
        this.saveTable(params);

        return params.row;
    },
    update  : function(params){
        var registro , nuevosDatos;
        var tabla = this.getTable(params, true);
        var posicion = this._buscarPosicion(params);

        if(posicion !== -1)
        {
            registro = tabla[posicion];
            nuevosDatos = $.extend({} , registro, params.row);
            tabla[posicion] = nuevosDatos;

            this.saveTable(params);
        }

        return nuevosDatos;
    },
    delete   : function(params){
        var tabla = this.getTable(params , true);
        var posicion = this._buscarPosicion(params);

        if(posicion !== -1)
        {
            //delete tabla[posicion];
            tabla.splice(posicion, 1);
            this.saveTable(params);
        }
    }   ,
    _buscarPosicion : function(params){
        var posicion = 0 , encontrado = false;
        var tabla = this.getTable(params);

        _.each(tabla, function(r){
                if(r[params.field] == params.value)
                {
                    if(!encontrado)
                        encontrado = true;
                }
                else
                {
                    if(!encontrado)
                        posicion++;
                }
            }
        );

        return (encontrado) ? posicion : -1;
    }
});
ProxyWebService = Class.extend({
    initialize : function(params){
        this.config = params;
        this.url = params.url;
    },
    _ajaxConfig : function(){
        var that = this;
        return {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: this.url,
            data: '',
            dataType: 'json',
            beforeSend : function(jqXHR, settings){

                console.log('beforeSend');
                console.log(arguments);
                console.log('----------');

            },
            dataFilter: function(data, dataType){
                //console.log('dataFilter');
                //console.log(JSON.parse(data));
                //console.log(that._processData(JSON.parse(data)));
                //console.log(arguments);
                //console.log('----------');
                return JSON.stringify(that._processData(JSON.parse(data)));
            },
            /*
            success : function(data, textStatus, jqXHR) {

                console.log('success');
                console.log(arguments);
                console.log('----------');

            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log('error');
                console.log(arguments);
                console.log('----------');

            },
            */
            complete : function (jqXHR, textStatus, errorThrown) {
                /*
                console.log('complete');
                console.log(arguments);
                console.log('----------');
                */
            }
        }
    },
    _processData : function(data, textStatus, jqXHR){
        //console.log('success'); console.log(arguments);

        var respuestaJSON = JSON.parse(data.d);

        var resultado = {};
        resultado.estado = respuestaJSON["Estado"];
        //resultado.entidad = respuesta.entidad;
        resultado.tieneDatos = false;
        resultado.mensaje = '';


        if(resultado.estado === 'OK')
        {
            if(respuestaJSON["Datos"].length > 0)
            {
                resultado.datos = JSON.parse(respuestaJSON["Datos"]);
                if(resultado.datos.length > 0)
                    resultado.tieneDatos = true;
                else
                    resultado.tieneDatos = false;
            }
            else
            {
                resultado.tieneDatos = false;
                resultado.datos = "";
            }
            resultado.mensaje = respuestaJSON["Mensaje"];
        }
        else if( resultado.estado === 'Empty')
        {
            resultado.mensaje = 'No se han obtenido resultados para la contulta';
        }
        else if( resultado.estado === 'Error')
        {
            resultado.mensaje = 'Ha ocurrido un error: \n ' + respuestaJSON["Mensaje"];
            resultado.llamada = arguments;
            alert(resultado.mensaje);
        }

        //console.log('success -- POST PROCESADO');        console.log(resultado);         console.log('----------');
        return resultado;
    },
    listado : function(params){
        var ajaxParams = {
            Operacion : {
                operation : 'Listado',
                params : {
                    table: params.table
                }
            }
        };

        var options = $.extend(this._ajaxConfig(), {
            data: JSON.stringify(ajaxParams)
        });

        return $.ajax(options);
    },
    insert : function(params){
        var ajaxParams = {
            Operacion : {
                operation : 'Insert',
                params : {
                    table: params.table,
                    datos : params.datos
                }
            }
        };

        var options = $.extend(this._ajaxConfig(), {
            data: JSON.stringify(ajaxParams)
        });

        return $.ajax(options);
    },
    update : function(params){
        var ajaxParams = {
            Operacion : {
                operation : 'Update',
                params : {
                    table: params.table,
                    clave : params.clave,
                    datos :params.datos,
                    grupo: ''
                }
            }
        };

        var options = $.extend(this._ajaxConfig(), {
            data: JSON.stringify(ajaxParams)
        });

        return $.ajax(options);
    },
    delete   : function(params){
        var ajaxParams = {
            Operacion : {
                operation : 'Delete',
                params : params
            }
        };

        var options = $.extend(this._ajaxConfig(), {
            data: JSON.stringify(ajaxParams)
        });

        return $.ajax(options);
    },
    buscar : function(params){
        var ajaxParams = {
            Operacion : {
                operation : 'Buscar',
                params : params
            }
        };

        var options = $.extend(this._ajaxConfig(), {
            data: JSON.stringify(ajaxParams)
        });

        return $.ajax(options);
    }
});

var Application = Class.extend({
    initialize : function(){
        this.createVariables();
        this.loadBBDD();
        this.loadModels();

    },
    createVariables : function(){
        this.ModelStore =    new ModelManager();
        this.CollectionStore =  new CollectionManager({modelStore : this.ModelStore});

        this.Service_WS = new Service({
            proxy: 'WebService',
            url : 'http://localhost:8080/Servicio.asmx/Execute'
        });
        this.Service = new Service({
            proxy: 'LocalStorage',
            dbName : AppConfig.dataBD
        });
        this.Service_ADM = new Service({
            proxy: 'LocalStorage',
            dbName : AppConfig.adminBD
        });
        this.Service_BASE = new Service({
            proxy: 'LocalStorage',
            dbName : AppConfig.baseBD
        });
    },
    loadBBDD : function(){
        if(!localStorage[AppConfig.adminBD])
            location = 'error.html';

        /*
        if(localStorage[AppConfig.adminBD])
        {
            this.adminBBDD = JSON.parse(localStorage[AppConfig.adminBD]);
            this.dataBBDD =  JSON.parse(localStorage[AppConfig.dataBD]);
        }
        */
    },
    createBackup : function(){
        var d = new Date();
        var identificador = d.getMonth() + 1 + '' + d.getDate() + '' + d.getFullYear() + '_' + d.getHours() + '' + d.getMinutes() + '' + d.getSeconds();

        var  backupsBBDDs = {};
        var backup = {};

        backup.admin = this.adminBBDD;
        backup.data = this.dataBBDD;

        if(localStorage[AppConfig.backupsBD])
            backupsBBDDs =  JSON.parse(localStorage[AppConfig.backupsBD]);
        else
            backupsBBDDs = {};

        backupsBBDDs[identificador] = backup;
        localStorage[AppConfig.backupsBD] = JSON.stringify(backupsBBDDs);

    },
    loadModels : function(){
        var that = this;
        var listadoModelos_ADM = this.Service_ADM.execute({
                operation : 'getTable',
                params : {
                    table : 'modelos'
                }
            });

        _.each(listadoModelos_ADM, function(modelo){
            modelo.campos = that.Service_ADM.execute({
                operation : 'query',
                params : {
                    table : 'campos_modelo',
                    field : 'idModelo',
                    value : modelo.id
                }
            });
        });
        this.ModelStore.load(listadoModelos_ADM);

        var listadoModelos_BASE = this.Service_BASE.execute({
                operation : 'getTable',
                params : {
                    table : 'modelos'
                }
            });
        _.each(listadoModelos_BASE, function(modelo){
            modelo.campos = that.Service_BASE.execute({
                operation : 'query',
                params : {
                    table : 'campos_modelo',
                    field : 'idModelo',
                    value : modelo.id
                }
            });
        });
        this.ModelStore.load(listadoModelos_BASE);
    },
    modelos : function(nombre, datos){
        return this.ModelStore.crear(nombre, datos);
    },
    colecciones : function(nombre, datos){
        return this.CollectionStore.crear(nombre, datos);
    },
    presentaciones : function(clave, base){
        var presentacion = undefined;
        var service = (base) ? this.Service_BASE : this.Service_ADM;

        presentacion = service.execute({
                operation : 'query',
                params : {
                    table : 'presentaciones',
                    field : 'clave',
                    value : clave
                }
            });
        presentacion = presentacion[0];
        presentacion.campos = service.execute({
                operation : 'query',
                params : {
                    table : 'campos_presentacion',
                    field : 'idPresentacion',
                    value : presentacion.id
                }
            });

        return presentacion;
    }
});
var Env = new Application();

Types = {};
Types.Base = Class.extend({
    include: WhithEvents,
    initialize: function(){
        this.valor = undefined;
    },
    get: function(){
        return this.valor;
    },
    set: function(valor){
        if(this.validate())
            this.valor = valor;
    },
    validate : function(){
        return true;
    }
});
Types.Guid = Class.extend(Types.Base , {
    initialize: function(config){
        this.parent(config);
        this.valor = undefined;
    },
    get: function(){
        return this.valor;
    },
    set: function(valor){
        if(this.validate(valor))
            this.valor = valor;
        else
            throw  new Error('No se puede asignar el valor a un campo guid.');
    },
    validate : function(valor){
        var resultado = false;
        var valorAComprobar = (valor) ? valor : this.valor;

        return _.isString(valorAComprobar);
    }
});
// TODO: Diferenciar entre int float
Types.Numerico = Class.extend(Types.Base , {
    initialize: function(config){
        this.parent(config);
        this.valor = 0;
    },
    get: function(){
        return this.valor;
    },
    set: function(valor){
        var fmtValue = valor;

        if(!Utils.isNull(valor) && !Utils.isUndefined(valor) && Utils.isString(valor))
            fmtValue = Utils.parseToFloat(valor);

        if(this.validate(fmtValue))
            this.valor = fmtValue;
        else
            throw  new Error('No se puede asignar el valor a un campo número.');
    },
    validate : function(valor){
        var resultado = false;
        var valorAComprobar = (valor) ? valor : this.valor;

        return Validator.number(valorAComprobar);
    }
});
Types.Texto = Class.extend(Types.Base , {
    initialize: function(config){
        this.defaults = {
            defaultValue : "",
            required : false
        };
        this.parent(config);

        this.config = $.extend({}, this.defaults, config);
        this.valor = this.config.defaultValue;
    },
    get: function(){
        return this.valor;
    },
    set: function(valor){
        if(this.validate(valor))
            this.valor = valor;
        else
            throw  new Error('No se puede asignar el valor a un campo texto.');
    },
    validate : function(valor){
        var resultado = false;
        var valorAComprobar = (valor) ? valor : this.valor;

        return _.isString(valorAComprobar);
    }
});
Types.Boolean = Class.extend(Types.Base , {
    initialize: function(config){
        this.parent(config);
        this.valor = false;
    },
    get: function(){
        return this.valor;
    },
    set: function(valor){
        if(this.validate(valor))
            this.valor = valor;
        else
            throw  new Error('No se puede asignar el valor a un campo boolean.');
    },
    validate : function(valor){
        var resultado = false;

        var valorAComprobar = (valor) ? valor : this.valor;

        return _.isBoolean(valorAComprobar);
    }
});
Types.DateTime= Class.extend(Types.Base , {
    initialize: function(config){
        this.parent(config);
        this.valor = "";
    },
    get: function(){
        return this.valor;
    },
    set: function(valor){
        if(this.validate(valor))
            this.valor = valor;
        else
        {
            console.log()
            throw  new Error('No se puede asignar el valor a un campo DateTime.');
        }

    },
    validate : function(valor){
        var resultado = false;

        var valorAComprobar = (valor) ? valor : this.valor;

        return _.isDate(valorAComprobar);
    }
});
Types.Coleccion = Class.extend(Types.Base , {
    initialize: function(config){
        this.parent(config);
        this.valor = "";
    },
    get: function(){
        return this.valor;
    },
    set: function(valor){
        if(this.validate(valor))
            this.valor = valor;
        else
            throw  new Error('No se puede asignar el valor a un campo DateTime.');
    },
    validate : function(valor){
        var resultado = false;

        var valorAComprobar = (valor) ? valor : this.valor;

        return _.isObject(valorAComprobar);
    }
});
Types.Referencia = Class.extend(Types.Base , {
    initialize: function(config){
        this.parent(config);
        this.valor = "";
    },
    get: function(){
        return this.valor;
    },
    set: function(valor){
        if(this.validate(valor))
            this.valor = valor;
        else
            throw  new Error('No se puede asignar el valor a un campo DateTime.');
    },
    validate : function(valor){
        var resultado = false;

        var valorAComprobar = (valor) ? valor : this.valor;

        return _.isDate(valorAComprobar);
    }
});

MiModelo = Class.extend({
    initialize: function(){
        this._guid = new Types.Guid();
        this._numero = new Types.Numerico();
        this._string = new Types.Texto();
        this._bool = new Types.Boolean();
        this._dateTime = new Types.DateTime();
    }
});

var _admin = {
    modelos : [],
    campos_modelo : [],
    presentaciones : [],
    campos_presentacion : [],
    vista_presentacion : [],
    campos_vista_presentacion : [],
    roles : [],
    accesos : [],
    usuarios : [],
    fases : []
};

var _Validator = Class.extend({
    initialize: function(){},
    /**
     * Comprobación de que el tipo es un string
     *
     * @param v {Object}  Valor a comprobar si es un string
     * @returns {boolean} Resultado de la validación
     */
    string : function(v) {
        if (v == null) return true;
            return (typeof v === "string");
    },
    /**
     *
     * @param v {Object}    Valor a comprobar si es un string
     * @param ctx {Object}
     * @param ctx.allowEmptyStrings {Boolean} Flag que indica si se permiten cadenas vacias
     * @returns {boolean} Resultado de la validación
     */
    required  :function (v, ctx) {
        if (typeof v === "string") {
            if (ctx && ctx.allowEmptyStrings) return true;
            return v.length > 0;
        } else {
            return v != null;
        }
    },
    /**
     *
     * @param v {Object}    Valor a comprobar si es un número
     * @param ctx {Object}
     * @param ctx.allowString {Boolean} Flag que indica si se permiten cadenas
     * @returns {boolean} Resultado de la validación
     */
    number : function (v, ctx) {
        if (v == null) return true;
        if (typeof v === "string" && ctx && ctx.allowString) {
            v = parseInt(v, 10);
        }
        return (typeof v === "number" && !isNaN(v));
    },
    /**
     *
     * @param v {Object}    Valor a comprobar si es un boolean
     * @returns {boolean} Resultado de la validación
     */
    bool : function (v) {
        if (v == null) return true;
        return (v === true) || (v === false);
    },
    /**
     *
     * @param v {Object}    Valor a comprobar si es un entero
     * @param ctx {Object}
     * @param ctx.allowString {Boolean} Flag que indica si se permiten cadenas
     * @returns {boolean} Resultado de la validación
     */
    integer : function (v, ctx) {
        if (v == null) return true;
        if (typeof v === "string" && ctx && ctx.allowString) {
            v = parseInt(v, 10);
        }
        return (typeof v === "number") && (!isNaN(v)) && Math.floor(v) === v;
    },
    /**
     *
     * @param v {Object}    Valor a comprobar si una cadena tiene el tamañao adecuado
     * @param ctx {Object}
     * @param ctx.minLength {int} Número minimo de caracteres
     * @param ctx.maxLength {int} Número maximo de caracteres
     * @returns {boolean} Resultado de la validación
     */
    stringLength : function (v, ctx) {
        if (v == null) return true;
        if (typeof (v) !== "string") return false;
        if (ctx.minLength != null && v.length < ctx.minLength) return false;
        if (ctx.maxLength != null && v.length > ctx.maxLength) return false;

        return true;
    }
});
var _Converters = Class.extend({
    initialize: function(){}
});
var Validator = new _Validator();
var Utils = {
    getType : function(o){
        if (o === null) {
            return "null";
        }
        if (o === undefined) {
            return "undefined";
        }
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    },
    isString : function(o) {
        return Utils.getType(o) === "string";
    },
    isDate : function(o) {
        return Utils.getType(o) === "date" && !isNaN(o.getTime());
    },
    isFunction: function(o) {
        return Utils.getType(o) === "function";
    },
    isGuid : function(value) {
        return Utils.getType(value) && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/.test(value);
    },
    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isNull: function(n) {
        return n == null;
    },
    isUndefined: function(n) {
        return n == undefined;
    },

    stringStartsWith: function(str, substr) {
        if ((!str) || !prefix) return false;
        return str.indexOf(prefix, 0) === 0;
    },
    stringConstains: function(str, substr) {
        if ((!str) || !substr) return false;
        return str.indexOf(substr) !== -1;
    },
    stringEndsWith : function(str, suffix) {
        if ((!str) || !suffix) return false;
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },
    stringFormat: function(str) {
        var args = arguments;
        var pattern = RegExp("%([1-" + (arguments.length - 1) + "])", "g");
        return str.replace(pattern, function (match, index) {
            return args[index];
        });
    },
    stringPaddingLeft: function(str, char, num){
        var mask = "";
        while(num > 0)
        {
            mask += char;
            num--;
        }

        return String(mask + str).slice(-mask.length);
    },
    stringPaddingRight: function(str, char, num){
        var mask = "";
        while(num > 0)
        {
            mask += char;
            num--;
        }


        return String(str + mask ).slice(0,mask.length);
    },

    parseToString : function(value){
        return (value == null) ? value : value.toString();
    },
    parseToInt : function(value){
        var type = Utils.getType(value);
        if (type=== "string") {
            var src = value.trim();
            if (src === "") return null;

            var val = parseInt(src, 10);
            return isNaN(val) ? value : val;
        } else if (type === "number") {
            return Math.round(value);
        }
        return value;
    },
    parseToFloat : function(value){
        var type = Utils.getType(value);

        if (type === "string") {
            var src = value.trim();
            if (src === "") return null;
            var val = parseFloat(src);
            return isNaN(val) ? value : val;
        }
        return value;
    },
    parseToDate : function(value){
        var type = Utils.getType(value);
        var val;

        if (type === "string") {
            var src = value.trim();
            if (src === "")
                return null;

            val = new Date(Date.parse(src));
            return Utils.isDate(val) ? val : value;
        } else if (type === "number") {
            val = new Date(value);
            return Utils.isDate(val) ? val : value;
        }
        return source;
    },
    parseToBool : function(value){
        var type = Utils.getType(value);

        if (type === "string") {
            var src = value.trim().toLowerCase();
            if (src === "false" || src ==="") {
                return false;
            } else if (src === "true") {
                return true;
            } else {
                return value;
            }
        }
        return value;
    },

    formatString : function (value) {
        return Utils.isNull(value) ? null : "'" + value + "'";
    },
    formatInt : function (value) {
        return Utils.isNull(value) ? null : ((Utils.getType(value) === "string") ? Utils.parseToInt(value) : value);
    },
    formatFloat : function (value) {
        return Utils.isNull(value) ? null : ((Utils.getType(value) === "string") ? Utils.parseToFloat(value) : value);
    },
    formatBool : function (value) {
        return Utils.isNull(value) ? null : ((Utils.getType(value) === "string") ? Utils.parseToBool(value) : value);
    },
    formatDate: function (value) {
        return Utils.formatString(value);
    }

    //Utils.stringPaddingLeft('1.000.000', '0', 0) + "," + Utils.stringPaddingLeft('500', '0', 3) + " €"
};
