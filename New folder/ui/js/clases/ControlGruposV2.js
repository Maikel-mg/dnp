/**
 * Control que lista los grupos del formulario
 */
var controlGrupos = function(options){
    this.datos = [];
    this.seleccion = {};
    this.seleccionHTML = {};

    this.contenedor     = options.contenedor;
    this.plantilla      = options.plantilla;
    this.tipoPlantilla  = options.tipoPlantilla;
    this.entidad        = options.entidad;
    this.prefijoId      = options.entidad + "-";
    this.campoId        = options.campoId;

    this.suscripciones();
    this.vincularEventos();
};

/*
* FUNCIONES
*/
controlGrupos.prototype.suscripciones = function(){
    app.eventos.subscribir(DataSource.Eventos.OnDataChange, $.proxy(this.refrescar, this));
};
controlGrupos.prototype.setData = function(datos , render){
    var cfgDataSource = {
        entidad : this.entidad,
        campoId : this.campoId
    };

    this.datos = new DataSource(datos, cfgDataSource);
    this.onDataChange(datos);

    if(render) this.render(this.datos.data);

    return this;
};
controlGrupos.prototype.render = function(datos){

    $('*', this.contenedor).remove();
    if(datos)
        $(this.plantilla).tmpl(datos).appendTo(this.contenedor);
    else
        $(this.plantilla).tmpl(this.datos.data).appendTo(this.contenedor);

    app.eventos.publicar(controlGrupos.Eventos.OnRender, datos ,true);
    return this;
};
controlGrupos.prototype.refrescar = function(evento , eventArgs ){

    if(eventArgs.entidad == this.entidad)
    {
        app.log.debug('rescamos los datos', eventArgs);
        this.render(eventArgs.datos);
    }

};

controlGrupos.prototype.setSeleccion = function(elementoHTML){
    $( this.tipoPlantilla + '.seleccionado', this.contenedor).removeClass('seleccionado');
    $(elementoHTML).addClass('seleccionado');

    var idSeleccion = $(elementoHTML).attr('id').replace(this.prefijoId, '');
    this.seleccion  = this.datos.find(this.campoId, idSeleccion); // _.find(this.datos, function(elemento){ return elemento.id == idSeleccion });
    this.seleccionHTML = elementoHTML;
};
/*
 * EVENTOS
 */
controlGrupos.prototype.vincularEventos = function(){
    var self = this;

    $(this.contenedor).delegate(this.tipoPlantilla, 'click', function(){
        self.setSeleccion(this);

        var eventArgs = {
            elemento : this,
            datos    : self.seleccion
        };

        self.onSeleccion(eventArgs);
    });
    $(this.contenedor).delegate(this.tipoPlantilla + ' a.btnEditar', 'click' , function(){
        var id = $(this).closest(self.tipoPlantilla).attr('id').replace(self.prefijoId, '');

        var eventArgs = {
            elemento : this,
            datos    : self.datos.find(self.campoId, id)
        };

        self.onEdicionClick(eventArgs);
    });
    $(this.contenedor).delegate(this.tipoPlantilla + ' a.btnEliminar', 'click' , function(){
        var id = $(this).closest(self.tipoPlantilla).attr('id').replace(self.prefijoId, '');

        var eventArgs = {
            elemento : this,
            datos    : self.datos.find(self.campoId, id)
        };

        self.onBorrarClick(eventArgs);
    });
    $('#btnNuevoGrupo').on('click', function(){
        self.onNuevoClick();
    });
};

/*
 * HANDLERS EVENTOS
 */
controlGrupos.prototype.onRender = function(){
    app.eventos.publicar(controlGrupos.Eventos.OnRender,[] ,true);
};
controlGrupos.prototype.onDataChange = function(datos){
    app.eventos.publicar(controlGrupos.Eventos.OnDataChange,datos ,true);
};
controlGrupos.prototype.onSeleccion = function(eventArgs){
    app.eventos.publicar(controlGrupos.Eventos.OnSeleccion, eventArgs ,true);
};
controlGrupos.prototype.onNuevoClick = function(){
    app.eventos.publicar(controlGrupos.Eventos.OnNuevoClick, [] ,true);
};
controlGrupos.prototype.onEdicionClick = function(eventArgs){
    app.eventos.publicar(controlGrupos.Eventos.OnEdicionClick, eventArgs ,true);
};
controlGrupos.prototype.onBorrarClick = function(eventArgs){
    app.eventos.publicar(controlGrupos.Eventos.OnBorrarClick, eventArgs,true);
};


/*
* ENUMERACION EVENTOS
*/
controlGrupos.Eventos = {
    OnRender       : 'onRender',
    OnDataChange   : 'onDataChange',
    OnSeleccion    : 'onSeleccion',
    OnNuevoClick   : 'onNuevoClick',
    OnEdicionClick : 'onEdicionClick',
    OnBorrarClick  : 'onBorrarClick'
};

