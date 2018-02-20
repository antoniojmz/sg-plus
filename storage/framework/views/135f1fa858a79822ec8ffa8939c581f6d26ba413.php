<?php $__env->startSection('content'); ?>
<div class="row">
	<div class="col-md-12 divDetalles">
	    <div class="card">
	        <div class="card-header">
	        	<center>
	        		<h5 class="card-header-text">
	        			Listado de Productos Registrados
	        		</h5>
                </center>
	        </div>
	        <div class="card-block">
				<div class="col-md-12">
					<div class="row">
						<div class="col-md-12">
							<button style="float:right;" name="agregar" id="agregar" type="button" class="btn btn-primary waves-effect waves-light">
								<span>Agregar</span>
                			</button>
						</div>
					</div>
					<br />
					<div class="row">
						<div class="col-md-12 table-responsive">
							<table id="tablaProductos" class="table table-striped dt-responsive nowrap table-hover" cellspacing="0" width="100%"></table>
						</div>
					</div>
		        </div>
	        </div>
	    </div>
	</div>
	<div class="col-md-12 divDetalles" style="display:none;">
		<div class="card">
		    <div class="card-header">
		    	<center>
			    	<h5 id="spanTitulo" class="card-header-text"></h5>
		    	</center>
		    </div>
		    <div class="card-block">
		        <div class="row">
		            <div class="col-sm-12">
		                <div class="product-edit">
							<div class="row">
								<div id="divVolver" class="col-md-12">
									<a style="float:right;" id="volverAct" href="#"><u>volver</u></a>
								</div>
							</div>
							<div id="divTabs">
			                    <ul class="nav nav-tabs nav-justified md-tabs " role="tablist">
			                        <li class="nav-item">
			                            <a id="adetalles" class="nav-link active" data-toggle="tab" href="#Tabdetalles" role="tab">
			                                <div class="f-26">
			                                    <i class="icofont icofont-document-search"></i>
			                                </div>
			                                Receta
			                            </a>
			                            <div class="slide"></div>
			                        </li>
			                        <li class="nav-item">
			                            <a id="aimpuestos" class="nav-link" data-toggle="tab" href="#TabImpuestos" role="tab">
			                                <div class="f-26">
			                                    <i class="icofont icofont-document-search"></i>
			                                </div>
			                                Impuestos
			                           	</a>
			                            <div class="slide"></div>
			                        </li>
			                        <li class="nav-item">
			                            <a id="astock" class="nav-link" data-toggle="tab" href="#TabStock" role="tab">
			                                <div class="f-26">
			                                    <i class="icofont icofont-document-search"></i>
			                                </div>
			                                Stock
			                           	</a>
			                            <div class="slide"></div>
			                        </li>
			                        <li class="nav-item">
			                            <a id="akardex" class="nav-link" data-toggle="tab" href="#TabKardex" role="tab">
			                                <div class="f-26">
			                                    <i class="icofont icofont-document-search"></i>
			                                </div>
			                                Kardex
			                           	</a>
			                            <div class="slide"></div>
			                        </li>
			                    </ul>
			                </div>
		                    <!-- Tab panes -->
							<br><br>
		                    <div class="tab-content">
		                        <div class="tab-pane active" id="Tabdetalles" role="tabpanel">
									<?php echo Form::open(['id'=>'FormProducto','autocomplete' => 'off']); ?>

									<?php echo Form::hidden('IdProducto', '', [
									'id'            => 'IdProducto',
									'class'         => 'form-control']); ?>

									<input type="hidden" name="_token" id="_token" value="<?php echo csrf_token(); ?>">
									<div class="row">
										<div class="col-sm-4">
											<div class="md-input-wrapper">
												<input id="CodigoBarra" name="CodigoBarra" type="text" class="md-form-control" maxlength="20" readonly />
												<label for="CodigoBarra">Código Barra</label>
											</div>
										</div>
										<div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<input id="CodigoProveedor" name="CodigoProveedor" type="text" class="md-form-control" maxlength="20" readonly />
												<label for="CodigoProveedor">Código Proveedor</label>
											</div>
					                    </div>
					                    <div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<input id="NombreProducto" name="NombreProducto" type="text" class="md-form-control" maxlength="250" readonly />
												<label for="NombreProducto">Nombre Producto</label>
											</div>
					                    </div>
									</div>
									<br>
									<div class="row">
										<div class="col-sm-4">
											<div class="md-input-wrapper">
												<input id="DescripcionProducto" name="DescripcionProducto" type="text" class="md-form-control" maxlength="250" readonly />
												<label for="DescripcionProducto">Descripción Producto</label>
											</div>
										</div>
										<div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<select name="IdUltimoProveedor" id="IdUltimoProveedor" class="md-disable md-valid" disabled></select>
				                                <label for="IdUltimoProveedor">Último proveedor</label>
											</div>
					                    </div>
					                    <div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<select name="IdFamilia" id="IdFamilia" class="md-disable md-valid" disabled></select>
				                                <label for="IdFamilia">Familia</label>
											</div>
					                    </div>
									</div>
									<br>
									<div class="row">
										<div class="col-sm-4">
											<div class="md-input-wrapper">
												<select name="IdSubFamilia" id="IdSubFamilia" class="md-disable md-valid" disabled></select>
				                                <label for="IdSubFamilia">Subfamilia</label>
											</div>
										</div>
										<div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<select name="IdUnidadMedida" id="IdUnidadMedida" class="md-disable md-valid" disabled></select>
				                                <label for="IdUnidadMedida">Unidad Medida</label>
											</div>
					                    </div>
					                    <div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<select name="SeCompra" id="SeCompra" class="md-disable md-valid" disabled></select>
					                            <label for="SeCompra">Se compra</label>
											</div>
					                    </div>
									</div>
									<br>
									<div class="row">
										<div class="col-sm-4">
											<div class="md-input-wrapper">
												<select name="SeVende" id="SeVende" class="md-disable md-valid" disabled></select>
					                            <label for="SeVende">Se Vende</label>
											</div>
										</div>
										<div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<select name="EsProductoCombo" id="EsProductoCombo" class="md-disable md-valid" disabled></select>
				                                <label for="EsProductoCombo">Es combo</label>
											</div>
					                    </div>
					                    <div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<select name="Descontinuado" id="Descontinuado" class="md-disable md-valid" disabled></select>
				                                <label for="Descontinuado">Producto Descontinuado</label>
											</div>
					                    </div>
									</div>
									<br>
									<div class="row">
										<div class="col-sm-4">
											<div class="md-input-wrapper">
												<input id="StockMinimo" name="StockMinimo" type="text" class="md-form-control" maxlength="5" readonly />
												<label for="StockMinimo">Stock Minimo</label>
											</div>
										</div>
										<div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<input id="StockMaximo" name="StockMaximo" type="text" class="md-form-control" maxlength="5" readonly />
												<label for="StockMaximo">Stock Maximo</label>
											</div>
					                    </div>
					                    <div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<input id="StockRecomendado" name="StockRecomendado" type="text" class="md-form-control" maxlength="5" readonly />
												<label for="StockRecomendado">Stock Recomendado</label>
											</div>
					                    </div>
									</div>
									<br>
									<div class="row">
					                    <div class="col-sm-4">
											<div class="md-input-wrapper">
												<input id="PrecioUltimaCompra" name="PrecioUltimaCompra" type="text" class="md-form-control" maxlength="15" readonly />
												<label for="PrecioUltimaCompra">Precio Ultima Compra</label>
											</div>
					                    </div>
										<div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<input id="PrecioVentaSugerido" name="PrecioVentaSugerido" type="text" class="md-form-control" maxlength="15" readonly />
												<label for="PrecioVentaSugerido">Precio Venta Sugerido</label>
											</div>
										</div>
										<div class="col-sm-4">
					                        <div class="md-input-wrapper">
												<select name="EstadoProducto" id="EstadoProducto" class="md-disable md-valid" disabled></select>
				                                <label for="EstadoProducto">Estado Producto</label>
											</div>
					                    </div>
									</div>
									<br>
									<div align="center">
										<div class="divBotones">
											<button id="modificar" type="button" class="btn btn-primary waves-effect waves-light">
												Modificar
											</button>
										</div>
										<div class="divBotones" style="display:none;">
											<button id="cancelar" type="button" class="btn btn-inverse-primary waves-effect waves-light">
												Cancelar
											</button>
				                			<button id="guardar"  type="button" class="btn btn-primary waves-effect waves-light">
												Guardar
				                			</button>
										</div>
									</div>
									<?php echo Form::close(); ?>

		                        </div>
		                        <div class="tab-pane" id="TabImpuestos" role="tabpanel">
									<?php echo Form::open(['id'=>'FormImpuesto','autocomplete' => 'off']); ?>

									<?php echo Form::hidden('IdProducto2', '', [
									'id'            => 'IdProducto2',
									'class'         => 'form-control']); ?>

									<div class="row">
										<div class="col-sm-4"></div>
										<div class="col-sm-6">
										<div class="row">
											<input type="hidden" id="IdProducto2">
											<div class="col-sm-8">
												<div class="md-input-wrapper">
													<select name="IdImpuesto" id="IdImpuesto" class="md-valid"></select>
					                                <label for="IdImpuesto">Impuesto</label>
												</div>
						                    </div>
						                    <div class="col-sm-4">
												<button id="guardarI"  type="button" class="btn btn-primary waves-effect waves-light">
													Guardar
					                			</button>
						                    </div>
										</div>
										</div>
										<div class="col-sm-2"></div>
									</div>
									<?php echo Form::close(); ?>

									<div class="row">
										<div class="col-md-2"></div>
										<div class="col-md-8">
											<table id="tablaImpuestos" class="table table-striped dt-responsive nowrap table-hover" cellspacing="0" width="100%"></table>
										</div>
										<div class="col-md-2"></div>
									</div>
		                        </div>
		                        <div class="tab-pane" id="TabStock" role="tabpanel">
		                        	222222222222222222222222222222222222222222222222222222222222222222
		                        	Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		                        	tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		                        	quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		                        	consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		                        	cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		                        	proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		                        </div>
		                        <div class="tab-pane" id="TabKardex" role="tabpanel">
		                        	333333333333333333333333333333333333333333333333333333333333333333333
		                        	Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		                        	tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		                        	quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		                        	consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		                        	cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		                        	proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		                        </div>
		                    </div>
		                </div>
		            </div>
		        </div>
		    </div>
		</div>
	</div>
</div>
<script Language="Javascript">
	var ruta = "<?php echo e(URL::route('productos')); ?>"
	var rutaA = "<?php echo e(URL::route('activarPr')); ?>"
	var rutaD = "<?php echo e(URL::route('detallesPr')); ?>"
	var rutaDes = "<?php echo e(URL::route('descontinuarPr')); ?>"
	var rutaB = "<?php echo e(URL::route('buscarSubfamilia')); ?>"
	var rutaPI = "<?php echo e(URL::route('procesarIm')); ?>"
	var rutaAI = "<?php echo e(URL::route('activarIm')); ?>"

	var d = [];
	d['v_productos'] = JSON.parse(rhtmlspecialchars('<?php echo e(json_encode($v_productos)); ?>'));
	d['v_estados'] = JSON.parse(rhtmlspecialchars('<?php echo e(json_encode($v_estados)); ?>'));
	d['v_familias'] = JSON.parse(rhtmlspecialchars('<?php echo e(json_encode($v_familias)); ?>'));
	d['v_subfamilias'] = JSON.parse(rhtmlspecialchars('<?php echo e(json_encode($v_subfamilias)); ?>'));
	d['v_unidad'] = JSON.parse(rhtmlspecialchars('<?php echo e(json_encode($v_unidad)); ?>'));
	d['v_bodegas'] = JSON.parse(rhtmlspecialchars('<?php echo e(json_encode($v_bodegas)); ?>'));
	d['v_impuestos'] = JSON.parse(rhtmlspecialchars('<?php echo e(json_encode($v_impuestos)); ?>'));
</script>
<script src="<?php echo e(asset('js/productos/productos.js')); ?>"></script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('menu.index', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>