app.configuracion = {
	ajax: {
		generales: {
			Insert 	   : { url : 'http://localhost:8080/Servicio.asmx/Insert'},
            InsertHijo : { url : 'http://localhost:8080/Servicio.asmx/InsertHijo'},
			Update 	   : { url : 'http://localhost:8080/Servicio.asmx/Update'},
			Delete 	   : { url : 'http://localhost:8080/Servicio.asmx/Delete'},
			GetById	   : { url : 'http://localhost:8080/Servicio.asmx/Select'},
            Buscar     : { url : 'http://localhost:8080/Servicio.asmx/Buscar'},
            Filtrar    : { url : 'http://localhost:8080/Servicio.asmx/Filtrar'},
            Listado	   : { url : 'http://localhost:8080/Servicio.asmx/Listado'},
            Copiar     : { url : 'http://localhost:8080/Servicio.asmx/Copiar'},
            CrearRelacion : { url : 'http://localhost:8080/Servicio.asmx/CrearRelacion'},
            BorrarRelacion: { url : 'http://localhost:8080/Servicio.asmx/BorrarRelacion'},
            Estructura : { url : 'http://localhost:8080/Servicio.asmx/Estructura'}
		},
        administracion: {
			Insert 	   : { url : 'http://localhost:8080/Administracion.asmx/Insert'},
			Update 	   : { url : 'http://localhost:8080/Administracion.asmx/Update'},
			Delete 	   : { url : 'http://localhost:8080/Administracion.asmx/Delete'},
			GetById	   : { url : 'http://localhost:8080/Administracion.asmx/Select'},
            Buscar     : { url : 'http://localhost:8080/Administracion.asmx/Buscar'},
            Listado	   : { url : 'http://localhost:8080/Administracion.asmx/Listado'},
            Copiar     : { url : 'http://localhost:8080/Administracion.asmx/Copiar'},
            Estructura : { url : 'http://localhost:8080/Administracion.asmx/Estructura'}
		},
        especiales : {
            AceptarSolucion : {
                url : 'http://localhost:8080/Especiales.asmx/AceptarSolucion'
            },
            RechazarSolucion : {
                url : 'http://localhost:8080/Especiales.asmx/RechazarSolucion'
            }
        },
		dossieres: {
			Listado  : { url : '../js/fixtures/Dossieres.json' }
		}
	}
};

app.modelos = {
	generales: {
		GetById: function(data){
			var parametros = app.configuracion.ajax.generales.GetById;
			parametros.data = data;

			return app.ajax.launch(parametros);
		},
		Insert: function(data){
			var parametros = app.configuracion.ajax.generales.Insert;
			parametros.data = data;

			return app.ajax.launch(parametros);
		},
        InsertHijo: function(data){
            var parametros = app.configuracion.ajax.generales.InsertHijo;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
		Update: function(data){
			var parametros = app.configuracion.ajax.generales.Update;
			parametros.data = data;

			return app.ajax.launch(parametros);
		},
		Delete: function(data){
			var parametros = app.configuracion.ajax.generales.Delete;
			parametros.data = data;

			return app.ajax.launch(parametros);
		},
        Buscar : function(data){
            var parametros = app.configuracion.ajax.generales.Buscar;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Filtrar : function(data){
            var parametros = app.configuracion.ajax.generales.Filtrar;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Listado : function(data){
            var parametros = app.configuracion.ajax.generales.Listado;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Copiar: function(data){
            var parametros = app.configuracion.ajax.generales.Copiar;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        CrearRelacion: function(data){
            var parametros = app.configuracion.ajax.generales.CrearRelacion;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        BorrarRelacion: function(data){
            var parametros = app.configuracion.ajax.generales.BorrarRelacion;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Estructura : function(data){
            var parametros = app.configuracion.ajax.generales.Estructura;
            parametros.data = data;

            return app.ajax.launch(parametros);
        }
	},
    administracion : {
        GetById: function(data){
            var parametros = app.configuracion.ajax.administracion.GetById;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Insert: function(data){
            var parametros = app.configuracion.ajax.administracion.Insert;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Update: function(data){
            var parametros = app.configuracion.ajax.administracion.Update;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Delete: function(data){
            var parametros = app.configuracion.ajax.administracion.Delete;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Buscar : function(data){
            var parametros = app.configuracion.ajax.administracion.Buscar;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Listado : function(data){
            var parametros = app.configuracion.ajax.administracion.Listado;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Copiar: function(data){
            var parametros = app.configuracion.ajax.administracion.Copiar;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        Estructura : function(data){
            var parametros = app.configuracion.ajax.administracion.Estructura;
            parametros.data = data;

            return app.ajax.launch(parametros);
        }
    },
    especiales : {
        AceptarSolucion: function(data){
            var parametros = app.configuracion.ajax.especiales.AceptarSolucion;
            parametros.data = data;

            return app.ajax.launch(parametros);
        },
        RechazarSolucion: function(data){
            var parametros = app.configuracion.ajax.especiales.RechazarSolucion;
            parametros.data = data;

            return app.ajax.launch(parametros);
        }
    },
	dossieres: {
		Listado: function(){
			return app.ajax.launch(app.configuracion.ajax.dossieres.Listado);	
		}
	}
};

app.servicios = {
	generales : {
		GetById : function(data){
            var entidad = JSON.parse(data).Entidad;

            var alias = JSON.parse(data).Alias;

            if(!alias)
                alias = "GetById";

			app.modelos.generales.GetById(data)
		    	  .done(
		    	  	function() {
                        arguments.entidad = entidad;

		    	  		app.log.debug('GetById', arguments);
                        app.log.debug(alias + entidad, arguments);
	    				//app.eventos.publicar('GetById', arguments);
                        app.eventos.lanzar(alias, entidad, arguments);
	    				//app.eventos.lanzar('GetById', entidad, arguments);
			 	  })
		    	  .fail(
	    	  		function(){
	    				var mensaje = 'Error obteniendo el elemento por id en ' + entidad;

    					app.log.write(mensaje);
					}
		    	  );
		},
        Insert : function(data){
            var entidad = JSON.parse(data).Entidad;

            app.modelos.generales.Insert(data)
                .done(
                function() {
                    arguments.entidad = entidad;

                    app.log.debug('Insert ' + entidad, arguments);
                    //app.eventos.publicar('Insert', arguments);
                    app.eventos.lanzar('Insert', entidad, arguments);
                })
                .fail(
                function(){

                    var mensaje = 'Error Insert de ' + entidad;

                    app.log.write(mensaje);
                }
            );
        },
        InsertHijo : function(data){
            var entidad = JSON.parse(data).Entidad;

            app.modelos.generales.InsertHijo(data)
                .done(
                function() {
                    arguments.entidad = entidad;

                    app.log.debug('InsertHijo ' + entidad);
                    //app.eventos.publicar('InsertHijo', arguments);
                    app.eventos.lanzar('InsertHijo', entidad , arguments);
                })
                .fail(
                function(){

                    var mensaje = 'Error InsertHijo de ' + entidad;

                    app.log.write(mensaje);
                }
            );
        },
		Update : function(data){
            var entidad = JSON.parse(data).Entidad;

			app.modelos.generales.Update(data)
		    	  .done(
		    	  	function() {
                        arguments.entidad = entidad;

		    	  		app.log.debug('Update ' + entidad, arguments);
	    				//app.eventos.publicar('Update', arguments);
	    				app.eventos.lanzar('Update', entidad,  arguments);
			 	  })
		    	  .fail(
	    	  		function(){

	    	  			var mensaje = 'Error Update de ' + entidad;

    					app.log.write(mensaje);
					}
		    	  );
		},
		Delete : function(data){
            var entidad = JSON.parse(data).Entidad;

			app.modelos.generales.Delete(data)
		    	  .done(
		    	  	function() {
                        arguments.entidad = entidad;

		    	  		app.log.debug('Delete ' + entidad, arguments);
	    				//app.eventos.publicar('Delete', arguments);
	    				app.eventos.lanzar('Delete',entidad,  arguments);
			 	  })
		    	  .fail(
	    	  		function(){

	    				var mensaje = 'Error Delete de ' + entidad;

    					app.log.write(mensaje);
					}
		    	  );
		},
        Buscar : function(data){
            var entidad = JSON.parse(data).Entidad;
            var alias = JSON.parse(data).Alias;

            if(!alias)
                alias = "Buscar";


            app.modelos.generales.Buscar(data)
                .done(
                function() {
                    arguments.entidad = entidad;

                    app.log.debug('Buscar ' + entidad, arguments);
                    app.log.debug(alias + entidad, arguments);
         //           app.eventos.publicar('Buscar', arguments);
                    app.eventos.lanzar(alias, entidad, arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Buscar de ' + entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Filtrar : function(data){
            var entidad = JSON.parse(data).Entidad;

            app.modelos.generales.Filtrar(data)
                .done(
                function() {
                    arguments.entidad = entidad;

                    app.log.debug('Filtrar ' + entidad, arguments);
                    app.eventos.publicar('Filtrar', arguments);
                    //app.eventos.lanzar('Filtrar' , entidad, arguments);
                    app.eventos.lanzar('Filtrar' + entidad, entidad, arguments);
                })
                .fail(
                function(){

                    var mensaje = 'Error Filtrar de ' + entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Listado : function(data){
            var entidad = JSON.parse(data).Entidad;
            var alias = JSON.parse(data).Alias;

            if(!alias)
                alias = "Listado";

            app.modelos.generales.Listado(data)
                .done(
                function() {
                    arguments.entidad = entidad;
                    app.log.debug('Listado', arguments);
                    app.log.debug(alias, arguments);
                    //app.eventos.publicar('Listado', arguments);
                    app.eventos.lanzar(alias, entidad, arguments);
                })
                .fail(
                function(){
                    var mensaje = 'Error Listado de ' + entidad;
                    app.log.debug('Error Listado de ' + entidad, []);
                }
            );
        },
        Copiar : function(data){
            var entidad = JSON.parse(data).Entidad;

            app.modelos.generales.Copiar(data)
                .done(
                function() {
                    arguments.entidad = entidad;
                    app.log.debug('Copiar', arguments);
                    //app.eventos.publicar('Copiar', arguments);
                    app.eventos.lanzar('Copiar', entidad, arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Copiar de ' + entidad;

                    app.log.write(mensaje);
                }
            );
        },
        CrearRelacion : function(data){
            var entidad = JSON.parse(data).Datos2.Entidad;
            var alias = JSON.parse(data).Alias;

            if(!alias)
                alias = "CrearRelacion";


            app.modelos.generales.CrearRelacion(data)
                .done(
                function() {
                    arguments.entidad = entidad;

                    app.log.debug('CrearRelacion ' + entidad, arguments);
                    app.log.debug(alias + entidad, arguments);
                    app.eventos.lanzar(alias, entidad, arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error CrearRelacion de ' + entidad;

                    app.log.write(mensaje);
                }
            );
        },
        BorrarRelacion : function(data){
            var entidad = JSON.parse(data).Datos2.Entidad;
            var alias = JSON.parse(data).Alias;

            if(!alias)
                alias = "BorrarRelacion";


            app.modelos.generales.BorrarRelacion (data)
                .done(
                function() {
                    arguments.entidad = entidad;

                    app.log.debug('BorrarRelacion  ' + entidad, arguments);
                    app.log.debug(alias + entidad, arguments);
                    app.eventos.lanzar(alias, entidad, arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error BorrarRelacion  de ' + entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Estructura : function(data){
            var entidad = JSON.parse(data).Entidad;
            app.modelos.generales.Estructura(data)
                .done(
                function() {
                    app.log.debug('Estructura', arguments);
                    //app.eventos.publicar('Estructura', arguments);
                    app.eventos.lanzar('Estructura',entidad, arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Estructura de ' + JSON.parse(data).Entidad;

                    app.log.write(mensaje);
                }
            );
        }
	},
    administracion : {
        GetById : function(data){
            app.modelos.administracion.GetById(data)
                .done(
                function() {
                    //app.log.debug('Get', [arguments, app.eventos.procesarRespuesta(arguments)]);
                    app.log.debug('GetById', arguments);
                    app.eventos.publicar('GetById', arguments);
                })
                .fail(
                function(){
                    var mensaje = 'Error consultando el listado de dossieres';

                    app.log.write(mensaje);
                }
            );
        },
        Insert : function(data){
            app.modelos.administracion.Insert(data)
                .done(
                function() {
                    app.log.debug('Insert ' + JSON.parse(data).Entidad, arguments);
                    app.eventos.publicar('Insert', arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Insert de ' + JSON.parse(data).Entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Update : function(data){
            app.modelos.administracion.Update(data)
                .done(
                function() {
                    app.log.debug('Update ' + JSON.parse(data).Entidad, arguments);
                    app.eventos.publicar('Update', arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Update de ' + JSON.parse(data).Entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Delete : function(data){
            app.modelos.administracion.Delete(data)
                .done(
                function() {
                    app.log.debug('Delete ' + JSON.parse(data), arguments);
                    app.eventos.publicar('Delete', arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Delete de ' + JSON.parse(data).Entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Buscar : function(data){
            app.modelos.administracion.Buscar(data)
                .done(
                function() {
                    app.log.debug('Buscar', arguments);
                    app.eventos.publicar('Buscar', arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Buscar de ' + JSON.parse(data).Entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Listado : function(data){
            app.modelos.administracion.Listado(data)
                .done(
                function() {
                    app.log.debug('Listado', arguments);
                    app.eventos.publicar('Listado_'+ JSON.parse(data).Entidad, arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Listado de ' + JSON.parse(data).Entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Copiar : function(data){
            app.modelos.administracion.Copiar(data)
                .done(
                function() {
                    app.log.debug('Copiar', arguments);
                    app.eventos.publicar('Copiar', arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Copiar de ' + JSON.parse(data).Entidad;

                    app.log.write(mensaje);
                }
            );
        },
        Estructura : function(data){
            app.modelos.administracion.Estructura(data)
                .done(
                function() {
                    app.log.debug('Estructura', arguments);
                    app.eventos.publicar('Estructura', arguments);
                })
                .fail(
                function(){
                    JSON.parse(data)
                    var mensaje = 'Error Estructura de ' + JSON.parse(data).Entidad;

                    app.log.write(mensaje);
                }
            );
        }
    },
    especiales : {
        AceptarSolucion: function(data){
            app.modelos.especiales.AceptarSolucion(data)
                .done(
                function() {
                    app.log.debug("AceptarSolucion", arguments);
                    //app.eventos.publicar('GetById', arguments);
                    app.eventos.lanzar("AceptarSolucion", "Solucion", arguments);
                    //app.eventos.lanzar('GetById', entidad, arguments);
                })
                .fail(
                function(){
                    var mensaje = 'Error obteniendo el elemento por id en ' + entidad;

                    app.log.write(mensaje);
                }
            );
        },
        RechazarSolucion: function(data){
            app.modelos.especiales.RechazarSolucion(data)
                .done(
                function() {
                    app.log.debug("RechazarSolucion", arguments);
                    //app.eventos.publicar('GetById', arguments);
                    app.eventos.lanzar("RechazarSolucion", "Solucion", arguments);
                    //app.eventos.lanzar('GetById', entidad, arguments);
                })
                .fail(
                function(){
                    var mensaje = 'Error obteniendo el elemento por id en ' + entidad;

                    app.log.write(mensaje);
                }
            );
        }
    },
	dossieres : {
		Listado : function(){
			app.modelos.dossieres.Listado()
		    	  .done(
		    	  	function() {  
		    	  		app.log.debug('Listado_Dossieres', [arguments, app.eventos.procesarRespuesta(arguments)]);
	    				app.eventos.publicar('Listado_Dossieres', arguments);
			 	  })
		    	  .fail(
	    	  		function(){ 
	    				var mensaje = 'Error consultando el listado de dossieres';

    					app.log.write(mensaje); 
					}
		    	  );
		}
	}
};
