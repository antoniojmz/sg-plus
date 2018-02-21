var RegistroEmpresas  = '';
var manejoRefresh=limpiarLocales=limpiarImpuestos=errorRut=limpiarBodegas=0;

var parametroAjax = {
    'token': $('input[name=_token]').val(),
    'tipo': 'POST',
    'data': {},
    'ruta': '',
    'async': false
};

var ManejoRespuestaProcesarD = function(respuesta){
    if(respuesta.code==200){
        bloquearInuts();
        $(".divDetalles").toggle();
        $("#divVolver").show();
        $("#divTabs").show();
        $("#spanTitulo").text("Detalles");
        $("#IdProducto2").val(respuesta.respuesta.v_detalles.IdProducto);
        pintarDatosActualizar(respuesta.respuesta.v_detalles);
        cargarTablaImpuestos(respuesta.respuesta.v_impuestos);
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Activar / Desactivar empresa
var ManejoRespuestaProcesarI = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta.activar>0){
            if(respuesta.respuesta.v_productos.length>0){
                $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});
                cargarTablaProductos(respuesta.respuesta.v_productos);
            }
        }else{
            $.growl({message:"Debe seleccionar un registro"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Activar / Desactivar Impuesto a producto
var ManejoRespuestaProcesarAI = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta.activar>0){
            $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});
            cargarTablaImpuestos(respuesta.respuesta.v_impuestos);
        }else{
            $.growl({message:"Debe seleccionar un registro"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo respuesta descontinuar Producto
var ManejoRespuestaProcesarDescontinuar = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta.descontinuar>0){
            if(respuesta.respuesta.v_productos.length>0){
                $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});
                cargarTablaProductos(respuesta.respuesta.v_productos);
            }
        }else{
            $.growl({message:"Debe seleccionar un registro"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Registro o actualizacion de empresa
var ManejoRespuestaProcesarImpuesto = function(respuesta){
    if(respuesta.code==200){
        var res = JSON.parse(respuesta.respuesta.f_registro_producto_impuesto);
        switch(res.code) {
            case '200':
                $.growl({message:res.des_code},{type: "success", allow_dismiss: true,});
                cargarTablaImpuestos(respuesta.respuesta.v_impuestos);
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
};

// Manejo Registro o actualizacion de empresa
var ManejoRespuestaProcesar = function(respuesta){
    if(respuesta.code==200){
        var res = JSON.parse(respuesta.respuesta.f_registro.f_registro_producto);
        switch(res.code) {
            case '200':
                $.growl({message:res.des_code},{type: "success", allow_dismiss: true,});
                $(".divDetalles").toggle();
                $(".divBotones").toggle();
                $('#FormProducto')[0].reset();
                $('#IdProducto').val("");
                cargarTablaProductos(respuesta.respuesta.v_productos);
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
};

var cargarTablaProductos = function(data){
    if(limpiarLocales==1){destruirTabla('#tablaProductos');$('#tablaProductos thead').empty();}
        $("#tablaProductos").dataTable({
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
                    "data": "IdProducto",
                    "render": function(data, type, row, meta){
                        var result = `
                        <center>
                        <a href="#" onclick="verDetallesProducto(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Ver Detalles" data-original-title="Delete">
                            <i class="icofont icofont-search"></i>
                        </a>
                        <a href="#" onclick="cambiarEstatusProducto(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Activar / Desactivar" data-original-title="Delete">
                            <i class="icofont icofont-ui-delete"></i>
                        </a>
                        <a href="#" onclick="descontinuarProducto(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Descontinuar Producto" data-original-title="Delete">
                            <i class="icofont icofont-close"></i>
                        </a>
                        </center>`;
                        return result;
                    }
                },
                {"title": "Id","data": "IdProducto",visible:0},
                {"title": "Codigo Barra","data": "CodigoBarra"},
                {"title": "Codigo Proveedor","data": "CodigoProveedor"},
                {"title": "Nombre Producto","data": "NombreProducto"},
                {"title": "Descripcion Producto","data": "DescripcionProducto"},
                {"title": "Ultimo Proveedor","data": "IdUltimoProveedor"},
                {"title": "IdFamilia","data": "IdFamilia", visible:0},
                {"title": "Familia","data": "NombreFamilia"},
                {"title": "IdSubFamilia","data": "IdSubFamilia",visible:0},
                {"title": "Subfamilia","data": "NombreSubFamilia"},
                {"title": "IdUnidadMedida","data": "IdUnidadMedida",visible:0},
                {"title": "Unidad Medida","data": "NombreUnidadMedida"},
                {"title": "Se Compra","data": "SeCompra",visible:0},
                {"title": "Se Compra","data": "DesCompra"},
                {"title": "Se Vende","data": "SeVende", visible:0},
                {"title": "Se Vende","data": "DesVende"},
                {"title": "Se Combo","data": "EsProductoCombo", visible:0},
                {"title": "Producto Combo","data": "DesProductoCombo"},
                {"title": "Descontinuado","data": "Descontinuado",visible:0},
                {"title": "Descontinuado","data": "DesDescontinuado"},
                {"title": "Stock Minimo","data": "StockMinimo"},
                {"title": "Stock Maximo","data": "StockMaximo"},
                {"title": "Stock Recomendado","data": "StockRecomendado"},
                {"title": "Precio Ultima Compra","data": "PrecioUltimaCompra"},
                {"title": "Precio Venta Sugerido","data": "PrecioVentaSugerido"},
                {"title": "EstadoProducto","data": "EstadoProducto",visible:0},
                {"title": "Estado","data": "DesEstadoProducto"}
            ],
        });
        limpiarLocales=1;
    if (data.length>0){seleccionarTablaProductos();}
};

var seleccionarTablaProductos = function(data){
    var tableB = $('#tablaProductos').dataTable();
    $('#tablaProductos tbody').on('click', 'tr', function (e) {
        tableB.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        RegistroEmpresas = TablaTraerCampo('tablaProductos',this);
    });
}

var cargarTablaImpuestos = function(data){
    if(limpiarImpuestos==1){destruirTabla('#tablaImpuestos');$('#tablaImpuestos thead').empty();}
        $("#tablaImpuestos").dataTable({
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
                    "data": "IdProductoImpuesto",
                    "render": function(data, type, row, meta){
                        var result = `
                        <center>
                        <a href="#" onclick="cambiarEstatusImpuesto(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Activar / Desactivar" data-original-title="Delete">
                            <i class="icofont icofont-ui-delete"></i>
                        </a>
                        </center>`;
                        return result;
                    }
                },
                {"title": "Id","data": "IdProductoImpuesto",visible:0},
                {"title": "Nombre Impuesto","data": "NombreImpuesto"},
                {"title": "Valor Impuesto","data": "ValorImpuesto"},
                {"title": "Precio Venta Sugerido","data": "auFechaCreacion",visible:0},
                {"title": "Precio Venta Sugerido","data": "auUsuarioCreacion",visible:0},
                {"title": "Creado por","data": "creador"},
                {"title": "Precio Venta Sugerido","data": "auFechaModificacion",visible:0},
                {"title": "Precio Venta Sugerido","data": "auFechaModificacion",visible:0},
                {"title": "EstadoProductoImpuesto","data": "EstadoProductoImpuesto",visible:0},
                {"title": "Estado","data": "DesEstadoProductoImpuesto"}
            ],
        });
        limpiarImpuestos=1;
};

var pintarDatosActualizar= function(data){
    $(".md-form-control").addClass("md-valid");
    $("#IdProducto").val(data.IdProducto);
    $("#CodigoBarra").val(data.CodigoBarra);
    $("#CodigoProveedor").val(data.CodigoProveedor);
    $("#NombreProducto").val(data.NombreProducto);
    $("#DescripcionProducto").val(data.DescripcionProducto);
    $("#StockMinimo").val(data.StockMinimo);
    $("#StockMaximo").val(data.StockMaximo);
    $("#StockRecomendado").val(data.StockRecomendado);
    $("#PrecioUltimaCompra").val(data.PrecioUltimaCompra);
    $("#PrecioVentaSugerido").val(data.PrecioVentaSugerido);
    $("#IdUltimoProveedor").val(data.IdUltimoProveedor).trigger("change");
    $("#IdFamilia").val(data.IdFamilia).trigger("change");
    $("#IdSubFamilia").val(data.IdSubFamilia).trigger("change");
    $("#IdUnidadMedida").val(data.IdUnidadMedida).trigger("change");
    $("#SeCompra").val(data.SeCompra).trigger("change");
    $("#SeVende").val(data.SeVende).trigger("change");
    $("#EsProductoCombo").val(data.EsProductoCombo).trigger("change");
    $("#Descontinuado").val(data.Descontinuado).trigger("change");
    $("#EstadoProducto").val(data.EstadoProducto).trigger("change");
}

var BotonCancelar = function(){
    $("#spanTitulo").text("");
    $(".md-form-control").removeClass("md-valid");
    $('#FormProducto')[0].reset();
    $("#IdProducto").val("");
    $("#divTabs").show();
    $(".divBotones").toggle();
    $(".divDetalles").toggle();
    bloquearInuts();
    $("#PrecioUltimaCompra").prop('readonly', true);
}

var BotonAgregar = function(){
    $("#spanTitulo").text("Registrar Producto");
    desbloquearInuts();
    $(".divDetalles").toggle();
    $("#divVolver").hide();
    $("#IdProducto").val("");
    $(".comboclear").val('').trigger("change");
    $('#FormProducto')[0].reset();
    $("#divTabs").hide();
    $(".divBotones").toggle();
    $("#PrecioUltimaCompra").prop('readonly', false);
}

var ProcesarImpuesto = function(){
    parametroAjax.ruta=rutaPI;
    parametroAjax.data = $("#FormImpuesto").serialize();
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarImpuesto(respuesta);
};

var ProcesarProducto = function(){
        parametroAjax.ruta=ruta;
        var camposNuevo = {
            'IdUltimoProveedor': $('#IdUltimoProveedor').val(),
            'IdFamilia': $('#IdFamilia').val(),
            'IdSubFamilia': $('#IdSubFamilia').val(),
            'IdUnidadMedida': $('#IdUnidadMedida').val(),
            'SeCompra': $('#SeCompra').val(),
            'SeVende': $('#SeVende').val(),
            'EsProductoCombo': $('#EsProductoCombo').val(),
            'Descontinuado': $('#Descontinuado').val(),
            'EstadoProducto': $('#EstadoProducto').val()
        }
        parametroAjax.data = $("#FormProducto").serialize() + '&' + $.param(camposNuevo);
        respuesta=procesarajax(parametroAjax);
        ManejoRespuestaProcesar(respuesta);
};

var validador = function(){
    $('#FormProducto').formValidation('validate');
};

var validadorI = function(){
    $('#FormImpuesto').formValidation('validate');
}

var cambiarEstatusProducto = function(IdProducto){
    parametroAjax.ruta=rutaA;
    parametroAjax.data = {IdProducto:IdProducto};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarI(respuesta);
}

var cambiarEstatusImpuesto = function(IdProductoImpuesto){
    parametroAjax.ruta=rutaAI;
    parametroAjax.data = {IdProductoImpuesto:IdProductoImpuesto};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarAI(respuesta);
}

var descontinuarProducto = function(IdProducto){
    parametroAjax.ruta=rutaDes;
    parametroAjax.data = {IdProducto:IdProducto};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarDescontinuar(respuesta);
}

var verDetallesProducto = function(IdProducto){
    parametroAjax.ruta=rutaD;
    parametroAjax.data = {IdProducto:IdProducto};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarD(respuesta);
}

var bloquearInuts = function(){
    $("#CodigoBarra").prop('readonly', true);
    $("#CodigoProveedor").prop('readonly', true);
    $("#NombreProducto").prop('readonly', true);
    $("#DescripcionProducto").prop('readonly', true);
    $("#StockMinimo").prop('readonly', true);
    $("#StockMaximo").prop('readonly', true);
    $("#StockRecomendado").prop('readonly', true);
    $("#PrecioUltimaCompra").prop('readonly', true);
    $("#PrecioVentaSugerido").prop('readonly', true);
    $("#IdUltimoProveedor").prop('disabled', true);
    $("#IdFamilia").prop('disabled', true);
    $("#IdSubFamilia").prop('disabled', true);
    $("#IdUnidadMedida").prop('disabled', true);
    $("#SeCompra").prop('disabled', true);
    $("#SeVende").prop('disabled', true);
    $("#EsProductoCombo").prop('disabled', true);
    $("#Descontinuado").prop('disabled', true);
    $("#EstadoProducto").prop('disabled', true);
}

var desbloquearInuts = function(){
    $("#CodigoBarra").prop('readonly', false);
    $("#CodigoProveedor").prop('readonly', false);
    $("#NombreProducto").prop('readonly', false);
    $("#DescripcionProducto").prop('readonly', false);
    $("#StockMinimo").prop('readonly', false);
    $("#StockMaximo").prop('readonly', false);
    $("#StockRecomendado").prop('readonly', false);
    $("#PrecioVentaSugerido").prop('readonly', false);
    $("#IdUltimoProveedor").prop('disabled', false);
    $("#IdFamilia").prop('disabled', false);
    $("#IdSubFamilia").prop('disabled', false);
    $("#IdUnidadMedida").prop('disabled', false);
    $("#SeCompra").prop('disabled', false);
    $("#SeVende").prop('disabled', false);
    $("#EsProductoCombo").prop('disabled', false);
    $("#Descontinuado").prop('disabled', false);
    $("#EstadoProducto").prop('disabled', false);
}

var modificarProducto = function(){
    $("#spanTitulo").text("Editar Producto");
    $("#divVolver").hide();
    $(".divBotones").toggle();
    desbloquearInuts();
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

var buscarSubfamilia = function(IdFamilia){
    parametroAjax.ruta=rutaB;
    parametroAjax.data = {IdFamilia:IdFamilia};
    respuesta=procesarajax(parametroAjax);
    if (respuesta.code==200){
        crearselect(respuesta.respuesta,"IdSubFamilia");
    }
}

var crearAllSelect = function(data){
    var v_proveedor =[{"id":1,"text":"proveedor 1"},{"id":2,"text":"proveedor 2"}];
    var secompra=[{"id":1,"text":"SI"},{"id":0,"text":"NO"}];
    var escombo=[{"id":1,"text":"SI"},{"id":2,"text":"NO"}];
    crearselect(escombo,"Descontinuado");
    crearselect(escombo,"EsProductoCombo");
    crearselect(secompra,"SeVende");
    crearselect(secompra,"SeCompra");
    crearselect(v_proveedor,"IdUltimoProveedor");
    crearselect(data.v_familias,"IdFamilia");
    crearselect(data.v_unidad,"IdUnidadMedida");
    crearselect(data.v_estados,"EstadoProducto");
    crearselect(data.v_impuestos,"IdImpuesto");

}

$(document).ready(function(){
    cargarTablaProductos(d.v_productos);
    crearAllSelect(d);
    $(document).on('click','#guardar',validador);
    $(document).on('click','#guardarI',validadorI);
    $(document).on('click','#cancelar',BotonCancelar);
    $(document).on('click','#agregar',BotonAgregar);
    $(document).on('click','#modificar',modificarProducto);
    $(document).on('click','#volverAct',volverTabs);
    $("#IdFamilia").change(function() {
        buscarSubfamilia($("#IdFamilia").val());
    });

    $('#FormImpuesto').formValidation({
        excluded:[':disabled'],
        // message: 'El módulo le falta un campo para ser completado',
        fields: {
            'IdImpuesto': {
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
        ProcesarImpuesto();
    })
    .on('status.field.fv', function(e, data){
        data.element.parents('.form-group').removeClass('has-success');
    });


    $('#FormProducto').formValidation({
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
            'CodigoProveedor': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'NombreProducto': {
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    }
                }
            },
            'DescripcionProducto': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'StockMinimo': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'StockMaximo': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'StockRecomendado': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'PrecioUltimaCompra': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'PrecioVentaSugerido': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'IdUltimoProveedor': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'IdFamilia': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'IdSubFamilia': {
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
            'SeCompra': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'SeVende': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'EsProductoCombo': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'Descontinuado': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'EstadoProducto': {
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
        ProcesarProducto();
    })
    .on('status.field.fv', function(e, data){
        data.element.parents('.form-group').removeClass('has-success');
    });
});