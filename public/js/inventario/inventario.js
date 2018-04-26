var manejoRefresh=limpiarInventario=limpiarDetalles=errorRut=errorRut2=errorRut3=NPreventa=0;

var parametroAjax = {
    'token': $('input[name=_token]').val(),
    'tipo': 'POST',
    'data': {},
    'ruta': '',
    'async': false
};

// var calcularMontos = function(CantidadPreVenta,ValorUnitarioVenta,FactorImpuesto,MontoDescuento){
//     var ValorImpuesto = (CantidadPreVenta * ValorUnitarioVenta * FactorImpuesto / 100)
//     $("#ValorImpuestos").val(ValorImpuesto);
//     var TotalLinea = ((CantidadPreVenta * ValorUnitarioVenta) - MontoDescuento);
//     $("#TotalLinea").val(TotalLinea);
//     var ValorUnitarioFinal = (TotalLinea / CantidadPreVenta);
//     $("#ValorUnitarioFinal").val(ValorUnitarioFinal);
// }

// var calcularTotalPreVenta = function(totalPV){
//     $("#TotalPreVentaDetalle").val(totalPV);
// }

var ManejoRespuestaBuscarProducto = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta.length > 0){
            $("#IdProducto").val(respuesta.respuesta[0].IdProducto);
            $("#NombreProducto").val(respuesta.respuesta[0].NombreProducto);
            $("#PrecioVentaSugerido").val(respuesta.respuesta[0].PrecioVentaSugerido);
            $("#StockSistema").val(respuesta.respuesta[0].Stock);
        }else{
            $.growl({message:"Producto no encontrado, verifique"},{type: "warning", allow_dismiss: true});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true});
    }
}

var ManejoRespuestaBuscarCliente = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta!=null){
            if(respuesta.respuesta.IdCliente==0){
                // var rut = $("#RUTProveedor").val();
                // $("#RUTProveedor2").val(rut);
                // $("#ModalProveedor").modal();
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

var ManejoRespuestaProcesarDetalleInventario = function(respuesta){
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
        switch(respuesta.respuesta.activar){
            case 1:
                if(respuesta.respuesta.v_detalles.length>0){
                    $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});
                    cargarTablaDetalles(respuesta.respuesta.v_detalles);
                }
            break;
            case 204:
                $.growl({message:"Esta Pre-venta la esta cerrada o finalizada"},{type: "warning", allow_dismiss: true,});
            break;
            default:
                $.growl({message:"Debe seleccionar un registro"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

var ManejoRespuestaProcesarD = function(respuesta){
    console.log(respuesta);
    console.log(respuesta.respuesta);
    if(respuesta.code==200){
        NPreventa=respuesta.respuesta.v_cabecera[0].IdInventario;
        bloquearInputs();
        $("#divAjusteInventario").show();
        $("#div-mod").show();
        $("#div-acep").hide();
        $(".divDetalles").toggle();
        $("#divVolver").show();
        $("#divTabs").show();
        $("#spanTitulo").text("Detalle Pre-Venta");
        pintarDatosActualizar(respuesta.respuesta.v_cabecera[0]);
        cargarTablaDetalles(respuesta.respuesta.v_detalles);
        if(parseInt(respuesta.respuesta.v_cabecera[0].EstadoPreVenta)>1){
            $(".CerrarPreventa").hide();
            $("#agregarC").hide();
        }else{
            $(".CerrarPreventa").show();
            $("#agregarC").show();
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Activar / Desactivar compra
var ManejoRespuestaProcesarI = function(respuesta){
    if(respuesta.code==200){
        switch(respuesta.respuesta.activar){
            case 1:
                if(respuesta.respuesta.v_inventario.length>0){
                    $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});
                    cargarTablaInventario(respuesta.respuesta.v_inventario);
                }
            break;
            case 204:
                $.growl({message:"Esta preventa la esta cerrada o finalizada"},{type: "warning", allow_dismiss: true,});
            break;
            default:
                $.growl({message:"Debe seleccionar un registro"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Registro de proveedor
// var ManejoRespuestaProcesarProveedor = function(respuesta,nombre){
//     if(respuesta.code==200){
//         if(respuesta.respuesta>0){
//             $("#IdProveedor").val(respuesta.respuesta);
//             $("#NombreFantasia").val(nombre);
//             $("#ModalProveedor").modal("hide");
//         }else{
//             $.growl({message:"ocurrió un error mientras se registraba el proveedor"},{type: "warning", allow_dismiss: true,}); 
//         }
//     }else{
//         $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
//     }
// };

// Manejo Registro o actualizacion de cabecera de compra
var ManejoRespuestaProcesarInventario = function(respuesta){
    if(respuesta.code==200){
        var res = JSON.parse(respuesta.respuesta.f_registro);
        if(res.code=="200"){ 
            $.growl({message:res.des_code},{type: "success", allow_dismiss: true,});
            NPreventa = res.IdPreVenta;
            $("#IdInventario").val(res.IdInventario);
            $("#IdInventario2").val(res.IdInventario);
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
    console.log(respuesta);
    console.log(respuesta.respuesta);
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

var cargarTablaInventario = function(data){
    if(limpiarInventario==1){destruirTabla('#tablaInventario');$('#tablaInventario thead').empty();}
        $("#tablaInventario").dataTable({
            responsive:false,
            "aLengthMenu": DataTableLengthMenu,
            "pagingType": "full_numbers",
            "pageLength": 50, 
            "language": LenguajeTabla,
            "columnDefs": [
                {"targets": [ 1 ],"searchable": true},
                {"sWidth": "1px", "aTargets": [6]}
            ],
            "data": data,
            "columns":[
                {
                    "title": "",
                    "data": "IdInventario",
                    "render": function(data, type, row, meta){
                        var result = `
                        <center>
                        <a href="#" onclick="verDetallesInventario(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Ver Detalles" data-original-title="Delete">
                            <i class="icofont icofont-search"></i>
                        </a>
                        <a href="#" onclick="cambiarEstatusInventario(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Activar / Desactivar" data-original-title="Delete">
                            <i class="icofont icofont-ui-delete"></i>
                        </a>
                        </center>`;
                        return result;
                    }
                },
                {"title": "Bodega","data": "NombreBodega", className: "text-center"},
                {"title": "Tipo Inventario","data": "DesTipoInventario"},
                {"title": "Fecha Inventario", "data": "FechaInventario", className: "text-center", 
                    "render": function(data, type, row, meta){
                        if(type === 'display'){
                            data = moment(data, 'YYYY-MM-DD HH:mm:ss',true).format("DD-MM-YYYY");
                        }
                        return data;
                    }
                },
                {"title": "Fecha Toma", "data": "FechaTomaInventario", className: "text-center", 
                    "render": function(data, type, row, meta){
                        if(type === 'display'){
                            data = moment(data, 'YYYY-MM-DD HH:mm:ss',true).format("DD-MM-YYYY");
                        }
                        return data;
                    }
                },
                {"title": "Fecha Ajuste", "data": "FechaAjusteInventario", className: "text-center", 
                    "render": function(data, type, row, meta){
                        if(type === 'display'){
                            if (data != null){
                                data = moment(data, 'YYYY-MM-DD HH:mm:ss',true).format("DD-MM-YYYY");
                            }
                            
                        }
                        return data;
                    }
                },
                {"title": "Estado","data": "DesEstadoInventario", className: "text-center"}
            ],
        });
        limpiarInventario=1;
};

var cargarTablaDetalles = function(data){
    if(limpiarDetalles==1){destruirTabla('#tablaDetalles');$('#tablaDetalles thead').empty();}
        var columnReport = [[5],[6],[7],[12]];       
        $("#tablaDetalles").dataTable({
            responsive:false,
            "bSort": false,
            "scrollCollapse": false,
            "paging": false,
            "searching": false,
            "info":false,           
            "pageLength": 50, 
            "columnDefs": [
                {"targets": [ 1 ],"searchable": true}
            ],
            "data": data,
            "columns":[
                {
                    "title": "",
                    "data": "IdInventarioDetalle",
                    "render": function(data, type, row, meta){
                        var result = `
                        <center>
                        <a href="#" onclick="verDetallesPreventaD(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Ver Detalles" data-original-title="Delete">
                            <i class="icofont icofont-search"></i>
                        </a>
                        <a href="#" onclick="cambiarEstatusPreventaD(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Activar / Desactivar" data-original-title="Delete">
                            <i class="icofont icofont-ui-delete"></i>
                        </a>
                        </center>`;
                        return result;
                    }
                },
                {"title": "Id","data": "IdInventarioDetalle",visible:0},
                {"title": "IdProducto","data": "IdProducto",visible:0},
                {"title": "Nombre Producto","data": "NombreProducto"},
                {"title": "Stock Fisico","data": "StockFisico"},
                {"title": "Stock Sistema","data": "StockSistema"},
            ],   
            dom: 'Bfrtip',
        });
    limpiarDetalles=1;
};

var pintarDatosActualizar= function(data){
    $(".md-form-control").addClass("md-valid");
    $("#IdInventario").val(data.IdInventario);
    $("#IdInventario2").val(data.IdInventario);
    $("#FechaInventario").val(moment(data.FechaInventario, 'YYYY-MM-DD HH:mm:ss',true).format("DD-MM-YYYY"));
    $("#FechaTomaInventario").val(moment(data.FechaTomaInventario, 'YYYY-MM-DD HH:mm:ss',true).format("DD-MM-YYYY"));
    if (data.FechaAjusteInventario != null){
        $("#FechaAjusteInventario").val(moment(data.FechaAjusteInventario, 'YYYY-MM-DD HH:mm:ss',true).format("DD-MM-YYYY"));
    }
    $("#Comentario").val(data.Comentario);
    $("#TipoInventario").val(data.TipoInventario).trigger("change");
    $("#IdBodega").val(data.IdBodega).trigger("change");    
}

var pintarDatosActualizarDetalles = function(data){
    $("#IdInventario2").val(data.IdInventario);
    $("#IdInventarioDetalle").val(data.IdInventarioDetalle);
    $("#IdProducto").val(data.IdProducto);
    $("#CodigoBarra").val(data.CodigoBarra);
    $("#NombreProducto").val(data.NombreProducto);
    $("#StockFisico").val(data.StockFisico);
    $("#StockSistema").val(data.StockSistema);
    $("#Diferencia").val(data.Diferencia).trigger("change");
    $("#AjusteRealizado").val(data.AjusteRealizado);
}

var BotonAgregar = function(){
    $("#spanTitulo").text("Registrar Inventario");
    desbloquearInputs();
    $(".divDetalles").toggle();
    $("#divVolver").hide();
    $("divAjusteInventario").hide();
    $("#IdInventario").val("");
    $('#FormInventario')[0].reset();
    $("#divTabs").hide();
    $("#div-mod").hide();
    $("#div-acep").show();
    var NowDate = moment().format('DD-MM-YYYY')
    $("#FechaInventario").val(NowDate);
    $("#FechaTomaInventario").val(NowDate);    
}

var BotonCancelar = function(){
    $("#spanTitulo").text("");
    $(".md-form-control").removeClass("md-valid");
    $('#FormInventario')[0].reset();
    $("#IdInventario").val("");
    $("#divTabs").show();
    $("#div-mod").hide();
    $("#div-acep").hide();
    $(".divDetalles").toggle();
    bloquearInputs();
    $("#PrecioUltimaCompra").prop('readonly', true);
    NPreventa=0;
}

var volverListado = function(){
    location.reload();
    NPreventa=0;
}

var BotonAgregarDetalle = function (){
    $("#spanTituloModal").text("Registrar Detalle");
    $("#guardar").text("Continuar");
    $("#divBotonM").hide();
    $("#divBotonesAC").show();
    $("#IdInventarioDetalle").val("");
    $("#IdProducto").val("");
    $("#CodigoBarra").val("");
    $("#NombreProducto").val("");
    $("#StockFisico").val("");
    $("#StockSistema").val("");
    $("#Diferencia").val("");
    $("#AjusteRealizado").val("");
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

// var ProcesarProveedor = function(){
//     var nombre = $("#NombreFantasia2").val();
//     parametroAjax.ruta=rutaPR;
//     parametroAjax.data = $("#FormProveedorNew").serialize();
//     respuesta=procesarajax(parametroAjax);
//     ManejoRespuestaProcesarProveedor(respuesta,nombre);
// };

var ProcesarInventario = function(){
    parametroAjax.ruta=ruta;
    parametroAjax.data = $("#FormInventario").serialize();
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarInventario(respuesta);
};

var ProcesarDetalleCompra = function(){
    parametroAjax.ruta=rutaDC;
    parametroAjax.data = $("#FormDetalle").serialize();
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarDetalles(respuesta);
};

var validador = function(){
    $('#FormInventario').formValidation('validate');
};

// var validadorP = function(){
//     $('#FormProveedorNew').formValidation('validate');
// };

var validadorI = function(){
    $('#FormImpuesto').formValidation('validate');
}

var validadorD = function(){
    $('#FormDetalle').formValidation('validate');
};

var cambiarEstatusInventario = function(IdInventario){
    parametroAjax.ruta=rutaA;
    parametroAjax.data = {IdInventario:IdInventario};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarI(respuesta);
}

var verDetallesInventario = function(IdInventario){
    parametroAjax.ruta=rutaB;
    parametroAjax.data = {IdInventario:IdInventario};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarD(respuesta);
}

var verDetallesPreventaD = function(IdInventarioDetalle){
    parametroAjax.ruta=rutaBDC;
    parametroAjax.data = {IdInventarioDetalle:IdInventarioDetalle};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarDetalleInventario(respuesta);
}

var cambiarEstatusPreventaD = function(IdInventarioDetalle){
    parametroAjax.ruta=rutaCDA;
    parametroAjax.data = {IdInventarioDetalle:IdInventarioDetalle};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarCD(respuesta);
}

var bloquearInputs = function(){
    $("#FechaInventario").prop('readonly', true);
    $("#FechaTomaInventario").prop('readonly', true);
    // $("#FechaAjusteInventario").prop('readonly', true);
    $("#Comentario").prop('readonly', true);
    $("#TipoInventario").prop('disabled', true);
    $("#IdBodega").prop('disabled', true);
}


var desbloquearInputs = function(){
    $("#FechaInventario").prop('readonly', false);
    $("#FechaTomaInventario").prop('readonly', false);
    // $("#FechaAjusteInventario").prop('readonly', false);
    $("#Comentario").prop('readonly', false);
    $("#TipoInventario").prop('disabled', false);
    $("#IdBodega").prop('disabled', false);
}

var bloquearInputsDetalles = function(){
    $("#CodigoBarra").prop('readonly', true);
    $("#StockFisico").prop('readonly', true);
    // $("#StockSistema").prop('readonly', true);
    // $("#Diferencia").prop('readonly', true);
    // $("#AjusteRealizado").prop('readonly', true);
}

var desbloquearInputsDetalles = function(){
    $("#CodigoBarra").prop('readonly', false);
    $("#StockFisico").prop('readonly', false);
    // $("#StockSistema").prop('readonly', false);
    // $("#Diferencia").prop('readonly', false);
    // $("#AjusteRealizado").prop('readonly', false);
}

var modificarCabeceras = function(){
    $("#spanTitulo").text("Editar Pre-Venta");
    $("#guardar").text("Guardar");
    $("#divVolver").hide();
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
    crearselect(data.v_bodegas,"IdBodega");
    crearselect(data.v_tipo_inventario,"TipoInventario");
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
    console.log($("#IdBodega").val());
    parametroAjax.data = {CodigoBarra:CodigoBarra,IdBodega:$("#IdBodega").val()};
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

var CerrarInventario = function (){
    console.log("Cierro inventario");
    // parametroAjax.ruta=rutaCP;
    // parametroAjax.data = {IdPreVenta:NPreventa};
    // respuesta=procesarajax(parametroAjax);
    // if (respuesta.code==200){
    //     if (respuesta.respuesta==1){
    //         $(".CerrarPreventa").hide();
    //         $("#agregarC").hide();
    //     }
    // }
}

var CompararInventario = function (){
    console.log("Comparo inventario");
    // parametroAjax.ruta=rutaCP;
    // parametroAjax.data = {IdPreVenta:NPreventa};
    // respuesta=procesarajax(parametroAjax);
    // if (respuesta.code==200){
    //     if (respuesta.respuesta==1){
    //         $(".CerrarPreventa").hide();
    //         $("#agregarC").hide();
    //     }
    // }
}

var AjustarInventario = function (){
    console.log("Ajusto inventario");
    // parametroAjax.ruta=rutaCP;
    // parametroAjax.data = {IdPreVenta:NPreventa};
    // respuesta=procesarajax(parametroAjax);
    // if (respuesta.code==200){
    //     if (respuesta.respuesta==1){
    //         $(".CerrarPreventa").hide();
    //         $("#agregarC").hide();
    //     }
    // }
}

var limpiarFormDetalle = function(){
    $("#NombreProducto").val("");  
    $("#CantidadPreVenta").val("");  
    $("#ValorUnitarioVenta").val("");  
    $("#TotalLinea").val("");
    $("#IdProducto").val("");  
    $("#FactorImpuesto").val("");  
    $("#ValorImpuestos").val("");  
    $("#MontoDescuento").val("");  
    $("#ValorUnitarioFinal").val("");  
    $("#IdUnidadMedida").val('').trigger("change");
}

$(document).ready(function(){
    $("#FechaInventario").inputmask({ mask: "99-99-9999"});
    $("#FechaTomaInventario").inputmask({ mask: "99-99-9999"});
    $("#FechaAjusteInventario").inputmask({ mask: "99-99-9999"});
    cargarTablaInventario(d.v_inventario);
    crearAllSelect(d);
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
        var codigo = $("#CodigoBarra").val();
        if (codigo.length > 2){
            limpiarFormDetalle();
            buscarProducto($("#CodigoBarra").val());
        }
    });

    // $("#CantidadPreVenta").focusout(function() {
    //     calcularMontos($("#CantidadPreVenta").val(),$("#ValorUnitarioVenta").val(),$("#FactorImpuesto").val(),$("#MontoDescuento").val());
    // });

    // Botones de cabecera de compra
    $(document).on('click','#guardar',validador);
    $(document).on('click','#guardarI',validadorI);
    // $(document).on('click','#aceptarM',validadorP);
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
    

    $(document).on('click','.BtnCerrarInv',CerrarInventario);
    $(document).on('click','.BtnCompararInv',CompararInventario);
    $(document).on('click','.BtnAjustarInv',AjustarInventario);

                

    $('#FormDetalle').on('keyup keypress', function(e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 13) { 
        e.preventDefault();
        return false;
      }
    });

    // $('#FormProveedorNew').formValidation({
    //     excluded:[':disabled'],
    //     // message: 'El módulo le falta un campo para ser completado',
    //     fields: {
    //         'RUTProveedor2': {
    //             verbose: false,
    //             validators: {
    //                 notEmpty: {
    //                     message: 'El campo es requerido.'
    //                 },
    //             }
    //         },
    //         'NombreFantasia2': {
    //             verbose: false,
    //             validators: {
    //                 notEmpty: {
    //                     message: 'El campo es requerido.'
    //                 },
    //             }
    //         },
    //     }
    // })
    // .on('success.form.fv', function(e){
    //     ProcesarProveedor();
    // })
    // .on('status.field.fv', function(e, data){
    //     data.element.parents('.form-group').removeClass('has-success');
    // });



    $('#FormInventario').formValidation({
        excluded:[':disabled'],
        // message: 'El módulo le falta un campo para ser completado',
        fields: {
            'FechaInventario': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'FechaTomaInventario': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            // 'FechaAjusteInventario': {
            //     verbose: false,
            //     validators: {
            //         notEmpty: {
            //             message: 'El campo es requerido.'
            //         },
            //     }
            // },
            'Comentario': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'TipoInventario': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'IdBodega': {
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
        ProcesarInventario();
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
            'StockFisico': {
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
        ProcesarDetalleCompra();
    })
    .on('status.field.fv', function(e, data){
        data.element.parents('.form-group').removeClass('has-success');
    });
});