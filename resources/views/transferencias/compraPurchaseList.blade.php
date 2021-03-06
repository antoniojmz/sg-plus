@extends('menu.index')
@section('content')
<style type="text/css" media="screen">
	.nav-tabs .slide{
		 width: calc(100% / 2)!important;
	}
	.ErrorRut{
		color:#E02121;
		font-size: 10px;
	}
</style>
<div class="row">
	<div class="col-md-12 divDetalles">
	    <div class="card">
			<div class="card-block">
				<div class="col-md-12">
					<div class="row">
						<div class="col-md-2">
                			<a  href="{{ route('compras') }}" style="float:left;" name="botonListadoCompras" id="botonListadoCompras" class="btn btn-primary waves-effect waves-light btn-block" href="#primary" role="button">
								<span>Compras Realizadas </span>
							</a>
						</div>
						
						<div class="col-md-2">
							<a  href="#!" style="float:left;" name="botonCDR" id="agregar" name="agregar" class="btn btn-warning waves-effect waves-light btn-block" href="#primary" role="button">
								<span>Ingresar Compra </span>
							</a>
						</div>
						
						<div class="col-md-2">
							<a  href="{{ URL::route('compraMasivaList') }}" style="float:left;" name="botonAgregarCompraMasiva" id="botonAgregarCompraMasiva" class="btn btn-warning waves-effect waves-light btn-block" href="#primary" role="button">
								<span>Compras Masivas</span>
							</a>
						</div>
						
						<div class="col-md-2">
                			<a  href="{{ URL::route('compraPurchaseList') }}" style="float:left;" name="botonListadoCompra" id="botonListadoCompra" class="btn btn-inverse-primary waves-effect waves-light btn-block" role="button">
								<span>Listados de Compra</span>
							</a>
						</div>
						
						<div class="col-md-2">
							<a  href="#!" style="float:left;" name="" id="" class="btn btn-primary waves-effect waves-light btn-block" href="#primary" role="button">
								<span>--</span>
							</a>
						</div>
					</div>
				</div>
				<br />
				<div class="col-md-12">
					<div class="row">
						<div class="col-md-2">
							<a  href="{{ URL::route('compraPurchaseList') }}" style="float:left;" name="" id="" class="btn btn-inverse-success waves-effect waves-light btn-block" role="button">
								<span>Listados de Compras</span>
							</a>
						</div>
						
						<div class="col-md-2">
                			<a  href="{{ route('compraPurchasListNew') }}" style="float:left;" name="botonListadoCompras" id="botonListadoCompras" class="btn btn-success waves-effect waves-light btn-block" role="button">
								<span>Nuevo Listado de Compras </span>
							</a>
						</div>
						
					</div>
				</div>
			</div>
	    </div>
	</div>
</div>

<div class="row">
	<div class="col-md-12 divDetalles">
		<div class="card">
		   <div class="card-header">
	        	<center>
	        		<h5 class="card-header-text">
	        			Listados de Compras
	        		</h5>
                </center>
	        </div>
		    <div class="card-block">
				<div class="col-md-12">
	        		<div class="row">
	        			<div class="col-md-12 table-responsive">
							<table id="tablaListadosCompra" ></table>
						</div>
						<form id="FormCompraMasivaView" action="{{ route('compraMasivaView') }}" method="get">
							 {{ csrf_field() }}
							<input type="hidden" name="IdCompra" id="IdCompra">

						</form>
					</div>
				</div>
		    </div>
		</div>
	</div>
</div>

<script Language="Javascript">
	var rutaCMV = "{{ URL::route('compraMasivaView') }}"
	
	var d = [];
	d['v_compras_listado_compra'] = JSON.parse(rhtmlspecialchars('{{ json_encode($v_compras_listado_compra) }}'));
</script>

<script src="{{ asset('js/compras/compraPurchaseList.js') }}"></script>
@endsection