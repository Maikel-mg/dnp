/**
 *
 * @class   Componente que nos permite gestionar los comportamientos(eventos) de los controles de las fichas
 * @name    EditorComportamientos
 * @constructor
 *
 * @param   {jQuery}    contenedor  Elemento HTML donde se va a insertar el control
 */
var EditorComportamientos = function(contenedor){
    /**
     *  Control para el que se van a añadir los comportamientos
     *  @type {Object}
     *  @memberOf EditorComportamientos
     * */
    this.control = undefined;
    /**
     *  Elemento donde se crea el control
     *  @type {jQuery}
     *  @memberOf EditorComportamientos
     * */
    this.contenedor = undefined;
    /**
     *  Comportamiento que está siendo editado cuando se abre el formulario
     *  @type {Object}
     *  @memberOf EditorComportamientos
     * */
    this.comportamiento = undefined;
    /**
     *  Accion que está siendo editado cuando se abre el formulario de edición
     *  @type {Object}
     *  @memberOf EditorComportamientos
     * */
    this.accion = undefined;

    if(contenedor)
        this.Crear(contenedor);

    return this;
};
/**
 * Crea el control obteniendo el codigo HTML del fichero externo y lanza el cacheo de los controles UI
 * @function
 * @public
 * @memberOf EditorComportamientos
 * @param   {jQuery}    contenedor  Elemento HTML donde se va a insertar el control
 */
EditorComportamientos.prototype.Crear = function(contenedor){
    var self = this;

    this.contenedor = contenedor;
    this.html = $(this.contenedor).load('../js/componentes/html/editorComportamientos.html', function(){
        self.CachearControles();
    });
};
/**
 * Cachea los elemeneto HTML en propiedades de javascript
 * @function
 * @private
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.CachearControles = function(){
    var self = this;

    this.UI_trigger = $('#triggerComportamiento' ,this.contenedor);
    this.UI_condicion = $('#condicionComportamiento' ,this.contenedor);
    this.UI_valorCondicion = $('#condicionValor' ,this.contenedor);
    this.UI_acciones = $('#acciones' ,this.contenedor);
    this.UI_controles = $('#controles' ,this.contenedor);
    this.UI_valor = $('#valor' ,this.contenedor).hide();
    this.UI_lista = new Lista( {
        contenedor: 'listaComportamientos' ,
        id: 'listaComportamientos',
        titulo : 'Comportamientos',
        campo   : 'trigger',
        campoId : 'id',
        allowNew:  true,
        allowEdit:  true,
        allowDelete:  true
    } );
    this.UI_tabla = new IpkTabla({contenedor: 'tablaAcciones' , id: 'tablaAcciones'});
    this.UI_tabla.setColumnas([
        {
            Nombre : 'id',
            Titulo : 'id',
            Tipo   : 'Int32',
            EsClave : true,
            BusquedaInterna : false
        },
        {
            Nombre : 'nombre',
            Titulo : 'Acci&oacute;n',
            Tipo   : 'String',
            EsClave : false,
            BusquedaInterna : false
        },
        {
            Nombre : 'options.control',
            Titulo : 'Control',
            Tipo   : 'String',
            EsClave : false,
            BusquedaInterna : false
        },
        {
            Nombre : 'options.valor',
            Titulo : 'Valor',
            Tipo   : 'String',
            EsClave : false,
            BusquedaInterna : false
        }
    ]);
    this.UI_dlgComportamiento = $('#dlgEditorComportamiento').dialog({
        title   : 'Editor Comportamiento',
        modal   : true,
        autoOpen : false,
        width   : '800',
        buttons : {
            'Guardar' : function(){
                if(self.UI_dlgComportamiento.Modo == 'Alta')
                    self.CrearComportamiento();
                else
                    self.ModificarComportamiento();

                self.UI_lista.setDatos(self.control.comportamientos);
                $(this).dialog('close');
            },
            'Cancel' : function(){
                $(this).dialog('close');
                self.LimpiarComportamiento();
            }
        }
    });
    this.UI_dlgAcciones = $('#dlgAcciones').dialog({
        title   : 'Acciones',
        modal   : true,
        autoOpen : false,
        width   : '500',
        buttons : {
            'Guardar' : function(){
                if(self.UI_dlgAcciones.Modo == 'Alta')
                    self.CrearAccion();
                else
                    self.ModificarAccion();
                self.UI_tabla.setDatos(self.comportamiento.acciones);
                $(this).dialog('close');
            },
            'Cancel' : function(){$(this).dialog('close');}
        }
    });
    this.CrearToolbar();

    this.UI_lista.onNuevoClick = function(){
        self.UI_dlgComportamiento.Modo = "Alta";
        self.UI_dlgComportamiento.dialog('open');
    };
    this.UI_lista.onEdicionClick = function(){
        var registro = self.UI_lista.datos.find('id', self.UI_lista.getIdRegistroSeleccionada());
        self.CargarComportamiento(registro);
        self.UI_dlgComportamiento.Modo = "Edicion";
        self.UI_dlgComportamiento.dialog('open');
    };
    this.UI_acciones.on('change', function(){
        if($(this).val() == 'Set' || $(this).val() == 'Alert')
            self.UI_valor.show();
        else
            self.UI_valor.hide();
    });
};
/**
 * Crear el IpkToolbar de la tabla de acciones y configura los eventos de los botones
 * @function
 * @private
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.CrearToolbar = function(){
    var self = this;
    this.UI_toolbar = new IpkToolbar({
        contenedor: 'toolbarAcciones',
        id : 'toolbarAcciones'
    });
    this.UI_toolbar.crear();

    this.UI_toolbar.agregarBoton({
            nombre: 'btnNuevaAccion',
            descripcion : 'Crea nua nueva accion para el comportamiento',
            texto: 'Nueva Accion',
            clases  : '',
            accessKey: 'n',
            icono : 'icon-plus'
        });
    this.UI_toolbar.agregarBoton({
            nombre: 'btnEditarAccion',
            descripcion : 'Edita la acción seleccionada para el comportamiento',
            texto: 'Editar Accion',
            clases  : '',
            accessKey: 'e',
            icono : 'icon-pencil'
        });
    this.UI_toolbar.agregarBoton({
            nombre: 'btnBorrarAccion',
            descripcion : 'Borra la acción seleccionada para el comportamiento',
            texto: 'Borrar Accion',
            clases  : '',
            accessKey: 'e',
            icono : 'icon-trash'
        });
    this.UI_toolbar.onbtnNuevaAccion = function(){
        self.LimpiarAccion();
        self.UI_dlgAcciones.Modo = 'Alta';
        self.UI_dlgAcciones.dialog('open');
    };
    this.UI_toolbar.onbtnEditarAccion = function(){
        var registro = _.find(self.UI_tabla.datos.data, function(e){ return e[self.UI_tabla.campoClave()] == self.UI_tabla.getIdRegistroSeleccionada()});
        app.log.debug('ACCION', registro);

        self.CargarAccion(registro);
        self.UI_dlgAcciones.Modo = 'Edicion';
        self.UI_dlgAcciones.dialog('open');
    };
};
/**
 * Carga el control en el componente poniendo los comportamientos que tenga, si los tiene, en la lista
 * @function
 * @public
 * @name     CargarControl
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.CargarControl = function(control){
    this.control = control;

    if(control.comportamientos)
        this.UI_lista.setDatos(control.comportamientos);
    else
        this.UI_lista.setDatos([]);
};

/**
 *
 * @param {Object[]}    controles   Array con los controles de la ficha a la que pertenece el campo
 */
EditorComportamientos.prototype.SetControles = function(controles){
    this.controles = controles;

    var plantilla  = $("<script type='text/javascript'><option value='${Nombre}'>${Titulo}</option></script>");
    $(plantilla).tmpl(controles).appendTo(this.UI_controles);

};

/**
 * Carga el comportamiento en los controles del formulario de edición del comportamiento
 * @function
 * @private
 * @name     CargarComportamiento
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.CargarComportamiento = function(comportamiento){
    this.comportamiento = comportamiento;

    this.UI_trigger.val(comportamiento.trigger);
    this.UI_condicion.val(comportamiento.condicion.nombre);
    this.UI_valorCondicion.val(comportamiento.condicion.options.valor);
    this.UI_tabla.setDatos(comportamiento.acciones);
};
/**
 * Limpia los controles del formulario de edición del comportamiento
 * @function
 * @private
 * @name     LimpiarComportamiento
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.LimpiarComportamiento = function(){
    this.comportamiento = undefined;

    this.UI_trigger.val('');
    this.UI_condicion.val('');
    this.UI_valorCondicion.val('');
    this.UI_tabla.setDatos([]);
};
/**
 * Crea el comportamiento a partir de los datos del formulario y lo introduce en la coleccion del control que se esta editando
 * @function
 * @private
 * @name     CrearComportamiento
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.CrearComportamiento = function(){
    var self = this;
    var comportamiento = {};
    if(this.control.comportamientos && this.control.comportamientos.length > 0)
    {
        comportamiento = _.max(this.control.comportamientos, function(e){
            return e[self.UI_lista.datos.campoId];
        });
    }
    else
    {
        comportamiento[this.UI_lista.datos.campoId] = 0;
        this.control.comportamientos = [];
    }


    var comportamientoNuevo = this.SerializarComportamiento();
    comportamientoNuevo[this.UI_lista.datos.campoId] = comportamiento[this.UI_lista.datos.campoId] + 1;

    this.control.comportamientos.push(comportamientoNuevo);
    this.comportamiento = comportamientoNuevo;
    this.UI_dlgComportamiento.Modo = "Edicion";
};
/**
 * Modifica el comportamiento a partir de los datos del formulario y lo introduce en la colección del control que se esta editando
 * @function
 * @private
 * @name     ModificarComportamiento
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.ModificarComportamiento = function(){
    var self = this;
    var comportamiento = _.find(this.control.comportamientos, function(e){
        return e[self.UI_lista.datos.campoId] == self.comportamiento[self.UI_lista.datos.campoId];
    });

    var comportamientoNuevo = this.SerializarComportamiento();
    comportamiento.trigger = comportamientoNuevo.trigger;
    comportamiento.control = comportamientoNuevo.control;
    comportamiento.condicion = comportamientoNuevo.condicion || {};
    comportamiento.acciones  = comportamientoNuevo.acciones || {};

};
/**
 * Crea el objeto Comportamiento a partir de los datos del formulario de edicion
 * @function
 * @private
 * @name     SerializarComportamiento
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.SerializarComportamiento = function(){
    var o = {};

    o.trigger = this.UI_trigger.val();
    o.control = this.control.Nombre;
    o.condicion = {};
    o.condicion.nombre = this.UI_condicion.val();
    o.condicion.options = {};
    o.condicion.options.control = this.control.Nombre;
    o.condicion.options.valor = this.UI_valorCondicion.val();
    if(this.comportamiento && this.comportamiento.acciones)
        o.acciones  = this.comportamiento.acciones;
    else
        o.acciones  = [];

    return o;
};

/**
 * Carga la accion en los controles del formulario de edición de accion
 * @function
 * @private
 * @name     CargarAccion
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.CargarAccion = function(accion){
    this.accion = accion;

    this.UI_acciones.val(accion.nombre);
    this.UI_acciones.trigger('change');
    this.UI_controles.val(accion.options.control);
    this.UI_valor.val(accion.options.valor);
};
/**
 * Limpia los controles del formulario de edición de accion
 * @function
 * @private
 * @name     LimpiarAccion
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.LimpiarAccion = function(){
    this.accion = undefined;

    this.UI_acciones.val('');
    this.UI_acciones.trigger('change');
    this.UI_controles.val('');
    this.UI_valor.val('');
};
/**
 * Crea la accion a partir de los datos del formulario y lo introduce en la coleccion del control que se esta editando
 * @function
 * @private
 * @name     CrearAccion
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.CrearAccion = function(){
    var self = this;
    var accion = {};

    if(this.comportamiento && this.comportamiento.acciones && this.comportamiento.acciones.length > 0)
    {
        accion = _.max(this.comportamiento.acciones, function(e){
            return e[self.UI_tabla.campoClave()];
        });
    }
    else
    {
        accion[this.UI_tabla.campoClave()] = 0;
        this.CrearComportamiento();
        //this.comportamiento.acciones = [];
    }

    var accionNueva = this.SerializarAccion();
    accionNueva[this.UI_tabla.campoClave()] = accion[this.UI_tabla.campoClave()] + 1;

    this.comportamiento.acciones.push(accionNueva);
};
/**
 * Modifica la accion a partir de los datos del formulario y lo introduce en la colección del control que se esta editando
 * @function
 * @private
 * @name     ModificarAccion
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.ModificarAccion = function(){
    var self = this;
    var accion = _.find(this.comportamiento.acciones, function(e){
        return e[self.UI_tabla.campoClave()] == self.accion[self.UI_tabla.campoClave()];
    });

    var accionNueva = this.SerializarAccion();
    accion.nombre = accionNueva.nombre;
    accion.options = accionNueva.options;
};
/**
 * Crea el objeto Accion a partir de los datos del formulario de edicion
 * @function
 * @private
 * @name     SerializarAccion
 * @memberOf EditorComportamientos
 */
EditorComportamientos.prototype.SerializarAccion = function(){
    var o = {};

    o.nombre = this.UI_acciones.val();
    o.options = {};
    o.options.control = this.UI_controles.val();

    if(o.nombre == 'Set' || o.nombre == 'Alert')
        o.options.valor = this.UI_valor.val();

    return o;
};
