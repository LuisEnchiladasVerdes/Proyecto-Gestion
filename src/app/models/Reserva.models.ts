import { Cliente } from './cliente.models';
import { Direccion } from './direccion.models';

export interface Reserva {
  cliente: Cliente;
  direccion: Direccion;
  metodo_pago: number;
  fecha_entrega: string; // Formato 'YYYY-MM-DD'
  hora_entrega: string;  // Formato 'HH:mm:ss'
  verification_token: string;
}
