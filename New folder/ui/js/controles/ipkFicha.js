var IpkFicha = function(configuracion){
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

//******* FUNCIONES DE CREACION DEL CONRTROL **********
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
    var idToolbar = 'toolbar' + this.propiedades.nombre ;
    var toolbarContainer = $('<div id="' + idToolbar  + '"></div>');
    div.append(toolbarContainer);

    this.toolbar = new IpkToolbar({
        contenedor : idToolbar ,
        id         : idToolbar
    });

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

    var self = this;
    this.toolbar.onEditar = function(){
        var eventArgs = {target : arguments, sender : self};
        app.log.debug('onEditar', arguments);
        self.setModo(IpkFicha.Modos.Edicion);
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
};
IpkFicha.prototype.crearAreaNotificaciones = function(div){
    var divNotificaciones = $('<div id="areaNotificaciones" class="areaNoficaciones">');

    divNotificaciones.hide();
    div.append(divNotificaciones);
};
IpkFicha.prototype.crearCtrlFormulario = function(div){
    this.areaControles = $("<div id='areaControles" + this.propiedades.Nombre + "' class='controles'>");
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
                        var referencia = new Referencia(campo, self.areaControles , {});
                        self.controlesObj[campo.Nombre] = referencia;
                        self.controles.push(referencia);
                        self.areaControles.append(referencia._control);
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


                                //var control = new ColeccionHijos(campo, self, {});
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
    //$('<div class="clearFix"> </div>').appendTo(self.areaControles);
    this.setModo(this.modo);
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
                        if( !$.isEmptyObject(self.colecciones))
                        {


                            app.log.debug('Coleccion ---- ' + campo.Nombre , self.colecciones[campo.Nombre]);
                            self.colecciones[campo.Nombre].setDatos(self.datos[campo.Nombre]);
                        }
                        else
                        {
                            if(campo.SonHijos)
                            {
                                var control = new IpkTablaHijos(self ,campo, self.datos[campo.Nombre]);

                                self.controles.push(control);
                                self.controlesObj[campo.Nombre] = control;
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

    if(tieneColecciones)
        $(".areaColecciones" , this.elemento).tabs({collapsible: true});
};
IpkFicha.prototype.setEstructura = function(estructura){
    this.configuracionFicha = estructura;
    this.estructura = estructura.zz_CamposFichas;

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
    }

    this.modo = modo;
};
IpkFicha.prototype.setPadre = function(padre){
    this.datosPadre = padre;
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
    $('.areaColecciones', this.elemento).hide();
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
