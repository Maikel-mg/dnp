var app = {
	log: {
		activado: false,
		write : function(valor){
			if(this.activado)
			{
				if(typeof(console) !== 'undefined' && console !== null) {
					console.log(valor);
				}
				else{
					//alert('No hay consola');
					//alert(valor);
				}	
			}

		},
		groupBegin : function(valor){
			if(this.activado)
			{
				if(typeof(console) !== 'undefined' && console !== null) {
					console.group(valor);
				}
				else{
					//alert('No hay consola');
					//alert(valor);
				}	
			}

		},		
		groupEnd : function(){
			if(this.activado)
			{
				if(typeof(console) !== 'undefined' && console !== null) {
					console.groupEnd();
				}
				else{
					//alert('No hay consola');
				}	
			}
		},
		debug : function(){
			app.log.groupBegin(arguments[0]);
			//app.log.write('----- ' + arguments[0] + ' -----');
			for (var i = arguments.length - 1; i >= 1; i--) {
				app.log.write(arguments[i]);
			};
			//app.log.write('---------------------');			
			app.log.groupEnd();
		}
	},
	eventos : {
		subscribir : function(evento, callback ,contexto){
			$.subscribe(evento, contexto, callback);
			app.log.debug('Subscripción' , evento);
		},
		publicar : function(evento, datos, noProcesar){
			app.log.debug('Publicación' , evento);


            if(noProcesar === undefined || noProcesar === false)
            {
                $.publish(evento, this.procesarRespuesta(datos));
            }
            else{
                $.publish(evento, datos);
            }


		},
        escuchar : function(evento, contexto, callback){
            $.escuchar(evento, contexto, callback);
            app.log.debug('Escuchar' , evento);
        },
        lanzar : function(evento, contexto, datos, procesado){
            app.log.debug('Lanzar' , evento);

            if(procesado === undefined || procesado === false)
            {
                $.publicar(evento, contexto, this.procesarRespuesta(datos));
            }
            else{
                $.publicar(evento, contexto, datos);
            }


        },
		procesarRespuesta: function(respuesta)
		{
			var respuestaJSON = JSON.parse(respuesta[0].d);

			var resultado = {};
			resultado.estado = respuestaJSON["Estado"];
			resultado.entidad = respuesta.entidad;
			resultado.tieneDatos = false;
			resultado.mensaje = '';


			if(resultado.estado === 'OK')
			{
				resultado.tieneDatos = true;
				resultado.datos = JSON.parse(respuestaJSON["Datos"]);
                resultado.mensaje = respuestaJSON["Mensaje"];
            }
			else if( resultado.estado === 'Empty')
			{
				resultado.mensaje = 'No se han obtenido resultados para la contulta';
			}
			else if( resultado.estado === 'Error')
			{
				resultado.mensaje = 'Ha ocurrido un error: \n ' + respuestaJSON["Mensaje"];
				alert(resultado.mensaje);
			}
				
			return resultado;
		},
		procesarRespuestaMicrosoft: function(respuesta)
		{
			var resultado = {};
			resultado.datos = JSON.parse(respuesta[0]["d"]);

			return resultado;
		}


	},
	ajax : {
		defaults : {
				type: "POST",
				contentType: "application/json; charset=utf-8",
		    	//contentType: "application/x-www-form-urlencoded; charset=utf-8",
		    	url: '',
		    	data: '',
		    	dataType: 'json',
		    	beforeSend : function(jqXHR, settings){},
		    	success : function(data, textStatus, jqXHR) {},
		    	error: function (jqXHR, textStatus, errorThrown) {}
			},
		launch : function(options){
			var parametros = $.extend({}, this.defaults, options);

			app.log.debug('Ajax Launch', options, parametros);

			return $.ajax(parametros);
		},
        procesarRespuesta : function(respuesta){
            var respuestaJSON = JSON.parse(respuesta[0].d);

            var resultado = {};
            resultado.estado = respuestaJSON["Estado"];
            resultado.entidad = respuesta.entidad;
            resultado.tieneDatos = false;
            resultado.mensaje = '';


            if(resultado.estado === 'OK')
            {
                resultado.tieneDatos = true;
                if(respuestaJSON["Datos"].length > 0)
                    resultado.datos = JSON.parse(respuestaJSON["Datos"]);
                else
                    resultado.datos = "";

                resultado.mensaje = respuestaJSON["Mensaje"];
            }
            else if( resultado.estado === 'Empty')
            {
                resultado.mensaje = 'No se han obtenido resultados para la contulta';
            }
            else if( resultado.estado === 'Error')
            {
                resultado.mensaje = 'Ha ocurrido un error: \n ' + respuestaJSON["Mensaje"];
                alert(resultado.mensaje);
            }

            return resultado;
        }
	},
    utils : {
        extenderFicha : function(ficha, textoExtension){
            if(textoExtension != null)
            {
                var extension = eval('( function(){ return ' +  textoExtension  + '  })()');
                $.extend(ficha, extension);
            }
        },
        extenderControl : function(control, textoEventos){
            if(textoEventos != null)
            {
                var eventos = eval('( function(){ return ' + textoEventos + '  })()');
                $.each(eventos, function(k,v){
                    $(control).off(k);
                    $(control).on(k, v);
                });
            }
        },
        Fecha : {
            Now : function(){
                var fecha = new Date();
                var dia = fecha.getDay();
                var mes = fecha.getMonth();

                if(dia.toString().length == 1)
                    dia = "0" + dia;

                if(mes.toString().length == 1)
                    mes = "0" + mes;

                return dia + "/"+ mes + "/" + fecha.getFullYear();
            },
            AddDays : function(fecha , dias){
                var nuevoDia = parseInt(fecha.substr(0, 2));
                var resto = fecha.substr(2, 8);
                nuevoDia += dias;

                if(nuevoDia.toString().length == 1)
                    nuevoDia = "0" + nuevoDia;

                return  nuevoDia + resto;

            }
        }
    }

};

if (!Date.now) {
    Date.now = function() {
        return new Date().valueOf();
    }
}