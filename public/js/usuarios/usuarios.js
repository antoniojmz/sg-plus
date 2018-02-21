var RegistroUsuario = RegistroPerfiles = '';
var manejoRefresh=limpiarPerfiles=limpiarUsuarios=errorRut=0;

var parametroAjax = {
    'token': $('input[name=_token]').val(),
    'tipo': 'POST',
    'data': {},
    'ruta': '',
    'async': false
};

var parametroAjaxGet = {
    'token': $('input[name=_token]').val(),
    'tipo': 'GET',
    'data': {},
    'ruta': '',
    'async': false
};

// Manejo Desbloquear cuenta de usuario
var ManejoRespuestaDesbloquearcuenta = function(respuesta){
    if(respuesta.code==200){
        var res = JSON.parse(respuesta.respuesta.v_desbloqueo);
        if(res.code==200){
            $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});    
            cargarTablaUsuarios(respuesta.respuesta.v_usuarios);
        }else{
            $.growl({message:"Ocurrio un error al tratar de desbloquear la cuenta."},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Activar Desactivar perfil
var ManejoRespuestaProcesarP = function(respuesta){
    if(respuesta.code==200){
        cargarTablaPerfiles(respuesta.respuesta.v_perfiles);
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Activar / Desactivar usuarios
var ManejoRespuestaProcesarI = function(respuesta){
    if(respuesta.code==200){
        if(respuesta.respuesta.activar>0){
            if(respuesta.respuesta.v_usuarios.length>0){
                $.growl({message:"Procesado"},{type: "success", allow_dismiss: true,});
                cargarTablaUsuarios(respuesta.respuesta.v_usuarios);
            }
        }else{
            $.growl({message:"Debe seleccionar un registro"},{type: "warning", allow_dismiss: true,});
        }
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Reinicio de contraseña
var ManejoRespuestaProcesarR = function(respuesta){
    if(respuesta.code==200){
        var res = respuesta.respuesta;
        switch(res.code) {
            case '200':
                $.growl({message:res.des_code},{type: "success", allow_dismiss: true,});
                break;
            case '500':
                $.growl({message:res.des_code},{type: "warning", allow_dismiss: true,});
                break;
            default:
                $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
        } 
    }else{
        $.growl({message:"Contacte al personal informatico"},{type: "danger", allow_dismiss: true,});
    }
}

// Manejo Registro o actualizacion de usuario
var ManejoRespuestaProcesar = function(respuesta){
    if(respuesta.code==200){
        var res = JSON.parse(respuesta.respuesta.f_registro.f_registro_usuario);
        switch(res.code) {
            case '200':
                $.growl({message:res.des_code},{type: "success", allow_dismiss: true,});
                $(".divForm").toggle();
                $('#FormUsuario')[0].reset();
                cargarTablaUsuarios(respuesta.respuesta.v_usuarios);
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

// Manejo agregar perfil
var ManejoRespuestaProcesarPerfil = function(respuesta){
    if(respuesta.code==200){
        var res = JSON.parse(respuesta.respuesta.f_registro_perfil);
        switch(res.code) {
            case '200':
                $.growl({message:res.des_code},{type: "success", allow_dismiss: true,});
                $(".comboclear").val('').trigger("change");  
                cargarTablaPerfiles(respuesta.respuesta.v_perfiles);
                manejoRefresh=1;
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

var cargarTablaUsuarios = function(data){
    if(limpiarUsuarios==1){destruirTabla('#tablaUsuarios');$('#tablaUsuarios thead').empty();}
        $("#tablaUsuarios").dataTable({ 
            responsive:false,
            "aLengthMenu": DataTableLengthMenu,
            "pagingType": "full_numbers",
            "language": LenguajeTabla,
            "columnDefs": [
                {
                    "targets": [ 1 ],
                    "searchable": true
                }
            ],
            "data": data,
            "columns":[
            {
                "title": "", 
                "data": "idUser",
                "render": function(data, type, row, meta){
                    var result = `
                    <a href="#!" onclick="reiniciarClave(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Reiniciar Contraseña" data-original-title="Delete">
                        <i class="icon-reload"></i>
                    </a>
                    <a href="#!" onclick="cambiarEstatusUsuario(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Activar / Desactivar" data-original-title="Delete">
                        <i class="icon-refresh"></i>
                    </a>
                    <a href="#!" onclick="desbloquearCuenta(`+data+`);" class="text-muted" data-toggle="tooltip" data-placement="top" title="Desbloquear Cuenta" data-original-title="Delete">
                        <i class="icon-lock-open"></i>
                    </a>`;
                    return result; 
                }
            },
            {"title": "Id","data": "idUser",visible:0},
            {"title": "Nombres","data": "usrNombreFull"},
            {
                "title": "Login", 
                "data": "usrUserName",
                "render": function(data, type, row, meta){
                    if(type === 'display'){
                        data = formateaRut(data, true)
                    }
                    return data;
                }
            },
            {"title": "Perfíl","data": "des_Perfil"},
            {"title": "fecha de creacion","data": "auCreadoEl",visible:0},
            {"title": "Creado id","data": "auCreadoPor",visible:0},
            {"title": "Creado por","data": "creador"},
            {"title": "Teléfono","data": "auModificadoEl",visible:0},
            {"title": "Modificado id","data": "auModificadoPor",visible:0},
            {"title": "Modificado por","data": "modificador",visible:0},
            {"title": "Estado","data": "des_estado"},
            {"title": "Última visita","data": "usrUltimaVisita"},
            {"title": "Estatus Bloqueo","data": "DescripcionBloqueo"}],
        });
        limpiarUsuarios=1;
    if (data.length>0){seleccionarTablaUsuarios();}
};

var seleccionarTablaUsuarios = function(data){
    var tableB = $('#tablaUsuarios').dataTable();
    $('#tablaUsuarios tbody').on('click', 'tr', function (e) {
        tableB.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        RegistroUsuario = TablaTraerCampo('tablaUsuarios',this);
    });
    $('#tablaUsuarios tbody').on('dblclick', 'tr', function () {
        bloquearInuts();
        $("#divBtnModificar").show();
        $("#divBtnAceptar").hide();  
        cargarFormulario();
        pintarDatosActualizar(RegistroUsuario);
    }); 
}

var cargarTablaPerfiles = function(data){
    if(limpiarPerfiles==1){destruirTabla('#tablaPerfiles');}
        $("#divTablaPerfiles").show();
        $("#tablaPerfiles").dataTable({ 
            "aLengthMenu": DataTableLengthMenu,
            'bSort': false,
            "scrollCollapse": false,
            "paging": false,
            "searching": false,
            "columnDefs": [
            {
                "targets": [ 1 ],
                "searchable": false
            }],
            "data": data,
            "columns":[
            {"title": "Id","data": "IdUser",visible:0},
            {"title": "Nombres","data": "usrNombreFull"},
            {"title": "Login","data": "usrUserName"},
            {"title": "idPerfil","data": "idPerfil",visible:0},
            {"title": "Perfíl","data": "des_perfil"},
            {"title": "Estado","data": "estado_perfil"},
            ],
        });
        limpiarPerfiles=1;
    if (data.length>0){seleccionarTablaPerfiles();}   
};

var seleccionarTablaPerfiles = function(data){
    var tableC = $('#tablaPerfiles').dataTable();
    $('#tablaPerfiles tbody').on('click', 'tr', function (e) {
        tableC.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        RegistroPerfiles = TablaTraerCampo('tablaPerfiles',this);
    });
    tableC.on('dblclick', 'tr', function () {
        $('#close').trigger('click');
    });
     $(function() {
        $.contextMenu({
            selector: '#tablaPerfiles',
            // selector: '.dataTable tbody tr',
            callback: function(key, options) {
                switch(key) {
                    case "1":
                        cambiarEstatusPerfil(RegistroPerfiles);
                        // cambiarEstatusUsuario(RegistroUsuario);
                    break;
                }
            },
            items: {
                "1": {name: "Activar / Desactivar", icon: "fa-toggle-on"},
            }
        });
    });
}; 

var crearallSelect = function(data){
    crearselect(data.v_perfiles,'idPerfil');
    crearselect(data.v_estados,'usrEstado',);
}

var cargarFormulario= function(){
    $(".divForm").toggle();
}

var volverPerfiles = function(){
    $("#spanTitulo").text("Usuarios registrados");
    if (manejoRefresh==1){
        cambiarSalir();
        location.reload();
    }else{
        $(".divPerfiles").toggle();
        $("#spanAlert").text("");
        $("#divTablaPerfiles").hide();
        $(".comboclear").val('').trigger("change");  
        $("#idUser2").val("")
    }
}

var administrarPerfiles= function(data){
    $("#spanTitulo").text("Administrar Perfiles de usuario");
    manejoRefresh=0;
    $("#idUser2").val(data.idUser)
    buscarPerfiles(data);
    $(".divPerfiles").toggle();
}

var pintarDatosActualizar= function(data){
    $(".md-form-control").addClass("md-valid");
    $("#spanTitulo").text("Editar Usuario");
    $("#perfiles").val("N/A o Inactivo")
    $('#divConsulta').show();
    $('#divSpanPerfiles').show();
    $("#idUser").val(data.idUser);
    $("#usrUserName").val(data.usrUserName);
    $("#usrEmail").val(data.usrEmail);
    $("#usrNombreFull").val(data.usrNombreFull);
    // if(data.des_Perfil!=null){
    //     var res = data.des_Perfil.split(",");
    //     var des='';
    //     res.length>1 ? des="Perfiles" : des="Perfil"
    //     $("#labelPerfil").text(des);
    //     $("#perfiles").text(res);
    // }
    $("#usrEstado").val(data.usrEstado).trigger("change");
    $("#idPerfil").val(data.idPerfil).trigger("change");
    if(data.usrUltimaVisita!=null){$("#usrUltimaVisita").val(data.usrUltimaVisita);}
    if(data.auCreadoEl!=null){$("#auCreadoEl").val(data.auCreadoEl);}
    if(data.creador!=null){$("#creador").val(data.creador);}
    if(data.auModificadoEl!=null){$("#auModificadoEl").val(data.auModificadoEl);}
    if(data.modificador!=null){$("#modificador").val(data.modificador);}
}

var BotonCancelar = function(){
    $(".md-form-control").removeClass("md-valid");
    $("#spanTitulo").text("Usuarios registrados");
    $(".divForm").toggle();    
    $('#divConsulta').hide();
    $('#FormUsuario')[0].reset();
    $("#idUser").val("");
    $('#divSpanPerfiles').hide();
    mostrarDesconocidos();
}

var mostrarDesconocidos = function(){
    $("#usrUltimaVisita").text("Desconocido");
    $("#auCreadoEl").text("Desconocido");
    $("#creador").text("Desconocido");
    $("#auModificadoEl").text("Desconocido");
    $("#modificador").text("Desconocido");
}

var BotonAgregar = function(){
    $("#spanTitulo").text("Registrar Usuario");
    $("#divBtnModificar").hide();
    $("#divBtnAceptar").show();
    cargarFormulario();
    mostrarDesconocidos();
    $("#divConsulta").hide();
    $("#divSpanPerfiles").hide();
    $("#idUser").val("");
    $(".comboclear").val('').trigger("change");
    $('#FormUsuario')[0].reset();
    desbloquearInuts();
}

var BotonAgregarPerfil = function(){
    var data = {'idPerfil': $('#idPerfil').val(),'idUser': $('#idUser2').val()};
    parametroAjax.ruta = rutaP;
    parametroAjax.data = data;
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarPerfil(respuesta);
}


var ProcesarUsuario = function(){
    if (errorRut==0){  
        var camposNuevo = {'usrEstado': $('#usrEstado').val(), 'idPerfil': $('#idPerfil').val()}
        parametroAjax.ruta=ruta;
        parametroAjax.data = $("#FormUsuario").serialize() + '&' + $.param(camposNuevo);
        respuesta=procesarajax(parametroAjax);
        ManejoRespuestaProcesar(respuesta);
    }
};

var buscarPerfiles = function(data){
    parametroAjaxGet.ruta=rutaP;
    parametroAjaxGet.data = data;
    respuesta=procesarajax(parametroAjaxGet);
    ManejoRespuestaProcesarP(respuesta);
};

var reiniciarClave = function(idUser){
    parametroAjax.ruta=rutaR;
    parametroAjax.data = {idUser:idUser};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarR(respuesta);
}

var validador = function(){
    $('#FormUsuario').formValidation('validate');
};

var validadorPerfil = function(){
    $('#FormPerfil').formValidation('validate');
};

var cambiarEstatusUsuario = function(idUser){
    parametroAjax.ruta=rutaA;
    parametroAjax.data = {idUser:idUser};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarI(respuesta);
}

var desbloquearCuenta = function(idUser){
    parametroAjax.ruta=rutaDC;
    parametroAjax.data = {idUser:idUser};
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaDesbloquearcuenta(respuesta);
}

var cambiarEstatusPerfil = function(data){
    manejoRefresh=1;
    parametroAjax.ruta=rutaAP;
    parametroAjax.data = data;
    respuesta=procesarajax(parametroAjax);
    ManejoRespuestaProcesarP(respuesta);
}

var verificarRut = function(control){
    var res = Valida_Rut(control);
    var format = formateaRut(control.val(), res);
    if (format != false){
        errorRut = 0;       
        $("#ErrorRut").text("");
        return format;
    }else{
        errorRut = 1;       
        $("#ErrorRut").text("Rut invalido");
        return control.val();
    }
}

var bloquearInuts = function(){
    $("#usrUserName").prop('readonly', true);
    $("#usrNombreFull").prop('readonly', true);
    $("#usrEmail").prop('readonly', true);
    $("#usrEstado").prop('disabled', true);
    $("#idPerfil").prop('disabled', true);
}

var desbloquearInuts = function(){
    $("#usrUserName").prop('readonly', false);
    $("#usrNombreFull").prop('readonly', false);
    $("#usrEmail").prop('readonly', false);
    $("#usrEstado").prop('disabled', false);
    $("#idPerfil").prop('disabled', false);
}

var modificarUsuario = function(){
    $("#divBtnModificar").hide();
    $("#divBtnAceptar").show();
    desbloquearInuts();    
}

$(document).ready(function(){
    $("#spanTitulo").text("Usuarios registrados");
    $("#usrUserName").focusout(function() {
        var valid = $("#usrUserName").val();
        if (valid.length > 0){
            var res = verificarRut($("#usrUserName"));
            $("#usrUserName").val(res);
        }else{$("#ErrorRut").text("");}
    });
    cargarTablaUsuarios(d.v_usuarios);
    crearallSelect(d);    
    $(document).on('click','#guardar',validador);
    $(document).on('click','#cancelar',BotonCancelar);
    $(document).on('click','#volverAct',BotonCancelar);
    $(document).on('click','#agregar',BotonAgregar);
    $(document).on('click','#agregarP',validadorPerfil);
    $(document).on('click','#volverPerfiles',volverPerfiles);
    $(document).on('click','#modificar',modificarUsuario);
    $('#FormUsuario').formValidation({
        excluded:[':disabled'],
        // message: 'El módulo le falta un campo para ser completado',
        fields: {
            'usrUserName': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            }, 
            'usrNombreFull': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },            
            'usrEmail': {
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                    emailAddress: {
                        message: 'Ingrese una dirección de correo valida'
                    }
                }
            },
            'usrEstado': {
                verbose: false,
                validators: {
                    notEmpty: {
                        message: 'El campo es requerido.'
                    },
                }
            },
            'idPerfil': {
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
        ProcesarUsuario();
    })
    .on('status.field.fv', function(e, data){
        data.element.parents('.form-group').removeClass('has-success');
    });

    
    $('#FormPerfil').formValidation({
        excluded:[':disabled'],
        // message: 'El módulo le falta un campo para ser completado',
        fields: {
            'idPerfil': {
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
        BotonAgregarPerfil();
    })
    .on('status.field.fv', function(e, data){
        data.element.parents('.form-group').removeClass('has-success');
    });
});