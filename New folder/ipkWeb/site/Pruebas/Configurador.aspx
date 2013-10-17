

<html>
	<head>
		<title>Configuraci&oacute;n de modelos</title>
		<style type="text/css">
	/**
	 *	Basic Layout Theme
	 * 
	 *	This theme uses the default layout class-names for all classes
	 *	Add any 'custom class-names', from options: paneClass, resizerClass, togglerClass
	 */
	body{
		font-family: Arial;
	}

	.ui-layout-pane { /* all 'panes' */ 
		background: #FFF; 
		border: 1px solid #BBB; 
		padding: 10px; 
		overflow: auto;
	} 

	.ui-layout-resizer { /* all 'resizer-bars' */ 
		background: #DDD; 
	} 

	.ui-layout-toggler { /* all 'toggler-buttons' */ 
		background: #AAA; 
	} 


	#grupos {
		border: 1px solid #DDD;
		font-family: Arial;

		margin:0px;
		padding: 0px;

	}
	#grupos li{
		/*background-color: #E9E9E9;*/
		font-size: 13px;
		border-bottom: 1px solid #CCC;
		padding:5px 5px;
		list-style-type: none;
	}
	#grupos li:hover{
		background-color: #EEE;
		border-bottom: 1px solid #CCC;
		font-weight: bold;

	}
	#grupos li.seleccionado{
		background-color: #E9e9e9;
		background-color: #C6E031;
		font-weight: bold;
	}
	#grupos li a{
		text-decoration:  none;
		color: #333;
	}

	.miniToolbar{
		background-color: #E9E9E9;
		border:1px solid #D9D9D9;
		width: 100%;
		margin:0px 0px 5px 0px;
		padding:0px;
	}
		.miniToolbar ul{
			margin:0px;
			padding:0px;	
		}
		.miniToolbar ul li{
			border-right: 1px solid #CCC;
			float: left;
			font-size: 13px;
			list-style-type: none;
			margin:0px;
			padding:5px 5px 5px 7px; 
			width: 20px;
		}
		.miniToolbar ul li:hover{
			background-color: #DDD;
			border-right: 1px solid #888;
		}
		.miniToolbar ul a{
			text-decoration: none;
			color: #333;
		}

	#listadoCampos tbody tr:hover{
		background-color: #E9E9E9;
	}
		#listadoCampos tbody tr.seleccionado{
			background-color: #C6E031;		
			font-weight: bold;
		}

	.listado tbody tr:hover{
		background-color: #E9E9E9;
	}
		.listado tbody tr.seleccionado{
			background-color: #C6E031;		
			font-weight: bold;
		}

	.clearFix{
		clear: both;
	}


	</style>
        <link rel='stylesheet' type='text/css' href='../../css/ipktheme/jquery-ui-1.8.18.custom.css' />
        <link rel='stylesheet' type='text/css' href='../../css/base.css' />
        <link rel='stylesheet' type='text/css' href='../../css/estilos.css' />
	</head>
	<body>
			<div class='ui-layout-north'>
				<span class=''>Configurador modelos</span>
			</div>
			<div class="ui-layout-west">
				<span class='block-Title'>Modelos</span>
				<ul id='grupos'>
				</ul>
				<div id='toolbarCampos' class='miniToolbar'>
					<ul>
						<li id='btnNuevoGrupo' title='A&ntilde;adir nuevo'>
							<a href="#" class='ui-icon ui-icon-plusthick' ></a>
						</li>
					</ul>
					<div class='clearFix'></div>
				</div>
			</div>
			<div class="ui-layout-east">
                <span class='block-Title'>Propiedades</span>
                <div id='panelPropiedades'>
                    <label for='nombreCampo'>Nombre:</label>
                    <br>
                    <input type='text' id='nombreCampo' name='nombreCampo' style='width:100%;'/>
                    <br>
                    <input type='checkbox' id='esClave' /> <span style='font-size:10px;'>Clave Primaria</span>
                    <br>
                    <input type='checkbox' id='esIndice' /> <span style='font-size:10px;'>Indice Unico</span>
                    <br>
                    <input type='checkbox' id='obligatorio' /> <span style='font-size:10px;'>Obligatorio</span>
                    <br>
                    <label for='tipoCampo'>Tipo:</label>
                    <br>
                    <select id='tipoCampo' name='tipoCampo' style='width:100%;'>
                        <option value='String'>Texto</option>
                        <option value='Int32'>Numerico</option>
                        <option value='DateTime'>Fecha</option>
                        <option value='Boolean'>Checkbox</option>
                        <option value='Reference'>Referencia</option>
                        <option value='Collection'>Colecci&oacute;n</option>
                    </select>
                    <select id='referencia' name='referencia' style='width:100%;' class='noDisplay'>
                    </select>
                    <br>
                </div>
                <div id='botoneraPropiedades'>
                    <input type='button' id='btnGuardar' value='Guardar' />
                    <input type='button' id='btnCancelar' value='Cancelar' />
                </div>
			</div>
			<div class="ui-layout-south">
				Consola
			</div>
			<div class="ui-layout-center">
				<div id='center-content' class="width100p">
                    <div id="listado" class='listado '>
                        <h3 id='tituloCentro'>TITULO</h3>
                        <table class='tabla width100p'>
                            <caption>
                                <div id='toolbar' class='toolbar'>
                                    <ul>
                                        <li class='boton' id='btnNuevoDossier' title='A&ntilde;adir nuevo registro'>
                                            <a href="#">
                                                <span class='icon-plus-sign'></span><span>Crear nuevo</span>
                                            </a>
                                        </li>
                                        <li class='boton' id='btnIrAFichar' title='Ir a fichar del registro seleccionado'>
                                            <a href="#ficha">
                                                <span class='icon-list-alt'></span><span>Ir a ficha</span>
                                            </a>
                                        </li>
                                        <li class='boton' id='btnBorrar' title='Borrar el registro seleccionado'>
                                            <a href="#borrar">
                                                <span class='icon-trash'></span><span>Borrar</span>
                                            </a>
                                        </li>
                                        <li class='boton' id='btnCopiar' title='Copiar el registro seleccionado'>
                                            <a href="#copiar"><span class='icon-repeat'></span> <span>Copiar</span> </a>
                                        </li>
                                    </ul>
                                    <div class='clearFix'></div>
                                </div>
                            </caption>
                            <thead></thead>
                            <tbody></tbody>
                            <tfoot>
                            <tr id="panelFiltro" class='noDisplay'>
                                <td colspan="6">
                                    <div >
                                        <label for="filtro">Buscar:</label>
                                        <input type="text" id='filtroTexto' />
                                        <select id='filtroCampo'>
                                            <option value='NumeroDossier'>Numero Dossier</option>
                                            <option value='Descripcion'>Descripcion</option>
                                            <option value='Version'>Version</option>
                                        </select>
                                        <input type="button" id='btnFiltro' value='Buscar' />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan='6'>
                                    <div>
                                        <div id='gridActions' class='floatLeft'>
                                            <a href="#" id='btnFiltrar' class='inline'>
                                                <span class='icon-search'>&nbsp;</span>
                                            </a>
                                        </div>
                                        <div id='numeroRegistros' class='floatRight'>
                                            N&uacute;m Registros:  <span id='count'> 0</span>
                                        </div>
                                    </div>

                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
			    </div>
            </div>


		<script type="text/javascript" src='../../js/libs/jquery-1.7.1.min.js'></script>
		<script type="text/javascript" src='../../js/libs/jquery-ui-1.8.18.custom.min.js'></script>
		<script type="text/javascript" src="../../js/libs/jquery.layout.min.js"></script>
		<script type="text/javascript" src="../../js/libs/jquery.tmpl.min.js"></script>
		<script type="text/javascript" src="../../js/libs/underscore-min.js"></script>
		<script type="text/javascript" src="../../js/base/Utils.js"></script>
		<script type="text/javascript" src="../../js/base/framework.base.js"></script>
        <script type="text/javascript" src="../../js/base/framework.project.js"></script>
		<script type="text/javascript" src="../../js/clases/formulario.js"></script>
        <script type="text/javascript" src="../../js/clases/DataSource.js"></script>
        <script type="text/javascript" src="../../js/clases/ControlGruposV2.js"></script>
        <script type="text/javascript" src="../../js/clases/ComponenteListado.js"></script>
        <script type="text/javascript" src="../../js/vistas/Administracion/Configurador.js"></script>
		<script type="text/javascript">
            var controller;

			$(document).ready(function(){
				$('body').layout({
					north: {
						resizable  : false,
						closable : false,
						size: '40'
					}
				});

                controller = new ConfiguradorController();

			});
		</script>

        <script	type="text/template" id="lateralTemplate">
            <li id='modelos-${IdModelo}'>
                <a href="#">${Nombre}</a>
                <a href="#" class='ui-icon ui-icon-trash btnEliminar' style='float: right' ></a>
                <a href="#" class='ui-icon ui-icon-pencil btnEditar' style='float: right' ></a>
            </li>
        </script>
        <script	type="text/template" id="centroTemplate">
            <tr id='camposModelos-${IdCampo}'>
                <td>${Nombre}</td>
                <td>${Tipo}</td>
                <td>${EsClave}</td>
                <td>${EsIndice}</td>
                <td>${Nullable}</td>
            </tr>
        </script>

        <script	type="text/template" id="comboReferenciasTemplate">
            <option value="${IdModelo}">${Nombre}</option>
        </script>
	</body>
</html>



