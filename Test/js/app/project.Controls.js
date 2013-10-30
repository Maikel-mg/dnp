var css = {
    Label : {
        s : {
            display : 'inline-block',
            width : '10%'
        },
        m : {
            display : 'inline-block',
            width : '13%'
        },
        l : {
            display : 'inline-block',
            width : '15%'
        }
    }
};

var Controls = {};

Controls.Toolbar = {
    Navegacion : {
        type : 'Toolbar',
        name : 'tbNavegacion',
        value : '',
        elements : [
            {
                name: 'btnEncuestas',
                value :'Encuestas',
                descripcion :'Navega a la pantalla de encuestas',
                clases : '',
                accessKey : '1',
                icono : 'icon-plus',
                events: {}
            },
            {
                name: 'btnDepartementos',
                value :'Departamentos',
                descripcion :'Navega al maestro de departamentos',
                clases : '',
                accessKey : '2',
                icono : 'icon-pencil',
                events: {}
            },
            {
                name: 'btnClientes',
                value :'Clientes',
                descripcion :'Navega al maestro de clientes',
                clases : '',
                accessKey : '3',
                icono : 'icon-user',
                events: {}
            }
        ],
        metodos : {},
        events : {
            control : {
                buttonClicked : function(boton, toolbar){
                    window.location = "http://localhost:13776/site/app/encuestas/" + boton.$element.text() + ".html";
                }
            }
        },
        conexiones : {}

    },
    Consulta : {
        type : 'Toolbar',
        nombre : 'tbConsulta',
        nombreInterno : 'tbConsulta',
        value : '',
        elements : [
            {
                nombre: 'btnNuevo',
                nombreInterno: 'btnNuevo',
                value :'Nuevo',
                descripcion :'Crea un nuevo registro',
                clases : '',
                accessKey : 'n',
                icono : 'icon-plus',
                events: {}
            },
            {
                nombre: 'btnEditar',
                nombreInterno: 'btnEditar',
                value :'Editar',
                descripcion :'Edita el registro seleccionado',
                clases : '',
                accessKey : 'e',
                icono : 'icon-pencil',
                events: {}
            },
            {
                nombre: 'btnBorrar',
                nombreInterno: 'btnBorrar',
                value :'Borrar',
                descripcion :'Elimina el registro seleccionado',
                clases : '',
                accessKey : 'e',
                icono : 'icon-trash',
                events: {}
            }
        ],
        metodos : {},
        events : {
            control : {
                buttonClicked : function(boton, toolbar){
                    console.log(boton.name);
                    toolbar.container.trigger('buttonClicked', boton);
                }
            }
        },
        conexiones : {}

    },
    Edicion : {
        type : 'Toolbar',
        name : 'tbEdicion',
        value : '',
        elements : [
            {
                name: 'btnGuardar',
                value :'Guardar',
                descripcion :'Guardar los cambios que se han realizado en el registro',
                clases : '',
                accessKey : 'g',
                icono : 'icon-ok',
                events: {}
            },
            {
                name: 'btnCancelar',
                value :'Cancelar',
                descripcion :'Cancelar los cambios que se han realizado en el registro',
                clases : '',
                accessKey : 'c',
                icono : 'icon-remove',
                events: {}
            }
        ],
        metodos : {},
        events : {
            control : {
                buttonClicked : function(boton, toolbar){
                    console.log(boton.name);
                }
            }
        },
        conexiones : {}

    },
    Ficha : {
        type : 'Toolbar',
        nombre : 'tbFicha',
        nombreInterno : 'tbFicha',
        value : '',
        elements : [
            {
                nombre: 'btnEditar',
                nombreInterno: 'btnEditar',
                value :'Editar',
                descripcion :'Habilita el formulario para editar los campos',
                clases : '',
                accessKey : 'e',
                icono : 'icon-pencil',
                events: {}
            },
            {
                nombre: 'btnGuardar',
                nombreInterno: 'btnGuardar',
                value :'Guardar',
                descripcion :'Guardar los cambios que se han realizado en el registro',
                clases : '',
                accessKey : 'g',
                icono : 'icon-ok',
                events: {}
            },
            {
                nombre: 'btnCancelar',
                nombreInterno: 'btnCancelar',
                value :'Cancelar',
                descripcion :'Cancelar los cambios que se han realizado en el registro',
                clases : '',
                accessKey : 'c',
                icono : 'icon-remove',
                events: {}
            }
        ],
        metodos : {
            modoSoloLectura : function(){
                this.hide();
            },
            modoConsulta : function(){
                this.show();
                this.find('btnEditar').show();
                this.find('btnGuardar').hide();
                this.find('btnCancelar').hide();
            },
            modoEdicion : function(){
                this.show();
                this.find('btnEditar').hide();
                this.find('btnGuardar').show();
                this.find('btnCancelar').show();
            }
        },
        events : {
            control : {
                buttonClicked : function(boton, toolbar){
                    var ficha = toolbar.container;

                    switch(boton.nombre)
                    {
                        case 'btnGuardar':
                            console.log(ficha);
                    }

                    console.log(boton.nombre);
                }
            }
        },
        conexiones : {}

    }
};
Controls.Encuesta = {

    Formulario : {
        type : 'Panel',
        name : 'pnlEncuesta',
        value : '',
        elements : [
            {
                type : enums.TipoControl.Label,
                name : 'lblNombre',
                value : 'Nombre',
                styles : css.Label.m
            },
            {
                type : enums.TipoControl.Textbox,
                name : 'txtNombre',
                nameInternal : 'nombre',
                value : '',
                styles : {
                    width : '35%',
                    marginRight :'2%'
                }
            },
            {
                type : enums.TipoControl.Label,
                name : 'lblAnyo',
                value : 'Año',
                styles : css.Label.m
            },
            {
                type : enums.TipoControl.Textbox,
                name : 'txtAnyo',
                nameInternal : 'anyo',
                value : '',
                styles : {
                    width : '5%',
                    marginRight :'2%'
                }
            },
            {
                type : enums.TipoControl.Label,
                name : 'lblDepartamento',
                value : 'Departamento',
                styles : css.Label.m
            },
            {
                type : enums.TipoControl.Combobox,
                name : 'cbDepartamento',
                nameInternal : 'departamento',
                value : '',
                metodos : {
                    load : function(){
                        this.setData(encuestasBD.IPK_Departamento);
                    },
                    convert: function(departamento){
                        return {value : departamento.id , text: departamento.nombre};
                    }
                },
                styles : {
                    width : '10%'
                }
            },
            {
                type : enums.TipoControl.SaltoLinea,
                name : 's1'
            },
            {
                type : enums.TipoControl.Label,
                name : 'lblTitulo',
                value : 'Titulo',
                styles : css.Label.m
            },
            {
                type : enums.TipoControl.Textbox,
                name : 'txtTitulo',
                nameInternal : 'titulo',
                value : '',
                styles : {
                    width : '35%',
                    marginRight :'2%'
                }
            },
            {
                type : enums.TipoControl.SaltoLinea,
                name : 's2'
            },
            {
                type : enums.TipoControl.Label,
                name : 'lblTituloCliente',
                value : 'Titulo Cliente',
                styles : css.Label.m
            },
            {
                type : enums.TipoControl.Textbox,
                name : 'txtTituloCliente',
                nameInternal : 'tituloCliente',
                value : '',
                styles : {
                    width : '35%',
                    marginRight :'2 %'
                }
            }
        ],
        metodos : {},
        eventos : {},
        conexiones : {},
        styles : {
            margin: 0,
            paddingLeft : 5,
            paddingTop : 5,
            borderTop: 0
        }
    }
};
