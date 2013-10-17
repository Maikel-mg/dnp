function ConfiguradorFormularios(){
	
	this.init = function(){
		this.eventos();
		this.subscripciones();

		this.pantalla = new formulario();
		this.pantalla.load();
		this.cf = new CreadorFormulario();
		this.cf.CargarFormulario(this.pantalla);

		this.CargarFuentesExternas();
		this.CargarFuentesInternas();

		//app.eventos.publicar('RenderGrupos', []);
	},
	this.eventos = function(){

		/* -- EVENTOS GRUPOS -- */
		$('#grupos').delegate('li', 'click', function(){ 
			app.eventos.publicar('SeleccionarGrupo', this); 
		});
		$('#grupos').delegate('li a.btnEliminar', 'click', function(){
			app.eventos.publicar('EliminarGrupo', this); 
		}); 
		$('#grupos').delegate('li a.btnEditar', 'click', function(){
			app.eventos.publicar('ModificarGrupo', this); 
		}); 
		$('#btnNuevoGrupo').on('click', function(){ 
			app.eventos.publicar('CrearGrupo', this); 
		});

		/* -- EVENTOS CAMPOS -- */
		$('#btnAddCampo').on('click', function(){
			app.eventos.publicar('CrearCampo', this);
		});
		$('#btnMoverCampo').on('click', function(){
			app.eventos.publicar('MoverCampo', this);
		});
		$('#listadoCampos').delegate('tbody tr', 'click', function(){
			app.eventos.publicar('SeleccionarCampo', this);
		});

		/* -- EVENTOS EDICION CAMPOS -- */
		$('#tipoCampo').on('change', function(){
			app.eventos.publicar('CambioTipoCampo', this);
		});
		$('#btnGuardar').on('click', function(){
			app.eventos.publicar('ModificarCampo', this);
		});
		$('#fuenteComboInterno').on('click', function(){
			app.eventos.publicar('CambioFuenteInterna', this);
		});
		$('#fuenteComboInterno').on('change', function(){
			app.eventos.publicar('CambioFuenteInterna', this);
		});
	},
	this.subscripciones = function()
	{
		/* -- EVENTOS GRUPOS -- */
		app.eventos.subscribir('RenderGrupos', $.proxy(this.RenderGrupos, this));
		app.eventos.subscribir('SeleccionarGrupo', $.proxy(this.SeleccionarGrupo, this));
		app.eventos.subscribir('CrearGrupo', $.proxy(this.CrearGrupo, this));
		app.eventos.subscribir('ModificarGrupo', $.proxy(this.ModificarGrupo, this));
		app.eventos.subscribir('EliminarGrupo', $.proxy(this.EliminarGrupo, this));

		/* -- EVENTOS CAMPOS -- */
		app.eventos.subscribir('RenderCampos', $.proxy(this.RenderCampos, this));
		app.eventos.subscribir('SeleccionarCampo', $.proxy(this.SeleccionarCampo, this));
		app.eventos.subscribir('CrearCampo', $.proxy(this.CrearCampo, this));
		app.eventos.subscribir('ModificarCampo', $.proxy(this.ModificarCampo, this));
		app.eventos.subscribir('MoverCampo', $.proxy(this.MoverCampo, this));
		app.eventos.subscribir('CargarCampoEdicion', $.proxy(this.CargarCampoEdicion, this));
		app.eventos.subscribir('CambioTipoCampo', $.proxy(this.CambioTipoCampo, this));
		app.eventos.subscribir('CambioFuenteInterna', $.proxy(this.CambioFuenteInterna, this));


	}, 
	/* ---- GRUPOS ----- */ 
	this.RenderGrupos = function(evento, respuesta)
	{
		$('#grupos li').remove();
		$('#seccionTemplate').tmpl( this.pantalla.datos.grupos ).appendTo('#grupos');
	}
	this.SeleccionarGrupo = function(evento, respuesta)
	{
		$('#grupos li.seleccionado').removeClass('seleccionado');
		$(respuesta).addClass('seleccionado');
		var id = $(respuesta).attr('id').replace('grupo-', '');

		//var grupo = this.pantalla.BuscarGrupo("id", id);
		this.cf.SeleccionarGrupo(id);

		app.eventos.publicar("RenderCampos", []);
	},
	this.CrearGrupo = function(evento, respuesta)
	{
		var nuevoGrupo = prompt ("Nombre del nuevo grupo");
		if(nuevoGrupo != "" && nuevoGrupo != undefined)
		{
			this.cf.CrearGrupo(nuevoGrupo);
			app.eventos.publicar('RenderGrupos', []);
		}
	},
	this.ModificarGrupo = function(evento, respuesta)
	{
		var id = $(respuesta).closest('li').attr('id').replace('grupo-', '');
		var nombreActual = $(respuesta).prev().prev().text();
		var nombreNuevo = prompt ("Cambie el nombre del grupo", nombreActual );
		if(nombreNuevo != "" && nombreNuevo != nombreActual)
		{
			this.cf.ModificarGrupo(id, nombreNuevo);
			app.eventos.publicar('RenderGruvpos', []);
		}
	},
	this.EliminarGrupo = function(evento, respuesta)
	{
		var id = $(respuesta).closest('li').attr('id').replace('grupo-', '');
		var confirmacion = prompt ("Desea eliminar el grupo'" + $(respuesta).prev().text() + "'", "N" );
		if(confirmacion == "S" || confirmacion == "s")
		{
			this.cf.EliminarGrupo(id);
			app.eventos.publicar('RenderGrupos', []);
		}
	},
	/* ---- CAMPOS ----- */ 
	this.RenderCampos = function(evento, respuesta)
	{
		$(this.cf.grupoActivo.campos).each(function(k,v){
			app.log.debug('Load ', [k,v]);
		});

		$('#listadoCampos tbody tr').remove();
		$('#campoTemplate').tmpl(this.cf.grupoActivo.campos).appendTo('#listadoCampos tbody')
		$('#numRegistros').text(this.cf.grupoActivo.campos.length);

		if(this.cf.campoActivo != {})
			$('#campo-' + this.cf.campoActivo.id).addClass('seleccionado');		
	},
	this.SeleccionarCampo = function(evento, respuesta)
	{
		$('#listadoCampos tbody tr.seleccionado').removeClass('seleccionado');
		$(respuesta).addClass('seleccionado');
		var id = $(respuesta).attr('id').replace('campo-', '');

		this.cf.SeleccionarCampo(id);

		app.eventos.publicar("CargarCampoEdicion", []);
	},
	this.CrearCampo = function(evento, respuesta)
	{
		this.cf.CrearCampo();	
		app.eventos.publicar("RenderCampos", []);
	},
	this.ModificarCampo = function(evento, respuesta)
	{
		var campo = {};

		campo.nombre = $('#nombreCampo').val();
		campo.etiqueta = $('#labelCampo').val();
		campo.tipo = $('#tipoCampo').val();
		campo.porDefecto = $('#valorDefecto').val();
		campo.observaciones = $('#observacionesCampo').val();

		this.cf.ModificarCampo( campo );
		app.eventos.publicar("RenderCampos", []);
	},
	this.EliminarCampo = function(evento, repuesta)
	{

		this.cf.EliminarCampo();
		app.eventos.publicar("RenderCampos", []);

	},
	this.MoverCampo = function(evento, respuesta)
	{
		var nombreGrupo = prompt ("Introduce el nombre del grupo", "" );
		if(nombreGrupo !== "")
		{
			this.cf.MoverCampo(nombreGrupo);	
			app.eventos.publicar("RenderCampos", []);	
		}
	},
	this.CargarCampoEdicion = function(evento, respuesta)
	{
		$('#nombreCampo').val('');
		$('#labelCampo').val('');
		$('#tipoCampo').val("textbox");
		$('#valorDefecto').val('');
		$('#observacionesCampo').val('');

		$('#nombreCampo').val(this.cf.campoActivo.nombre);
		$('#labelCampo').val(this.cf.campoActivo.etiqueta);
		$('#tipoCampo').val(this.cf.campoActivo.tipo);
		$('#valorDefecto').val(this.cf.campoActivo.porDefecto);
		$('#observacionesCampo').val(this.cf.campoActivo.observaciones);

		app.eventos.publicar('CambioTipoCampo', $('#tipoCampo'));
	},
	this.CambioTipoCampo = function(evento, respuesta)
	{
		var tipo = $(respuesta).val();
		$('#filaFuenteComboExterno').hide();
		$('#filaFuenteComboInterno').hide();

		if( tipo == "comboInterno")
		{
			$('#filaFuenteComboInterno').show();	
		}

		if( tipo == "comboExterno")
		{
			$('#filaFuenteComboExterno').show();
		}
		
	},
	this.CargarFuentesExternas = function(){
		var self = this;

		$.getJSON('../js/fixtures/fuentesExternas.json', function(data){
			self.fuentesExternas = data;

			$('#fuenteComboExterno option').remove();
			$('#comboTemplate').tmpl(self.fuentesExternas).appendTo('#fuenteComboExterno');

		});
	},
	this.CargarFuentesInternas = function(){
		var self = this;

		$.getJSON('../js/fixtures/fuentesInternas.json', function(data){

			self.fuentesInternas = data;
			$(self.fuentesInternas).each(function(){
				this.value = this.id;
				this.text = this.nombre;
			});

			$('#fuenteComboInterno option').remove();
			$('#comboTemplate').tmpl(self.fuentesInternas).appendTo('#fuenteComboInterno');

		});
	},
	this.CambioFuenteInterna = function(evento, respuesta){
		var tipo = $(respuesta).val();
		var valores = _.find(this.fuentesInternas, function(elemento){ return elemento.id === tipo}).valores;

		$("#valoresFuenteInterna tbody tr").remove();
		$("#filaValoresTemplate").tmpl(valores).appendTo('#valoresFuenteInterna tbody');

	}
}