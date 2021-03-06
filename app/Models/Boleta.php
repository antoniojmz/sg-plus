<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\QueryException;
use App\Exceptions\Handler;
use Illuminate\Mail\Mailable;

use DB;
use Log;
use DateTime;
use Session;
use Exception;
use Auth;
use Empresa;


class Boleta extends Authenticatable
{

    public function verBoleta($obj,$caso){
        $local = DB::table('v_locales')->where('IdLocal',$obj->IdLocal)->first();
        $empresa = DB::table('v_empresas')->where('IdEmpresa',$local->IdEmpresa)->first();
        if ($caso==1){ 
            $tittle= "PREVENTA"; // N° ".$obj->idPreVenta; 
            $numero = "N° ".$obj->idPreVenta;
            $vendedor = $obj->IdVendedor.' - '.$obj->NombreVendedor;

            $id = $obj->idPreVenta;
            $detalles = DB::select("select CantidadPreVenta as Cant,NombreProducto,ValorUnitarioVenta from v_preventas_detalle where IdPreVenta = ".$obj->idPreVenta);
            $pagos = DB::select("select FormaPago,MontoPagado from v_preventas_pagos where IdPreVenta =".$obj->idPreVenta);
            $DetalleFactura = '';
            $total = 0;
            foreach ($detalles as $key => $detalle) {
                $CantTotal = 0;
                $CantTotal = ($detalle->Cant * $detalle->ValorUnitarioVenta);

                $DetalleFactura .= '
                <tr style="font-size: 9px;">
                    <td colspan="2">'.number_format($detalle->Cant, 2, ",", ".").' x $ '.number_format($detalle->ValorUnitarioVenta, 2, ",", ".").'</td>
                    <td align="right">'.number_format($CantTotal, 2, ",", ".").'</td>
                </tr>
                <tr>
                    <td colspan="3">'.$detalle->NombreProducto.'</td>
                </tr>
                ';
                $total += $CantTotal;
            }
        }

        if ($caso==2){ 
            $tittle= "VENTA ";  // N° ".$obj->IdVenta; 
            $numero = "N° ".$obj->IdVenta;
            $vendedor = $obj->IdVendedor.' - '.$obj->NombreVendedor;

            $id = $obj->IdVenta;
            $detalles = DB::select("select CantidadVenta, NombreProducto, ValorUnitarioVenta from v_ventas_detalle where IdVenta = ".$obj->IdVenta);
            $pagos = DB::select("select FormaPago,MontoPagado from v_ventas_pagos where IdVenta=".$obj->IdVenta);
            $DetalleFactura = '';
            $total = 0;
            foreach ($detalles as $key => $detalle) {
                $CantTotal = 0;
                $DetalleFactura .= '
                <tr style="font-size:9px;">
                <td>'.$detalle->NombreProducto.'</td>
                <td align="center">'.number_format($detalle->CantidadVenta, 2, ",", ".").'</td>
                <td align="right">'.number_format($detalle->ValorUnitarioVenta, 2, ",", ".").'</td>
                </tr>
                ';
                $CantTotal = ($detalle->CantidadVenta * $detalle->ValorUnitarioVenta);
                $total += $CantTotal;                
            }
        }
        $FechaNow = new DateTime();
        $DetallePago = '';
        $totalPago = 0;
        foreach ($pagos as $key => $pago) {
            $DetallePago .= '
            <tr style="font-size: 10px;">
            <td colspan="2">'.$pago->FormaPago.'</td>
            <td align="right">'.number_format($pago->MontoPagado, 2, ",", ".").'</td>
            </tr>
            ';
            $totalPago += $pago->MontoPagado;
        }

        $vuelto = $totalPago - $total;

        return 
        '
        <div style="font-size:7px;">
            <input type="hidden" id="NumeroBoletaModal" value="'.$id.'">
            <table border="1" cellspacing="0" width="100%">
                <tr>
                    <td>
                        <table border="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="text-align:center;">
                                    '.$local->NombreLocal.'
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    '.$tittle.' '.$numero.'
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <br>
            <br>
            <table border="0" cellspacing="0" width="100%" style="font-size: 10px; font-family: Arial, Helvetica, sans-serif;">
                <tr>
                    <td>
                        <b>'.$empresa->NombreFantasia.'</b>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>'.$local->NombreLocal.'</b>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>'.$local->DireccionLocal.'</b>
                    </td>
                </tr>
            </table>
             <br />
            <table border="0" cellspacing="0" width="100%" style="font-size: 10px; font-family: Arial, Helvetica, sans-serif;">
                <tr>
                    <td>
                        <b>Fecha Emisión: '.$FechaNow->format('d-m-Y').' '.$FechaNow->format('H:i:s').' </b>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Vendedor: '.$vendedor.' </b>
                    </td>
                </tr>   
                <tr>
                    <td>
                        <b>Documento: '.$obj->DTE.' </b>
                    </td>
                </tr>                                                                          
            </table>
            <br />
            <table border="0" cellspacing="0" width="100%" style="font-size: 10px; font-family: Arial, Helvetica, sans-serif;">
                <tr>   
                    <td colspan="3"><br /></td>
                </tr>
                <tr class="tableHead" style="font-weight: bold;" >
                    <td width="70%" colspan="2">DETALLE COMPRA</td>
                    <td width="30%" align="right">TOTAL</td>
                </tr>
                    '.$DetalleFactura.'
                <tr>
                    <td colspan="3"><br /></td>
                </tr>
                <tr>
                    <td colspan="2"><b>TOTAL COMPRA</b></td>
                    <td align="right"><b>'.number_format($total, 2,",", ".").'</b></td>
                </tr>
                <tr>
                    <td colspan="2"><b>SUMA DE SUS PAGOS</b></td>
                    <td align="right"><b>'.number_format($totalPago, 2,",", ".").'</b></td>
                </tr>
                <tr>
                    <td colspan="2"><b>'.($vuelto>=0 ? 'VUELTO' : 'PENDIENTE PAGO').'</b></td>
                    <td align="right"><b>'.number_format($vuelto, 2,",", ".").'</b></td>
                </tr>
                <tr>
                    <td colspan="3"><br /></td>
                </tr>
            </table>
            <table border="0" cellspacing="0" width="100%" style="font-size: 9px; font-family: Arial, Helvetica, sans-serif;">
                <tr>
                    <td colspan="3" style="font-weight: bold;">DETALLE PAGO</td>
                </tr>
                '.$DetallePago.'
            </table>
        </div>
        ';
    }
}
