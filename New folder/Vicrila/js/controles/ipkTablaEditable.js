/**
 * Control que tiene una tabla remota y una toolbar con las opciones de Crear, Ver, Borrar y Copiar
 *
 * @class IpkTablaEditable
 * @name  IpkTablaEditable
 * @param {Object}  configuracion
 * @param {Object[]}    datos   Datos para cargar en la tabla
 */
var IpkTablaEditable = function(configuracion ,datos){

    this.referencia = Date.now();

    /**
     * Valoers por defecto del control
     * @type {Object}
     * @memberOf  IpkTablaEditable
     */
    this.defaults = {};
    /**
     * Valores configurables del control
     * @type {Object}
     * @memberOf  IpkTablaEditable
     */
    this.propiedades = $.extend(this.defaults , configuracion);
    /**
     * Información del modelo para el que se crea la tabla
     * @type {Object}
     * @memberOf  IpkTablaEditable
     */
    this.modelo = {};
    /**
     * Referencia al control ficha que se crea desde el control
     * @type    {IpkRemoteFicha}
     * @memberOf  IpkTablaEditable
     * @see      IpkRemoteFicha
     */
    this.ficha = {};
    /**
     * Referencia al control tabla que se crea desde el control
     * @type    {IpkRemoteTabla}
     * @memberOf  IpkTablaEditable
     * @see      IpkRemoteTabla
     */
    this.tabla = {};
    /**
     * Referencia al control toolbar que se crea desde el control
     * @type    {IpkToolbar}
     * @memberOf  IpkTablaEditable
     * @see      IpkToolbar
     */
    this.toolbar = {};
    /**
     * Control infraestructura para obtener la configuracion de los componentes
     * @type    {IpkInfraestructura}
     * @memberOf    IpkRemoteFicha
     */
    this.ipkConfiguracion = new IpkInfraestructura();

    if(datos)
        this.datos = datos;

    //this.crearTab();
    this.crearIpkConfiguracion();
    this.crearContenedor();

    this.crearTabla();
    this.crearFicha();

    this.ipkConfiguracion.getListadoByName(this.propiedades.Listado);
};

/**
 * Crear el contenedor donde se va ha crear el control
 * @function
 * @private
 * @name      crearContenedor
 * @memberOf  IpkTablaEditable
 */
IpkTablaEditable.prototype.crearContenedor = function(){
    this.contexto = $('#' + this.propiedades.contenedor);
    var elemento = $("#" +  this.propiedades.Nombre  + "_TE" + this.referencia);

    app.log.debug('IpkTablaEditable cuenta de elementos' , elemento);

    this.placeholder = $("<div id='" +  this.propiedades.Nombre  + "_TE" + this.referencia + "'  ></div>");
    this.contexto.append(this.placeholder);
};
/**
 * Crear el control toolbar
 * @function
 * @private
 * @name      crearToolbar
 * @memberOf  IpkTablaEditable
 */
IpkTablaEditable.prototype.crearToolbar = function(){
    var idToolbar = 'toolbar' + this.propiedades.Nombre + '_Toolbar_TE' + this.referencia ;
    var toolbarContainer = $('<div id="' + idToolbar  + '"></div>');
    this.placeholder.prepend(toolbarContainer);

    this.toolbar = new IpkToolbar({
        contenedor : idToolbar ,
        id         : idToolbar
    });

    var grupo = app.seguridad.grupoActual.toUpperCase();
    if(this.accesos)
    {
        if(this.accesos[grupo])
        {
            var self = this;

            if( this.accesos[grupo][1] )
            {
                this.toolbar.agregarBoton({
                    nombre : "CrearNuevo",
                    descripcion : "Añade un nuevo registro",
                    clases : "",
                    icono : "icon-ok",
                    texto : "Crear Nuevo"
                });
                this.toolbar.onCrearNuevo = function(){
                    self.ficha.ficha.setModo(IpkFicha.Modos.Alta);
                    self.ficha.ficha.limpiar();
                    self.dialogoFicha.dialog('open');
                };
            }

            this.toolbar.agregarBoton({
                nombre : "IrAFicha",
                descripcion : "Ir a la ficha del registro seleccionado",
                clases : "",
                icono : "icon-list-alt",
                texto : "Ir a ficha"
            });
            this.toolbar.onIrAFicha = function(){
                var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();

                if(idRegistro){
                    self.ficha.ficha.limpiar();
                    self.ficha.ficha.setModo(IpkFicha.Modos.Consulta);
                    self.ficha.cargarRegistro(idRegistro);
                    self.dialogoFicha.dialog('open');
                }
            };

            if( this.accesos[grupo][3] )
            {
                this.toolbar.agregarBoton({
                    nombre : "Borrar",
                    descripcion : "Borrar el registro seleccionado",
                    clases : "",
                    icono : "icon-trash",
                    texto : "Borrar"
                });
                this.toolbar.onBorrar = function(){
                    var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();

                    if(idRegistro){
                        var resultado = confirm('¿Está segura de que desea borrar el registro ?');
                        if(resultado )
                        {
                            self.dossieresDS.Delete(idRegistro);
                            self.tabla.tabla.borrarFilaSeleccionada();
                        }
                    }
                };
            }
            if( this.accesos[grupo][4] )
            {
                this.toolbar.agregarBoton({
                    nombre : "Copiar",
                    descripcion : "Copia el registro seleccionado",
                    clases : "",
                    icono : "icon-repeat",
                    texto : "Copiar"
                });
                this.toolbar.onCopiar = function(){
                    alert('Copiar');
                };
            }
            /*
             var permisos =
             {
             "COMERCIAL"    : [1,1,0,1,1],
             "PRODUCCION"   : [1,0,0,0,0],
             "MOLDES"       : [1,0,0,0,0],
             "DNP"          : [1,0,0,0,0],
             "ANALITICA"    : [1,0,0,0,0],
             "PROGRAMACION" : [1,0,0,0,0]
             };
             */
            if(!this.accesos[grupo][1] && !this.accesos[grupo][3] && !this.accesos[grupo][4])
            {
                $('.ficha' , this.elemento).eq(0).attr('style' , 'border-top: 1px solid #DDD');
            }

        }
        else
        {

            $('.ficha' , this.elemento).eq(0).attr('style' , 'border-top: 1px solid #DDD');
        }
    }
    else
    {

        this.toolbar.agregarBoton({
            nombre : "CrearNuevo",
            descripcion : "Añade un nuevo registro",
            clases : "",
            icono : "icon-ok",
            texto : "Crear Nuevo"
        });
        this.toolbar.agregarBoton({
            nombre : "IrAFicha",
            descripcion : "Ir a la ficha del registro seleccionado",
            clases : "",
            icono : "icon-list-alt",
            texto : "Ir a ficha"
        });
        this.toolbar.agregarBoton({
            nombre : "Borrar",
            descripcion : "Borrar el registro seleccionado",
            clases : "",
            icono : "icon-trash",
            texto : "Borrar"
        });
        this.toolbar.agregarBoton({
            nombre : "Copiar",
            descripcion : "Copia el registro seleccionado",
            clases : "",
            icono : "icon-repeat",
            texto : "Copiar"
        });

        var self = this;
        this.toolbar.onCrearNuevo = function(){
            self.ficha.ficha.setModo(IpkFicha.Modos.Alta);
            self.ficha.ficha.limpiar();
            self.dialogoFicha.dialog('open');
        };
        this.toolbar.onIrAFicha = function(){
            var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();

            if(idRegistro){
                self.ficha.ficha.limpiar();
                self.ficha.ficha.setModo(IpkFicha.Modos.Consulta);
                self.ficha.cargarRegistro(idRegistro);
                self.dialogoFicha.dialog('open');
            }
        };
        this.toolbar.onBorrar = function(){
            var idRegistro = self.tabla.tabla.getIdRegistroSeleccionada();

            if(idRegistro){
                var resultado = confirm('¿Está segura de que desea borrar el registro ?');
                if(resultado )
                {
                    self.dossieresDS.Delete(idRegistro);
                    self.tabla.tabla.borrarFilaSeleccionada();
                }
            }
        };
        this.toolbar.onCopiar = function(){
            alert('Copiar');
        };
    }
};
/**
 * Crear el control IpkRemoteTabla
 * @function
 * @private
 * @name      crearTabla
 * @memberOf  IpkTablaEditable
 */
IpkTablaEditable.prototype.crearTabla = function(){

    var contenedorTabla = this.propiedades.Nombre  + "_Tabla_TE" + this.referencia;
    var toolbarContainer = $('<div id="' + contenedorTabla + '"></div>');
    this.placeholder.append(toolbarContainer);

    this.propiedades.contenedor = contenedorTabla;


    this.tabla = new IpkRemoteTabla(this.propiedades ,this.datos);
};
/**
 * Crear el control IpkRemoteFicha
 * @function
 * @private
 * @name      crearFicha
 * @memberOf  IpkTablaEditable
 */
IpkTablaEditable.prototype.crearFicha = function(){
    var contenedorFicha = this.propiedades.Nombre  + "_Ficha_TE" + this.referencia;
    var fichaContainer = $('<div id="' + contenedorFicha + '"></div>');
    this.placeholder.append(fichaContainer);

    var configuracion = {
        contenedor : contenedorFicha,
        nombre     : this.propiedades.Ficha ,
        ficha      : this.propiedades.Ficha ,
        modo       : IpkFicha.Modos.Consulta
    };

    var self = this;
    this.ficha = new IpkRemoteFicha(configuracion, []);

    if(this.datosPadre)
        this.ficha.setPadre(this.datosPadre);

    this.ficha.onGuardarClick = function(){
        //setTimeout( function(){self.aplicarFiltro()}, 3000 );
    };
    this.ficha.onRecordInserted = function(respuesta){
        self.onRecordInserted(respuesta);
        //TODO: Actualizar el registro en la tabla
    };
    this.ficha.onRecordUpdated = function(respuesta){
        self.onRecordUpdated(respuesta);
        //TODO: Actualizar el registro en la tabla
    };
    this.ficha.onRecordDeleted = function(respuesta){
        self.onRecordDeleted(respuesta);
        //TODO: Actualizar el registro en la tabla
    };
    this.ficha.onRecordCopied = function(respuesta){
        self.onRecordCopied(respuesta);
        //TODO: Actualizar el registro en la tabla
    };
    this.dialogoFicha = $('#' + contenedorFicha).dialog({
        width : '1200px',
        autoOpen  : false,
        modal     : true,
        resizable : false,
        title     : 'Ficha de ' + this.propiedades.Nombre
    }).height("auto");
};

/**
 * Crea el componente IpkInfraestructura para configurar los controles
 *
 * @function
 * @private
 * @name        crearIpkConfiguracion
 * @memberOf    IpkTablaEditable
 */
IpkTablaEditable.prototype.crearIpkConfiguracion = function(){
    var self = this;
    this.ipkConfiguracion.onGetListado = function(listado){
        self.listadoCfg = listado;
        self.ipkConfiguracion.getModeloById(listado.zz_Modelos.IdModelo);
    };
    this.ipkConfiguracion.onGetModelo = function(modelo){
        self.modelo = modelo;

        if(self.modelo.zz_Accesos.length > 0)
        {
            self.accesos = JSON.parse(self.modelo.zz_Accesos[0].Json);
            self.crearToolbar();
            self.ficha.ficha.setPermisos(self.accesos);
        }
    };
};

/**
 * Pone datos en el control tabla
 * @function
 * @public
 * @name      setDatos
 * @memberOf  IpkTablaEditable
 *
 * @param     {Object[]}    datos   Datos para cargar en la tabla
 */
IpkTablaEditable.prototype.setDatos = function(datos){
    this.tabla.setDatos(datos);
};
/**
 * Pone el padre del registro en caso de que la tabla sea de hijos de otra entidad
 * @function
 * @public
 * @name      setPadre
 * @memberOf  IpkTablaEditable
 *
 * @param       {Object}    padre   Registro padre de los que se muestran en la tabla
 */
IpkTablaEditable.prototype.setPadre = function(padre){
    this.datosPadre = padre;
    this.ficha.setPadre(this.datosPadre);
};
/**
 * Se lanza cuando se ha guardado el registro
 *
 * @event   onRecordInserted
 * @memberOf IpkTablaEditable
 *
 */
IpkTablaEditable.prototype.onRecordInserted = function(respuesta){};
/**
 * Se lanza cuando se ha actualizado el registro
 *
 * @event   onRecordUpdated
 * @memberOf IpkTablaEditable
 *
 */
IpkTablaEditable.prototype.onRecordUpdated = function(respuesta){};
/**
 * Se lanza cuando se ha borrado el registro
 *
 * @event   onRecordDeleted
 * @memberOf IpkTablaEditable
 *
 */
IpkTablaEditable.prototype.onRecordDeleted = function(respuesta){};
/**
 * Se lanza cuando se ha copiado el registro
 *
 * @event   onRecordCopied
 * @memberOf IpkTablaEditable
 *
 */
IpkTablaEditable.prototype.onRecordCopied = function(respuesta){};
