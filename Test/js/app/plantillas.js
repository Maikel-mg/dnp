var enums = {
    TipoCampoModelo : {
        String  : 'string',
        Int     : 'int',
        Float     : 'float',
        Boolean : 'boolean',
        Datetime : 'datetime',
        Guid        : 'guid',
        Coleccion : 'coleccion',
        Referencia : 'referencia'
    },
    TipoControl : {
        Label : 'Label',
        Textbox : 'TextBox',
        Datepicker : 'Datepicker',
        Checkbox : 'Checkbox',
        Combobox : 'Combobox',
        Button : 'Button',
        Icono : 'Icono',
        SaltoLinea : 'SaltoLinea',
        Codigo : 'Codigo'
    },
    TipoPresentacion : {
        Ficha           : 'Ficha',
        Listado         : 'Listado',
        MostrarElegir   : 'ME',
        Combo           : 'Combo'
    },
    ModoCampoPresentacion : {
        Consulta : 'Consulta',
        Edicion  : 'Edicion',
        Oculto   : 'Oculto'
    }
};

/**
 * @class ModeloConfiguration
 * @type {ModeloConfiguration}
 */
var ModeloConfiguration = Class.extend({

    /**
     * Identificador del modelo
     * @property
     * @type {String}
     */
    idModelo : 0,
    /**
     * Nombre del modelo
     * @property
     * @type {String}
     */
    nombre      : '',
    /**
     * Descripcion del modelo
     * @property
     * @type {String}
     */
    descripcion: '',
    /**
     * Metodos que se le van a añadir al modelo
     * @property
     * @type {Object.<string, Function>}
     */
    metodos : {},
    /**
     * Event handlers que se le van a añadir al modelo
     * @property
     * @type {Object.<string, Function>}
     */
    eventos : {},

    /**
     * @constructor
     */
    inicializar : function(){}
})

var tmplModelo = {
    idModelo : 0,
    nombre      : '',
    descripcion: '',
    metodos : {},
    eventos : {}
};

var tmplCampoModelo = {
    idModelo : 0,
    idCampoModelo : 0,
    nombre : '',
    nombreInterno : '',
    tipo : '',
    tipoInterno : enums.TipoCampoModelo.String,
    titulo : '',
    esClave : false,
    esIndice : false,
    esObligatorio : false,
    idReferencia : 0
};

var  tmpAcceso = {
    idModelo : 0,
    idRol : 0,
    idFase : 0,
    acessos : {
        crear : false,
        borrar : false,
        modificar : false,
        ver : false
    }
};


var tmplPresentacion  = {
    idModelo : 0,
    idPresentacion : 0,
    nombre : '',
    clave : '',
    descripcion : '',
    tipo : enums.TipoPresentacion.Listado,
    metodos : {},
    eventos : {}
};

var tmplCampoPresentacion = {
    idPresentacion : 0,
    idCampoModelo : 0,
    nombre : '',
    nombreInterno : '',
    tipo : '',
    tipoInterno : '',
    titulo : '',
    esClave : false,
    esIndice : false,
    esObligatorio : false,
    esDecripcion : false,
    esBusquedaInterna : false,
    esPadre : false,
    sonHijos : false,
    modo : enums.ModoCampoPresentacion.Consulta,
    orden : 0,
    ancho : 0,
    tag : '',
    eventos : {}
};

function importarCampos(idModelo){
    var modelo = Env.ModelStore.buscarModelo(idModelo, 'id');
    var camposModelo = modelo.configuracion.campos;
    var camposPresentacion = [];
    var tmpCampoPresentacion = {};

    _.each(camposModelo , function(campo, indice){
        tmpCampoPresentacion = convertirCampoModelo_CampoPresentacion(campo);
        tmpCampoPresentacion.orden = indice + 1;

        camposPresentacion.push( tmpCampoPresentacion );
    });

    return camposPresentacion;

    myWindow =window.open('','','width=200,height=100');
    myWindow.document.write("<p>" + JSON.stringify(camposPresentacion) + "</p>");
    myWindow.focus();
}
function convertirCampoModelo_CampoPresentacion(campo){
    var campoPresentacion = $.extend({}, tmplCampoPresentacion);

    campoPresentacion.idCampoModelo = campo.id;
    campoPresentacion.nombre = campo.nombre;
    campoPresentacion.nombreInterno = campo.nombreInterno;
    campoPresentacion.tipo = enums.ConversionTiposAControles[campo.tipo];
    campoPresentacion.tipoInterno = campo.tipo;
    campoPresentacion.titulo = campo.titulo;
    campoPresentacion.esClave = campo.esClave;
    campoPresentacion.esIndice = campo.esIndice;
    campoPresentacion.esObligatorio = campo.esObligatorio;

    return campoPresentacion;
}

enums.ConversionTiposAControles = {
    string  : 'TextBox',
    int     : 'TextBox',
    boolean : 'Checkbox',
    datetime : 'Datepicker',
    guid        : 'TextBox',
    coleccion : 'coleccion',
    referencia : 'referencia'
}

























