/**
 * Created by Maikel Merillas
 * User: mg01
 * Date: 9/10/12
 * Time: 10:15
 */

/**
 * @class   Control que permite crear filtro para los listados
 * @name    IpkFiltro
 */
var IpkFiltro = function(){
    /**
     * Referencia al control que se esta creando
     * @type {Object}
     */
    this.control = {};
    /**
     * Colección interna con el filtro creado
     * @type {Object}
     */
    this.filtro = {};
    /**
     * Coleccion de los campos por los que va ha poder crear los filtro
     * @type {Object[]}
     */
    this.campos = {};

    this.propiedades = undefined;

    this.interval = undefined;

    return this;
};

/**
 * Inicializa el control con la configuración indicada
 *
 * @param {Object}      configuracion              Configuración del control
 * @param {Object}      configuracion.nombre       Nombre que le damos al control
 * @param {Object}      configuracion.contenedor   Contenedor donde se va ha crear el control
 * @param {IpkTabla}    configuracion.tabla        Tabla sobre la que se aplica el filtro
 */
IpkFiltro.prototype.inicializar = function(configuracion){
    var self = this;
    this.html = $('#' + configuracion.contenedor).load('../js/controles/html/ipkFiltro.html', function(){
        self.crearToolbarFiltro();
        self.crearDialogoCampos();

        $('#camposFuente', self.html).delegate('tbody tr', 'click',  function(){
            $('#camposFuente tr.seleccionado').removeClass('seleccionado');

            $(this).addClass('seleccionado');
        });
    });

    this.control =  $('#areaFiltro', this.html);
    $('#' + configuracion.contenedor).append(this.control);

    console.log(configuracion.tabla.tabla.propiedades);
    this.propiedades = configuracion.tabla.tabla.propiedades;
    this.interval = setInterval( $.proxy( this.checkCampos, this) , 500);


};

/**
 * Crea una barra de botones para las acciones del filtro
 *
 * @function
 * @private
 * @memberOf IpkFiltro
 *
 */
IpkFiltro.prototype.crearToolbarFiltro = function(){
    var configuracion = {
        contenedor : "areaFiltro #accionesFiltro",
        id         : "accionesFiltro"
    };

    this.accionesFiltro = new IpkToolbar(configuracion);
/*
    this.accionesFiltro.agregarBoton({
        nombre : "AplicarFiltro",
        descripcion : "Filtra el listado de los dossieres (ALT + B)",
        clases : "",
        icono : "icon-search",
        accessKey : "b",
        texto : "Filtrar"
    });
    this.accionesFiltro.agregarBoton({
        nombre : "LimpiarFiltro",
        descripcion : "Limpia los resultado del listado (ALT + L)",
        clases : "",
        icono : "icon-remove-circle",
        accessKey : "l",
        texto : "Limpiar"
    });
    */
    this.accionesFiltro.agregarBoton({
        nombre : "AddCampo",
        descripcion : "Crea un nuevo campo en el  filtro",
        clases : "",
        icono : "icon-plus",
        accessKey : "a",
        texto : "Nuevo Campo"
    });
    this.accionesFiltro.agregarBoton({
        nombre : "EditCampo",
        descripcion : "Edita el campo del filtro seleccionado",
        clases : "",
        icono : "icon-pencil",
        accessKey : "e",
        texto : "Editar Campo"
    });
    this.accionesFiltro.agregarBoton({
        nombre : "BorrarCampo",
        descripcion : "Borra el campo del filtro seleccionado",
        clases : "",
        icono : "icon-trash",
        accessKey : "z",
        texto : "Borrar Campo"
    });

    var self = this;
/*
    this.accionesFiltro.onAplicarFiltro = $.proxy(this.aplicarFiltro, this);
    this.accionesFiltro.onLimpiarFiltro = $.proxy(this.limpiarFiltro ,this);
*/
    this.accionesFiltro.onAddCampo = function(){
        self.dialogoCampos.dialog('open');
        self.dialogoCampos.modo = 'Alta';
    };
    this.accionesFiltro.onEditCampo = function(){

        var seleccion = $('#camposFuente .seleccionado');

        if(seleccion.length > 0)
        {
            self.dialogoCampos.dialog('open');

            self.dialogoCampos.modo = 'Modificacion';

            var campo = $(seleccion).find('td').eq(0).text();
            var valor = $(seleccion).find('td').eq(1).text();
            $('select#campos', self.dialogoCampos).val(campo);
            $('input#filtro', self.dialogoCampos).val(valor);
        }
        else
            alert('No has seleccionado ningún campo del filtro.');


        app.log.debug('onEditCampo', [seleccion, seleccion.length]);

    };
    this.accionesFiltro.onBorrarCampo = function(){
        var seleccion = $('#camposFuente .seleccionado');
        if(seleccion.length > 0)
        {
            var campo = $(seleccion).find('td').eq(0).text();
            self.borrarCampoFiltro(campo);
        }
        else
            alert('No has seleccionado ningún campo del filtro.');

    };
};
/**
 * Crea y configura el dialogo de los campos
 *
 * @function
 * @private
 * @memberOf IpkFiltro
 *
 */
IpkFiltro.prototype.crearDialogoCampos = function(){
    var self = this;

    this.dialogoCampos =  $('#dlgCampos', this.html);
    $(this.dialogoCampos).dialog({
        title : 'Campo de filtro',
        modal : true,
        autoOpen: false,
        width    : '450px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){
                    if(self.dialogoCampos.modo == 'Alta')
                    {
                        self.crearCampoFiltro();
                    }
                    else
                    {
                        self.modificarCampoFiltro();
                    }

                    $(this).dialog('close');
                }
            },
            {
                'text' :'Cancelar' ,
                'click': function(){
                    $(this).dialog('close');
                }
            }
        ]
    });
};

/**
 * Estable la coleccion de campos por los que se podrá crear el filtro
 *
 * @function
 * @public
 * @name    setCampos
 * @memberOf    IpkFiltro
 * @param {Object[]}    campos  Coleccion de campos para crear el filtro
 */
IpkFiltro.prototype.setCampos = function(campos){
    this.campos = campos;

    $('select#campos option').remove();
    $('#optionTemplate').tmpl(campos).appendTo('select#campos');
};
/**
 * Funcion que ejecuta el intervalo y que asigna las columnas de la tabla a los campos cuando los tenga
 *
 * @function
 * @private
 * @name checkCampos
 * @memberOf    IpkFiltro
 */
IpkFiltro.prototype.checkCampos  = function(){

    if(this.propiedades)
    {
        if(this.propiedades['columnas'])
        {
            console.log(this.propiedades['columnas']);
            this.setCampos(this.propiedades['columnas']);

            if(this.interval)
            {
                clearInterval(this.interval);
                this.interval = undefined;
            }
        }
    }
};
/**
 * Actualiza la tabla de los filtros
 *
 * @function
 * @private
 * @name        actualizarTablaFiltros
 * @memberOf    IpkFiltro
 *
 */
IpkFiltro.prototype.actualizarTablaFiltros = function(){
    $('#camposFuente table tbody tr').remove();
    $.each(this.filtro, function(k,v){
        var plantilla = "<tr><td>@campo</td><td>@valor</td></tr>";
        var fila = plantilla.replace('@campo', k);
        fila = fila.replace('@valor', v);
        $('#camposFuente table tbody').append($(fila));
    });
};

/**
 * Crea el filtro y lanza el evento con el filtro
 *
 * @function
 * @private
 * @name        aplicarFiltro
 * @memberOf    IpkFiltro
 *
 */
IpkFiltro.prototype.aplicarFiltro = function(){
    var cadena = '';

    $.each(this.filtro, function(k,v){
        if(v !== "")
            if(cadena !== "") cadena += " OR ";
            cadena += " it." + k + " Like '%" + v + "%'";
    });

    if(cadena !== "")
    {
        this.onFiltrar(cadena);
        app.log.debug('IpkFiltro -- aplicarFiltro' , cadena);
    }
};
/**
 * Limepia el filtro y lanza el evento
 *
 * @function
 * @private
 * @name        limpiarFiltro
 * @memberOf    IpkFiltro
 *
 */
IpkFiltro.prototype.limpiarFiltro = function(){
    this.filtro = {};
    this.actualizarTablaFiltros();

    this.onLimpiar();
};
/**
 * Crea un campo para el filtro
 *
 * @function
 * @private
 * @name     crearCampoFiltro
 * @memberOf IpkFiltro
 */
IpkFiltro.prototype.crearCampoFiltro = function(){
    var campo = $('select#campos', this.dialogoCampos).val();
    var valor = $('input#filtro', this.dialogoCampos).val();

    this.filtro[campo] = valor;
    this.actualizarTablaFiltros();
    this.aplicarFiltro();
};
/**
 * Modifica un campo del filtro
 *
 * @function
 * @private
 * @name     modificarCampoFiltro
 * @memberOf IpkFiltro
 */
IpkFiltro.prototype.modificarCampoFiltro = function(){
    var campo = $('select#campos', this.dialogoCampos).val();
    var valor = $('input#filtro', this.dialogoCampos).val();

    this.filtro[campo] = valor;
    this.actualizarTablaFiltros();
    this.aplicarFiltro();
};
/**
 * Borra un campo del filtro
 *
 * @function
 * @private
 * @name     modificarCampoFiltro
 * @memberOf IpkFiltro
 * @param    {Object}   campo      Campo del filtro a borrar
 */
IpkFiltro.prototype.borrarCampoFiltro = function(campo){

    var clavesFiltro = _.without( _.keys(this.filtro), campo);
    var nuevoFiltro = _.pick(this.filtro, clavesFiltro);
    this.filtro = nuevoFiltro;

    this.actualizarTablaFiltros();
    this.aplicarFiltro();
};

/**
 * Se lanza cuando se pulsa el boton de filtrar
 *
 * @event
 * @name    onFiltrar
 * @param   eventArgs
 * @memberOf    IpkFiltro
 */
IpkFiltro.prototype.onFiltrar = function(cadena){};
/**
 * Se lanza cuando se pulsa el boton de limpiar
 *
 * @event
 * @name    onLimpiar
 * @memberOf    IpkFiltro
 */
IpkFiltro.prototype.onLimpiar = function(){};





