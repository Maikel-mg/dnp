var IpkFicha = function(configuracion){
    if (!Date.now) {
        Date.now = function() {
            return new Date().valueOf();
        }
    }
    this.referencia = Date.now();
    this.defaults = {};
    this.propiedades = $.extend(this.defaults , configuracion);


    this.toolbar = {};
    this.estructura = [];
    this.datos = [];
    this.controles = [];
    this.controlesObj = {};

    this.elemento = $('#' + configuracion.contenedor);

    this.crear();

    if(configuracion.modo)
    {
        this.setModo(configuracion.modo);
    }
    else
    {
        this.setModo(IpkFicha.Modos.SoloLectura);
    }
};

IpkFicha.prototype.crear = function (){
    app.log.debug('Crear', this);
    this.crearDiv();

    //this.modoConsulta();
    //this.ocultarNotificaciones();
};

//******* FUNCIONES DE CREACION DEL CONTROL **********
IpkFicha.prototype.crearDiv = function(){
    app.log.debug('Crear Div', this);

    var _div = $('<div class="ficha">');

    this.elemento.append(_div);

    this.crearToolbar(_div);
    this.crearAreaNotificaciones(_div);
    this.crearCtrlFormulario(_div);
    this.crearAreaColecciones(_div);
    _div.append('<div class="clearFix"></div>');
};
IpkFicha.prototype.crearToolbar = function(div){
    var self = this;
    var idToolbar = 'toolbar' + this.propiedades.nombre + '_Ficha_' + this.referencia ;
    var toolbarContainer = $('<div id="' + idToolbar  + '"></div>');

    div.prepend(toolbarContainer);

    this.toolbar = new IpkToolbar({
        contenedor : idToolbar ,
        id         : idToolbar
    });

    var grupo = app.seguridad.grupoActual.toUpperCase();
    if(this.permisos)
    {
        if(this.permisos[grupo])
        {

            if( this.permisos[grupo][2] )
            {
                this.toolbar.agregarBoton({
                    nombre : "Editar",
                    descripcion : "Editar el registro",
                    clases : "",
                    icono : "icon-pencil",
                    texto : "Editar"
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

                this.toolbar.onEditar = function(){
                    var eventArgs = {target : arguments, sender : self};

                    self.setModo(IpkFicha.Modos.Edicion);
                    self.aplicarSeguridad();
                    self.onEditarClick(eventArgs);
                };
                this.toolbar.onGuardar = function(){
                    var eventArgs = {target : arguments, sender : self};
                    self.onGuardarClick(eventArgs);
                };
                this.toolbar.onCancelar = function(){
                    var eventArgs = {target : arguments, sender : self};
                    self.setModo(IpkFicha.Modos.Consulta);
                    self.onCancelarClick(eventArgs);
                };
            }
            if( this.permisos[grupo][3] )
            {
                this.toolbar.agregarBoton({
                    nombre : "Borrar",
                    descripcion : "Borrar el registro",
                    clases : "",
                    icono : "icon-trash",
                    texto : "Borrar"
                });
                this.toolbar.onBorrar = function(){
                    var eventArgs = {target : arguments, sender : self};

                    self.onBorrarClick(eventArgs);
                };
            }
            if( this.permisos[grupo][4] )
            {
                this.toolbar.agregarBoton({
                    nombre : "Copiar",
                    descripcion : "Copia el registro",
                    clases : "",
                    icono : "icon-repeat",
                    texto : "Copiar"
                });
                this.toolbar.onCopiar = function(){
                    var eventArgs = {target : arguments, sender : self};
                    self.onCopiarClick(eventArgs);
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
            if(!this.permisos[grupo][2] && !this.permisos[grupo][3] && !this.permisos[grupo][4])
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
            nombre : "Editar",
            descripcion : "Editar el registro",
            clases : "",
            icono : "icon-pencil",
            texto : "Editar"
        });
        this.toolbar.agregarBoton({
            nombre : "Borrar",
            descripcion : "Borrar el registro",
            clases : "",
            icono : "icon-trash",
            texto : "Borrar"
        });
        this.toolbar.agregarBoton({
            nombre : "Copiar",
            descripcion : "Copia el registro",
            clases : "",
            icono : "icon-repeat",
            texto : "Copiar"
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

        this.toolbar.onEditar = function(){
            var eventArgs = {target : arguments, sender : self};
            app.log.debug('onEditar', arguments);
            self.setModo(IpkFicha.Modos.Edicion);
            self.aplicarSeguridad();
            self.onEditarClick(eventArgs);
        };
        this.toolbar.onBorrar = function(){
            var eventArgs = {target : arguments, sender : self};

            self.onBorrarClick(eventArgs);
        };
        this.toolbar.onCopiar = function(){
            var eventArgs = {target : arguments, sender : self};
            self.onCopiarClick(eventArgs);
        };
        this.toolbar.onGuardar = function(){
            var eventArgs = {target : arguments, sender : self};
            self.onGuardarClick(eventArgs);
        };
        this.toolbar.onCancelar = function(){
            var eventArgs = {target : arguments, sender : self};
            self.setModo(IpkFicha.Modos.Consulta);
            self.onCancelarClick(eventArgs);
        };
    }

};
IpkFicha.prototype.crearAreaNotificaciones = function(div){
    var divNotificaciones = $('<div id="areaNotificaciones" class="areaNoficaciones">');

    divNotificaciones.hide();
    div.append(divNotificaciones);
};
IpkFicha.prototype.crearCtrlFormulario = function(div){
    this.areaControles = $("<div id='areaControles" + this.propiedades.nombre + "' class='controles'>");
    div.append(this.areaControles);
};
IpkFicha.prototype.crearAreaColecciones = function(div){
    this.areaColecciones = $("<div class='areaColecciones width90p' style='  margin: 15px auto ;'><ul></ul></div>");
    div.append(this.areaColecciones);
};

//******* FUNCIONES DEL CONRTROL **********
IpkFicha.prototype.render = function(){
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
            if(self.datos.length > 0)
                ctrHidden.setValor(self.datos[campo.Nombre]);

            self.areaControles.append(ctrHidden._control);
        }
        else
        {
            switch(campo.Tipo)
            {
                case "ComboInterno":
                {
                    var valor = {};
                    if(self.datos[campo.Nombre])
                        valor.valor = self.datos[campo.Nombre];

                    var combo = new ComboInterno(campo, valor);

                    self.controles.push(combo);
                    self.controlesObj[campo.Nombre] = combo;
                    self.areaControles.append(combo._control);

                    break;
                }
                case "ComboNavision":
                {
                    var valor = {};
                    if(self.datos[campo.Nombre])
                        valor.valor = self.datos[campo.Nombre];

                    var combo = new ComboNavision(campo, valor);

                    self.controles.push(combo);
                    self.controlesObj[campo.Nombre] = combo;
                    self.areaControles.append(combo._control);

                    break;
                }
                case "Boolean":
                {
                    var ctrCheckbox = new Checkbox(campo, {});
                    self.controlesObj[campo.Nombre] = ctrCheckbox;
                    self.controles.push(ctrCheckbox);
                    ctrCheckbox.setValor(self.datos[campo.Nombre]);

                    self.areaControles.append(ctrCheckbox._control);

                    break;
                }
                case "Reference":
                {
                    if( !campo.EsPadre)
                    {
                        app.log.debug('Referencia', campo);
                        //var referencia = new Referencia(campo, self.areaControles , {});
                        //self.controlesObj[campo.Nombre] = referencia;
                        //self.controles.push(referencia);
                        //self.areaControles.append(referencia._control);
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
                    self.areaControles.append(crtFecha._control);
                    break;
                }
                case "Collection":
                {
                    if(self.modo != IpkFicha.Modos.Edicion)
                    {
                        app.log.debug('COLECCION HIJO ' , campo);

                        //var control = new IpkTablaHijos(self ,campo);

                        if( !$.isEmptyObject(self.datos))
                        {

                            if(campo.SonHijos)
                            {
                                app.log.debug('COLECCION HIJO ' , campo);


                                var control = new IpkTablaHijos(self ,campo);
                                self.controles.push(control);
                                self.controlesObj[campo.Nombre] = control;
                            }
                            else
                            {


                                app.log.debug('COLECCION HIJO ' , campo);
                                //var control = new Coleccion(campo, self, {});
                                var control = new IpkTablaHijos(self ,campo);
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
                    self.areaControles.append(input._control);

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
                    self.areaControles.append(input._control);

                    break;
                }
                default :
                {
                    var input = new Textbox(campo, {});

                    if(self.datos[campo.Nombre])
                        $(input.input).val(self.datos[campo.Nombre]);

                    self.controles.push(input);
                    self.controlesObj[campo.Nombre] = input;
                    self.areaControles.append(input._control);

                    break;
                }
            }
        }
    });

    if(tieneColecciones)
        $(".areaColecciones", this.elemento).tabs({collapsible: true});

    self.areaControles.append($('<div class="clearFix"> </div>'));

    this.setModo(this.modo);
    this.bloquearCampos();
};
IpkFicha.prototype.renderData = function(){
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
                if(self.modo != IpkFicha.Modos.Edicion)
                {

                    if( !$.isEmptyObject(self.datos))
                    {
                        if( self.controlesObj[campo.Nombre])
                        {
                            app.log.debug('Coleccion ---- ' + campo.Nombre , self.colecciones[campo.Nombre]);
                            self.controlesObj[campo.Nombre].setDatos(self.datos[campo.Nombre]);
                        }
                        else
                        {
                            if(campo.SonHijos)
                            {
                                app.log.debug('DATOS HIJO --- ' , [campo.Nombre , self.datos, self.datos[campo.Nombre]]);
                                var control = new IpkTablaHijos(self ,campo, self.datos[campo.Nombre]);

                                self.controles.push(control);
                                self.controlesObj[campo.Nombre] = control;
                                var padre = {
                                    Entidad : self.propiedades.nombre,
                                    Clave   : self.campoClave(),
                                    Valor   : self.valorClave()
                                };

                                app.log.debug('OTRO PADRE' , padre);
                                control.tabla.setPadre(padre);

                            }
                            else
                            {
                                app.log.debug('DATOS HIJO' , [campo.Nombre , self.datos, self.datos[campo.Nombre]]);
                                var datos = self.datos[campo.Nombre];
                                var control  = new  IpkTablaRelacion(self ,campo, datos);

                                self.controles.push(control);
                                self.controlesObj[campo.Nombre] = control;
                            }
                        }

                        tieneColecciones = true;
                    }
                    tieneColecciones = true;
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

    });

    var padre = {
        Entidad : self.propiedades.nombre,
        Clave   : self.campoClave(),
        Valor   : self.valorClave()
    };

    if(tieneColecciones){
        var tablasHijos = _.filter(this.controles , function(e){return e.tipo == "IpkTablaHijos";});
        $.each(tablasHijos, function(){
            this.tabla.setPadre(padre);
        })
    }

    $(".areaColecciones" , this.elemento).tabs({collapsible: true});
    this.bloquearCampos();
};
IpkFicha.prototype.setEstructura = function(estructura){
    this.configuracionFicha = estructura;
    app.utils.extenderFicha( this, this.configuracionFicha.Extension);
    app.utils.extenderControl( this, this.configuracionFicha.Eventos);
    this.estructura = estructura.zz_CamposFichas;

    app.log.debug('setEstructura' , this.estructura);
    if(this.estructura && this.estructura.length > 0)
        this.estructura  = _.sortBy(this.estructura, function(e){ return e.Orden; });

    this.render();
};
IpkFicha.prototype.setDatos = function(datos){
    this.datos =  datos;


    this.renderData();
};
IpkFicha.prototype.setModo = function(modo){
    if(modo === IpkFicha.Modos.SoloLectura)
    {
        var self = this;
        $.each(this.toolbar.comandos, function(){
            self.toolbar.visibilidad( this.nombre, false);
        });

    }
    if(modo === IpkFicha.Modos.Consulta)
    {
        this.toolbar.visibilidad( "Editar", true);
        this.toolbar.visibilidad( "Borrar", true);
        this.toolbar.visibilidad( "Copiar", true);
        this.toolbar.visibilidad( "Guardar", false);
        this.toolbar.visibilidad( "Cancelar", false);
        $('.areaColecciones', this.elemento).show();
    }
    if(modo === IpkFicha.Modos.Edicion)
    {
        this.toolbar.visibilidad( "Editar", false);
        this.toolbar.visibilidad( "Borrar", false);
        this.toolbar.visibilidad( "Copiar", false);
        this.toolbar.visibilidad( "Guardar", true);
        this.toolbar.visibilidad( "Cancelar", true);
    }
    if(modo === IpkFicha.Modos.Alta)
    {
        this.toolbar.visibilidad( "Editar", false);
        this.toolbar.visibilidad( "Borrar", false);
        this.toolbar.visibilidad( "Copiar", false);
        this.toolbar.visibilidad( "Guardar", true);
        this.toolbar.visibilidad( "Cancelar", true);
        this.aplicarSeguridad();
    }

    this.modo = modo;
};
IpkFicha.prototype.setPadre = function(padre){
    this.datosPadre = padre;
};
IpkFicha.prototype.setPermisos = function(permisos){
    this.permisos = permisos;
    $('#toolbar' + this.propiedades.nombre + '_Ficha_' + this.referencia , this.elemento).remove();
    var div = this.elemento.find('div').eq(0);
    this.crearToolbar(div);
};
IpkFicha.prototype.serializar = function(incluirClave){
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
            else
            {
                if(incluirClave)
                    if($(this).val() !== '')
                    {
                        if(this.name !== '')
                            obj[this.name] =  parseInt($.trim($(this).val()));
                    }
            }
        }
    });

    return obj;
};
IpkFicha.prototype.limpiar = function(){
    this.datos = undefined;
    this.colecciones = {};
    this.limpiarDatos();
};
IpkFicha.prototype.limpiarDatos = function(){
    $('input' , this.elemento).val('');
    $('input[type=checkbox]' , this.elemento).attr('checked',false);
    //$('.areaColecciones', this.elemento).hide();

    //$('.areaColecciones ul li', this.elemento).remove();
    //$('.areaColecciones div', this.elemento).remove();
    //$(".areaColecciones" , this.elemento).tabs("destroy");
};
IpkFicha.prototype.campoClave = function(){
    return _.find(this.estructura, function(elemento){return elemento.EsClave == true}).Nombre;
};
IpkFicha.prototype.valorClave = function(){
    return parseInt( $('#'+ this.campoClave()).val() );
};
IpkFicha.prototype.ocultarNotificaciones = function(){
    $(".areaNotificaciones" , this.elemento).hide();
};

IpkFicha.prototype.aplicarSeguridad = function(){
    var self = this;
    var campoNoDisponibles = undefined;
    if(app.seguridad.grupoActual != 'COMERCIAL')
        campoNoDisponibles = _.filter(this.estructura , function(elemento){ return elemento.Grupo == '' || elemento.Grupo == app.seguridad.grupoActual});
    else
        campoNoDisponibles = this.estructura;

    $.each(campoNoDisponibles, function(){
        $('#' + this.Nombre).attr('readonly' ,false);
        $('#' + this.Nombre).attr('disabled' ,false);
    });
};

IpkFicha.prototype.bloquearCampos = function(){
    var self = this;
    var campos = undefined;
    if(app.seguridad.grupoActual != 'COMERCIAL')
        campos = _.filter(this.estructura , function(elemento){ return elemento.Grupo == '' || elemento.Grupo == app.seguridad.grupoActual});
    else
        campos = this.estructura;

    $.each(campos, function(){
        $('#' + this.Nombre).attr('readonly' ,true);
        $('#' + this.Nombre).attr('disabled' ,true);
    });
};


//******* EVENTOS **********
IpkFicha.prototype.onEditarClick = function(){};
IpkFicha.prototype.onBorrarClick = function(){};
IpkFicha.prototype.onCopiarClick = function(){};
IpkFicha.prototype.onGuardarClick = function(){};
IpkFicha.prototype.onCancelarClick = function(){};

IpkFicha.Modos = {
    SoloLectura : "SoloLectura",
    Consulta    : "Consulta",
    Edicion     : "Edicion",
    Alta        : "Alta"
};
