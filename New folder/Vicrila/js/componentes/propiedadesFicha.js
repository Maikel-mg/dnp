/**
 * Created by Maikel
 * User: mg01
 * Date: 01/10/2012
 * Time: 12:00
 * Control de ficha para el campo de las fichas
 */
var EditorCampo = function(options){
    var self = this;
    this.defaults = {
        contenedor: 'body'
    };
    this.propiedades = $.extend(this.defaults,  options);
    this.campo = {};

    this.html = $(this.propiedades.contenedor).load('../js/componentes/html/propiedadesFicha.html', function(){
        self.cachearElementos();
        self.vincularEventos();


    });

    this.crearDSFuentesNavision();
    this.crearDSFuentesInternas();
    this.crearDSModelos();

    this.fuentesNavisionDS.Listado();
    this.fuentesInternasDS.Listado();
    this.modelosDS.Listado();




    return this;
};

EditorCampo.prototype.cachearElementos = function(){
    this.control = $('div#propiedades', this.html);
    this.titulo = $('span .block-Title', this.html);

    this.nombre = $('input#nombreCampo', this.html);
    this.titulo = $('input#tituloCampo', this.html);
    this.esClave = $('input#esClave', this.html);
    this.esIndice = $('input#esIndice', this.html);
    this.esNullable = $('input#esNullable', this.html);
    this.esSoloLectura = $('input#esLectura', this.html);
    this.tipoCampo = $('select#tipoCampo', this.html);
    this.referencia = $('select#referencia', this.html);
    this.esPadre = $('input#esPadre', this.html);
    this.sonHijos = $('input#sonHijos', this.html);
    this.fuentesNavision = $('select#fuenteNavision', this.html);
    this.fuentesInternas = $('select#fuenteInterna', this.html);
    this.grupo = $('select#grupo' ,this.html);
    this.orden = $('input#ordenCampo' ,this.html);
    this.btnEventos = $('#btnEventos', this.html);

    this.propiedadesReferencia = $('#propiedadesReferencia', this.html);
    this.propiedadesColeccion = $('#propiedadesColeccion', this.html);
    this.propiedadesComboNavision= $('#propiedadesComboNavision', this.html);
    this.propiedadesComboInterno = $('#propiedadesComboInterno', this.html);

    this.editorComportamientos = new EditorComportamientos($('#eventos'));

    this.editorEventos = undefined;
    this.editorEventos = new CodeEditor();
    this.editorEventos.Crear('dlgEditorEventos', "{\n}");
    this.editorEventos.onGuardar = function(eventArgs){
        console.log('Capturamos el evento del guardar');
        console.log(eventArgs.control.getJsonValue());
    };
    var self = this;
    this.dlgEditorEventos =  $('#dlgEditorEventos').dialog({
        autoOpen : false,
        title : 'Editor de eventos del control',
        height : '700',
        width : '1000',
        open : function(){
            self.editorEventos.refresh();
        }
    });

    this.plantillaComboNavision = $('<script type="text/template" id="comboFuenteNavisionTemplate"><option value="${IdFuente}">${Nombre}</option></script>');
    this.plantillaComboReferencia = $('<script type="text/template" id="comboReferenciaTemplate"><option value="${IdModelo}">${Nombre}</option></script>');
    this.plantillaComboInterno = $('<script type="text/template" id="comboFuenteInternoTemplate"><option value="${IdFuente}">${Nombre}</option></script>');
};
EditorCampo.prototype.vincularEventos = function(){
    var self = this;
    $(this.tipoCampo,  this.html ).on('change' , function(){
        //self.reset();

        var nuevoTipo = self.tipoCampo.val();
        if(nuevoTipo == 'Reference')
        {
            self.referencia.removeClass('noDisplay');
            self.propiedadesReferencia.removeClass('noDisplay');
        }
        if(nuevoTipo == 'Collection')
        {
            self.referencia.removeClass('noDisplay');
            self.propiedadesColeccion.removeClass('noDisplay');
        }
        if(nuevoTipo == 'ComboNavision')
        {
            self.propiedadesComboNavision.removeClass('noDisplay');
        }
        if(nuevoTipo == 'ComboInterno')
        {
            self.propiedadesComboInterno.removeClass('noDisplay');
        }
    });


    $(this.btnEventos , this.html).on('click', function(){
        self.dlgEditorEventos.dialog('open');
    });

    $('#btnGuardarCampo').on('click', function(){
        self.onGuardar();
    });
};
EditorCampo.prototype.reset = function(){
    this.nombre.val('');
    this.titulo.val('');
    this.esClave.attr('checked', false);
    this.esIndice.attr('checked', false);
    this.esNullable.attr('checked', false);
    this.esSoloLectura.attr('checked', false);
    this.orden.val('');
    this.editorEventos.setValue('{}');

    this.referencia.addClass('noDisplay');
    this.propiedadesReferencia.addClass('noDisplay');
    this.propiedadesColeccion.addClass('noDisplay');
    this.propiedadesComboNavision.addClass('noDisplay');
    this.propiedadesComboInterno.addClass('noDisplay');
};

EditorCampo.prototype.cargarCampo = function(Campo){

    this.campo = Campo;
    this.nombre.val( Campo.Nombre );
    this.titulo.val( Campo.Titulo );
    this.tipoCampo.val( Campo.Tipo );
    this.esClave.attr('checked', Campo.EsClave);
    this.esIndice.attr('checked', Campo.EsIndice);
    this.esNullable.attr('checked', Campo.EsNullable);
    this.esSoloLectura.attr('checked', Campo.EsLectura);
    this.tipoCampo.val( Campo.Tipo );
    this.grupo.val(Campo.Grupo);
    this.orden.val( Campo.Orden );
    this.editorEventos.setValue(Campo.Eventos);

    if(Campo.IdReferencia !== undefined && Campo.IdReferencia != 0)
    {
        this.referencia.val(Campo.IdReferencia);
        this.esPadre.attr('checked', Campo.EsPadre);
        this.sonHijos.attr('checked', Campo.SonHijos);
    }
    if( Campo.Tipo == 'ComboNavision' )
    {
        this.fuentesNavision.val(Campo.IdReferencia);
    }
    if( Campo.Tipo == 'ComboInterno' )
    {
        this.fuentesInternas.val(Campo.IdReferencia);
    }

    if(typeof this.campo.comportamientos == "string")
        this.campo.comportamientos = JSON.parse(this.campo.comportamientos);

    this.editorComportamientos.CargarControl(this.campo);

    this.referencia.addClass('noDisplay');
    this.propiedadesReferencia.addClass('noDisplay');
    this.propiedadesColeccion.addClass('noDisplay');
    this.propiedadesComboNavision.addClass('noDisplay');
    this.propiedadesComboInterno.addClass('noDisplay');

    if( Campo.Tipo == 'Reference' )
    {
        this.referencia.removeClass('noDisplay');
        this.propiedadesReferencia.removeClass('noDisplay');
    }
    if( Campo.Tipo== 'Collection' )
    {
        this.referencia.removeClass('noDisplay');
        this.propiedadesColeccion.removeClass('noDisplay');
    }
    if( Campo.Tipo== 'ComboNavision' )
    {
        this.propiedadesComboNavision.removeClass('noDisplay');
    }
    if( Campo.Tipo== 'ComboInterno' )
    {
        this.propiedadesComboInterno.removeClass('noDisplay');
    }
};
EditorCampo.prototype.actualizarCampo = function(){
    this.campo.Nombre = this.nombre.val();
    this.campo.Titulo= this.titulo.val();
    this.campo.Tipo = this.tipoCampo.val();
    this.campo.EsClave = (this.esClave.attr('checked') == 'checked');
    this.campo.EsIndice = (this.esIndice.attr('checked') == 'checked');
    this.campo.EsNullable = (this.esNullable.attr('checked') == 'checked');
    this.campo.EsLectura = (this.esSoloLectura.attr('checked') == 'checked');
    this.campo.Grupo = this.grupo.val();
    this.campo.Orden = (this.orden.val() == '') ? 0 : this.orden.val();
    this.campo.Eventos = this.editorEventos.getValue();

    if(this.campo.Tipo == 'Reference' || this.campo.Tipo == 'Collection')
    {
        this.campo.IdReferencia = parseInt(this.referencia.val());
        if(this.campo.Tipo == 'Reference')
            this.campo.EsPadre = (this.esPadre.attr('checked') == 'checked');
        else
            this.campo.SonHijos = (this.sonHijos.attr('checked') == 'checked');
    }

    if(this.campo.Tipo == 'ComboNavision')
    {
        this.campo.IdReferencia = parseInt(this.fuentesNavision.val());
    }
    if(this.campo.Tipo == 'ComboInterno')
    {
        this.campo.IdReferencia = parseInt(this.fuentesInternas.val());
    }

    this.campo.comportamientos = JSON.stringify(this.campo.comportamientos);

    return this.campo;
};
EditorCampo.prototype.setControles = function(controles){
    this.editorComportamientos.SetControles(controles);
};

/** FUNCIONES DATOS **/
EditorCampo.prototype.crearDSModelos = function(){
    var self = this;
    this.modelosDS = new IpkRemoteDataSource(
        {
            entidad : 'zz_Modelos',
            clave   : 'IdModelo'
        }
    );

    this.modelosDS.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                console.log(respuesta.datos);
                $('option', self.referencia).remove();
                $(self.plantillaComboReferencia).tmpl(respuesta.datos).appendTo(self.referencia);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
EditorCampo.prototype.crearDSFuentesNavision = function(){
    var self = this;
    this.fuentesNavisionDS = new IpkRemoteDataSource(
        {
            entidad : 'zz_FuentesNavision',
            clave   : 'IdFuente'
        }
    );

    this.fuentesNavisionDS.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                $('option', self.fuentesNavision).remove();
                $(self.plantillaComboNavision).tmpl(respuesta.datos).appendTo(self.fuentesNavision);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};
EditorCampo.prototype.crearDSFuentesInternas = function(){
    var self = this;
    this.fuentesInternasDS = new IpkRemoteDataSource(
        {
            entidad : 'zz_FuentesInternas',
            clave   : 'IdFuente'
        }
    );

    this.fuentesInternasDS.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                $('option', self.fuentesInternas).remove();
                $(self.plantillaComboInterno).tmpl(respuesta.datos).appendTo(self.fuentesInternas);
            }
        }
        else
            alert(respuesta.mensaje);
    };
};

EditorCampo.prototype.onGuardar = function(){};


/*

{
IdCampoFicha:235,
Nombre: 'Marca',
Tipo: 'ComboNavision',
IdReferencia:14,
EsClave:false,
EsIndice:false,
EsNullable:false,
Titulo: 'Marca',
EsLectura:false,
EsPadre:null,
SonHijos:false
}

*/