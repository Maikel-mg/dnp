var FichaPage = function(){
    this.ficha = {};
    this.fichasDS = {};

    this.crearFichasDS();
    this.crearDossieresDS();

    this.inicializarLayout();

    this.crearFicha();


    this.ontenerConfiguracionFicha();
};

FichaPage.prototype.inicializarLayout = function(){
    $('body').layout({
        north: {
            resizable  : false,
            closable : false,
            size: '30'
        }
    });
};

FichaPage.prototype.crearFicha = function(){
    var self = this;
    var configuracion = {
        contenedor : 'fichaPlaceholder',
        nombre     : 'Solucion' ,
        modo       : IpkFicha.Modos.Consulta
    };

    this.ficha = new IpkFicha(configuracion);
    this.ficha.onEditarClick = function( eventArgs ){
        app.log.debug('onEditarClick', eventArgs);
    };
    this.ficha.onGuardarClick = function(eventArgs){
        var ficha = eventArgs.sender;
        var registro = {} ;self.ficha.serializar(true);

        if(ficha.modo === IpkFicha.Modos.Alta)
        {
            registro = self.ficha.serializar();
            self.crearRegistro(registro);
        }
        else
        {
            registro = self.ficha.serializar(true);
            self.actualizarRegistro(registro);
        }

        app.log.debug('onGuardarClick', eventArgs);
    };
    this.ficha.onBorrarClick = function( eventArgs ){
        alert('Vamos a borrar');
    };
};

FichaPage.prototype.crearFichasDS = function(){
    var self = this;
    
    this.fichasDS = new IpkRemoteDataSource({
        entidad : "zz_Fichas",
        clave   : 'IdFicha'
    });
    this.fichasDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Configuracion de la ficha', respuesta.datos);
                self.ficha.setEstructura(respuesta.datos[0]);
                self.cargarRegistro();
                //self.dossieresDS.Listado();
            }

        }
        else
            alert(respuesta.mensaje);
    };
};
FichaPage.prototype.crearDossieresDS = function(){
    var self = this;

    this.dossieresDS= new IpkRemoteDataSource({
        entidad : "Solucion",
        clave   : "IdSolucion"
    });
    this.dossieresDS.onListado = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Listado de dossieres', respuesta.datos);
                self.ficha.setDatos(respuesta.datos[0]);
            }

        }
        else
            alert(respuesta.mensaje);
    };
    this.dossieresDS.onBuscar = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            app.log.debug('Buscar dossieres', respuesta.datos);
            self.ficha.setDatos(respuesta.datos[0]);
        }
        else
            alert(respuesta.mensaje);
    };
    this.dossieresDS.onUpdate = function(respuesta){
        if(respuesta.estado = 'OK')
        {
            if(respuesta.datos.length == 0)
                alert("No hay resultados para la consulta");
            else
            {
                app.log.debug('Update', respuesta.datos);
                self.ficha.setDatos(respuesta.datos[0]);
            }

        }
        else
            alert(respuesta.mensaje);
    };
};

FichaPage.prototype.ontenerConfiguracionFicha = function(){
    var where = {
        "Clave" : "'Solucion'"
    };

    this.fichasDS.Buscar(where , true, true);
};

FichaPage.prototype.cargarRegistro = function(Id){
    var where = {
        "IdSolucion" : 10
    };

    this.dossieresDS.Buscar(where , true, true);
};
FichaPage.prototype.actualizarRegistro = function(datos){
    this.dossieresDS.Update(datos);
};

