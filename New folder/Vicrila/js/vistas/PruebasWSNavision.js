var NavisioWSPage = function(){
    this.fuentesNavision = [
        {
            IdFuente: 1 ,
            Nombre : 'Calidad',
            Configuracion:
            {
                Pagina: 'ItemValues',
                Filtro :
                {
                    'Tipo_tabla' : "30"
                },
                Tamanyo : 0
            },
            CampoValor   : 'Codigo',
            CampoMostrar : 'Descripcion'
        },
        {
            IdFuente: 2 ,
            Nombre : 'Tipo Esmalte',
            Configuracion:
            {
                Pagina: 'ItemValues',
                Filtro :
                {
                    'Tipo_tabla' : "31",
                    'Codigo' : 'AG'
                },
                Tamanyo : 0
            },
            CampoValor   : 'Codigo',
            CampoMostrar : 'Descripcion'
        }
    ];
    this.paginas = [];

    this.seleccionActual = {};
    this.seleccionActualCampos = [];

    this.navisionDS = {};
    this.fuentesNavisionDS = {};

    this.inicializarLayout();
    this.crearDataSources();

    this.eventos();

    this.crearToolbarTabla();
    this.crearLista();
    this.crearDialogoAlta();
    this.crearDialogoCampo();

    this.navisionDS.Paginas();
    this.fuentesNavisionDS.Listado();
};

NavisioWSPage.prototype.inicializarLayout = function(){
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
NavisioWSPage.prototype.eventos = function(){
    var self = this;

    $('select#paginas').on('change', function(){
        self.navisionDS.Campos($(this).val())
    });

    $('select#campoMostrar').on('change', function(){
        self.seleccionActual.CampoMostrar = $(this).val();
        self.modificarFuenteNavision();
    });
    $('select#campoValor').on('change', function(){
        self.seleccionActual.CampoValor = $(this).val();
        self.modificarFuenteNavision();
    });

    $('#camposFuente').delegate('tbody tr', 'click',  function(){
        $('#camposFuente tr.seleccionado').removeClass('seleccionado');

        $(this).addClass('seleccionado');
    });

    $('#btnPreview').on('click', function(){
        $('#controlComboNavision *').remove();

        var config = {
            Nombre       : self.seleccionActual.Nombre,
            Titulo       : self.seleccionActual.Nombre,
            EsNullable   : false,
            Tipo         : 'ComboNavision',
            IdReferencia : self.seleccionActual.IdFuente
        };

        var combo = new ComboNavision(config, { valor : '2038' });
        $('#controlComboNavision').append(combo._control);
    });
};

NavisioWSPage.prototype.crearDataSources = function(){
    this.crearNavisionDS();
    this.crearFuentesNavisionDS()
};
NavisioWSPage.prototype.crearNavisionDS = function(){
    var self = this;

    this.navisionDS= new IpkRemoteDataSourceNavision();
    this.navisionDS.onEjecutarFiltro = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                var collection = [];
                app.log.debug('Datos del WS de Navision', respuesta.datos);

                $('#tablaPlaceholder table tbody tr').remove();
                $(self.plantilla).tmpl(respuesta.datos).appendTo('#tablaPlaceholder table tbody');

                app.log.debug('Datos del WS de Navision',  $(self.plantilla).tmpl(respuesta.datos));
            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.navisionDS.onPaginas = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                var collection = [];
                self.paginas = respuesta.datos;
                app.log.debug('Filtrado de paginas', respuesta.datos);

                $.each(respuesta.datos, function(){
                    collection.push({
                        value : this,
                        text  : this
                    });
                });

                $('select#paginas option').remove();
                $('#optionTemplate').tmpl(collection).appendTo('select#paginas');
                $('#optionTemplate').tmpl(collection).appendTo('select#paginasAlta');
            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.navisionDS.onCampos = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                var collection = [];
                app.log.debug('Filtrado de campos', respuesta.datos);

                $.each(respuesta.datos, function(){

                    collection.push({
                        value : this,
                        text  : this
                    });

                    app.log.debug('FFFF', collection);
                });

                $('select#campos option').remove();
                $('#optionTemplate').tmpl(collection).appendTo('select#campos');

                $('select#campoValor option').remove();
                $('#optionTemplate').tmpl(collection).appendTo('select#campoValor');

                $('select#campoMostrar option').remove();
                $('#optionTemplate').tmpl(collection).appendTo('select#campoMostrar');

                $('select#campoValor').prepend('<option></option>');
                $('select#campoMostrar').prepend('<option></option>');


                self.campos = collection;
                self.seleccionActualCampos = respuesta.datos;
                $('select#campoMostrar').val(self.seleccionActual.CampoMostrar);
                $('select#campoValor').val(self.seleccionActual.CampoValor);

                self.crearPlantillas();
                $('#tablaPlaceholder table tbody tr').remove();
                $('#filtro').val('');
            }

        }
        else
            alert(respuesta.mensaje);
    };
};
NavisioWSPage.prototype.crearFuentesNavisionDS = function(){
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
                self.fuentesNavision = respuesta.datos;
                $.each(self.fuentesNavision , function(){
                    this.Configuracion = JSON.parse(this.Configuracion);
                });
                self.lista.setDatos(self.fuentesNavision);
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.fuentesNavisionDS.onBuscar = function(respuesta){
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
    this.fuentesNavisionDS.onInsert = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien insertando el registro");
            else
            {
                alert(respuesta.mensaje);
                self.fuentesNavisionDS.Listado();
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.fuentesNavisionDS.onUpdate = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("Algo no ha ido bien actualizando el registro");
            else
            {

                alert(respuesta.mensaje);
                /*
                self.fuentesNavisionDS.Listado();
                self.fuentesNavision = respuesta.datos;
                $.each(self.fuentesNavision , function(){
                    this.Configuracion = JSON.parse(this.Configuracion);
                });
                self.lista.setDatos(self.fuentesNavision);
                */

                self.lista.seleccion = respuesta.datos;

                self.lista.seleccion.Configuracion = JSON.parse(self.lista.seleccion.Configuracion);
                self.seleccionActual = self.lista.seleccion;
                self.lista.refrescar();
            }
        }
        else
            alert(respuesta.mensaje);
    };
    this.fuentesNavisionDS.onDelete = function(respuesta){
        alert(respuesta.mensaje);

        self.lista.borrarFilaSeleccionada();
    };
};
NavisioWSPage.prototype.crearToolbarTabla = function(){
    var configuracion = {
        contenedor : "accionesFiltro",
        id         : "accionesFiltro"
    };

    this.accionesTabla = new IpkToolbar(configuracion);

    this.accionesTabla.agregarBoton({
        nombre : "VerDatos",
        descripcion : "Obtiene los datos de la pagina seleccionada",
        clases : "",
        icono : "icon-search",
        accessKey : "d",
        texto : "Ver Datos"
    });
    this.accionesTabla.agregarBoton({
        nombre : "AddCampo",
        descripcion : "Crea un nuevo campo en el  filtro",
        clases : "",
        icono : "icon-plus",
        accessKey : "a",
        texto : "Nuevo Campo"
    });
    this.accionesTabla.agregarBoton({
        nombre : "EditCampo",
        descripcion : "Edita el campo del filtro seleccionado",
        clases : "",
        icono : "icon-pencil",
        accessKey : "a",
        texto : "Editar Campo"
    });
    this.accionesTabla.agregarBoton({
        nombre : "BorrarCampo",
        descripcion : "Borra el campo del filtro seleccionado",
        clases : "",
        icono : "icon-trash",
        accessKey : "z",
        texto : "Borrar Campo"
    });


    var self = this;
    this.accionesTabla.onVerDatos = function(){
        self.obtenerDatos();
    };
    this.accionesTabla.onAddCampo = function(){
        self.dlgCampo.dialog('open');
        self.dlgCampo.modo = 'Alta';
    };
    this.accionesTabla.onEditCampo = function(){

        var seleccion = $('#camposFuente .seleccionado');

        if(seleccion.length > 0)
        {
            self.dlgCampo.dialog('open');

            self.dlgCampo.modo = 'Modificacion';

            var campo = $(seleccion).find('td').eq(0).text();
            var valor = $(seleccion).find('td').eq(1).text();
            $('select#campos', self.dlgCampo).val(campo);
            $('input#filtro', self.dlgCampo).val(valor);
        }
        else
            alert('No has seleccionado ningún campo del filtro.');


        app.log.debug('onEditCampo', [seleccion, seleccion.length]);

    };
    this.accionesTabla.onBorrarCampo = function(){
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

//******** CONFIGURAR LISTA *************
NavisioWSPage.prototype.crearLista = function(){
    var configuracion = {
        contenedor  : "lista",
        id          : "lista",
        titulo      : "Fuentes Navision",
        campoId     : "IdFuente",
        campo       : "Nombre",
        allowNew    : true,
        allowDelete : true,
        allowEdit   : false
    };

    this.lista = new IpkLista(configuracion);
    this.lista.setDatos(this.fuentesNavision);

    this.configurarEventosLista();
};
NavisioWSPage.prototype.configurarEventosLista = function(){
    var self = this;

    this.lista.onDataChange = function(){
        //self.rellenarReferencias();
    };
    this.lista.onSeleccion = function(){
        var seleccion = this.datos.find( this.propiedades.campoId , this.getIdRegistroSeleccionada());
        self.seleccionActual = seleccion;

        self.actualizarSeleccionFuente();
    };
    this.lista.onNuevoClick = function(){
        self.dlgAltaListado.dialog('open');
    };
    this.lista.onBorrarClick = function(eventArgs){
        app.log.debug('Borrar click', eventArgs);
        self.eliminarListado(eventArgs.datos[this.propiedades.campoId]);
    };
};

//******** CONFIGURAR DIALOGO ALTA FUENTE DATOS *************
NavisioWSPage.prototype.crearDialogoAlta = function(){
    var self = this;
    this.dlgAltaListado = $('#dlgAltaListado').dialog({
        title : 'Nuevo Fuente Navision',
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
NavisioWSPage.prototype.crearDialogoCampo = function(){
    var self = this;
    this.dlgCampo = $('#dlgCampos').dialog({
        title : 'Campo de filtro',
        modal : true,
        autoOpen: false,
        width    : '450px',
        buttons  : [
            {
                'text' :'Guardar',
                'click': function(){
                    if(self.dlgCampo.modo == 'Alta')
                    {
                        self.crearCampoFiltro();
                        app.log.debug('Guardar Campo', self.dlgCampo.modo);
                    }
                    else
                    {
                        self.modificarCampoFiltro();
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

// **** FUNCIONES DATOS *****
NavisioWSPage.prototype.obtenerPaginas = function(){
    this.navisionDS.Paginas();
};
NavisioWSPage.prototype.obtenerCampos = function(Pagina){
    this.navisionDS.Campos(Pagina);
};
NavisioWSPage.prototype.obtenerDatos = function(){
    var pagina = $('select#paginas').val();
    var campo =  $('select#campos').val();
    var valorfiltro = $('#filtro').val();
    var filtro = {};

    pagina = this.seleccionActual.Configuracion.Pagina;
    if(this.seleccionActual.Configuracion.Filtro !== {})
    {
        $.each(this.seleccionActual.Configuracion.Filtro, function(k,v){
            filtro[k] = v;
        });
    }
//    if(valorfiltro != '')
//       filtro[campo] = valorfiltro;

    this.navisionDS.EjecutarFiltro(pagina, filtro, 0);
};


// **** FUNCIONES FORMULARIO *****
NavisioWSPage.prototype.crearFuenteNavision = function(){
    var nombre = $('#nombreAlta').val();
    var pagina = $('#paginasAlta').val();
    var id = this.fuentesNavision.length + 1;


    var fuenteNueva = {
        IdFuente: id ,
        Nombre : nombre,
        Configuracion: {
            Pagina: pagina,
            Filtro : {},
            Tamanyo : 0
        }
    };

    var fuenteNuevaDS = {
        Nombre : nombre,
        Configuracion: JSON.stringify({
            Pagina: pagina,
            Filtro : {},
            Tamanyo : 0
        })
    };

    this.fuentesNavisionDS.Insert(fuenteNuevaDS);

    //this.fuentesNavision.push(fuenteNueva);
    //this.lista.setDatos(this.fuentesNavision);

};
NavisioWSPage.prototype.modificarFuenteNavision = function(){
    var actualizacion = _.clone(this.seleccionActual);
    actualizacion.Configuracion = JSON.stringify(actualizacion.Configuracion);

    this.fuentesNavisionDS.Update(actualizacion);
};


NavisioWSPage.prototype.crearCampoFiltro = function(){
    var campo = $('select#campos', this.dlgCampo).val();
    var valor = $('input#filtro', this.dlgCampo).val();

    this.seleccionActual.Configuracion.Filtro[campo] = valor;

    this.modificarFuenteNavision();

    //app.log.debug(this.seleccionActual.Configuracion.Filtro[campo]);
    this.actualizarTablaFiltros();
};
NavisioWSPage.prototype.modificarCampoFiltro = function(){
    var campo = $('select#campos', this.dlgCampo).val();
    var valor = $('input#filtro', this.dlgCampo).val();

    this.seleccionActual.Configuracion.Filtro[campo] = valor;

    this.modificarFuenteNavision();
    //app.log.debug(this.seleccionActual.Configuracion.Filtro[campo]);
    this.actualizarTablaFiltros();
};
NavisioWSPage.prototype.borrarCampoFiltro = function(campo){

    var clavesFiltro = _.without( _.keys(this.seleccionActual.Configuracion.Filtro), campo);
    var nuevoFiltro = _.pick(this.seleccionActual.Configuracion.Filtro, clavesFiltro);
    this.seleccionActual.Configuracion.Filtro = nuevoFiltro;

    this.modificarFuenteNavision();

    this.actualizarTablaFiltros();
};

NavisioWSPage.prototype.actualizarSeleccionFuente = function(){
    this.actualizarCabecera();
    this.actualizarTablaFiltros();
    this.borrarDatos();

    $('select#paginas').val(this.seleccionActual.Configuracion.Pagina);
    $('select#campoValor').val(this.seleccionActual.CampoValor);
    $('select#campoMostrar').val(this.seleccionActual.CampoMostrar);

    this.obtenerCampos(this.seleccionActual.Configuracion.Pagina);
};
NavisioWSPage.prototype.actualizarCabecera = function(){
    $('#tituloFuente').text('Fuente datos - ' + this.seleccionActual.Nombre + " ( Basado en page '"+ this.seleccionActual.Configuracion.Pagina + "')");
};
NavisioWSPage.prototype.actualizarTablaFiltros = function(){
    $('#camposFuente table tbody tr').remove();
    $.each(this.seleccionActual.Configuracion.Filtro, function(k,v){
        var plantilla = "<tr><td>@campo</td><td>@valor</td></tr>";
        var fila = plantilla.replace('@campo', k);
        fila = fila.replace('@valor', v);
        app.log.debug('MI FILA ', fila);
        $('#camposFuente table tbody').append($(fila));

    });
};

NavisioWSPage.prototype.borrarDatos = function(){
    $('#tablaPlaceholder table tbody tr').remove();
};

NavisioWSPage.prototype.crearPlantillas = function(){
   this.crearPlantillaFilas();
   this.crearPlantillaCabecera();
};
NavisioWSPage.prototype.crearPlantillaFilas = function(){
    var self = this;
    var script = $('<script type="text/template"></script>');

    var $plantilla  =  $("<tr></tr>");
    $.each(this.campos, function(){
        $plantilla.append("<td> ${" + this.text + "} </td>");
    });

    var $div = $('<div></div>').append($plantilla);
    var texto = $div.html();

    var plantilla = '<script type="text/template">'+ texto +'</script>';


    app.log.debug('Plantilla creada', plantilla);

    this.plantilla = plantilla;
    app.log.debug('Plantilla creada', plantilla);
};
NavisioWSPage.prototype.crearPlantillaCabecera = function(){
    var $plantillaHead  =  $("<tr></tr>");
    $.each(this.campos, function(){
        $plantillaHead.append("<th> "+ this.text + "</th>");
    });

    var $divHead = $('<div></div>').append($plantillaHead);
    var textoHead = $divHead.html();

    $('#tablaPlaceholder table thead tr th').remove();
    $('#tablaPlaceholder table thead').append(textoHead);

    this.plantillaHead = textoHead.replace('td', 'th');

    app.log.debug('Plantilla creada head', this.plantillaHead);

};


