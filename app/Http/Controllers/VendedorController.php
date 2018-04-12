<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

use Form;
use Lang;
use View;
use Redirect;
use SerializesModels;
use Log;
use Session;
use Config;
use Mail;
use Storage;
use DB;

use App\Models\Vendedor;
use App\Models\Usuario;


class VendedorController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */

    public function getvendedor()
    {
        $model= new Vendedor();
        $data['v_vendedores'] = $model->listVendedor();
        $data['v_estados'] = $model->listEstados();
        return View::make('vendedores.vendedores',$data);
    }

    //Registrar o actualizar Vendedor
    protected function postvendedor(Request $request){
        $datos = $request->all();
        $usuario= new Usuario();
        $datos['RUTVendedor'] = $usuario->LimpiarRut($datos['RUTVendedor']);
        $model= new Vendedor();
        $result['f_registro'] = $model->regVendedor($datos);
        $result['v_vendedores'] = $model->listVendedor();
        return $result;
    }

    //Activar / desactivar Vendedor
    protected function postVendedoractivo (Request $request){
        $datos = $request->all();
        $model= new Vendedor();
        $vendedor = Vendedor::find($datos['IdVendedor']);
        $result['activar'] = $model->activarVendedor($vendedor);
        $result['v_vendedores'] = $model->listVendedor();
        return $result;
    }

    // Ver detalles de los Vendedor
    protected function postVendedordetalle (Request $request){
        $datos = $request->all();
        $model= new Vendedor();
        $result['v_detalles'] = $model->getOneDetalle($datos['IdVendedor']);
        // $result['v_productos'] = $model->localesProducto($datos['IdVendedor']);
        return $result;
    }

    protected function postBuscarVen(Request $request){
        $datos = $request->all();
        $usuario= new Usuario();
        $datos['RUTVendedor'] = $usuario->LimpiarRut($datos['RUTVendedor']);
        $result['v_usuario'] = Usuario::where('usrUserName', $datos['RUTVendedor'])->first();
        return $result;
    }

}