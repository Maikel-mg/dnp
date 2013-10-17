function formulario()
{
	this.datos = {},
	this.load = function(){
		var self = this;

		$.getJSON('../js/fixtures/formulario_1.json', function(data){
			self.datos = data;
			
			app.eventos.publicar('RenderGrupos', []);
		});
	},
	this.CrearGrupo = function(nombre)
	{
		var grupo = {};
		grupo.nombre = nombre;
		grupo.campos = [];

		this.datos.grupos.push(grupo);

		app.eventos.publicar('CargarGrupos', []);
	},
	this.BuscarGrupo = function(Campo, Valor){
		arr = jQuery.grep(this.datos.grupos, function(n, i){
			return n[Campo] == Valor;
		});
		
		return arr[0];
	},
	this.BuscarCampo = function(IdGrupo , IdCampo){

		var grupo = this.BuscarGrupo("id", IdGrupo);

		arr = jQuery.grep(grupo.campos, function(n, i){
	  		return n.id == IdCampo;
		});

		return arr[0];
	},
	this.insertarCampo = function(campo){
		this.seccionActual.Campos.push(campo);
		$.publish('campoInsertado' , [campo]);
	}
};