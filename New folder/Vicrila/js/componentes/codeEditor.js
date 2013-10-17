var CodeEditor = function(options){
    this.propiedades = options;
    this.control = undefined;
    this.editor = undefined;
    this.contenedor = undefined;

    this.template = "<div class='toolbar' style='margin-bottom: 0; padding-right: -2px;'>                        <ul>                        <li>                        <a class='btnGuardar'  href='#' title='Guardar' alt='Guardar'>                        <span class='icon-ok'></span><span>Guardar</span>                        </a>                        </li>                        <!--<li>                        <a class='btnBuscar' href='#' title='Buscar' alt='Buscar'>                        <span class='icon-search'></span><span>Buscar</span>                        </a>                        </li> -->                       <li>                        <a class='btnFormatear'  href='#' title='Formatear el texto seleccionado' alt='Formatear el texto seleccionado'>                        <span class='icon-align-justify'></span><span>Formatear</span>                        </a>                        </li>                        </ul>                        <div class='clearFix'></div>                        </div>                        <textarea id='txtCodigoExtension' rows='20' cols='150' class='codeEditor'></textarea>";
    return this;
};
CodeEditor.prototype.Crear = function(contenedor , textoInicial){
    var that = this,
        contenedorSelector = "body";

    this.contenedor = $('#' + contenedor);
    this.contenedor.append($(this.template));

    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
    };

    this.editor = CodeMirror.fromTextArea($('textarea' , this.contenedor)[0], {
        value : (textoInicial == undefined || textoInicial == '' )? '{}' : textoInicial,
        lineNumbers: true,
        matchBrackets: true,
        tabSize: 4,
        indentUnit: 4,
        indentWithTabs: true,
        mode:  "javascript",
        extraKeys: {"Ctrl-Space": "autocomplete"},
        onChange: function() {
            //console.log("Se ha cambiado el documento");
            //console.log(arguments);
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

    this.inicializarEventos();
    this.editor.initialFormat();
    return this.editor;
};
CodeEditor.prototype.inicializarEventos = function(){
    var that = this;

    $('.btnGuardar' , this.contenedor).on('click' , function(){
        console.log('Boton Guardar');
        arguments.control = that;
        that.onGuardar(arguments);
    });
    $('.btnFormatear' , this.contenedor).on('click' , function(){
        console.log('Boton Formatear');
        arguments.control = that;
        that.onFormatear(arguments);
    });
    $('.btnBuscar' , this.contenedor).on('click' , function(){
        console.log('Boton Buscar');
        arguments.control = that;
        that.onBuscar(arguments);
    });
};
CodeEditor.prototype.setValue = function(valor){

    if(valor == undefined || valor == null ||  valor == '')
        this.editor.setValue('{\n}');
    else
        this.editor.setValue(valor);

    this.initialFormat();
    this.editor.refresh();

    return this;
};
CodeEditor.prototype.getValue = function(){
    return this.editor.getValue().replace(/\n/g, "");
};
CodeEditor.prototype.getJsonValue = function(){
    return eval('( function(){ return ' + this.getValue()  + '  })()');
};
CodeEditor.prototype.initialFormat = function(){
    this.editor.initialFormat();

    return this;
};
CodeEditor.prototype.refresh = function(){
    this.editor.refresh();

    return this;
};

CodeEditor.prototype.onGuardar = function(event){
    console.log(event);
};
CodeEditor.prototype.onFormatear = function(event){
    this.editor.initialFormat();
    console.log(event);
};
CodeEditor.prototype.onBuscar = function(event){
    console.log(event);
};
