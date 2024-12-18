import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa el CommonModule
import { ReservacionService } from '../../../../../services/reservacion.service';
import { Reserva } from '../../../../../models/Reserva.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    RouterLink, CommonModule,     FormsModule
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent implements OnInit {
  reservas: Reserva[] = []; // Almacena todas las reservas

  reservasFiltradas: Reserva[] = [];
  reservasPaginadas: Reserva[] = [];
  codigoBusqueda: string = '';
  metodoFiltro: string = '';
  metodosPago: string[] = ['Efectivo', 'Transferencia', 'Tarjeta'];

  itemsPorPagina: number = 10;
  paginaActual: number = 1;
  paginasTotales: number = 1;
  arrayPaginas: number[] = [];


  constructor(private reservacionService: ReservacionService) {}

  ngOnInit(): void {
    this.fetchReservas(); // Llamar al método para obtener reservas al cargar el componente
  }

  fetchReservas(): void {
    this.reservacionService.getReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.reservasFiltradas = reservas; // Inicializa todas las reservas
        this.actualizarPaginacion();
      },
      error: (error) => console.error('Error al obtener reservas:', error),
    });
  }


  /**
   * Filtra las reservas dinámicamente según el texto ingresado en el buscador.
   */





  filtrarReservas(): void {
    const texto = this.codigoBusqueda.toLowerCase().trim();
    this.reservasFiltradas = this.reservas.filter((reserva) => {
      const coincideTexto = reserva.codigo_pedido?.toLowerCase().includes(texto);
      const coincideMetodo = !this.metodoFiltro || reserva.metodo_pago.nombre_metodo === this.metodoFiltro;
      return coincideTexto && coincideMetodo;
    });
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    this.paginasTotales = Math.ceil(this.reservasFiltradas.length / this.itemsPorPagina);
    this.arrayPaginas = Array.from({ length: this.paginasTotales }, (_, i) => i + 1);
    this.paginaActual = Math.min(this.paginaActual, this.paginasTotales || 1);
    this.actualizarReservasPaginadas();
  }

  actualizarReservasPaginadas(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.reservasPaginadas = this.reservasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.paginasTotales) {
      return; // Prevenir navegación fuera de límites
    }
    this.paginaActual = pagina;
    this.actualizarReservasPaginadas();
  }









  getDisplayStatus(reserva: Reserva): string {
    if (reserva.estado === 'PENDIENTE' && reserva.estado_solicitud === 'SIN_SOLICITUD') {
      return 'PENDIENTE';
    }
    if (reserva.estado_solicitud && reserva.estado_solicitud !== 'SIN_SOLICITUD') {
      return reserva.estado_solicitud;
    }
    return reserva.estado || 'UNKNOWN';
  }

  getDisplayLabel(reserva: Reserva): string {
    if (reserva.estado_solicitud && reserva.estado_solicitud !== 'SIN_SOLICITUD') {
      return 'Estado Solicitud';
    }
    return 'Estado';
  }
}
