/**
 * Control ficha que genera un formulario para la entidad
 *
 * @class   IpkRemoteFicha
 * @name    IpkRemoteFicha
 * @constructor
 *
 * @param   {Object}    Configuracion   Configuracion de la ficha
 * @param   {Object}    Configuracion.contenedor    Identificador del elemento donde se va a crear el control
 * @param   {Object}    Configuracion.nombre    Nombre que se le asigna al contol
 * @param   {Object}    Configuracion.modo      Modo en el que se habre por defecto la ficha
 *
 * @see IpkFicha#Modos
 */
var IpkRemoteFicha = function(Configuracion){
    /**
     * Valores por defecto del contol
     * @type    {Object}
     * @memberOf    IpkRemoteFicha
     */
    this.defaults = {};
    /**
     * Propiedades configurables del control
     * @type    {Object}
     * @memberOf    IpkRemoteFicha
     */
    this.propiedades = $.extend(this.defaults , Configuracion);

    /**
     * Control de acceso a datos para la entidad de la ficha
     * @type    {IpkRemoteDataSource}
     * @memberOf    IpkRemoteFicha
     */
    this.genericoDS = {};

    /**
     * Informacion del modelo al que pertenece la ficha
     * @type    {Object}
     * @memberOf    IpkRemoteFicha
     */
    this.modelo = {};
    /**
     * Control IpkFicha
     * @type    {IpkFicha}
     * @memberOf    IpkRemoteFicha
     */
    this.ficha = {};

    this.crearFicha();

    /**
     * Control infraestructura para obtener la configuracion de los componentes
     * @type    {IpkInfraestructura}
     * @memberOf    IpkRemoteFicha
     */
    this.ipkConfiguracion = new IpkInfraestructura();

    this.crearGenericoDS();
    this.crearIpkConfiguracion();

    this.ipkConfiguracion.getFichaByName(Configuracion.nombre);
};

/**
 * Crea el componente IpkInfraestructura para configurar los controles
 *
 * @function
 * @private
 * @name        crearIpkConfiguracion
 * @memberOf    IpkRemoteFicha
 */
IpkRemoteFicha.prototype.crearIpkConfiguracion = function(){
    var self = this;
    this.ipkConfiguracion.onGetFicha = function(ficha){
        self.fichaCfg = ficha;
        app.log.debug('onGetFicha' , ficha);

        self.ipkConfiguracion.getModeloById(ficha.zz_Modelos.IdModelo);
    };
    this.ipkConfiguracion.onGetModelo = function(modelo){
        self.modelo = modelo;

        var clave = _.find(self.modelo.zz_CamposModelos, function(elemento) { return elemento.EsClave == true;});

        if(self.modelo.zz_Accesos.length > 0)
        {
            app.log.debug('ACESOSSSSSSSS' , JSON.parse(self.modelo.zz_Accesos[0].Json) );
            self.ficha.setPermisos(JSON.parse(self.modelo.zz_Accesos[0].Json));
        }

        self.genericoDS.CambiarEntidad(self.modelo.Nombre, clave.Nombre);
        self.ficha.setEstructura( self.fichaCfg);
    };
};
/**
 * Crea el componente IpkRemoteDataSource para la entidad del control ficha
 *
 * @function
 * @private
 * @name        crearGenericoDS
 * @memberOf    IpkRemoteFicha
 */
IpkRemoteFicha.prototype.crearGenericoDS = function(){
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
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.genericoDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Buscar Registro', respuesta.datos);
                self.ficha.setDatos(respuesta.datos[0]);
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.genericoDS.onInsert = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.onRecordInserted(respuesta);
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.genericoDS.onInsertHijo = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.onRecordInserted(respuesta);
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.genericoDS.onUpdate = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.onRecordUpdated(respuesta);
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.genericoDS.onDelete = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            alert(respuesta.mensaje);
            self.onRecordDeleted(respuesta);
        }
        else
            alert(respuesta.mensaje);
    };
    this.genericoDS.onCopiar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                self.onRecordCopied(respuesta);
            }
        }
        else
            alert(respuesta.mensaje);
    };

};
    /**
 * Crea el control IpkFicha
 *
 * @function
 * @private
 * @name        crearFicha
 * @memberOf    IpkRemoteFicha
 */
IpkRemoteFicha.prototype.crearFicha = function(){
    var self = this;

    this.ficha = new IpkFicha(this.propiedades);
    this.ficha.onEditarClick = function( eventArgs ){
        app.log.debug('onEditarClick', eventArgs);
    };
    this.ficha.onGuardarClick = function(eventArgs){
        var ficha = eventArgs.sender;
        var registro = {} ;
        self.ficha.serializar(true);

        if(ficha.modo === IpkFicha.Modos.Alta)
        {
            registro = self.ficha.serializar();
            self.crearRegistro(registro);
        }
        else
        {
            registro = self.ficha.serializar(true);
            self.actualizarRegistro(registro);
            self.ficha.setModo(IpkFicha.Modos.Consulta);
        }

        self.onGuardarClick();
        app.log.debug('onGuardarClick', eventArgs);
    };
    this.ficha.onBorrarClick = function( eventArgs ){
        //TODO: Añadir comfirmacion de borrado de registro
        self.eliminarRegistro();
    };
    this.ficha.onCopiarClick = function( eventArgs ){
        alert('Vamos a copiar');
    };
    this.ficha.onCancelarClick = function(){
       self.onCancelarClick();
    };
};

/**
 * Establece del padre del registro que gestiona la ficha para poder persistirlo
 *
 * @function
 * @public
 * @name        setPadre
 * @memberOf    IpkRemoteFicha
 */
IpkRemoteFicha.prototype.setPadre = function(padre){
    this.ficha.setPadre(padre);
};
/**
 * Dado el identificador de un registro ,de la entidad para la que está configurada la ficha, lanza la busqueda
 *
 * @function
 * @public
 * @name        cargarRegistro
 * @memberOf    IpkRemoteFicha
 * @param       {int}   id  Identicador del registro a recuperar
 *
 */
IpkRemoteFicha.prototype.cargarRegistro = function(id){
    var where = {};
    var campoClave = this.ficha.campoClave();

    where[campoClave] = id;

    this.genericoDS.Buscar(where , true, true);
};
/**
 * Lanza la creación del registro
 *
 * @function
 * @public
 * @name        cargarRegistro
 * @memberOf    IpkRemoteFicha
 * @param       {Object}   datos  Registro a guardar
 *
 */
IpkRemoteFicha.prototype.crearRegistro = function(datos){
    if(this.ficha.datosPadre){
        this.genericoDS.InsertHijo(datos, this.ficha.datosPadre);
    }
    else{
        this.genericoDS.Insert(datos);
    }

};
/**
 * Lanza la actualización del registro
 *
 * @function
 * @public
 * @name        actualizarRegistro
 * @memberOf    IpkRemoteFicha
 * @param       {Object}   datos  Registro a actualizar
 *
 */
IpkRemoteFicha.prototype.actualizarRegistro = function(datos){
    this.genericoDS.Update(datos);
};
/**
 * Lanza el borrado del registro comprobando la acción
 *
 * @function
 * @public
 * @name        eliminarRegistro
 * @memberOf    IpkRemoteFicha
 * @param       {Object}   datos  Registro a eliminar
 *
 */
IpkRemoteFicha.prototype.eliminarRegistro = function(){
    var campo = this.ficha.campoClave();
    var valor = this.ficha.valorClave();

    if(valor && valor != "" )
        this.genericoDS.Delete(valor);
};

/**
 * Se lanza cuando se pulsa el botón de editar
 *
 * @event   onEditarClick
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onEditarClick = function(){};
/**
 * Se lanza cuando se pulsa el botón de borrar
 *
 * @event   onBorrarClick
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onBorrarClick = function(){};
/**
 * Se lanza cuando se pulsa el botón de copiar
 *
 * @event   onCopiarClick
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onCopiarClick = function(){};
/**
 * Se lanza cuando se pulsa el botón de guardar
 *
 * @event   onGuardarClick
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onGuardarClick = function(){};
/**
 * Se lanza cuando se pulsa el botón de cancelar
 *
 * @event   onCancelarClick
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onCancelarClick = function(){};

/**
 * Se lanza cuando se ha guardado el registro
 *
 * @event   onRecordInserted
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onRecordInserted = function(respuesta){};
/**
 * Se lanza cuando se ha actualizado el registro
 *
 * @event   onRecordUpdated
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onRecordUpdated = function(respuesta){};
/**
 * Se lanza cuando se ha borrado el registro
 *
 * @event   onRecordDeleted
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onRecordDeleted = function(respuesta){};
/**
 * Se lanza cuando se ha copiado el registro
 *
 * @event   onRecordCopied
 * @memberOf IpkRemoteFicha
 *
 */
IpkRemoteFicha.prototype.onRecordCopied = function(respuesta){};

