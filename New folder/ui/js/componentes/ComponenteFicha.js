/**
 * Created by Maikel Merillas
 * User: mg01
 * Date: 11/06/12
 * Time: 17:37
 */
var ComponenteFicha = function(options){
    this.data = {};
    this.estructura = [];
    this.entidad = options.entidad;
    this.contenedor = options.contenedor;
    this.campoClave = options.campoClave;

    this.vincularEventos();
};
ComponenteFicha.prototype.vincularEventos = function(){
    var self = this;

    $('.ficha').delegate('.toolbar .btnGuardar', 'click', function(){
        app.eventos.publicar(ComponenteFicha.Eventos.OnBtnGuardarClick, {Entidad: self.entidad}, true);
    });

    $('.ficha').delegate('.toolbar .btnCancelar', 'click', function(){
        app.eventos.publicar(ComponenteFicha.Eventos.OnBtnCancelarClick, {Entidad: self.entidad}, true);
    });

    $('.ficha').delegate('.toolbar .btnEditar', 'click', function(){
        app.eventos.publicar(ComponenteFicha.Eventos.OnBtnEditarClick, {Entidad: self.entidad}, true);
    });
    $('.ficha').delegate('.toolbar .btnBorrar', 'click', function(){
        app.eventos.publicar(ComponenteFicha.Eventos.OnBtnBorrarClick, {Entidad: self.entidad}, true);
    });
    $('.ficha').delegate('.toolbar .btnCopiar', 'click', function(){
        app.eventos.publicar(ComponenteFicha.Eventos.OnBtnCopiarClick, {Entidad: self.entidad}, true);
    });
};

ComponenteFicha.prototype.setData = function(data){
    this.data = data;
};
ComponenteFicha.prototype.setEstructura = function(estructura){
    this.estructura = estructura;
    app.log.debug('Estructura', estructura);
    app.eventos.publicar(ComponenteFicha.Eventos.OnEstructuraChange, [estructura], true);
};

ComponenteFicha.prototype.Serializar = function(){
    var self = this;
    var obj = {};
    var selector = '#' +  this.contenedor + ' input[type != button],' + this.contenedor + ' select,' + this.contenedor + ' textarea';

    $.each($(selector), function(){
        if(this.type == 'checkbox')
            obj[this.name] = $(this).attr('checked') == 'checked' ? true : false;
        else
        {
            if($(this).attr('id') != self.campoClave)
            {
                if($(this).val() !== '')
                {
                    obj[this.name] = $.trim($(this).val());
                }
            }
        }
    })

    return obj;
};

// TODO: Implementar desde aqui la creacion del formulario
ComponenteFicha.prototype.renderFicha = function(){};


ComponenteFicha.Eventos = {
    OnDataChange        : "OnDataChange",
    OnEstructuraChange  : "OnEstructuraChange",

    OnBtnEditarClick    : "OnBtnEditarClick",
    OnBtnBorrarClick    : "OnBtnBorrarClick",
    OnBtnCopiarClick    : "OnBtnCopiarClick",
    OnBtnGuardarClick   : "OnBtnGuardarClick",
    OnBtnCancelarClick  : "OnBtnCancelarClick"
};