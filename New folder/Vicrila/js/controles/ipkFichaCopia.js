/**
 * Created by Maikel Merillas
 * User: mg01
 * Date: 9/10/12
 * Time: 15:58
 */

/**
 *
 * @class Control que crea una ficha con los
 * @name IpkFichaCopia
 * @constructor
 *
 *
 */
var IpkFichaCopia = function(){
    var self= this;



    /**
     * Timespan de creación del control para crear un identificador unico
     *
     * @memberOf IpkFichaCopia
     * @type {int}
     */
    this.referencia = Date.now();

    this.contenedor = undefined;
    this.control = undefined;
    /**
     * Barra de acciones
     * @memberOf IpkFichaCopia
     * @type {IpkToolbar}
     */
    this.toolbar = {};
    this.areaControles = {};

    this.propiedades = undefined;
    this.infoModelo = undefined;
    this.campos = {};
    this.registro = {};
    this.genericDS = {};

    this.controles = {};

    this.factory = new IpkRemoteFactory();
    this.factory.onGetRemoteDataSource = function(eventArgs){
        if(self[eventArgs.propiedad])
        {
            self[eventArgs.propiedad] = eventArgs.control;
            if([eventArgs.propiedad + 'Eventos'])
                self[eventArgs.propiedad + 'Eventos']();

            self.cargarRegistro(self.idRegistro);
        }
    };

    return this;
};

IpkFichaCopia.prototype.inicializar = function (configuracion){
    this.propiedades = configuracion;
    this.contenedor = $('#' + this.propiedades.contenedor);

    this.crearControl();
};

IpkFichaCopia.prototype.crearControl = function(){
    this.control = $('<div class="ficha">');

    this.contenedor.append(this.control);

    this.crearAreaToolbar(this.control);
    this.crearAreaControles(this.control);
    this.control.append('<div class="clearFix"></div>');
};
IpkFichaCopia.prototype.crearAreaToolbar = function(div){
    var idToolbar = 'toolbar' + this.propiedades.nombre + '_Ficha_' + this.referencia ;
    var toolbarContainer = $('<div id="' + idToolbar  + '"></div>');

    div.prepend(toolbarContainer);

    this.toolbar = new IpkToolbar({
        contenedor : idToolbar ,
        id         : idToolbar
    });

    this.toolbar.agregarBoton({
        nombre : "Guardar",
        descripcion : "Guarda el registro",
        clases : "",
        icono : "icon-ok",
        texto : "Guardar"
    });
    this.toolbar.agregarBoton({
        nombre : "Cancelar",
        descripcion : "Cancela la edicion del registro",
        clases : "",
        icono : "icon-remove",
        texto : "Cancelar"
    });

    var self = this;
    this.toolbar.onGuardar = function(){
        var distinto = true;

        $.each(self.campos , function(){
            distinto = (distinto && (self.registro[this.Nombre] !== self.controles[this.Nombre].getValor()) );
        });

        if(distinto)
        {
            self.genericDS.Buscar(self.serializarBuscar(), true, true);
            //self.genericDS.Buscar(self.serializar(), true, true);
            //self.onGuardar(self.serializar());
        }
        else
            alert('Los valores deben ser distintos de los del registro que se esta copiando.');
    };
    this.toolbar.onCancelar = function(){
        self.onCancelar();
    };
};
IpkFichaCopia.prototype.crearAreaControles = function(div){
    this.areaControles = $("<div id='areaControles" + this.propiedades.nombre + "' class='controles'>");
    div.append(this.areaControles);
};
IpkFichaCopia.prototype.render = function(){
    var self = this;

    $('*' , this.areaControles).remove();

    $.each(this.campos , function(){
        app.log.debug('Campo ', this);
        this.Titulo = this.Nombre;

        switch(this.Tipo)
        {
            case "Boolean":
            {
                var ctrCheckbox = new Checkbox(this, {});
                ctrCheckbox.setValor(self.registro[this.Nombre]);

                self.areaControles.append(ctrCheckbox._control);
                self.controles[this.Nombre] = ctrCheckbox;
                break;
            }
            case "DateTime":
            {
                var crtFecha = new TextboxCalendario(this, {});

                if(self.registro[this.Nombre])
                    $(crtFecha.input).val(self.registro[this.Nombre]);

                self.areaControles.append(crtFecha._control);
                self.controles[this.Nombre] = crtFecha;
                break;
            }
            case "Int32":
            {
                var input = new TextboxNumerico(this, {
                    aceptaDecimales : false,
                    aceptaNegativos : true
                });

                if(self.registro[this.Nombre])
                    $(input.input).val(self.registro[this.Nombre]);

                self.areaControles.append(input._control);
                self.controles[this.Nombre] = input;

                break;
            }
            case "Double":
            {
                var input = new TextboxNumerico(this, {
                    aceptaDecimales : true,
                    aceptaNegativos : true
                });

                if(self.registro[this.Nombre])
                    $(input.input).val(self.registro[this.Nombre]);

                self.areaControles.append(input._control);
                self.controles[this.Nombre] = input;

                break;
            }
            default :
            {

                var input = new Textbox(this, {});

                if(self.registro[this.Nombre])
                    $(input.input).val(self.registro[this.Nombre]);

                self.areaControles.append(input._control);
                self.controles[this.Nombre] = input;

                break;
            }
        }
    });

    $("[readonly='readonly']").attr('readonly', false);
    $("[disabled='disabled']").attr('disabled', false);
};
IpkFichaCopia.prototype.serializar = function(){
    //Todo: Revisar los campo vacios
    var self = this;
    var obj = {};
    var selector = this.contenedor.selector + ' input[type != button],' + this.contenedor.selector + ' select,' + this.contenedor.selector + ' textarea';

    $.each($(selector), function(){
        if(this.type == 'checkbox')
            obj[this.name] = $(this).attr('checked') == 'checked' ? true : false;
        else
        {
            if($(this).val() !== '')
            {
                if(this.name !== '')
                    obj[this.name] = $.trim($(this).val());
            }
        }
    });

    return obj;
};
IpkFichaCopia.prototype.serializarBuscar = function(){
    var self = this;
    var obj = {};
    var serializado = {};

    $.each(this.controles, function(){
        if(this['serializar'])
        {
            serializado = this.serializar();
            obj[this.nombre] = serializado[this.nombre];
        }
    });

    return obj;
};

IpkFichaCopia.prototype.genericDSEventos = function(){
    var self = this;

    this.genericDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
            {
                self.onGuardar(self.serializar());
            }
            else
            {
                alert("Ya existe un registro con esos valores.");
            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.genericDS.onFiltrar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Filtrado de dossieres', respuesta.datos);
                self.tabla.setDatos(respuesta.datos);
            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.genericDS.onGetById = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('GetById de dossieres', respuesta.datos);
                self.registro = respuesta.datos;
                self.ponerRegistroEnCampos();
            }
        }
        else
            alert(respuesta.mensaje);
    };
};

IpkFichaCopia.prototype.setInfoModelo = function(infoModelo){
    this.infoModelo = infoModelo;
    this.campos = _.filter(this.infoModelo.zz_CamposModelos , function(e){return e.EsIndice});
    this.factory.getRemoteDataSource(this.infoModelo.Nombre, 'genericDS');
    this.render();
};
IpkFichaCopia.prototype.setIdRegistro = function(id){
    this.idRegistro = id;

};

/**
 * Obtiene el registro asociado al id indicado
 *
 * @function
 * @private
 * @name cargarRegistro
 * @memberOf IpkFichaCopia
 * @param {int} id  Clave del registro
 */
IpkFichaCopia.prototype.cargarRegistro = function(id){
    this.genericDS.GetById(id);
};
IpkFichaCopia.prototype.ponerRegistroEnCampos = function(){
    var self = this;

    $.each(this.campos , function(){
        if(self.registro[this.Nombre])
            self.controles[this.Nombre].setValor(self.registro[this.Nombre]);
    });
};

/**
 * Se lanza cuando se pulsa el boton de cancelar
 *
 * @event
 * @name        onCancelar
 * @memberOf    IpkFichaCopia
 */
IpkFichaCopia.prototype.onCancelar = function(){};
/**
 * Se lanza cuando se pulsa el boton de guardar
 *
 * @event
 * @name        onGuardar
 * @memberOf    IpkFichaCopia
 */
IpkFichaCopia.prototype.onGuardar = function(datosCopia){};

