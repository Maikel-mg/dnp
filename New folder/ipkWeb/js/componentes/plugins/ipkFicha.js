(function($){

    $.fn.ficha = function(options) {
        var self = this;
        self.options = options;

        return new Ficha( this, self.options);
    };

    var Ficha = function(elemento, options){
        this.propiedades = $.extend(this.defaults, options);

        //TODO: BOrrar
        this.debug = {};

        this.datos = {};
        this.estructura = [];
        this.elemento = $(elemento);
        this.nombre = $(elemento).attr('id');
        this.controles = [];
        this.controlesObj = {};
        this.colecciones = {};
        this.datosPadre = {};

        this.subcripciones();
        this.vincularEventos();

        this.crear();

        return this;
    };

    Ficha.prototype.subcripcionesDatos = function(){

        app.eventos.escuchar('Estructura',  this.infoModelo.Nombre  , $.proxy(this.render, this) );
        app.eventos.escuchar('Update',      this.infoModelo.Nombre  , $.proxy(this.updated, this) );
        app.eventos.escuchar('Insert',      this.infoModelo.Nombre  , $.proxy(this.inserted, this) );
        app.eventos.escuchar('InsertHijo',  this.infoModelo.Nombre  , $.proxy(this.inserted, this) );
        app.eventos.escuchar('Delete',      this.infoModelo.Nombre  , $.proxy(this.deleted, this) );
        app.eventos.escuchar('Copiar',      this.infoModelo.Nombre  , $.proxy(this.copied, this) );
    };
    Ficha.prototype.subcripciones = function(){
        /* EVENTOS FICHA */
        app.eventos.escuchar(Ficha.Eventos.OnBtnEditarClick   , this.nombre,  $.proxy(this.entrarModoEdicion, this) );
        app.eventos.escuchar(Ficha.Eventos.OnBtnBorrarClick   , this.nombre,  $.proxy(this.borraRegistro, this) );
        app.eventos.escuchar(Ficha.Eventos.OnBtnCopiarClick   , this.nombre,  $.proxy(this.copiarRegistro, this) );
        app.eventos.escuchar(Ficha.Eventos.OnBtnGuardarClick  , this.nombre,  $.proxy(this.guardarRegistro, this) );
        app.eventos.escuchar(Ficha.Eventos.OnBtnCancelarClick , this.nombre,  $.proxy(this.cancelarGuardar , this) );
        app.eventos.escuchar(Ficha.Eventos.OnBtnVolverClick   , this.nombre,  $.proxy(this.Volver, this) );

        app.eventos.escuchar('ColeccionCreada', this.nombre, function(e,v){
            app.log.debug('Coleccion se ha cargado ', [e,v]);
        });
    };
    Ficha.prototype.vincularEventos = function(){
        var self = this;
        var nombreContexto  = this.nombre;

        $(this.elemento).delegate('.toolbar .btnGuardar', 'click', function(){
            app.eventos.lanzar(Ficha.Eventos.OnBtnGuardarClick, nombreContexto , {Entidad: self.propiedades.entidad}, true);
        });

        $(this.elemento).delegate('.toolbar .btnCancelar', 'click', function(){
            app.eventos.lanzar(Ficha.Eventos.OnBtnCancelarClick, nombreContexto , {Entidad: self.propiedades.entidad}, true);
        });

        $(this.elemento).delegate('.toolbar .btnEditar', 'click', function(){
            app.eventos.lanzar(Ficha.Eventos.OnBtnEditarClick, nombreContexto , {Entidad: self.propiedades.entidad}, true);
        });
        $(this.elemento).delegate('.toolbar .btnBorrar', 'click', function(){
            app.eventos.lanzar(Ficha.Eventos.OnBtnBorrarClick, nombreContexto , {Entidad: self.propiedades.entidad}, true);
        });
        $(this.elemento).delegate('.toolbar .btnCopiar', 'click', function(){
            app.eventos.lanzar(Ficha.Eventos.OnBtnCopiarClick, nombreContexto , {Entidad: self.propiedades.entidad}, true);
        });
    };
    Ficha.prototype.crear = function (){
        app.log.debug('Crear', this);
        this.crearDiv();

        this.modoConsulta();
        this.ocultarNotificaciones();
    };
    
    Ficha.prototype.crearDiv = function(){
        app.log.debug('Crear Div', this);

        var _div = $('<div class="ficha">');

        this.elemento.append(_div);

        this.crearToolbar(_div);
        this.crearAreaNotificaciones(_div);
        this.crearCtrlFormulario(_div);
        this.crearAreaColecciones(_div);
        _div.append('<div class="clearFix"></div>');
    };
    Ficha.prototype.crearToolbar = function(div){
        var toolbarContainer = $('<div id="toolbar" class="toolbar"></div>');
        var toolbar = $('<ul></ul>');

        toolbar.append( this.crearToolbarButton("btnEditar", "Editar el registro","icon-pencil", "Editar", "botonConsulta") );
        toolbar.append( this.crearToolbarButton("btnBorrar", "Borrar el registro","icon-trash", "Borrar", "botonConsulta") );
        toolbar.append( this.crearToolbarButton("btnCopiar", "Copiar el registro","icon-repeat", "Copiar", "botonConsulta") );
        toolbar.append( this.crearToolbarButton("btnGuardar", "Guardar el registro","icon-ok", "Guardar", "botonEdicion") );
        toolbar.append( this.crearToolbarButton("btnCancelar", "Cancelar la edicion del registro","icon-remove", "Cancelar", "botonEdicion") );

        toolbarContainer.append(toolbar);
        toolbarContainer.append( $('<div class="clearFix"></div>') );
        div.append(toolbarContainer);
    };
    Ficha.prototype.crearToolbarButton = function(id, titulo, claseIcono ,texto, clase ){

        return "<li class='"+ clase +" " + id +"' id='"+ id +"' title='"+ titulo +"'><a href='#" + id + "'><span class='"+ claseIcono +"'></span><span>"+ texto +"</span></a></li>";
    };
    Ficha.prototype.crearAreaNotificaciones = function(div){
        var divNotificaciones = $('<div id="areaNotificaciones" class="areaNoficaciones">');
        divNotificaciones.append( this.crearToolbarButton("btnClose", "Salir de las Notificaciones","", "x", "botonNotif") );

        divNotificaciones.hide();
        div.append(divNotificaciones);
    };
    Ficha.prototype.crearCtrlFormulario = function(div){
        this.ctrFormulario = $("<div id='ctrlFormulario' class='controles'>");
        div.append(this.ctrFormulario);
    };
    Ficha.prototype.crearAreaColecciones = function(div){
        this.areaColecciones = $("<div class='areaColecciones width90p' style='  margin: 15px auto ;'><ul></ul></div>");
        div.append(this.areaColecciones);
    };

    Ficha.prototype.render = function(evento, respuesta){
        var self = this;
        var control = undefined;
        var campo = undefined;
        var plantilla = undefined;
        var tieneColecciones = false;


        $(".areaColecciones" , this.elemento).tabs( "destroy" );
        $('.areaColecciones ul li' , this.elemento).remove();
        $('.areaColecciones div *' , this.elemento).remove();
        $('.controles *' , this.elemento).remove();

        $(this.estructura).each(function(){
            campo = this;

            if(campo.EsClave)
            {
                var ctrHidden = new Hidden(campo, {});
                self.controlesObj[campo.Nombre] = ctrHidden;
                self.controles.push(ctrHidden);
                ctrHidden.setValor(self.datos[campo.Nombre]);

                $("#ctrlFormulario",  self.elemento).append(ctrHidden._control);
            }
            else
            {
                switch(campo.Tipo)
                {
                    case "Boolean":
                    {
                        var ctrCheckbox = new Checkbox(campo, {});
                        self.controlesObj[campo.Nombre] = ctrCheckbox;
                        self.controles.push(ctrCheckbox);
                        ctrCheckbox.setValor(self.datos[campo.Nombre]);

                        $("#ctrlFormulario",  self.elemento).append(ctrCheckbox._control);

                        break;
                    }
                    case "Reference":
                    {
                        if( !campo.EsPadre)
                        {
                            app.log.debug('Referencia', campo);
                            var referencia = new Referencia(campo, $('#ctrlFormulario' , self.elemento), {});
                            self.controlesObj[campo.Nombre] = referencia;
                            self.controles.push(referencia);
                            $('#ctrlFormulario', self.elemento).append(referencia._control);
                        }

                        break;
                    }
                    case "DateTime":
                    {
                        var crtFecha = new TextboxCalendario(campo, {});

                        if(self.datos[campo.Nombre])
                            $(crtFecha.input).val(self.datos[campo.Nombre]);

                        self.controles.push(crtFecha);
                        self.controlesObj[campo.Nombre] = crtFecha;
                        $('#ctrlFormulario', self.elemento).append(crtFecha._control);
                        break;
                    }
                    case "Collection":
                    {
                        if(self.modo != Ficha.Modos.Edicion)
                        {
                            if( !$.isEmptyObject(self.datos))
                            {
                                if(campo.SonHijos)
                                {
                                    var control = new ColeccionHijos(campo, self, {});
                                    self.controles.push(control);
                                    self.controlesObj[campo.Nombre] = control;
                                }
                                else
                                {
                                    var control = new Coleccion(campo, self, {});
                                    self.controles.push(control);
                                    self.controlesObj[campo.Nombre] = control;
                                }




                                tieneColecciones = true;
                            }

                            //Todo: Cargar el listado con la coleccion indicada en la referencia
                            app.log.debug('Campo de coleccion' + campo.Nombre, self.datos[campo.Nombre]);
                        }


                        break;
                    }
                    case "Int32":
                    {
                        var input = new TextboxNumerico(campo, {
                            aceptaDecimales : false,
                            aceptaNegativos : true
                        });

                        if(self.datos[campo.Nombre])
                            $(input.input).val(self.datos[campo.Nombre]);

                        self.controles.push(input);
                        self.controlesObj[campo.Nombre] = input;
                        $('#ctrlFormulario', self.elemento).append(input._control);

                        break;
                    }
                    case "Double":
                    {
                        var input = new TextboxNumerico(campo, {
                            aceptaDecimales : true,
                            aceptaNegativos : true
                        });

                        if(self.datos[campo.Nombre])
                            $(input.input).val(self.datos[campo.Nombre]);

                        self.controles.push(input);
                        self.controlesObj[campo.Nombre] = input;
                        $('#ctrlFormulario', self.elemento).append(input._control);

                        break;
                    }
                    default :
                    {
                        var input = new Textbox(campo, {});

                        if(self.datos[campo.Nombre])
                            $(input.input).val(self.datos[campo.Nombre]);

                        self.controles.push(input);
                        self.controlesObj[campo.Nombre] = input;
                        $('#ctrlFormulario', self.elemento).append(input._control);

                        break;
                    }
                }
            }
        });


        if(tieneColecciones)
            $(".areaColecciones", this.elemento).tabs({collapsible: true});

        if( this.modo == Ficha.Modos.Consulta)
            this.modoConsulta();
        else
            this.modoEdicion();
    };
    Ficha.prototype.getEstructura = function(evento, respuesta){

        if(respuesta)
        {
            var registro = respuesta;
            if(registro !== undefined)
            {
                app.log.debug('Ya tenemos los datos', registro);
                //this.ficha.setData(registro);
            }
            else
            {
                alert('No se ha encontrado ningún modelo con el Id indicado');
            }
        }


        var estructura = {
            Entidad : this.entidad
        };

        var self = this;
        //var modelo = _.find(self.data, function(elemento){ return elemento.Nombre.toLowerCase() == self.entidad;});
        var campos = this.propiedades.infoCampos;  //_.filter(self.data.camposFicha , function(elemento){ return elemento.IdFicha == registro.IdFicha});
        var respuestaNueva = {
            datos : campos
        };

        app.eventos.lanzar('Estructura', this.infoModelo.Nombre, respuestaNueva, true);
        //this.servicio.Estructura(JSON.stringify(estructura));
    };
    Ficha.prototype.setData = function(data){
        this.datos =  data[0];
        this.renderData();
        app.log.debug("data",data);
    };
    Ficha.prototype.renderData = function(){
        var self = this;
        var campo = undefined;
        var tieneColecciones = false;

        $(this.estructura).each(function(){
            campo = this;


                switch(campo.Tipo)
                {
                    case "Boolean":
                    {
                        $('#' + campo.Nombre, self.elemento).attr('checked', self.datos[campo.Nombre]);
                        break;
                    }
                    case "Reference":
                    {
                        if(self.datos[campo.Nombre])
                            $('#' + campo.Nombre, self.elemento).val(self.datos[campo.Nombre]);

                        break;
                    }
                    case "DateTime":
                    {
                        if(self.datos[campo.Nombre])
                            $('#' + campo.Nombre, self.elemento).val(self.datos[campo.Nombre]);
                        break;
                    }
                    case "Collection":
                    {
                        if(self.modo != Ficha.Modos.Edicion)
                        {
                            if( !$.isEmptyObject(self.datos))
                            {
                                if( !$.isEmptyObject(self.colecciones))
                                {
                                    app.log.debug('Coleccion ---- ' + campo.Nombre , self.colecciones[campo.Nombre]);
                                    self.colecciones[campo.Nombre].setDatos(self.datos[campo.Nombre]);
                                }
                                else
                                {
                                    if(campo.SonHijos)
                                    {
                                        var control = new ColeccionHijos(campo, self, {});
                                        self.controles.push(control);
                                        self.controlesObj[campo.Nombre] = control;
                                    }
                                    else
                                    {
                                        var control = new Coleccion(campo, self, {});
                                        self.controles.push(control);
                                        self.controlesObj[campo.Nombre] = control;
                                    }
                                }

                                tieneColecciones = true;
                            }
                        }
                        break;
                    }
                    case "Int32":
                    {
                        if(self.datos[campo.Nombre])
                            $('#' + campo.Nombre, self.elemento).val(self.datos[campo.Nombre]);
                        break;
                    }
                    case "Double":
                    {
                        if(self.datos[campo.Nombre])
                            $('#' + campo.Nombre, self.elemento).val(self.datos[campo.Nombre]);

                        break;
                    }
                    default :
                    {
                        if(self.datos[campo.Nombre])
                            $('#' + campo.Nombre, self.elemento).val(self.datos[campo.Nombre]);
                        break;
                    }
                }

            if(tieneColecciones)
                $(".areaColecciones" , this.elemento).tabs({collapsible: true});

        });
    };
    Ficha.prototype.setEstructura = function(estructura){
        //TODO: 10/07/2012 Comprobar si la estructura ya está cargada para no cargarla siempre
        this.infoFicha = estructura.infoFicha;
        this.infoModelo = estructura.infoModelo;
        this.infoCampos = estructura.infoCampos;
        this.estructura = this.infoCampos;
        this.subcripcionesDatos();
        this.render();
    };
    Ficha.prototype.Serializar = function(){
        //Todo: Revisar los campo vacios
        var self = this;
        var obj = {};
        var selector = this.elemento.selector + ' input[type != button],' + this.elemento.selector + ' select,' + this.elemento.selector + ' textarea';

        $.each($(selector), function(){
            if(this.type == 'checkbox')
                    obj[this.name] = $(this).attr('checked') == 'checked' ? true : false;
            else
            {
                if($(this).attr('id') != self.campoClave())
                {
                    if($(this).val() !== '')
                    {
                        if(this.name !== '')
                            obj[this.name] = $.trim($(this).val());
                    }
                }
            }
        });

        return obj;
    };
    Ficha.prototype.setPadre = function(padre){
        this.datosPadre = padre;
    };

    Ficha.prototype.ocultarNotificaciones = function(){
        $(".areaNotificaciones" , this.elemento).hide();
    };
    Ficha.prototype.entrarModoEdicion = function(evento, respuesta){
        //TODO: Guardar una copia de los datos actuales para el caso de deshacer
        this.modo = Ficha.Modos.Edicion;
        this.modoEdicion();
    };
    Ficha.prototype.salirModoEdicion = function(evento, respuesta){

        this.modo = Ficha.Modos.Consulta;
        this.modoConsulta();
    };

    Ficha.prototype.limpiar = function(){
        this.datos = undefined;
        this.colecciones = {};
        $('input' , this.elemento).val('');
        $('input[type=checkbox]' , this.elemento).attr('checked',false);
        $('.areaColecciones', this.elemento).hide();
    };
    Ficha.prototype.modoConsulta = function(){
        $('input' , this.elemento).attr('readonly', true);

        $('.botonEdicion' , this.elemento).hide();
        $('.botonConsulta' , this.elemento).show();
        $('.areaColecciones', this.elemento).show();
        this.modo = Ficha.Modos.Consulta;
    };
    Ficha.prototype.modoEdicion = function(){
        $('input', this.elemento).attr('readonly', false);

        $('.botonEdicion', this.elemento).show();
        $('.botonConsulta', this.elemento).hide();
        this.modo = Ficha.Modos.Edicion;
    };

    Ficha.prototype.onEditarClick= function(){
        return _.find(this.infoCampos, function(elemento){return elemento.EsClave == true}).Nombre;
    };

    Ficha.prototype.campoClave = function(){
        return _.find(this.infoCampos, function(elemento){return elemento.EsClave == true}).Nombre;
    };
    Ficha.prototype.valorClave = function(){
        return parseInt( $('#'+ this.campoClave()).val() );
    };
    Ficha.prototype.borraRegistro = function(evento, respuesta){
        var eliminacion = {
            'Entidad': this.infoModelo.Nombre,
            'Clave': this.campoClave(),
            'Valor': this.valorClave()

        };
        var confirmacion = confirm('¿ Confirma el borrado del registro ?');

        if( confirmacion )
            app.servicios.generales.Delete( JSON.stringify(eliminacion) );
        else
            alert('Se ha cancelado el borrado del registro');

    };
    Ficha.prototype.copiarRegistro = function(evento, respuesta){
        var copia = {
            'Entidad': this.infoModelo.Nombre,
            'Clave': this.campoClave(),
            'Valor': this.valorClave(),
            'Datos' : {}
        };

        app.servicios.generales.Copiar(JSON.stringify(copia));
    };
    Ficha.prototype.guardarRegistro = function(evento, respuesta){
        if(  isNaN(this.valorClave()))
        {
            var insercion = {};

            if(!$.isEmptyObject(this.datosPadre))
            {
                insercion = {
                    'Entidad'       : this.infoModelo.Nombre,
                    'Datos'         : this.Serializar(),
                    'DatosPadre'    : this.datosPadre
                };

                app.log.debug('Creacion de registro hijo', insercion);
                app.servicios.generales.InsertHijo( JSON.stringify(insercion) );
            }
            else
            {
                insercion = {
                    'Entidad': this.infoModelo.Nombre,
                    'Datos': this.Serializar()
                };

                app.log.debug('Creacion de registro', insercion);
                app.servicios.generales.Insert( JSON.stringify(insercion) );
            }
        }
        else
        {
            var actualizacion = {
                'Entidad': this.infoModelo.Nombre,
                'Clave': {
                    'Clave': this.campoClave(),
                    'Valor': this.valorClave()
                },
                'Datos': this.Serializar()
            };

            app.log.debug('Actualizacion del registro', actualizacion);

            app.servicios.generales.Update( JSON.stringify(actualizacion) );
        }
        //this.modo = Ficha.Modos.Consulta;
        this.salirModoEdicion();
    };
    Ficha.prototype.cancelarGuardar = function(evento, respuesta){
        this.render();
        this.salirModoEdicion();
    };
    Ficha.prototype.updated = function(evento, respuesta){

        app.log.debug('Updated ---- ', respuesta);
        if(respuesta)
        {
            var registro = respuesta.datos;
            if(registro !== undefined)
            {
                alert(respuesta.mensaje);
                //app.eventos.publicar(Ficha.Eventos.OnRecordUpdated, respuesta, true);
                app.eventos.lanzar(Ficha.Eventos.OnRecordUpdated, this.nombre, respuesta, true);
            }
            else
            {
                alert(respuesta.mensaje);
            }
        }

    };
    Ficha.prototype.inserted = function(evento, respuesta){

        app.log.debug('Inserted ---- ', respuesta);
        if(respuesta)
        {
            var registro = respuesta.datos;
            if(registro !== undefined)
            {
                alert(respuesta.mensaje);
                //app.eventos.publicar(Ficha.Eventos.OnRecordInserted, respuesta, true);
                app.eventos.lanzar(Ficha.Eventos.OnRecordInserted, this.nombre,  respuesta, true);
            }
            else
            {
                alert(respuesta.mensaje);
            }
        }

    };
    Ficha.prototype.deleted = function(evento, respuesta){

        app.log.debug('Deleted  ---- ', respuesta);
        if(respuesta)
        {
            var registro = respuesta.datos;
            if(registro !== undefined)
            {
                alert(respuesta.mensaje);
                //app.eventos.publicar(Ficha.Eventos.OnRecordDeleted, respuesta, true);
                app.eventos.lanzar(Ficha.Eventos.OnRecordDeleted, this.nombre,  respuesta, true);
            }
            else
            {
                alert(respuesta.mensaje);
            }
        }

    };
    Ficha.prototype.copied = function(evento, respuesta){

        app.log.debug('Copied  ---- ', respuesta);
        if(respuesta)
        {
            var registro = respuesta.datos;
            if(registro !== undefined)
            {
                alert(respuesta.mensaje);
                //app.eventos.publicar(Ficha.Eventos.OnRecordCopied, respuesta, true);
                app.eventos.lanzar(Ficha.Eventos.OnRecordCopied, this.nombre,  respuesta, true);
            }
            else
            {
                alert(respuesta.mensaje);
            }
        }

    };

    Ficha.Modos = {
        Consulta : "Consulta",
        Edicion  : "Edicion",
        Alta     : "Alta"
    };
    Ficha.Eventos = {
        OnDataChange        : "OnDataChange",
        OnEstructuraChange  : "OnEstructuraChange",

        OnBtnEditarClick    : "OnBtnEditarClick",
        OnBtnBorrarClick    : "OnBtnBorrarClick",
        OnBtnCopiarClick    : "OnBtnCopiarClick",
        OnBtnGuardarClick   : "OnBtnGuardarClick",
        OnBtnCancelarClick  : "OnBtnCancelarClick",

        OnRecordInserted    : "OnRecordInserted",
        OnRecordUpdated     : "OnRecordUpdated",
        OnRecordDeleted     : "OnRecordDeleted",
        OnRecordCopied      : "OnRecordCopied"
    };

})(jQuery);
