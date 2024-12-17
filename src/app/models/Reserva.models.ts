import { Cliente } from './cliente.models';
import { Direccion } from './direccion.models';
import {Producto} from "./producto.models";

export interface Reserva {
  cliente: Cliente;
  direccion: Direccion;
  metodo_pago: MetodoPago ;
  // metodo_pago: number;
  fecha_entrega: string; // Formato 'YYYY-MM-DD'
  hora_entrega: string;  // Formato 'HH:mm:ss'
  verification_token: string;

  id?: number;
  codigo_pedido?: string;
  fecha_reserva?: string; // ISO format (e.g., "2024-12-13T17:32:47.335935Z")
  estado?: string; // Estado de la reserva (e.g., Confirmada, Pendiente)
  estado_solicitud?: string; // Solicitud de cambio de estado (e.g., Cancelar)
  total?: string; // Total en formato string (e.g., "45.00")
  detalles?: DetalleReserva[]; // Lista de productos en la reserva
}

export interface MetodoPago {
  id: number;
  nombre_metodo?: string;
}

export interface DetalleReserva {
  id: number;
  producto: Producto;
  paquete: string | null; // Puede ser null si no hay paquete asociado
  cantidad: number;
  precio_unitario: string;
  precio_total: string;
}
