var manejoRefresh=limpiarLocales=limpiarImpuestos=errorRut=errorRut2=errorRut3=limpiarBodegas=0;

var parametroAjax = {
    'token': $('input[name=_token]').val(),
    'tipo': 'POST',
    'data': {},
    'ruta': '',
    'async': false
};

var calcularMontos = function(CantidadPreVenta,ValorUnitarioVenta,FactorImpuesto,MontoDescuento){
    var ValorImpuesto = (CantidadPreVenta * ValorUnitarioVenta * FactorImpuesto / 100)
    $("#ValorImpuestos").val(ValorImpuesto);
    var TotalLinea = ((CantidadPreVenta * ValorUnitarioVenta) + ValorImpuesto - MontoDescuento);
    $("#TotalLinea").val(TotalLinea);
    var ValorUnitarioFinal = (TotalLinea / CantidadPreVenta);
    $("#ValorUnitarioFinal").val(ValorUnitarioFinal);
}

var ManejoRespuestaBuscarProducto = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta!=null){
            if(respuesta.respuesta.IdProducto==0){
                $.growl({message:"Producto no encontrado"},{type: "warning", allow_dismiss: true});
            }else{
                $("#IdProducto").val(respuesta.respuesta.producto.IdProducto);
                $("#NombreProducto").val(respuesta.respuesta.producto.NombreProducto);
                $("#ValorUnitarioVenta").val(respuesta.respuesta.producto.PrecioVentaSugerido);
                $("#CantidadPreVenta").val(1);
                $("#FactorImpuesto").val(respuesta.respuesta.impuesto);
                $("#MontoDescuento").val(0);
                $("#IdUnidadMedida").val(respuesta.respuesta.producto.IdUnidadMedida).trigger("change");
                calcularMontos($("#CantidadPreVenta").val(),$("#ValorUnitarioVenta").val(),$("#FactorImpuesto").val(),$("#MontoDescuento").val());
            }    
        }else{
            $.growl({message:"Producto no encontrado"},{type: "warning", allow_dismiss: true});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true});
    }
}

var ManejoRespuestaBuscarCliente = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta!=null){
            if(respuesta.respuesta.IdCliente==0){
                var rut = $("#RUTProveedor").val();
                $("#RUTProveedor2").val(rut);
                $("#ModalProveedor").modal();
            }else{
                $("#IdCliente").val(respuesta.respuesta.IdCliente);
                $("#NombreCliente").val(respuesta.respuesta.NombreCliente);
            }    
        }else{
            $.growl({message:"Cliente no encontrado"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

var ManejoRespuestaBuscarEmpresa = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta!=null){
            crearselect(respuesta.respuesta.v_locales,"IdLocal");
            if(respuesta.respuesta.busqueda.IdEmpresa==0){
                $("#idEmpresa").val("");
                $("#NombreFantasiaE").val("");
                $.growl({message:"Empresa no encontrada"},{type: "warning", allow_dismiss: true,});
            }else{
                $("#idEmpresa").val(respuesta.respuesta.busqueda.IdEmpresa);
                $("#NombreFantasiaE").val(respuesta.respuesta.busqueda.NombreFantasia);
            }    
        }else{
            $.growl({message:"Contacte al personal informatico"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

var ManejoRespuestaProcesarCompraD = function(respuesta){
    console.log(respuesta);
    console.log(respuesta.respuesta);
    if(respuesta.code==200){
        if(respuesta.respuesta!=null){
            $("#ModalDetalleCompra").modal();
            $("#spanTituloModal").text("Detalle Compra");
            $("#divBotonM").show();
            $("#divBotonesAC").hide();
            bloquearInputsDetalles();
            pintarDatosActualizarDetalles(respuesta.respuesta[0]);
        }else{
            $.growl({message:"Contacte al personal informatico"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

var ManejoRespuestaProcesarCD = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta.activar>0){
            if(respuesta.respuesta.v_detalles.length>0){
                $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});
                cargarTablaDetalles(respuesta.respuesta.v_detalles);
            }
        }else{
            $.growl({message:"Debe seleccionar un registro"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

var ManejoRespuestaProcesarD = function(respuesta){
    if(respuesta.code==200){
        bloquearInputs();
        $("#div-mod").show();
        $("#div-acep").hide();
        $(".divDetalles").toggle();
        $("#divVolver").show();
        $("#divTabs").show();
        $("#spanTitulo").text("Detalles");
        pintarDatosActualizar(respuesta.respuesta.v_cabecera[0]);
        cargarTablaDetalles(respuesta.respuesta.v_detalles);
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Activar / Desactivar compra
var ManejoRespuestaProcesarI = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta.activar>0){
            if(respuesta.respuesta.v_preventas.length>0){
                $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});
                cargarTablaPreventas(respuesta.respuesta.v_preventas);
            }
        }else{
            $.growl({message:"Debe seleccionar un registro"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Registro de proveedor
var ManejoRespuestaProcesarProveedor = function(respuesta,nombre){
    if(respuesta.code==200){
        if(respuesta.respuesta>0){
            $("#IdProveedor").val(respuesta.respuesta);
            $("#NombreFantasia").val(nombre);
            $("#ModalProveedor").modal("hide");
        }else{
            $.growl({message:"ocurrió un error mientras se registraba el proveedor"},{type: "warning", allow_dismiss: true,}); 
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
};

// Manejo Registro o actualizacion de cabecera de compra
var ManejoRespuestaProcesar = function(respuesta){
    if(respuesta.code==200){
        var res = JSON.parse(respuesta.respuesta.f_registro);
        if(res.code=="200"){ 
            $.growl({message:res.des_code},{type: "success", allow_dismiss: true,});
            $("#idPreVenta").val(res.IdPreVenta);
            $("#IdPreVenta2").val(res.IdPreVenta);
            $("#div-mod").hide();
            $("#div-acep").hide();
            $("#aimpuestos").addClass("active");
            $("#TabImpuestos").addClass("active");
            $("#Tabdetalles").removeClass("active");
            $("#adetalles").removeClass("active");
            $("#divTabs").show();
            $("#divVolver").show();               
        }
        if (res.code=="-2"){
            $.growl({message:res.des_code},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
};

var ManejoRespuestaProcesarDetalles = function(respuesta){
    if(respuesta.code==200){
        var res = JSON.parse(respuesta.respuesta.f_registro);
        switch(res.code) {
            case '200':
                $.growl({message:res.des_code},{type: "success", allow_dismiss: true,});
                $(".divBotonesC").toggle();
                $("#ModalDetalleCompra").modal("hide");
                $('#IdDetalleCompra').val("");
                $('#FormDetalle')[0].reset();
                cargarTablaDetalles(respuesta.respuesta.v_detalles);
                break;
            case '-2':
                $.growl({message:res.des_code},{type: "warning", allow_dismiss: true,});
                break;
            default:
                $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
                break;
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }

}

var cargarTablaPreventas = function(data){
    if(limpiarLocales==1){destruirTabla('#tablaPreventas');$('#tablaPreventas thead').empty();}
        $("#tablaPreventas").dataTable({
            responsive:false,
            "aLengthMenu": DataTableLengthMenu,
            "pagingType": "full_numbers",
            "language": LenguajeTabla,
            "columnDefs": [
                {"targets": [ 1 ],"searchable": true},
                {"sWidth": "1px", "aTargets": [8]}
            ],
            "data": data,
            "columns":[
                {
                    "title": "",
                    "data": "idPreVenta",
                    "render": function(data, type, row, meta){
                        var result = `
                        <center>
                        <a href="#" onclick="verDetallesPreventa(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Ver Detalles" data-original-title="Delete">
                            <i class="icofont icofont-search"></i>
                        </a>
                        <a href="#" onclick="cambiarEstatusPreventa(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Activar / Desactivar" data-original-title="Delete">
                            <i class="icofont icofont-ui-delete"></i>
                        </a>
                        </center>`;
                        return result;
                    }
                },
                {"title": "Id","data": "idPreVenta",visible:0},
                {
                    "title": "Fecha Preventa", 
                    "data": "FechaPreVenta",
                    "render": function(data, type, row, meta){
                        if(type === 'display'){
                            data = moment(data, 'YYYY-MM-DD HH:mm:ss',true).format("DD-MM-YYYY");
                        }
                        return data;
                    }
                },
                {"title": "Nombre Local","data": "NombreLocal"},
                {"title": "RUT Cliente","data": "RUTCliente"},
                {"title": "Nombre Cliente","data": "NombreCliente"},
                {"title": "Nombre Vendedor","data": "NombreVendedor"},
                {"title": "Total","data": "TotalPreVenta"},
                {"title": "EstadoPreVenta","data": "EstadoPreVenta",visible:0},
                {"title": "Estado","data": "desEstadoPreventa"}
            ],
        });
        limpiarLocales=1;
};

var cargarTablaDetalles = function(data){
    if(limpiarImpuestos==1){destruirTabla('#tablaDetalles');$('#tablaDetalles thead').empty();}
        $("#tablaDetalles").dataTable({
            responsive:false,
            "bSort": false,
            "scrollCollapse": false,
            "paging": false,
            "searching": false,
            "info":false,
            "columnDefs": [
                {"targets": [ 1 ],"searchable": true},
                {"sWidth": "1px", "aTargets": [8]}
            ],
            "data": data,
            "columns":[
                {
                    "title": "",
                    "data": "IdDetallePreVenta",
                    "render": function(data, type, row, meta){
                        var result = `
                        <center>
                        <a href="#" onclick="verDetallesPreventaD(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Ver Detalles" data-original-title="Delete">
                            <i class="icofont icofont-search"></i>
                        </a>
                        <a href="#" onclick="cambiarEstatusCompraD(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Activar / Desactivar" data-original-title="Delete">
                            <i class="icofont icofont-ui-delete"></i>
                        </a>
                        </center>`;
                        return result;
                    }
                },
                {"title": "Id","data": "IdDetallePreVenta",visible:0},
                {"title": "IdPreVenta","data": "IdPreVenta",visible:0},
                {"title": "IdProducto","data": "IdProducto",visible:0},
                {"title": "IdUnidadMedida","data": "IdUnidadMedida",visible:0},
                {"title": "Nombre Producto","data": "NombreProducto"},
                {"title": "Cantidad","data": "CantidadPreVenta"},
                {"title": "Valor Unitario","data": "ValorUnitarioVenta"},
                {"title": "Factor Impuesto","data": "FactorImpuesto"},
                {"title": "Valor Impuestos","data": "ValorImpuestos"},
                {"title": "Monto Descuento","data": "MontoDescuento"},
                {"title": "Valor Unitario Final","data": "ValorUnitarioFinal"},
                {"title": "Total Linea","data": "TotalLinea"},
                {"title": "Estado","data": "EstadoPreVentaDetalle",visible:0},
                {"title": "Estado","data": "desEstadoPreventaDetalle",visible:0}
            ],
        });
        limpiarImpuestos=1;
};

var pintarDatosActualizar= function(data){
    $(".md-form-control").addClass("md-valid");
    $("#idPreVenta").val(data.idPreVenta);
    $("#IdPreVenta2").val(data.idPreVenta);
    $("#IdCliente").val(data.IdCliente);
    $("#FechaPreVenta").val(moment(data.FechaPreVenta, 'YYYY-MM-DD HH:mm:ss',true).format("DD-MM-YYYY"));
    $("#RUTCliente").val(data.RUTCliente);
    $("#NombreCliente").val(data.NombreCliente);
    $("#TotalPreVenta").val(data.TotalPreVenta);
}

var pintarDatosActualizarDetalles = function(data){
    $("#IdPreVenta2").val(data.IdPreVenta);
    $("#IdDetallePreVenta").val(data.IdDetallePreVenta);
    $("#IdProducto").val(data.IdProducto);
    $("#CodigoBarra").val(data.CodigoBarra);
    $("#NombreProducto").val(data.NombreProducto);
    $("#IdUnidadMedida").val(data.IdUnidadMedida).trigger("change");
    $("#CantidadPreVenta").val(data.CantidadPreVenta);
    $("#ValorUnitarioVenta").val(data.ValorUnitarioVenta);
    $("#FactorImpuesto").val(data.FactorImpuesto);
    $("#ValorImpuestos").val(data.ValorImpuestos);
    $("#MontoDescuento").val(data.MontoDescuento);
    $("#ValorUnitarioFinal").val(data.ValorUnitarioFinal);
    $("#TotalLinea").val(data.TotalLinea);
}

var BotonAgregar = function(){
    $("#spanTitulo").text("Registrar Preventa");
    desbloquearInputs();
    $(".divDetalles").toggle();
    $("#divVolver").hide();
    $("#idPreVenta").val("");
    $('#FormPreventas')[0].reset();
    $("#divTabs").hide();
    $("#div-mod").hide();
    $("#div-acep").show();
    var now = moment().format('DD-MM-YYYY')
    $("#FechaPreVenta").val(now);
}

var BotonCancelar = function(){
    $("#spanTitulo").text("");
    $(".md-form-control").removeClass("md-valid");
    $('#FormPreventas')[0].reset();
    $("#idPreVenta").val("");
    $("#divTabs").show();
    $("#div-mod").hide();
    $("#div-acep").hide();
    // $(".divBotones").toggle();
    $(".divDetalles").toggle();
    bloquearInputs();
    $("#PrecioUltimaCompra").prop('readonly', true);
}

var volverListado = function(){
    $(".divDetalles").toggle();
    $('#FormPreventas')[0].reset();
    $('#FormProveedorNew')[0].reset();
    $('#FormDetalle')[0].reset();
    $("#idPreVenta").val("");
    $("#RUTProveedor2").val("");
    $("#IdDetalleCompra").val("");
    $("#idPreVenta2").val("");
    $("#IdProducto").val("");
    $("#aimpuestos").removeClass("active");
    $("#TabImpuestos").removeClass("active");
    $("#Tabdetalles").addClass("active");
    $("#adetalles").addClass("active");
}

var BotonAgregarDetalle = function (){
    $("#spanTituloModal").text("Registrar Detalle");
    $("#divBotonM").hide();
    $("#divBotonesAC").show();
    // $('#FormDetalle')[0].reset();
    $("#IdDetallePreVenta").val("");
    $("#IdProducto").val("");
    $("#CodigoBarra").val("");
    $("#NombreProducto").val("");
    $("#CantidadPreVenta").val("");
    $("#ValorUnitarioVenta").val("");
    $("#FactorImpuesto").val("");
    $("#ValorImpuestos").val("");
    $("#MontoDescuento").val("");
    $("#ValorUnitarioFinal").val("");
    $("#TotalLinea").val("");
    $(".comboclear").val('').trigger("change");
    desbloquearInputsDetalles();
}

var BotonCancelarDetalle = function(){
    $("#ModalDetalleCompra").modal("hide");
    $("#divBotonM").hide();
    $("#divBotonesAC").hide();
    $('#FormDetalle')[0].reset();
    $("#IdDetalleCompra").val("");
    $("#IdProducto").val("");
    $(".comboclear").val('').trigger("change");
    bloquearInputsDetalles();
}

var ProcesarProveedor = function(){
    var nombre = $("#NombreFantasia2").val();
    parametroAjax.ruta=rutaPR;
    parametroAjax.data = $("#FormProveedorNew").serialize();
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarProveedor(respuesta,nombre);
};

var ProcesarPreventa = function(){
    if(errorRut == 0){
        parametroAjax.ruta=ruta;
        parametroAjax.data = $("#FormPreventas").serialize();
        respuesta=procesarajax(parametroAjax);
        ManejoRespuestaProcesar(respuesta);
    }
};

var ProcesarDetalleCompra = function(){
    parametroAjax.ruta=rutaDC;
    parametroAjax.data = $("#FormDetalle").serialize();
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarDetalles(respuesta);
};

var validador = function(){
    $('#FormPreventas').formValidation('validate');
};

var validadorP = function(){
    $('#FormProveedorNew').formValidation('validate');
};

var validadorI = function(){
    $('#FormImpuesto').formValidation('validate');
}

var validadorD = function(){
    $('#FormDetalle').formValidation('validate');
};

var cambiarEstatusPreventa = function(idPreVenta){
    parametroAjax.ruta=rutaA;
    parametroAjax.data = {idPreVenta:idPreVenta};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarI(respuesta);
}

var verDetallesPreventa = function(idPreVenta){
    parametroAjax.ruta=rutaB;
    parametroAjax.data = {idPreVenta:idPreVenta};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarD(respuesta);
}

var verDetallesPreventaD = function(IdDetallePreVenta){
    parametroAjax.ruta=rutaBDC;
    parametroAjax.data = {IdDetallePreVenta:IdDetallePreVenta};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarCompraD(respuesta);
}

var cambiarEstatusCompraD = function(IdDetalleCompra){
    parametroAjax.ruta=rutaCDA;
    parametroAjax.data = {IdDetalleCompra:IdDetalleCompra};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarCD(respuesta);
}

var bloquearInputs = function(){
    $("#FechaPreVenta").prop('readonly', true);
    $("#RUTCliente").prop('readonly', true);
    // $("#NombreCliente").prop('readonly', true);
}


var desbloquearInputs = function(){
    $("#FechaPreVenta").prop('readonly', false);
    $("#RUTCliente").prop('readonly', false);
    // $("#NombreCliente").prop('readonly', false);
}

var bloquearInputsDetalles = function(){
    $("#CodigoBarra").prop('readonly', true);
    $("#NombreProducto").prop('readonly', true);
    $("#CantidadPreVenta").prop('readonly', true);
    $("#ValorUnitario").prop('readonly', true);
    // $("#FactorImpuesto").prop('readonly', true);
    // $("#ValorImpuestos").prop('readonly', true);
    $("#MontoDescuento").prop('readonly', true);
    // $("#ValorUnitarioFinal").prop('readonly', true);
    // $("#TotalLinea").prop('readonly', true);
    $("#IdUnidadMedida").prop('disabled', true);
}

var desbloquearInputsDetalles = function(){
    $("#CodigoBarra").prop('readonly', false);
    $("#NombreProducto").prop('readonly', false);
    $("#CantidadPreVenta").prop('readonly', false);
    $("#ValorUnitario").prop('readonly', false);
    // $("#FactorImpuesto").prop('readonly', false);
    // $("#ValorImpuestos").prop('readonly', false);
    $("#MontoDescuento").prop('readonly', false);
    // $("#ValorUnitarioFinal").prop('readonly', false);
    // $("#TotalLinea").prop('readonly', false);
    $("#IdUnidadMedida").prop('disabled', false);
}

var modificarCabeceras = function(){
    $("#spanTitulo").text("Editar Compra");
    $("#divVolver").hide();
    // $(".divBotones").toggle();
    $("#div-mod").hide();
    $("#div-acep").show();
    desbloquearInputs();
}

var modificarDetalles = function(){
    $("#spanTituloModal").text("Editar Detalle");
    $("#divBotonM").hide();
    $("#divBotonesAC").show();
    desbloquearInputsDetalles();
}

var volverTabs = function(){
    $("#spanTitulo").text("");
    $(".divDetalles").toggle();
    $("#aimpuestos").removeClass("active");
    $("#astock").removeClass("active");
    $("#akardex").removeClass("active");
    $("#TabImpuestos").removeClass("active");
    $("#TabStock").removeClass("active");
    $("#TabKardex").removeClass("active");
    $("#Tabdetalles").addClass("active");
    $("#adetalles").addClass("active");
}

var crearAllSelect = function(data){
    // crearselect(data.v_tipo_dte,"TipoDTE");
    // crearselect(data.v_estados,"EstadoCompra");
    // crearselect(data.v_estados,"EstadoDetalleCompra");
    crearselect(data.v_unidad_medida,"IdUnidadMedida");
}


var verificarRut = function(control,caso){
    var res = Valida_Rut(control);
    var format = formateaRut(control.val(), res);
    if (format != false){
        errorRut = 0;
        errorRut2 = 0;
        if (caso==1){buscarCliente(format);$("#ErrorRut").text("");}
        if (caso==2){$("#ErrorRut2").text("");}
        if (caso==3){buscarEmpresa(format);$("#ErrorRut3").text("");}
        return format;
    }else{
        if (caso==1){errorRut = 1;$("#ErrorRut").text("Rut invalido");}
        if (caso==2){errorRut2 = 1;$("#ErrorRut2").text("Rut invalido");}
        if (caso==3){errorRut3 = 1;$("#ErrorRut3").text("Rut invalido");}
        return control.val();
    }
}

var buscarCombos = function(IdLocal,IdBodega){
    parametroAjax.ruta=rutaBC;
    parametroAjax.data = {IdLocal:IdLocal,IdBodega:IdBodega};
    respuesta=procesarajax(parametroAjax);
    if(respuesta.code==200){var res = respuesta.respuesta;}
    else{ var res= 0; }
    return res;
}

var buscarProducto = function(CodigoBarra){
    parametroAjax.ruta=rutaBPD;
    parametroAjax.data = {CodigoBarra:CodigoBarra};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaBuscarProducto(respuesta);
}

var buscarCliente = function(RUTCliente){
    parametroAjax.ruta=rutaBC;
    parametroAjax.data = {RUTCliente:RUTCliente};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaBuscarCliente(respuesta);
}

var buscarEmpresa = function(RUTEmpresa){
    parametroAjax.ruta=rutaBE;
    parametroAjax.data = {RUTEmpresa:RUTEmpresa};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaBuscarEmpresa(respuesta);
}

var buscarBodegas = function(IdLocal){
    parametroAjax.ruta=rutaBB;
    parametroAjax.data = {IdLocal:IdLocal};
    respuesta=procesarajax(parametroAjax);
    if (respuesta.code==200){
        crearselect(respuesta.respuesta,"IdBodega");
    }
}

var calcularFechaPago = function (fecha){
    var FechaDTE = moment(fecha, 'DD-MM-YYYY',true).format("YYYY-MM-DD");
    var FechaSuma = moment(FechaDTE).add(1, 'month').format("YYYY-MM-DD");
    var FechaVencimiento = moment(FechaSuma, 'YYYY-MM-DD',true).format("DD-MM-YYYY");
    $("#FechaVencimiento").val(FechaVencimiento);
    $("#FechaPago").val(FechaVencimiento);
    $("#FechaVencimiento").focus();
    $("#FechaPago").focus();
    $("#TotalNeto").focus();
}

$(document).ready(function(){
    $("#FechaPreVenta").inputmask({ mask: "99-99-9999"});
    // $("#NombreCliente").val(now);
    cargarTablaPreventas(d.v_preventas);
    crearAllSelect(d);
    // $("#IdLocal").change(function() {
    //     buscarBodegas($("#IdLocal").val());
    // });
    $("#RUTCliente").focusout(function() {
        var valid = $("#RUTCliente").val();
        if (valid.length > 0){
            var res = verificarRut($("#RUTCliente"),1);
            $("#RUTCliente").val(res);
        }else{$("#ErrorRut").text("");}
    });
    // $("#RUTProveedor2").focusout(function() {
    //     var valid = $("#RUTProveedor2").val();
    //     if (valid.length > 0){
    //         var res = verificarRut($("#RUTProveedor2"),2);
    //         $("#RUTProveedor2").val(res);
    //     }else{$("#ErrorRut2").text("");}
    // });
    // $("#RUT").focusout(function() {
    //     var valid = $("#RUT").val();
    //     if (valid.length > 0){
    //         var res = verificarRut($("#RUT"),3);
    //         $("#RUT").val(res);
    //     }else{$("#ErrorRut3").text("");}
    // });
    // $("#FechaDTE").focusout(function() {
    //     calcularFechaPago($("#FechaDTE").val());
    // });
    $("#CodigoBarra").focusout(function() {
        buscarProducto($("#CodigoBarra").val());
    });

    $("#CantidadPreVenta").focusout(function() {
        calcularMontos($("#CantidadPreVenta").val(),$("#ValorUnitario").val(),$("#FactorImpuesto").val(),$("#MontoDescuento").val());
    });

    $("#ValorUnitario").focusout(function() {
        calcularMontos($("#CantidadPreVenta").val(),$("#ValorUnitario").val(),$("#FactorImpuesto").val(),$("#MontoDescuento").val());
    });

    $("#MontoDescuento").focusout(function() {
        calcularMontos($("#CantidadPreVenta").val(),$("#ValorUnitario").val(),$("#FactorImpuesto").val(),$("#MontoDescuento").val());
    });

    // Botones de cabecera de compra
    $(document).on('click','#guardar',validador);
    $(document).on('click','#guardarI',validadorI);
    $(document).on('click','#aceptarM',validadorP);
    $(document).on('click','#cancelar',BotonCancelar);
    $(document).on('click','#agregar',BotonAgregar);
    $(document).on('click','#modificar',modificarCabeceras);
    $(document).on('click','#volverAct',volverTabs);
    // Botones de detalles de compra
    $(document).on('click','#agregarC',BotonAgregarDetalle);
    $(document).on('click','#guardarC',validadorD);
    $(document).on('click','#cancelarC',BotonCancelarDetalle);
    $(document).on('click','#closeModal',BotonCancelarDetalle);
    $(document).on('click','#modificarC',modificarDetalles);
    $(document).on('click','#btn-list',volverListado);


    // $("#RUTProveedor").focusout(function() {
    //     var valid = $("#RUTProveedor").val();
    //     if (valid.length > 0){
    //         var res = verificarRut($("#RUTProveedor"));
    //         $("#RUTProveedor").val(res);
    //     }else{$("#ErrorRut").text("");}
    // });

    $('#FormProveedorNew').formValidation({
        excluded:[':disabled'],
        // message: 'El módulo le falta un campo para ser completado',
        fields: {
            'RUTProveedor2': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'NombreFantasia2': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
        }
    })
    .on('success.form.fv', function(e){
        ProcesarProveedor();
    })
    .on('status.field.fv', function(e, data){
        data.element.parents('.form-group').removeClass('has-success');
    });



    $('#FormPreventas').formValidation({
        excluded:[':disabled'],
        // message: 'El módulo le falta un campo para ser completado',
        fields: {
            'FechaPreVenta': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'RUTCliente': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
        }
    })
    .on('success.form.fv', function(e){
        ProcesarPreventa();
    })
    .on('status.field.fv', function(e, data){
        data.element.parents('.form-group').removeClass('has-success');
    });

    $('#FormDetalle').formValidation({
        excluded:[':disabled'],
        // message: 'El módulo le falta un campo para ser completado',
        fields: {
            'CodigoBarra': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'IdUnidadMedida': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'CantidadPreVenta': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'ValorUnitarioVenta': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'MontoDescuento': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            }
        }
    })
    .on('success.form.fv', function(e){
        ProcesarDetalleCompra();
    })
    .on('status.field.fv', function(e, data){
        data.element.parents('.form-group').removeClass('has-success');
    });
});