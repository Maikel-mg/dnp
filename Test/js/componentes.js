/// <reference path="data.js" />

/**
 * Comportamiento para proporcionar la capacidad de gestionar eventos
 * @type {Object}
 */
WhitEvents = {
    on : function(event, callback, context){
        this.publications = this.publications || [];

        if(this.publications[event])
            this.publications[event].push({'context' : context, 'callback' :  callback });
        else{
            this.publications[event] = [];
            this.publications[event].push({'context' : context, 'callback' :  callback });
        }
    },
    off : function(event){
        if(this.publications[event])
            this.publications[event] = [];
    },
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

    }
};
WhitValue = {
    Value : function(newValue){
        if(newValue !== undefined)
            this.$element.val(newValue);

        return this.$element.val();
    },
    to_JSON : function(){
        var serializado = {};
        serializado[this.nombre] = this.Value();

        return serializado;
    }
};

/**
 * Clase base para crear controles
 *
 * @class
 * @type {Class}
 */
Component = Class.extend({
    include: WhitEvents,

    /**
     * @constructor
     *
     * @param {Object} params Configuracion inicial
     */
    initialize : function(params){
        this.type = params.type;
        this.name = params.name;
        this.nombre = params.nombre;
        this.nombreInterno = params.nombreInterno;
        this.nameInternal = params.nameInternal;
        this.tipo = params.tipo;
        this.tipoInterno= params.tipoInterno;
        this.variables = params.variables;
        this.titulo = params.titulo;
        this.metodos = (typeof params.metodos == "string") ? $.extend({} , eval('( function(){ return ' + params.metodos + '  })()')) : params.metodos   ;
        this.events = (typeof params.events == "string") ? $.extend({} , eval('( function(){ return ' + params.events + '  })()')) : params.events   ;
        this.eventos = (typeof params.eventos == "string") ? $.extend({} , eval('( function(){ return ' + params.eventos + '  })()')) : params.eventos   ;
        this.conexiones = params.conexiones;
        this.container = params.container;
        this.renderTo = params.renderTo;
        this.tag = params.tag;

        if(params.styles && typeof params.styles == 'string' && params.styles.trim() !== "")
            this.styles = JSON.parse(params.styles.trim());
        else
            this.styles = params.styles;

        //if(params.styles && params.styles.trim && params.styles.trim() !== "") this.styles = (typeof params.styles == 'string') ? JSON.parse(params.styles) : params.styles;

        //this.styles = params.styles;
        $.extend(this, this.variables);
        $.extend(this, this.metodos);

        this.isComponent = true;
    },
    toHtml : function(){
        return "";
    },
    toString : function(){
        return "Component ";
    },
    render : function(){
        var html = this.toHtml();
        if(html){
            if(this.container)
                if(this.container.containerArea)
                    html.appendTo(this.container.containerArea);
                else
                    html.appendTo(this.container.$element);
            else
            {
                if(this.renderTo)
                    html.appendTo(this.renderTo);
                else
                    html.appendTo('body');
            }

            if(this.styles)
                html.css(this.styles);
        }

        return this;
    },
    addEvents : function(events){
    if(events)
    {
        if(events.ui){
            for(var event in events.ui)
            {
                this.$element.on(event, this, events.ui[event] );
            }
        }
        if(events.control){
            for(var event in events.control)
            {
                this.on(event, _.bind(events.control[event], this),  this);
            }
        }
    }
    },

    hide : function(){
        this.$element.hide();
    },
    show : function(){
        this.$element.show();
    },
    toggle : function(){
        this.$element.toggle();
    },
    habilitar: function(){
        this.$element.attr('disabled', false);
        this.$element.attr('readonly', false);
    },
    deshabilitar: function(){
        this.$element.attr('disabled', true);
        this.$element.attr('readonly', true);
    }
});

Container = Class.extend( Component , {
    initialize : function(params){
        this.parent(params);
        this.elements = params.elements;

        this.isContainer = true;
        this.$element = undefined;
        this.controls = [];
    },
    toHtml : function(){

        this.$element = $("<div />");
        this.addEvents(this.events);

        if(this.elements && this.elements.length > 0)
            this.renderChilds();



        return this.$element;
    },
    renderChilds : function(){
        var tmpControl = undefined;
        for( var i = 0; i < this.elements.length; i++)
        {
            this.elements[i].container = this;
            tmpControl = new window[this.elements[i].type](this.elements[i]);
            this.addControl( tmpControl );
            this.$element.append(tmpControl.render());
        }
    },
    refresh : function(){
        this.empty();
        this.controls = [];
        this.render();
    },
    empty : function(){

        if(this.containerArea)
            this.containerArea.find('*').remove();
        else
            this.$element.find('*').remove();
    },
    find : function(nombre){
        return _.find(this.controls , function(control){
            return control.nombre == nombre;
        });
    },
    toString : function(){
        return this.parent() + " Container ";
    },
    addElement : function(element, silent){
        this.elements.push(element);
        this.trigger('elementAdded', element);
    },
    addControl : function(control, silent){
        this.controls.push(control);
        this.trigger('controlAdded', control);
    },
    serialize : function(){
        var reg = {};
        _.each(this.controls, function(control){
            if(control['Value'])
                reg[control.nombreInterno] = control.Value();
        });

        return reg;
    }
});
Panel = Class.extend( Container , {
    initialize : function(params){
        this.parent(params);

        this.resizable = params.resizable;
        this.value = params.value;

        this.isRendered = false;
    },
    toHtml : function(){
        if(!this.isRendered)
        {
            this.$header = $("<div class='colAsbestos  header'/>");
            this.$content = $("<div class='content'/>");
            this.$footer = $("<div class='footer'/>");


            this.$element = $("<div class='ctrlPanel'/>");
            this.makeResizable();

            if(this.value)
            {
                var $title = $("<span />").text(this.value);
                this.$header.append($title);
                this.$element.append( this.$header );
            }

            this.$headerActions = $('<div class="headerActions floatLeft" style="margin-right: 5px"><i class="icon-white icon-chevron-up"></i></div>');
            this.$header.append(this.$headerActions);
            this.$header.on('click', _.bind(this.toggleCollapse, this));

            this.$element.append( this.$content );
            this.$element.append( this.$footer );

            this.containerArea = this.$content;

            this.addEvents(this.events);
        }
        else
        {
            this.containerArea.find('*').remove();
        }


        if(this.elements && this.elements.length > 0)
            this.renderChilds();

        this.isRendered = true;

        return this.$element;
    },
    renderChilds : function(){
        var tmpControl = undefined;
        for( var i = 0; i < this.elements.length; i++)
        {
            this.elements[i].container = this;
            tmpControl = new window[this.elements[i].type](this.elements[i]);
            this.controls.push( tmpControl );
            this.elements[i].container = this;

            tmpControl.render();
        }
    },
    toString : function(){
        return this.parent() + " Panel ";
    },
    makeResizable : function(){
        if(this.resizable)
        {
            if(this.container)
                this.$element.resizable({
                    handles : this.resizable,
                    containment : (this.container.containerArea) ? this.container.containerArea :  this.container.$element
                });
            else
                this.$element.resizable({handles : this.resizable});
        }
    },
    collapse : function(){
            this.$element.style('height', 'auto');
            this.$content.hide();
            this.$footer.hide();
            this.$headerActions.find('i')._toggleClass('icon-chevron-down');
            this.$headerActions.find('i')._toggleClass('icon-chevron-up');
    },
    decollapse : function(){
            this.$content.show();
            this.$footer.show();
            this.$headerActions.find('i')._toggleClass('icon-chevron-down');
            this.$headerActions.find('i')._toggleClass('icon-chevron-up');
    },
    toggleCollapse : function(){
            this.$content.toggle();
            this.$footer.toggle();
            this.$headerActions.find('i')._toggleClass('icon-chevron-down');
            this.$headerActions.find('i')._toggleClass('icon-chevron-up');
    }
});
Dialog = Class.extend( Container , {
    initialize : function(params){
        this.parent(params);

        this.title = params.title;
    },
    toHtml : function(){
        var $header = $("<div class='header'/>");
        var $content = $("<div class='content'/>");
        var $footer = $("<div class='footer'/>");

        this.$element = $("<div class='ctrlPanel'/>");
        if(this.value)
        {
            var $title = $("<span />").text(this.value);
            $header.append($title);
            this.$element.append( $header );
        }

        this.$element.append( $content );
        this.$element.append( $footer );

        this.containerArea = $content;

        this.addEvents(this.events);
        this.addEvents(this.eventos);

        this.renderChilds();

        /*
        this.$element.css({
            position : 'absolute',
            'z-index' : 99999,
            top : 200,
            left : 200
        });
         this.$element.draggable();
        */
/*
        this.$element.css({
            minHeight : '50px',
            minWidth :  '50px'
        });
        this.$element.resizable();
*/
        return this.$element;
    },
    render : function(){
        this.parent();
        var that = this;
        var paremtrosDialogo = {
            title       : this.title,
            autoOpen    : false,
            height   : 'auto',
            width    : '1000',
            modal: true,
            open: function( event, ui ) {
                that.trigger('opened', that);
            },
            close: function( event, ui ) {
                that.trigger('closed', that);
            }
        };

        this.$element = this.$element.dialog(paremtrosDialogo);

        this.$element.parent().removeClass('ui-corner-all');
        this.$element.parent().find('*').removeClass('ui-corner-all');
        this.$element.parent().css('padding', 0);
        this.$element.parent().find('.ui-dialog-titlebar').removeClass('ui-corner-all')


        var closeBtn = this.$element.parents('.ui-dialog').find("a.ui-dialog-titlebar-close");
        $(closeBtn).after('<a href="#" class="ui-dialog-titlebar-close" role="button" style="right: 2.3em;"><span class="ui-icon ui-icon-minusthick">minus</span></a>'); /* this adds the minus icon from the theme set */
        $('.ui-icon-minusthick').click(function() {
            //that.$element.parents('.ui-dialog').find('.ui-dialog-content').css("display","none");
            that.$element.parents('.ui-dialog').find('.ui-dialog-content').toggle();

        });

        /*
        $(closeBtn).after('<a href="#" class="ui-dialog-titlebar-close" role="button" style="right: 4.3em;"><span class="ui-icon ui-icon-resize-full">Full Screen</span></a>');
        $('.ui-icon-resize-full').click(function() {
            //that.$element.parents('.ui-dialog').find('.ui-dialog-content').css("display","none");
            that.$element.parents('.ui-dialog').css('height',window.screen.availHeight - 50);
            that.$element.parents('.ui-dialog').css('width',window.screen.availWidth - 50);
        });
        */
        this.$element.css('margin' , 0);
    },
    renderChilds : function(){
        var tmpControl = undefined;
        if(this.elements)
        {
            for( var i = 0; i < this.elements.length; i++)
            {
                this.elements[i].container = this;
                tmpControl = new window[this.elements[i].type](this.elements[i]);
                this.controls.push( tmpControl );
                //this.$element.find('.content').append(tmpControl.render());
                this.elements[i].container = this;
                tmpControl.render();
            }
        }
        this.trigger('rendered', this);
    },
    toString : function(){
        return this.parent() + " Panel ";
    },
    open : function(){
        this.$element.dialog('open');
    },
    close : function(){
        this.$element.dialog('close');
    }

});
Page = Class.extend( Container , {
    initialize : function(params){
        this.parent(params);

        this.trigger('initialized', this);
    },
    toHtml : function(){

        this.$element = $("<div class='ctrlPage'/>");
        this.addEvents(this.events);
        this.renderChilds();

        this.crearConexiones();

        this.trigger('created', this);
        return this.$element;
    },
    toString : function(){
        return this.parent() + " Page ";
    },
    crearConexiones : function(){
        var conexion, origen, destino ;
        for(var i in this.conexiones)
        {
            conexion = this.conexiones[i];
            origen = this.find(conexion.origen);
            destino = (conexion.destino == 'this') ? this : this.find(conexion.destino);

            origen.on(conexion.evento, _.bind(destino[conexion.ejecutar], destino), origen);
        }
    }
});

SaltoLinea = Class.extend( Component , {
    initialize : function(params){
        this.parent(params);
        this.$element = undefined;
    },
    toHtml : function(){
        this.$element = $("<br/>");
        return this.$element;
    },
    toString : function(){
        return this.parent() + " SaltoLinea ";
    }
});
Button = Class.extend( Component , {
    initialize : function(params){
        this.parent(params);

        this.value = params.value;

        this.isButton = true;
        this.$element = undefined;
    },
    toHtml : function(){

        this.$element = $("<input/>");
        this.$element.attr('type' , 'button');
        this.$element.attr('value' , this.value );
        this.$element.addClass('boton');
        //this.$element.appendTo('#container');
        this.addEvents(this.events);
        return this.$element;
    },
    toString : function(){
        return this.parent() + " Button ";
    }
});
TextBox = Class.extend( Component , {
    include : WhitValue,
    initialize : function( params){

        if(!params.styles)
            params.styles = {
                width : '80%'
            };
        else
        {
            if(params.styles && typeof params.styles == 'string' && params.styles.trim() !== "")
                if(params.styles.trim() == '{}')
                    params.styles = { width : '80%' };
                else
                    params.styles = JSON.parse(params.styles.trim());
            else
                params.styles = params.styles;
        }

        this.parent(params);

        this.value = params.value;

        this.isTextbox = true;
        this.$element = undefined;
    },
    toHtml : function(){
        /*
        var texto = "<div class='formElementWrapper medium textboxNumerico'> " +
            "<label class='formElementLabel' for='${Titulo}'>" +this.name + "</label> " +
            "<span class='formElementRequiredIndicator'>&nbsp;</span> " +
            "<input type='text' class='formElement ${Tipo}' id='${Nombre}' name='${Nombre}' /> " +
            "<span class='formElementType indicadorTipo'> <i class='fam style'></i> " +
            "</span>" +
            " <span class='formElementErrorInfo noValido'> <i class='fam error'></i> </span>" +
            " <div class='clearFix'></div>" +
            "</div>";

        var $textoElemento = $(texto);
        this.$element = $textoElemento.find('input'); //$("<input/>");
        */
        this.$element = $("<input/>");
        this.$element.attr('type' , 'text');
        this.$element.attr('value' , this.value );

        this.addEvents(this.events);
        if(this.eventos)
            this.addEvents(this.eventos);

        return this.$element;

    },
    toString : function(){
        return this.parent() + " Textbox ";
    },
    Value : function(newValue){
        if(newValue !== undefined)
            this.$element.val(newValue);

        var valor = "";

        if(enums.TipoCampoModelo[this.tipoInterno] == enums.TipoCampoModelo.Int)
            valor = parseInt(this.$element.val());
        else if(enums.TipoCampoModelo[this.tipoInterno] == enums.TipoCampoModelo.Float)
            valor = parseFloat(this.$element.val());
        else
            valor = this.$element.val();

        return valor;
    }
});
Datepicker = Class.extend( TextBox , {
    include : WhitValue,
    initialize : function( params){
        this.parent(params);

        this.value = params.value;

        this.isTextbox = true;
        this.$element = undefined;

    },
    toHtml : function(){
        this.parent();

        var that = this;

        $.datepicker.regional['es'] = {
            closeText: 'Cerrar',
            prevText: 'Ant',
            nextText: 'Sig>',
            currentText: 'Hoy',
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
            dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
            weekHeader: 'Sm',
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''};
        $.datepicker.setDefaults($.datepicker.regional['es']);
        this.$element.datepicker({
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true,
            onSelect: function(dateText){
                that.$element.blur();
            }
        });

        this.$element.off('blur');
        this.$element.on('blur', _.bind(this.validar, this));

        return this.$element;
    },
    validar : function(){
        var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        var valor = this.Value();

        if(valor.length > 0)
        {
            if (valor.match(re)==null)
                console.log('El campo no tiene el formato correcto.');
        }
    },
    toString : function(){
        return this.parent() + " DatePicker ";
    }
});
Label = Class.extend( Component , {
    initialize : function( params){
        this.parent(params);

        this.value = params.value;

        this.isLabel = true;
        this.$element = undefined;
    },
    toHtml : function(){
        this.$element = $("<span/>");
        this.$element.text(this.value);

        this.addEvents(this.events);

        return this.$element;
    },
    toString : function(){
        return this.parent() + " Text ";
    }
});
Icono = Class.extend( Component , {
    initialize : function( params){
        this.parent(params);

        this.value = params.value;

        this.isIcono = true;
        this.$element = undefined;
    },
    toHtml : function(){
        this.$element = $("<span/>");
        this.$element.addClass(this.value);

        this.addEvents(this.events);

        return this.$element;
    },
    toString : function(){
        return this.parent() + " Icono ";
    }
});
Checkbox = Class.extend( Component , {
    include : WhitValue,
    initialize : function( params){
        this.parent(params);

        this.value = params.value;

        this.isCheckbox = true;
        this.$element = undefined;
    },
    toHtml : function(){
        this.$element = $("<input type='checkbox' />");
        this.$element.text(this.value);

        this.addEvents(this.events);

        return this.$element;
    },
    Value : function(newValue){
      if(newValue !== undefined)
        this.$element.attr('checked', newValue);

      return this.$element.attr('checked') == 'checked';
    },
    toString : function(){
        return this.parent() + " Checkbox ";
    }
});
Combobox = Class.extend( Component , {
    include : WhitValue,
    initialize : function( params){
        this.parent(params);

        this.data = undefined;

        this.isCombobox = true;
        this.$element = undefined;
    },
    toHtml : function(){
        this.$element = $("<select/>");

        if(this.load)
            this.load();

        this.addEvents(this.events);
        if(this.eventos)
            this.addEvents(this.eventos);
        return this.$element;
    },
    setData : function(datos){

        var seleccion = this.$element.val();

        this.data = datos;

        this.$element.find('*').remove();
        /*if(this.load)
            this.load();
*/
        for(var i in this.data){
            this.createOption(this.convert(this.data[i]));
        }

        this.$element.val(seleccion);
    },
    createOption : function(option){
        var $option = $("<option value='" + option.value + "'>" + option.text + "</option>");

        this.$element.append($option);
    },
    toString : function(){
        return this.parent() + " Combobox ";
    }
});
Codigo = Class.extend( Component , {
    include : WhitValue,
    initialize : function( params){

        if(!params.styles)
            params.styles = {
                width : '75%'
            };

        this.parent(params);
        this.value = params.value;
        this.isCodigo = true;
        this.$element = undefined;
    },
    toHtml : function(){
        this.$element = $("<div>");

        this.$element = $("<input/>");
        this.$element.attr('type' , 'button');
        this.$element.attr('value' , this.titulo);
        this.$editor = $("<div class='editor' style='width:100%'><div class='toolbar' style='margin-bottom: 0; padding-right: -2px;'>                        <ul>                        <li>                        <a class='btnGuardar'  href='#' title='Guardar' alt='Guardar'>                        <span class='icon-ok'></span><span>Guardar</span>                        </a>                        </li>                        <!--<li>                        <a class='btnBuscar' href='#' title='Buscar' alt='Buscar'>                        <span class='icon-search'></span><span>Buscar</span>                        </a>                        </li> -->                       <li>                        <a class='btnFormatear'  href='#' title='Formatear el texto seleccionado' alt='Formatear el texto seleccionado'>                        <span class='icon-align-justify'></span><span>Formatear</span>                        </a>                        </li>                        </ul>                        <div class='clearFix'></div>                        </div>                        <textarea id='txtCodigoExtension' rows='20' cols='150' class='codeEditor'></textarea></div> ");

        //this.$element.append(this.$trigger);
        //this.$element.append(this.$editor);

        this.$editor = this.$editor.dialog({modal :true, autoOpen: false, title: 'Editor de estilos', height: window.screen.availHeight - 50, width: window.screen.availWidth - 50});

        CodeMirror.commands.autocomplete = function(cm) {
            CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
        };
        var that = this;
        this.editor = CodeMirror.fromTextArea($('textarea' , this.$editor)[0], {
            value : (this.value == undefined || this.value == '' )? '{}' : this.value,
            lineNumbers: true,
            matchBrackets: true,
            tabSize: 4,
            indentUnit: 4,
            //indentWithTabs: true,
            mode:  "javascript",
            extraKeys: {"Ctrl-Space": "autocomplete"},
            onChange: function() {

            },
            onCursorActivity: function() {
                //that.editor.matchHighlight("CodeMirror-matchhighlight");
                that.editor.setLineClass(that.editor.filaResaltada, null, null);
                that.editor.filaResaltada = that.editor.setLineClass(that.editor.getCursor().line, null, "activeline");
            }
        });
        this.editor.setValue((this.value == undefined || this.value == '' )? '{\n}' : this.value);
        this.editor.autoFormatSelection = function (){
            this.autoFormatRange(this.getCursor(true), this.getCursor(false));
        };
        this.editor.initialFormat = function (){
            this.setSelection({ch:0, line: 0}, {ch:1000, line: this.lineCount()});
            this.autoFormatSelection();
            this.setSelection({ch:0, line: 0}, {ch:0, line: 0});
        };
        this.editor.filaResaltada = this.editor.setLineClass(0, "activeline");

        this.addEvents(this.events);

        var that = this;
        this.$element.on('click', function(){
            that.$editor.dialog('open');
            //that.editor.setValue(that.Value());
            //that.initialFormat();
            that.editor.refresh();
        });
        $('.btnGuardar' , this.$editor).on('click' , function(){
            arguments.control = that;
            that.onGuardar(arguments);
        });

        return this.$element;

    },
    Value : function(newValue){
        if(newValue !== undefined)
        {
            if(newValue == undefined || newValue == null ||  newValue == '')
                this.editor.setValue('{\n}');
            else
                this.editor.setValue(newValue);

            this.initialFormat();
            this.editor.refresh();
        }

        return this.editor.getValue().replace(/\n/g, "");

        var value = eval('( function(){ return ' + this.editor.getValue().replace(/\n/g, "")  + '  })()');
        return   JSON.stringify(value, function(key, val) {
            if (typeof val === 'function') {
                return val + ''; // implicitly `toString` it
            }
            return val;
        });

    },
    initialFormat : function(){
        this.editor.initialFormat();
        return this;
    },
    refresh : function(){
        this.editor.refresh();
        return this;
    },
    toString : function(){
        return this.parent() + " Codigo ";
    }
});
CodeEditor = Class.extend( Component , {
    include : WhitValue,
    initialize : function( params){

        if(!params.styles)
            params.styles = {
                width : '75%'
            };

        this.parent(params);
        this.value = params.titulo;


        alert('OK');
        this.isCodeEditor = true;
        this.$element = undefined;
    },
    toHtml : function(){
        this.$element = $("<div>");

        this.$element = $("<input/>");
        this.$element.attr('type' , 'button');
        this.$element.attr('value' , this.value);
        this.$editor = $("<div class='editor' style='width:100%'>" +
            "<div class='toolbar' style='margin-bottom: 0; padding-right: -2px;'>       " +
            "<ul>                        " +
            "<li><a class='btnGuardar'  href='#' title='Guardar' alt='Guardar'><span class='icon-ok'></span><span>Guardar</span></a></li>         " +
            "<li><a class='btnFormatear'  href='#' title='Formatear el texto seleccionado' alt='Formatear el texto seleccionado'><span class='icon-align-justify'></span><span>Formatear</span></a></li>" +
            "</ul>" +
            "<div class='clearFix'></div>" +
            "</div>" +
            "<textarea id='txtCodigoExtension' rows='20' cols='150' class='codeEditor'></textarea>" +
            "</div> ");


        alert('OK');
        this.$editor = this.$editor.dialog({modal :true, autoOpen: false, title: 'Editor de estilos', height: '800', width: '800'});

        CodeMirror.commands.autocomplete = function(cm) {
            CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
        };

        this.editor = CodeMirror.fromTextArea($('textarea' , this.$editor)[0], {
            value : (textoInicial == undefined || textoInicial == '' )? '{}' : textoInicial,
            lineNumbers: true,
            matchBrackets: true,
            tabSize: 4,
            indentUnit: 4,
            indentWithTabs: true,
            mode:  "javascript",
            extraKeys: {"Ctrl-Space": "autocomplete"},
            onChange: function() {

            },
            onCursorActivity: function() {
                that.editor.matchHighlight("CodeMirror-matchhighlight");
                that.editor.setLineClass(that.editor.filaResaltada, null, null);
                that.editor.filaResaltada = that.editor.setLineClass(that.editor.getCursor().line, null, "activeline");
            }
        });
        this.editor.setValue((textoInicial == undefined || textoInicial == '' )? '{\n}' : textoInicial);
        this.editor.autoFormatSelection = function (){
            this.autoFormatRange(this.getCursor(true), this.getCursor(false));
        };
        this.editor.initialFormat = function (){
            this.setSelection({ch:0, line: 0}, {ch:1000, line: this.lineCount()});
            this.autoFormatSelection();
            this.setSelection({ch:0, line: 0}, {ch:0, line: 0});
        };

        this.editor.filaResaltada = this.editor.setLineClass(0, "activeline");


        this.addEvents(this.events);

        var that = this;
        this.$element.on('click', function(){ that.$editor.dialog('open');  });

        return this.$element;

    },
    toString : function(){
        return this.parent() + " Codigo ";
    }
});

Listview = Class.extend( Panel , {
    initialize : function(params){
        this.parent(params);

        this.value = params.value;
        this.componente = params.componente;
        this.data =  params.data;
    },
    render : function(){
        this.parent();

        this.$element.addClass('ctrlListview');
    },
    setData : function(data ){
        this.data = data ;
        this.renderChilds();
    },
    renderChilds : function(){
        var tmpControl = undefined;
        if( this.data)
        {
            this.controls = [];
            this.containerArea.find('*').remove();

            for( var i = 0; i < this.data.length; i++)
            {
                type = window[this.componente].type;
                tmpControl = new window[type](window[this.componente]);
                tmpControl.container = this;
                tmpControl.render();
                tmpControl.setData(this.data[i]);
                this.controls.push( tmpControl );
            }
        }
    },
    toString : function(){
        return this.parent() + " ListView ";
    }
});
Treeview = Class.extend( Panel , {
    initialize : function(params){
        this.parent(params);

        this.value = params.value;
        this.componente = params.componente;
        this.prop = params.prop;
        this.data =  params.data;
        this.nodes = params.nodes;
    },
    setData : function(data ){
        this.data = data ;
        this.containerArea.find('*').remove();
        this.renderChilds(this.data, -1);
    },
    render : function(){
        this.parent();

        this.$element.addClass('ctrlTree');
    },
    renderChilds : function(){
        if( this.data)
        {
            var nodo = undefined;
            nodo = new TreeviewNode({data : this.data , nivel : -1 , config : this.nodes});
            nodo.container = this;
            nodo.render();

            this.containerArea.append(nodo.$element);
        }
    },
    refresh : function(){
        this.setData(this.data);
    },
    toString : function(){
        return this.parent() + " Treeview ";
    }
});
TreeviewNode = Class.extend( Component , {
    initialize : function(params){
        this.parent(params);

        this.data =  params.data;
        this.nivel = params.nivel;
        this.config = params.config;

        this.$nivel = undefined;
        this.$hojas = undefined;
        this.$nodo = undefined;
    },
    setData : function(data ){
        this.data = data ;
        this.render();
    },
    render: function(){
        var nivelActual = this.nivel + 1;
        var nivelSiguiente = this.nivel + 2;
        var texto  = this.config.toNodeText(this);

        this.$nivel = $("<ul></ul>");
        this.$hojas = $("<ul></ul>");

        if( this.config.hasChilds(this.data) )
            //this.$textoNodo =  $("<div class='textoNodo'><span class='icon-minus'></span><span>" + texto +"</span></div>");
            this.$textoNodo =  $("<div class='textoNodo'><span class='fam bullet_toggle_minus'></span><span>" + texto +"</span></div>");
        else
            this.$textoNodo =  $("<div class='textoNodo'><span class='fam bullet_white' ></span><span>" + texto +"</span></div>");

        this.$nodo =  $("<li></li>").append(this.$textoNodo);

        this.$nodo.append(this.$hojas);
        this.$nivel.append(this.$nodo);

        if(this.config.hasChilds(this.data))
        {
            this.$element = this.$nivel;
            this.$textoNodo.on('click', this , this.toggle);
        }
        else
            this.$element = this.$nodo;

        this.renderChilds();
    },
    renderChilds : function(){
        if( this.data)
        {
            if(this.config.hasChilds(this.data))
            {
                var that = this;
                _.each(this.data[this.config.prop] , function(e){
                    var nodo = new TreeviewNode({data : e , nivel : that.nivel++, config: that.config});
                    nodo.container = that;
                    nodo.render();

                    if(that.config.hasChilds(e))
                    {
                        //that.$element.append(nodo.$element);
                        that.$hojas.append(nodo.$element);
                    }

                    else
                    {
                        that.$hojas.append(nodo.$element);
                    }


                });
            }
        }
    },
    toggle : function(event){
        event.data.$hojas.toggle();
        var el = $(this).find('span').eq(0);
        if(el.hasClass('bullet_toggle_minus'))
        {
            el.removeClass('bullet_toggle_minus');
            el.addClass('bullet_toggle_plus');
        }
        else
        {
            el.removeClass('bullet_toggle_plus');
            el.addClass('bullet_toggle_minus');
        }
    },
    toString : function(){
        return this.parent() + " Treeview ";
    }
});

Toolbar = Class.extend( Container , {
    initialize : function(params){
        this.parent(params);

        this.config = params;
    },
    toHtml : function(){

        this.$element = $("<div/>");
        this.$element.addClass('toolbar');

        this.$acciones = $('<ul></ul>');
        this.$element.append(this.$acciones);
        this.$element.append($('<div class="clearFix">'));

        this.addEvents(this.events);

        if(this.elements && this.elements.length > 0)
            this.renderChilds();

        return this.$element;
    },
    renderChilds : function(){
        for( var i = 0; i < this.elements.length; i++)
            this.addAction( this.elements[i] );
    },
    addAction :function(action){
/*
        {
            nombre : 'Nuevo',
            texto :'Nuevo',
            descripcion :'Crea un nuevo registro',
            clases : '',
            accessKey : undefined,
            icono : ''
        }
*/
        var actionButton = new ToolbarAction(action);
        actionButton.container = this;
        actionButton.render();
        this.$acciones.append(actionButton.$element);
        this.controls.push(actionButton);
    },
    onlyIcons: function() {
        _.each(this.controls ,
            function(action){
                $(action.$element.find('span')[1]).hide()
            }
        );
    },
    toString : function(){
        return this.parent() + " Toolbar ";
    }
});
ToolbarAction = Class.extend( Component , {
    initialize : function(params){
        this.parent(params);

        this.config = params;
    },
    toHtml : function(){

        this.$element = $("<li></li>");
        this.$element.attr('id', this.config.name);
        this.$element.attr('title', this.config.descripcion);
        this.$element.attr('alt', this.config.descripcion);
        this.$element.addClass(this.config.clases);

        var $a = $("<a></a>");
        $a.attr('href', '#');

        if(this.config.accessKey)
        {
            $a.attr('accessKey', this.config.accessKey);
        }

        if(this.config.icono)
        {
            var $icono = $("<span></span>");
            $icono.addClass(this.config.icono);
            $a.append($icono);
        }

        var $texto = $("<span></span>");
        $texto.text(this.config.value);

        $a.append($texto);
        this.$element.append($a);

        if(this.config.events)
        {
            if(!this.config.events.ui)
                this.config.events.ui ={
                    click : function(event){
                        var control =  event.data;
                        var contenedor = control.container;

                        contenedor.trigger('buttonClicked', control );
                        //contenedor.container.trigger('buttonClicked', control );
                    }
                };

        }
        else
        {
            this.config.events = {};
            this.config.events.ui ={
                click : function(event){
                    var control =  event.data;
                    var contenedor = control.container;

                    contenedor.trigger('buttonClicked', control );
                    //contenedor.container.trigger('buttonClicked', control );
                }
            };
        }

        this.addEvents(this.config.events );

        return this.$element;
    },
    toString : function(){
        return this.parent() + " ToolbarAction ";
    }
});

/**
 * Control Table
 * Muestra los datos en formato grid
 *
 * @extends {Component}
 */
Table = Class.extend( Component , {
    initialize : function(params){
        this.parent(params);

        this.columns = params.columns;
        this.hiddenColumns = params.hiddenColumns || [];
        this.sortColumn = undefined;
        this.sortDirection = undefined;
        this.modelCollection = params.modelCollection;
    },
    toHtml : function(){
        var cabeceras = this.createHeaders();
        var pie = this.createTableFoot();
        this.toolbar = new Toolbar(Controls.Toolbar.Consulta);
        this.toolbar.container = this;


        this.$element = $('<div class="listado"><table class="tabla"><thead>' + cabeceras + '</thead><tbody></tbody><tfoot>' + pie+ '</tfoot></table></div>');
        this.$element.prepend(this.toolbar.toHtml());
        this.addEvents(this.events);
        this.addEvents(this.eventos);

        this.vincularEnventos();
        this.setData([]);

        return this.$element;
    },
    createHeaders : function(){
        var columnas = "<tr>";
        var columnaActual;

        //columnas = columnas + "<th style='width: 3%;'><input type='checkbox' /></th>";
        for(var i in this.columns)
        {
            columnaActual = this.columns[i];
            if(typeof columnaActual == enums.TipoCampoModelo.String && this.hiddenColumns.indexOf(columnaActual.nombre) == -1)
                columnas =  columnas + "<th>" + columnaActual + "</th>";
            else
            {
                if (!columnaActual.esClave && this.hiddenColumns.indexOf(columnaActual.nombre) == -1)
                    columnas =  columnas + "<th>" + columnaActual.titulo + " <span class='icon-white icon-arrow-down' style='display: none;'></span></th>";
                this.binded =true;
            }

        }
        columnas =  columnas + "</tr>";

        return columnas;
    },
    createRows : function(){
        var filas = "",
            columnas = "",
            filaActual,
            columnaActual,
            valorClave;

        var colFilas = this.showingData;

        for(var i in colFilas)
        {
            filaActual = colFilas[i];
            //TODO: Descomentar el check de las tabla y los regitros cuando sepamos que vamos a hacer con ellos
            //columnas = columnas + "<th style='width: 3%;'><input type='checkbox' /></th>";
            for(var j in this.columns)
            {
                columnaActual = this.columns[j];
                if (!columnaActual.esClave && this.hiddenColumns.indexOf(columnaActual.nombre) == -1)
                    columnas =  columnas + "<td>" + filaActual[columnaActual.nombreInterno] + "</td>";

                if (columnaActual.esClave)
                    valorClave = filaActual[columnaActual.nombreInterno];
            }

            filas = filas +"<tr id='"+ valorClave +"'>" + columnas + "</tr>";

            columnas = "";
        }

        filas = $(filas);

        return filas;
    },
    crearAreaBusquedaInterna : function(){
        if(this.columns )
        {
            var tieneBusquedaInterna = false;
            var columnas = this.columns.length;
            var areaBusqueda = "<tr id='panelFiltro' class='noDisplay' style='background-color: #EDE9D5;'>";
            areaBusqueda += "<td colspan='" + columnas + "' style='background-color: #EDE9D5;'><div>";
            areaBusqueda += "<label for='filtro'>Buscar:</label><input type='text' id='filtroTexto' />";
            areaBusqueda += "<select id='filtroCampo'>";
            $.each(this.columns , function(){
                if (this.esBusquedaInterna)
                {
                    areaBusqueda += "<option value='" + this.nombre + "'>" + this.titulo + "</option>";
                    tieneBusquedaInterna = true;
                }
                    
            });
            areaBusqueda += "</select>" +
                "<input type='button' id='btnFiltro' value='Buscar' />" +
                "<input type='button' id='btnLimpiarFiltro' value='Limpiar' />";
            areaBusqueda += "</div></td></tr>";

            //return (tieneBusquedaInterna) ? areaBusqueda : '';
            return areaBusqueda ;
        }
    },
    crearAccionesPie : function(){
        var accionesPie = "";
        if(this.columns)
        {
            var columnas = this.columns.length;
            //TODO : Controlar que si el grid no tiene columnas de busqueda no muestre el boton
            accionesPie = "<tr class='colClouds'><td colspan='" + columnas + "'><div>";
            accionesPie += "<div id='gridActions' class='floatLeft'><a href='#' id='btnFiltrar' class='inline' accessKey='b'><span class='icon-search'>&nbsp;</span></a></div>";
            accionesPie += "<div id='numeroRegistros' class='floatRight'>N&uacute;m Registros:  <span id='count'> 0</span></div>";
            accionesPie += "</div></td></tr>";
        }

        return accionesPie;
    },

    createTableFoot : function(){
        return this.crearAreaBusquedaInterna() +  this.crearAccionesPie();
    },
    clearRows : function(){
        this.getTableBody()
            .find('*').remove();
    },
    getTableBody : function(){
        return this.$element.find('tbody');
    },
    campoClave : function(){
        var clave = _.find(this.columns, function(elemento){return elemento.esClave == true});
        var nombre = "";
        console.log(clave);
        if(clave === undefined)
            alert('No se ha seleccionado un campo clave para el listado "' + this.name  + '"');
        else
            nombre = clave.propiedad;

        return nombre;
    },
    valorClave : function(){
        return $('tr.seleccionado', this.getTableBody()).attr('id');
    },
    bindTo : function(collection){
        var that = this;
        this.collection = collection;
        this.collection.on('dataChanged',
            function (nuevoRegistro) {
                that.setData(that.collection.to_JSON());
            }
        ,this);
    },
    refresh : function(){

        this.clearRows();
        this.getTableBody()
            .append( $(this.createRows()) );

        this._updateNumberOfRecords();
    },
    setData : function(data, isFilter){
        if (!isFilter)
        {
            this.data = data;
            if (!this.collection && this.modelCollection)
            {
                this.collection = this.modelCollection;
                this.bindTo(this.modelCollection);
                this.data = this.collection.to_JSON();
                this.showingData = this.collection.to_JSON();
            }
            else{
                //this.collection.setData(this.data, true);
                //this.data = this.collection.to_JSON();
                if (this.modelCollection)
                    this.showingData = this.collection.to_JSON();
                else
                    this.showingData = data;
            }
        }
        else
        {
            this.showingData = data;
        }

        if(this.sortColumn)
            this.showingData = this.sortData(this.sortColumn, this.sortDirection);

        this.clearRows();
        this.getTableBody()
            .append( this.createRows() );

        this.trigger('applyStyles', this);

        this._updateNumberOfRecords();

        if(this.idFilaSeleccionada)
            this.getTableBody().find('tr#' + this.idFilaSeleccionada).addClass('seleccionado');

    },
    addData : function(data){
        this.data.push(data);
        this.setData(this.data);
    },
    sortData : function(columna, direction){
        var datosOrdenados  = _.sortBy(this.showingData, columna);
        if(direction == 'down')
            datosOrdenados = datosOrdenados.reverse();

        return datosOrdenados;
    },
    vincularEnventos : function(){
        var that = this;
        this.getTableBody().delegate('tr', 'click', _.bind(this._onMouseClick, this));
        this.$element.delegate('th','click', _.bind(this._onHeaderClick, this));
        this.$element.delegate('#btnFiltrar, #btnFiltro, #btnLimpiarFiltro', 'click' , _.bind(this._onFilterClick, this));
        this.$element.delegate('#filtroTexto', 'keypress' , _.bind(this._onFilterKeyPress, this) );
    },

    /* EVENT HANDLING METHODS */
    _onMouseClick : function(evento){
        var that = this;

        if(!window.clicks)
            window.clicks=0;

        window.clicks++;
        if (window.clicks == 1) {
            setTimeout(function() {
                if(window.clicks == 1) {
                    that._onClick(evento);
                } else {
                    that._onDblClick(evento);
                }
                window.clicks = 0;
            },  300);
        }


    },
    _onHeaderClick : function(evento){
        var columna = evento.currentTarget.innerText.trim();
        this.sort(columna);
    },
    _onClick : function(evento){
        this._seleccionarFila(evento);
        this.trigger('rowClick', this);
    },
    _onDblClick : function(evento){
        this._seleccionarFila(evento);
        this.trigger('rowDblClick', this);
    },
    _onFilterClick : function(evento){
        switch(evento.currentTarget.id){
            case 'btnFiltrar':
                this._toggleFilterPanel();
                break;
            case 'btnFiltro':
                this._applyFilter();
                break;
            case 'btnLimpiarFiltro':
                this._clearFilter();
                break;
        }
    },
    _onFilterKeyPress : function(evento){
        if(evento.keyCode == 13)
            this._applyFilter();
    },

    /* SORTING METHODS */
    sort : function(columna){
        var columnIndex = _.map(this.$element.find('thead th'), function(e){ return $(e).text().trim() ;}).indexOf(columna);
        var columnInternalName = _.find(this.columns, function(e){ return e.titulo == columna}).nombreInterno;

        this._setOrderVariables(columnInternalName);
        this._setOrderIcon(columnIndex);
        this._setOrderedData(columnInternalName);
    },
    _setOrderedData : function(columna){
        var datosOrdenados  = this.sortData(columna, this.sortDirection);
        this.setData(datosOrdenados, true);
    },
    _setOrderVariables : function(columna){
        if(this.sortColumn !== columna)
            this.sortDirection = 'up';
        else
            this.sortDirection = ((this.sortDirection == 'up') ? 'down' : 'up');

        this.sortColumn = columna;
    },
    _setOrderIcon: function(columnIndex){
        this.$element.find('th span').hide();

        if(this.sortDirection == 'up')
        {
            this.$element.find('th span').removeClass('icon-arrow-down');
            this.$element.find('th span').addClass('icon-arrow-up');
        }
        else
        {
            this.$element.find('th span').removeClass('icon-arrow-up');
            this.$element.find('th span').addClass('icon-arrow-down');
        }
        $(this.$element.find('th span')[columnIndex]).show();
    },

    /* FILTERING METHODS */
    filter : function(columna, valor){
        var campo = _.find(this.columns, function(e){ return e.nombre == columna});

        var datosFiltro = undefined ;
        if(campo.tipoInterno.toLowerCase() == enums.TipoCampoModelo.String )
            datosFiltro = _.filter(this.data, function(e){return e[columna].indexOf(valor) !=-1});
        else
            datosFiltro = _.filter(this.data, function(e){return e[columna].toString() == valor.toLowerCase()});

        this.setData(datosFiltro, true);
    },
    _toggleFilterPanel : function(){
        this.$element.find('#panelFiltro').toggleClass('noDisplay');
    },
    _applyFilter : function(){
        var filtroCampo = this.$element.find('#filtroCampo').val();
        var filtroTexto = this.$element.find('#filtroTexto').val();
        this.filter(filtroCampo, filtroTexto);
    },
    _clearFilter : function(){
        this.setData(this.data, true);
    },

    /* INTERNAL METHODS */
    _seleccionarFila : function(evento){
        var that = this;
        this.$filaSeleccionada = $(evento.currentTarget);
        this.idFilaSeleccionada = this.$filaSeleccionada.attr('id');
        this.datosFilaSeleccionada = _.find(this.data, function(e){
            return e[that.campoClave()] == that.idFilaSeleccionada;
        });

        $('tr.seleccionado', this.getTableBody()).removeClass('seleccionado');
        this.$filaSeleccionada.addClass('seleccionado');

    },
    _updateNumberOfRecords : function(){
        if(this.data.length != this.showingData.length)
            this.$element.find('#count').text(this.showingData.length + ' de ' + this.data.length);
        else
            this.$element.find('#count').text(this.showingData.length);
    },
    toString : function(){
        return this.parent() + " Treeview ";
    }
});
TablePresentacion = Class.extend( Table , {
    initialize : function(params){

        this.presentacion =  params.presentacion;

        if(this.presentacion.metodos)
            params.metodos = this.presentacion.metodos;

        if(this.presentacion.eventos)
            params.eventos = this.presentacion.eventos;

        this.parent(params);
        /*
        this.presentacion =  _.find(encuestaPresentacion, function(e){
            return e.nombre == params.presentacion;
        });
        */



        var campos = _.reject(this.presentacion.campos, function(campo){return campo.modo == enums.ModoCampoPresentacion.Oculto;} );
        this.columns = _.sortBy(campos,'orden');
    },
    createRows : function(){
        var filas = "",
            columnas = "",
            filaActual,
            columnaActual,
            valorClave;

        var colFilas = this.showingData;

        for(var i in colFilas)
        {
            filaActual = colFilas[i];

            //columnas =  columnas + "<td style='width: 3%;' ><input type='checkbox' /></td>";
            for(var j in this.columns)
            {
                columnaActual = this.columns[j];
                if (!columnaActual.esClave && this.hiddenColumns.indexOf(columnaActual.nombre) == -1)
                    columnas =  columnas + "<td>" + filaActual[columnaActual.nombreInterno] + "</td>";
                else
                    valorClave = filaActual[columnaActual.nombreInterno];
            }

            filas = filas +"<tr id='"+ valorClave +"'>" + columnas + "</tr>";

            columnas = "";
        }

        filas = $(filas);


        return filas;
    },
    campoClave : function(){
        var clave = _.find(this.columns, function(elemento){return elemento.esClave == true});
        var nombre = "";
        if(clave === undefined)
            alert('No se ha seleccionado un campo clave para el listado "' + this.name  + '"');
        else
            nombre = clave.nombreInterno;

        return nombre;
    },
    toString : function(){
        return this.parent() + " TablePresentacion ";
    }
});

Ficha = Class.extend(Dialog , {
    initialize : function(params){
        /*
        this.presentacion =  _.find(encuestaPresentacion, function(e){
            return e.nombre == params.presentacion;
        });
        */
        this.presentacion = params.presentacion;

        if(this.presentacion.title)
            params.title = this.presentacion.title;

        if(this.presentacion.metodos)
            params.metodos = this.presentacion.metodos;

        if(this.presentacion.eventos)
            params.eventos = this.presentacion.eventos;

        this.parent(params);

        this.elements = _.clone(this.presentacion.campos);
        this.grupos = _.groupBy(this.elements, 'grupo');
        this.modo = Ficha.Modos.Consulta;
    },
    toHtml : function(){
        if(!this.isRendered)
        {
            var $header = $("<div class='header'/>");
            var $content = $("<div class='content'/>");
            var $footer = $("<div class='footer'/>");


            this.$element = $("<div class='ctrlPanel'/>");
            this.makeResizable();

            if(this.value)
            {
                var $title = $("<span />").text(this.value);
                $header.append($title);
                this.$element.append( $header );
            }

            this.$element.append( $content );
            this.$element.append( $footer );
            this.containerArea = $content;

            this.toolbar = new Toolbar(Controls.Toolbar.Ficha);
            this.toolbar.container = this;
            this.$element.prepend(this.toolbar.toHtml());

            this.addEvents(this.events);
            this.addEvents(this.eventos);
        }
        else
        {
            this.containerArea.find('*').remove();
        }

        if(this.elements && this.elements.length > 0)
            this.renderChilds();

        this.isRendered = true;

        this.trigger('rendered', this );

        return this.$element;
    },
    renderChilds : function(){
        var tmpControl = undefined,
            tmpControlLabel = undefined,
            estiloControl;

        _.each(this.elements , function(r) {
            r.orden = parseInt(r.orden);
            if(r.grupo == null || r.grupo == undefined) r.grupo = '';
        });

//        console.log(  _.groupBy(this.elements, 'grupo')  );
        this.grupos = _.groupBy(this.elements, 'grupo');
        console.log('GRUPOS');
        console.log(this.grupos);

        var grupo = undefined,
            camposGrupo = undefined;

        for( var nombreGrupo in this.grupos){
                camposGrupo = _.sortBy(this.grupos[nombreGrupo], 'orden');

                console.log(nombreGrupo);
                console.log(camposGrupo);
                console.log('....');
                var config = { nombre : nombreGrupo,
                    nombreInterno : nombreGrupo,
                    value : nombreGrupo.toUpperCase()
                };

                if(nombreGrupo == "")
                {
                    config.styles = '{ "border": "0"}';
                    config.value = '_PRUEBA_';
                }


                grupo = new Panel( config );
                grupo.container = this;
                grupo.render();


                for( var i = 0; i < camposGrupo.length; i++)
                {
                    camposGrupo[i] = $.extend({} , tmplCampoPresentacion, camposGrupo[i]);
                    camposGrupo[i].container = grupo;
                    if(camposGrupo[i].titulo.length > 0)
                    {
                        estiloControl = camposGrupo[i].styles;
                        camposGrupo[i].styles = {
                            display : 'inline-block',
                            width : '10%'
                        };
                        camposGrupo[i].value = camposGrupo[i].titulo;
                        tmpControlLabel = new Label($.extend({} , camposGrupo[i], { nombre : camposGrupo[i].nombre + 'Label',nombreInterno : camposGrupo[i].nombreInterno + 'Label'}));
                        camposGrupo[i].container = grupo;
                        this.controls.push( tmpControlLabel );
                        tmpControlLabel.render();
                        camposGrupo[i].value = "";
                    }

                    camposGrupo[i].styles = estiloControl;
                    tmpControl = new window[camposGrupo[i].tipo](camposGrupo[i]);
                    grupo.controls.push( tmpControl );
                    this.controls.push( tmpControl );
                    camposGrupo[i].container = grupo;

                    tmpControl.render();

                    if(camposGrupo[i].modo == enums.ModoCampoPresentacion.Oculto)
                    {
                        tmpControlLabel.hide();
                        tmpControl.hide();
                    }
                }



        }







/*        for( var i = 0; i < this.elements.length; i++)
        {
                this.elements[i] = $.extend({} , tmplCampoPresentacion, this.elements[i]);
                this.elements[i].container = this;
                if(this.elements[i].titulo.length > 0)
                {
                    estiloControl = this.elements[i].styles;
                    this.elements[i].styles = {
                        display : 'inline-block',
                        width : '10%'
                    };
                    this.elements[i].value = this.elements[i].titulo;
                    tmpControlLabel = new Label($.extend({} , this.elements[i], { nombre : this.elements[i].nombre + 'Label',nombreInterno : this.elements[i].nombreInterno + 'Label'}));
                    this.elements[i].container = this;
                    this.controls.push( tmpControlLabel );
                    tmpControlLabel.render();
                    this.elements[i].value = "";
                }

                this.elements[i].styles = estiloControl;
                tmpControl = new window[this.elements[i].tipo](this.elements[i]);
                this.controls.push( tmpControl );
                this.elements[i].container = this;

                tmpControl.render();

                if(this.elements[i].modo == enums.ModoCampoPresentacion.Oculto)
                {
                    tmpControlLabel.hide();
                    tmpControl.hide();
                }

        }*/
    },
    tieneGrupos : function(){
     return  this.grupos;
    },
    toString : function(){
        return this.parent() + " Panel ";
    },
    makeResizable : function(){
        if(this.resizable)
        {
            if(this.container)
                this.$element.resizable({
                    handles : this.resizable,
                    containment : (this.container.containerArea) ? this.container.containerArea :  this.container.$element
                });
            else
                this.$element.resizable({handles : this.resizable});
        }
    },

    campoClave : function(){
        var clave = _.find(this.elements, function(elemento){return elemento.esClave == true});
        var nombre = "";

        if(clave === undefined)
            alert('No se ha seleccionado un campo clave para la ficha "' + this.name  + '"');
        else
            nombre = clave.nombreInterno;

        return nombre;
    },
    valorClave : function(){
        return this.$element.find('#' + this.campoClave()).val();
    },
    setData : function(data){
        this.data = data;

        _.each(this.controls, function(control){
            if(control['Value'])
                control.Value(data[control.nombreInterno]);
        });
    },
    limpiar : function(){
        this.data = undefined;
        this.colecciones = undefined;
        this.limpiarDatos();
    },
    limpiarDatos : function(){
        _.each(this.controls , function(control){
            if(control.Value)
                control.Value(' ');
        });
    },
    bloquearControles : function(){
        _.each(this.controls , function(control){ control.deshabilitar();})
    },
    desbloquearControles : function(){
        _.each(this.controls , function(control){ control.habilitar();})
    },

    modoSoloLectura : function(){
        this.modo = Ficha.Modos.SoloLectura;
        this.bloquearControles();
    },
    modoAlta : function(){
        this.modo = Ficha.Modos.Alta;
        this.limpiar();
        this.toolbar.modoEdicion();
        this.desbloquearControles();
        this.setFocusInControls();
    },
    modoEdicion : function(){
        this.modo = Ficha.Modos.Edicion;
        this.toolbar.modoEdicion();
        this.desbloquearControles();
        this.setFocusInControls();
    },
    modoConsulta : function(){
        if(this.modo == Ficha.Modos.Alta)
            this.limpiar();
        else if(this.modo == Ficha.Modos.Edicion)
            this.setData(this.data);

        this.modo = Ficha.Modos.Consulta;
        this.toolbar.modoConsulta();
        this.bloquearControles();
    },
    setFocusInControls : function(){
        _.filter(this.controls, function(e){return (e.Value && e.nombre !== 'id')})[0].$element.focus();
    }
});
Ficha.Modos = {
    SoloLectura : "SoloLectura",
    Consulta    : "Consulta",
    Edicion     : "Edicion",
    Alta        : "Alta"
};

Grid = Class.extend(Component,{
    include : WhithEvents,
    initialize: function(params){
        this.parent(params);
        this.tablaConfig = params.tablaConfig;
        this.fichaConfig = params.fichaConfig;
        this.initializeComponent();

        return this;
    },
    initializeComponent : function(){
        this.initializeUI();
        this.initializeEvents();
    },
    initializeUI : function(){
        /* FICHA */
        this.ficha = new Ficha(this.fichaConfig);
        this.ficha.render();
        this.ficha.container = this;

        /* TABLA */
        this.tabla = new TablePresentacion(this.tablaConfig);
        this.tabla.render();
        this.tabla.container = this;

    },
    initializeEvents : function(){
        /* TOOLBAR FICHA ENCUESTAS */
        this.ficha.toolbar.on('buttonClicked', function(boton, contexto){
            switch (boton.nombre)
            {
                case 'btnEditar':
                    contexto.ficha.modoEdicion();
                    break;
                case 'btnGuardar':
                    var registro = undefined;
                    var nuevosDatos = contexto.ficha.serialize();

                    delete nuevosDatos[contexto.ficha.campoClave()];

                    contexto.ficha.trigger('guardar', {modo : contexto.ficha.modo , nuevodDatos: nuevosDatos} );

                    if(contexto.ficha.modo == Ficha.Modos.Alta)
                        registro = contexto.tabla.collection.crear(nuevosDatos);
                    else
                    {
                        registro = contexto.tabla.collection.actualizar('id', contexto.tabla.idFilaSeleccionada, nuevosDatos);
                        contexto.tabla.datosFilaSeleccionada = $.extend({}, contexto.tabla.datosFilaSeleccionada, nuevosDatos);
                    }
                    contexto.ficha.modoConsulta();
                    contexto.ficha.close();
                    break;
                case 'btnCancelar':
                    contexto.ficha.modoConsulta();
                    break;
            }
        }, {grid: this, tabla : this.tabla, ficha: this.ficha});

        /* TOOLBAR TABLA ENCUESTAS */
        this.tabla.toolbar.on('buttonClicked', function(boton, contexto){
            switch (boton.nombre)
            {
                case 'btnNuevo':
                    contexto.ficha.modoAlta();
                    contexto.ficha.open();
                    break;
                case 'btnEditar':
                    contexto.ficha.modoConsulta();
                    contexto.ficha.setData(contexto.tabla.datosFilaSeleccionada);
                    contexto.ficha.open();
                    break;
                case 'btnBorrar':
                    if(confirm('¿ Está seguro que desea borrar el registro seleccionado ?'))
                        if(confirm('¿ Confirma que desea borrar el registro seleccionado ?'))
                        {
                            contexto.tabla.collection.eliminar(contexto.tabla.campoClave(), contexto.tabla.idFilaSeleccionada);
                            contexto.tabla.$filaSeleccionada.remove();
                        }
                    break;
            }
        }, {tabla : this.tabla, ficha: this.ficha});

        this.on('fichaGuardar', function(){
            console.log('fichaGuardar');
            console.log(arguments);

        }, {tabla : this.tabla, ficha: this.ficha});
    },
    setData : function(data){
        this.tabla.setData(data);
    }
});



























