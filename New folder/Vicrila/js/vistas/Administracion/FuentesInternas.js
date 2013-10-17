var FuentesInternasPage = function(){
    this.fuentesInternas = [];
    this.seleccionActual = {};

    this.fuentesInternasDS = {};

    this.inicializarLayout();
    this.crearDataSources();

    this.eventos();

    app.configuracion.navegacionAdministracion();

    this.crearToolbarTabla();
    this.crearLista();
    this.crearTabla();
    this.crearDialogoAlta();
    this.crearDialogoCampo();
    this.crearPlantillas();

    this.fuentesInternasDS.Listado();
};

FuentesInternasPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        },
        south : {
            resizable  : false,
            closable : false,
            size: '220'
        }
    });
};
FuentesInternasPage.prototype.eventos = function(){
    var self = this;

    $('#btnPreview').on('click', function(){
        $('#controlComboNavision *').remove();

        var config = {
            Nombre       : self.seleccionActual.Nombre,
            Titulo       : self.seleccionActual.Nombre,
            EsNullable   : false,
            Tipo         : 'ComboInterno',
            IdReferencia : self.seleccionActual.IdFuente
        };

        var combo = new ComboInterno(config, {});
        $('#controlComboNavision').append(combo._control);

        $('select', combo._control).attr('disabled', false);

    });
};

FuentesInternasPage.prototype.crearDataSources = function(){
    this.crearFuentesInternasDS();
};

FuentesInternasPage.prototype.crearFuentesInternasDS = function(){
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
                self.fuentesInternas = respuesta.datos;
                $.each(self.fuentesInternas , function(){
                    this.Configuracion = JSON.parse(this.Configuracion);
                });
                self.lista.setDatos(self.fuentesInternas);
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.fuentesInternasDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {

                self.DesrcipcionCentro.text( "(Basado en la entidad " + respuesta.datos[0].zz_Modelos.Nombre.toUpperCase() + ")" );
                self.camposModelosStore.Filtrar('it.zz_Modelos.IdModelo = ' + respuesta.datos[0].zz_Modelos.IdModelo)
            }


        }
        else
            alert(respuesta.mensaje);
    };
    this.fuentesInternasDS.onInsert = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien insertando el registro");
            else
            {
                alert(respuesta.mensaje);
                self.fuentesInternasDS.Listado();
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.fuentesInternasDS.onUpdate = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien actualizando el registro");
            else
            {

                alert(respuesta.mensaje);
                /*
                self.fuentesInternasDS.Listado();
                self.fuentesInternas = respuesta.datos;
                $.each(self.fuentesInternas , function(){
                    this.Configuracion = JSON.parse(this.Configuracion);
                });
                self.lista.setDatos(self.fuentesInternas);
                */

                self.lista.seleccion = respuesta.datos;

                self.lista.seleccion.Datos = JSON.parse(self.lista.seleccion.Datos);
                self.lista.seleccion.Configuracion = JSON.parse(self.lista.seleccion.Configuracion);
                self.seleccionActual = self.lista.seleccion;
                self.lista.refrescar();
                self.borrarDatos();
                self.tabla.setDatos(self.seleccionActual.Datos);
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.fuentesInternasDS.onDelete = function(respuesta){
        alert(respuesta.mensaje);

        self.lista.borrarFilaSeleccionada();
    };
};
FuentesInternasPage.prototype.crearToolbarTabla = function(){
    var configuracion = {
        contenedor : "accionesFiltro",
        id         : "accionesFiltro"
    };

    this.accionesTabla = new IpkToolbar(configuracion);

    this.accionesTabla.agregarBoton({
        nombre : 'BtnAddElement',
        descripcion : 'Añadir un nuevo elemento en la colecci&oacute;n',
        texto : 'Nuevo Elemento',
        icono : 'icon-plus',
        accessKey : 'a'
    });
    this.accionesTabla.agregarBoton({
        nombre : 'BtnEditElement',
        descripcion : 'Edita un elemento en la colecci&oacute;n',
        texto : 'Editar Elemento',
        icono : 'icon-pencil',
        accessKey : 'e'
    });
    this.accionesTabla.agregarBoton({
        nombre : 'BtnDeleteElement',
        descripcion : 'Elimina el elemento seleccionado en la colecci&oacute;n',
        texto : 'Borrar Elemento',
        icono : 'icon-trash',
        accessKey : 'b'
    });

    var self = this;
    this.accionesTabla.onBtnAddElement = function(){
        self.dlgCampo.dialog('open');
        self.dlgCampo.modo = 'Alta';
    };
    this.accionesTabla.onBtnEditElement = function(){
        var seleccion = $('#tablaContainer .seleccionado');

        if(seleccion.length > 0)
        {
            self.dlgCampo.dialog('open');
            self.dlgCampo.modo = 'Modificacion';

            var valor = $(seleccion).find('td').eq(0).text();
            var texto = $(seleccion).find('td').eq(1).text();
            $('input#valor', self.dlgCampo).val($.trim(valor));
            $('input#texto', self.dlgCampo).val($.trim(texto));
        }
        else
            alert('No has seleccionado ningún campo.');
    };
    this.accionesTabla.onBtnDeleteElement = function(){
        var seleccion = $('#tablaContainer .seleccionado');
        if(seleccion.length > 0)
        {
            var campo = $(seleccion).find('td').eq(0).text();
            self.borrarElementoFuenteInterna(campo);
        }
        else
            alert('No has seleccionado ningún campo del filtro.');

    };

};

//******** CONFIGURAR LISTA *************
FuentesInternasPage.prototype.crearLista = function(){
    var configuracion = {
        contenedor  : "lista",
        id          : "lista",
        titulo      : "Fuentes Internas",
        campoId     : "IdFuente",
        campo       : "Nombre",
        allowNew    : true,
        allowDelete : true,
        allowEdit   : false
    };

    this.lista = new IpkLista(configuracion);
    this.lista.setDatos(this.fuentesInternas);

    this.configurarEventosLista();
};
FuentesInternasPage.prototype.configurarEventosLista = function(){
    var self = this;

    this.lista.onDataChange = function(){};
    this.lista.onSeleccion = function(){
        var seleccion = this.datos.find( this.propiedades.campoId , this.getIdRegistroSeleccionada());
        self.seleccionActual = seleccion;

        if(typeof self.seleccionActual.Datos == 'string')
            self.seleccionActual.Datos  = JSON.parse(self.seleccionActual.Datos);
        //self.seleccionActual.Configuracion  = JSON.parse(self.seleccionActual.Configuracion);

        self.actualizarSeleccionFuente();
    };
    this.lista.onNuevoClick = function(){
        self.dlgAltaListado.dialog('open');
    };
    this.lista.onBorrarClick = function(eventArgs){
        self.borrarFuenteNavision(this.datos.find( this.propiedades.campoId , this.getIdRegistroSeleccionada()));
    };
};

//******** CONFIGURAR DIALOGO ALTA FUENTE DATOS *************
FuentesInternasPage.prototype.crearDialogoAlta = function(){
    var self = this;
    this.dlgAltaListado = $('#dlgAltaListado').dialog({
        title : 'Nuevo Fuente Interna',
        modal : true,
        autoOpen: false,
        width    : '350px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){
                    self.crearFuenteNavision();
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

//******** CONFIGURAR DIALOGO ALTA CAMPO *************
FuentesInternasPage.prototype.crearDialogoCampo = function(){
    var self = this;
    this.dlgCampo = $('#dlgCampos').dialog({
        title : 'Nuevo elemento',
        modal : true,
        autoOpen: false,
        width    : '450px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){

                    if(self.dlgCampo.modo == 'Alta')
                    {
                        self.crearElementoFuenteInterna();
                        app.log.debug('Guardar Campo', self.dlgCampo.modo);
                    }
                    else
                    {
                        self.modificarElementoFuenteInterna();
                        app.log.debug('Guardar Campo', self.dlgCampo.modo);
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

//******** CONFIGURAR LISTA *************
FuentesInternasPage.prototype.crearTabla = function(){
    var configuracionTabla = {
        id         : 'tabla',
        contenedor : 'tablaContainer'
    };
    var columnas = [
        {
            Nombre  : 'id',
            Titulo  : 'id',
            Tipo    : 'Int32',
            Ancho   : '15px',
            EsClave : true
        },
        {
            Nombre  : 'Valor',
            Titulo  : 'Valor',
            Tipo    : 'String',
            Ancho   : '15px',
            Orden   : 1,
            EsClave : false
        },
        {
            Nombre  : 'Texto',
            Titulo  : 'Texto',
            Tipo    : 'String',
            Ancho   : '100px',
            Orden   : 2,
            EsClave : false
        }
    ];

    this.tabla = new IpkTabla(configuracionTabla);
    this.tabla.setColumnas(columnas);
    //this.tabla.setDatos(this.fuentesInternas);

//    this.configurarEventosLista();
};

// **** FUNCIONES FORMULARIO *****
FuentesInternasPage.prototype.crearFuenteNavision = function(){
    var nombre = $('#nombreAlta').val();
    var id = this.fuentesInternas.length + 1;

    var fuenteNuevaDS = {
        Nombre          : nombre,
        Datos           : JSON.stringify([]),
        Configuracion   : JSON.stringify({})
    };

    this.fuentesInternasDS.Insert(fuenteNuevaDS);
};
FuentesInternasPage.prototype.modificarFuenteNavision = function(){
    var actualizacion = _.clone(this.seleccionActual);
    actualizacion.Datos = JSON.stringify(actualizacion.Datos);
    actualizacion.Configuracion = JSON.stringify(actualizacion.Configuracion);

    this.fuentesInternasDS.Update(actualizacion);
};
FuentesInternasPage.prototype.borrarFuenteNavision = function(){
    this.fuentesInternasDS.Delete(this.seleccionActual.IdFuente);
};

FuentesInternasPage.prototype.crearElementoFuenteInterna = function(){
    var valor = $('input#valor', this.dlgCampo).val();
    var texto = $('input#texto', this.dlgCampo).val();

    app.log.debug('Crear Elemento' , this.seleccionActual);

    var elemento =  {
        Valor : valor,
        Texto : texto
    };

    this.seleccionActual.Datos.push(elemento);

    this.modificarFuenteNavision();
};
FuentesInternasPage.prototype.modificarElementoFuenteInterna = function(){
    var valor = $('input#valor', this.dlgCampo).val();
    var texto = $('input#texto', this.dlgCampo).val();

    var elemento = _.find(this.seleccionActual.Datos, function(e){ return e.Valor == valor; });
    elemento.Texto = texto;

    this.modificarFuenteNavision();
};
FuentesInternasPage.prototype.borrarElementoFuenteInterna = function(campo){
    this.seleccionActual.Datos  = _.reject(this.seleccionActual.Datos , function(e){return e.Valor == $.trim(campo)});
    this.modificarFuenteNavision();
};

FuentesInternasPage.prototype.actualizarSeleccionFuente = function(){
    this.tabla.setDatos(this.seleccionActual.Datos);
    this.actualizarCabecera();
};
FuentesInternasPage.prototype.actualizarCabecera = function(){
    $('#tituloFuente').text('Fuente datos - ' + this.seleccionActual.Nombre );
};
FuentesInternasPage.prototype.borrarDatos = function(){
    $('#tablaPlaceholder table tbody tr').remove();
};

FuentesInternasPage.prototype.crearPlantillas = function(){
   this.crearPlantillaFilas();
};
FuentesInternasPage.prototype.crearPlantillaFilas = function(){
    var $plantilla  =  $("<tr><td>${Valor}</td>${Texto}<td></td></tr>");
    var $div = $('<div></div>').append($plantilla);
    var texto = $div.html();

    this.plantilla = '<script type="text/template">'+ texto +'</script>';
};




