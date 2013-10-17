var Listado = function(parametros){

    this.entidad        = parametros.Entidad;
    this.claveEntidad   = parametros.ClaveEntidad;
    this.cabecera       = parametros.Cabecera;
    this.plantillaFila  = parametros.PlantillaFila;

    this.servicio = app.servicios.generales;

    /* INICIALIZACION */
    this.configurar();
    this.subcripciones();

    /* CARGA DATOS */
    this.fetch();
};

Listado.prototype.subcripciones = function(){

    /* EVENTOS ACCESO DATOS */
    app.eventos.subscribir('Listado', $.proxy(this.render, this) );
    app.eventos.subscribir('Delete', $.proxy(this.deleted, this) );
    app.eventos.subscribir('Copiar', $.proxy(this.copied, this) );
    app.eventos.subscribir('Buscar', $.proxy(this.render, this));

    /* EVENTOS LISTADO */
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnNuevoClick, $.proxy(this.irNuevo, this) );
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnIrAFichaClick, $.proxy(this.irFicha, this) );
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnBorrarClick, $.proxy(this.borrar, this) );
    app.eventos.subscribir(ComponenteListado.Eventos.OnBtnCopiarClick, $.proxy(this.copiar, this) );
};

Listado.prototype.configurar = function(){
    //TODO: Sacar esto de aqui y que sea configurable
    var configuracionListado = {
        'entidad' : this.entidad ,
        'contenedor' : $('#listado'),
        'cabecera'   : this.cabecera,
        'plantilla'   : this.plantillaFila,
        'accionesEnLinea' : false,
        'sufijo' : this.entidad + '-'
    };

    this.ctrListado = new ComponenteListado(configuracionListado);
};
Listado.prototype.render = function(evento , respuesta){
    var datos = respuesta.datos;

    if(datos !== undefined)
    {
        this.ctrListado.setDatos(respuesta.datos);
        this.ctrListado.render();
    }
    else
    {
        alert('No se ha encontrado modelos');
    }
};
Listado.prototype.fetch = function(){
    this.servicio.Listado(JSON.stringify({ Entidad :  this.entidad}));
};
Listado.prototype.setDatos = function(datos){
    this.ctrListado.setDatos(datos);
    this.ctrListado.render();
};

Listado.prototype.irNuevo = function(evento, respuesta){
    window.location = "Ficha.html?entidad=" + this.entidad + "&clave=" + this.claveEntidad;
};
Listado.prototype.irFicha = function(evento, respuesta){
    window.location = "Ficha.html?id=" + this.ctrListado.getIdRegistroSeleccionada() + "&entidad=" + this.entidad + "&clave=" + this.claveEntidad;
};
Listado.prototype.borrar = function(evento, respuesta){
    var parametros = {
        'Entidad':  this.entidad,
        'Clave':    this.claveEntidad,
        'Valor':    this.ctrListado.getIdRegistroSeleccionada()
    };

    var confirmacion = confirm('¿ Confirma el borrado del registro ?');

    if( confirmacion )
        this.servicio.Delete( JSON.stringify(parametros) );
    else
        alert('Se ha cancelado el borrado del registro');
};
Listado.prototype.copiar = function(evento, respuesta){

    var parametros = {
        'Entidad':  this.entidad,
        'Clave'  :  this.claveEntidad,
        'Valor'  :  this.ctrListado.getIdRegistroSeleccionada(),
        'Datos'  :  {}
    };

    this.servicio.Copiar( JSON.stringify(parametros) );
};

Listado.prototype.deleted = function(evento, respuesta){

    if(respuesta.estado == "OK")
    {
        alert(respuesta.mensaje);
        this.ctrListado.borrarFilaSeleccionada();
    }
    else
    {
        alert(respuesta.mensaje);
    }
};
Listado.prototype.copied = function(evento, respuesta){

    if(respuesta.estado == "OK")
    {
        alert(respuesta.mensaje);
        this.ctrListado.agregarRegistro(respuesta.datos);
    }
    else
    {
        alert(respuesta.mensaje);
    }
};
