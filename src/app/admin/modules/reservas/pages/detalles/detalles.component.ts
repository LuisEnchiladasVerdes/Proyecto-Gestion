import { Component, OnInit } from '@angular/core';
import { NgForOf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ReservacionService } from '../../../../../services/reservacion.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [NgForOf, RouterLink, CommonModule],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent implements OnInit {
  codigoPedido: string = '';
  reserva: any; // Datos de la reserva

  mensaje: string = '';
  thumbPosition = 'translateX(0px)';
  sliderBackgroundColor = '#f8f8f8';
  isSliding = false;
  sliderWidth = 0;
  actionCompleted = false;
  textPosition = 'calc(50% - 60px)';
  textOpacity = 1;
  public arrowOffsetStyle = '0px'; // Nueva variable de estilo dinámico

  private animationFrameId: number | null = null;
  private currentDeltaX = 0;
  private targetDeltaX = 0;

  sliderAction: 'confirmar' | 'cancelar' = 'cancelar';

  // Variables generales
  devolverSliderWidth = 400;
  devolverThumbWidth = 60;
  devolverCurrentDeltaX = 0;
  devolverThumbPosition = 'translateX(0px)';
  devolverArrowOffsetStyle = '0px';
  devolverSliderBackgroundColor = '#f8f8f8';
  devolverTextPosition = 'calc(100% - 150px)';
  devolverTextOpacity = 1;
  devolverIsSliding = false;
  devolverActionCompleted = false;

  private devolverTargetDeltaX = 0;
  private devolverAnimationFrameId: number | null = null;

  constructor( private route: ActivatedRoute, private reservacionService: ReservacionService ) {}

  ngOnInit(): void {

    // Inicializar el slider en el extremo derecho
    this.devolverCurrentDeltaX = this.devolverSliderWidth - this.devolverThumbWidth;
    this.updateDevolverStyles();

    this.codigoPedido = this.route.snapshot.paramMap.get('codigo_pedido') || '';
    if (!this.codigoPedido) {
      console.error('No se encontró el parámetro codigo_pedido en la URL');
      return;
    }

    this.reservacionService.getReservaPorCodigo(this.codigoPedido).subscribe({
      next: (data) => {
        this.reserva = data;
        console.log('Datos de la Reserva:', this.reserva);
      },
      error: (error) => {
        console.error('Error al obtener la reserva:', error);
      }
    });
  }

  // Confirmar reserva
  confirmarReserva(): void {
    this.reservacionService.confirmarReservaAdmin(this.codigoPedido).subscribe({
      next: () => {
        this.mensaje = 'Reserva confirmada exitosamente.';
        this.reserva.estado = 'CONFIRMADA';
        console.log('Reserva confirmada');
      },
      error: (error) => {
        this.mensaje = 'Error al confirmar la reserva.';
        console.error('Error al confirmar:', error);
      }
    });
  }

  // Cancelar reserva
  cancelarReserva(): void {
    this.reservacionService.gestionarSolicitudCancelacion(this.codigoPedido, 'APROBAR').subscribe({
      next: () => {
        this.mensaje = 'Solicitud de cancelación aprobada.';
        // Actualizar ambos valores en el frontend tras la cancelación
        this.reserva.estado = 'CANCELADA';
        this.reserva.estado_solicitud = 'SIN_SOLICITUD';
        console.log('Cancelación aprobada:', this.reserva);
      },
      error: (error) => {
        this.mensaje = 'Error al aprobar la solicitud de cancelación.';
        console.error('Error al cancelar:', error);
      }
    });
  }

  // Iniciar el deslizamiento específico para "Devolver"
  onMouseDownDevolver(event: MouseEvent): void {
    this.startSlidingDevolver(event.clientX);
  }

  onTouchStartDevolver(event: TouchEvent): void {
    this.startSlidingDevolver(event.touches[0].clientX);
  }

// Modificaciones específicas para el slider de "Devolver"
  private startSlidingDevolver(startX: number): void {
    this.devolverIsSliding = true;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.devolverIsSliding) return;

      const currentX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const delta = startX - currentX;

      // Limitar el movimiento dentro de los límites
      this.devolverTargetDeltaX = Math.max(
        0,
        Math.min(this.devolverSliderWidth - this.devolverThumbWidth, this.devolverSliderWidth - this.devolverThumbWidth - delta)
      );

      if (!this.devolverAnimationFrameId) {
        this.animateThumbDevolver();
      }
    };

    const onEnd = () => {
      this.devolverIsSliding = false;
      const sliderProgress = 1 - this.devolverTargetDeltaX / (this.devolverSliderWidth - this.devolverThumbWidth);

      if (sliderProgress >= 0.95) {
        this.devolverTargetDeltaX = 0;
        this.animateThumbDevolver(() => this.completeActionDevolver());
      } else {
        this.resetSliderDevolver();
      }

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  }

  private animateThumbDevolver(callback?: () => void): void {
    this.devolverAnimationFrameId = requestAnimationFrame(() => {
      const smoothingFactor = 0.15;

      // Animar suavemente el botón
      this.devolverCurrentDeltaX +=
        (this.devolverTargetDeltaX - this.devolverCurrentDeltaX) * smoothingFactor;

      this.updateDevolverStyles();

      if (Math.abs(this.devolverCurrentDeltaX - this.devolverTargetDeltaX) > 0.5) {
        this.animateThumbDevolver(callback);
      } else {
        this.devolverAnimationFrameId = null;
        if (callback) callback();
      }
    });
  }

  private updateDevolverStyles(): void {
    // Posiciona dinámicamente el botón
    this.devolverThumbPosition = `translateX(${this.devolverCurrentDeltaX}px)`;

    // Posiciona las flechas pegadas al botón y centradas verticalmente
    this.devolverArrowOffsetStyle = `translate(${this.devolverCurrentDeltaX - this.devolverThumbWidth}px, -50%)`;

    // Progreso del slider (de 0 a 1)
    const sliderProgress = 1 - this.devolverCurrentDeltaX / (this.devolverSliderWidth - this.devolverThumbWidth);

    // Cambia dinámicamente el fondo
    this.devolverSliderBackgroundColor = `rgba(79, 134, 217, ${sliderProgress})`;

    // Posiciona el texto dinámicamente
    this.devolverTextPosition = `calc(${50 + sliderProgress * 50}% - 170px)`;
    this.devolverTextOpacity = 1 - sliderProgress; // El texto desaparece al deslizar
  }

  resetSliderDevolver(): void {
    this.devolverTargetDeltaX = this.devolverSliderWidth - this.devolverThumbWidth;
    this.devolverIsSliding = false;
    if (!this.devolverAnimationFrameId) {
      this.animateThumbDevolver();
    }
  }

  // Devolver reserva
  completeActionDevolver(): void {
    this.reservacionService.devolverReservaAdmin(this.codigoPedido).subscribe({
      next: (response) => {
        console.log('Reserva devuelta exitosamente:', response);
        this.mensaje = 'Reserva devuelta correctamente.';

        // Actualizar el estado local de la reserva a 'DEVUELTA'
        if (this.reserva) {
          this.reserva.estado = 'DEVUELTA';
        }
      },
      error: (error) => {
        console.error('Error al devolver la reserva:', error);
        this.mensaje = 'Error al procesar la devolución.';
      }
    });
  }

  // Iniciar deslizamiento
  onMouseDown(event: MouseEvent, action: 'confirmar' | 'cancelar'): void {
    this.sliderAction = action;
    this.startSliding(event.clientX);
  }

  onTouchStart(event: TouchEvent, action: 'confirmar' | 'cancelar'): void {
    this.sliderAction = action;
    this.startSliding(event.touches[0].clientX);
  }

  private startSliding(startX: number): void {
    const thumbWidth = 60;
    this.isSliding = true;
    this.sliderWidth = 400;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isSliding) return;

      const currentX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      this.targetDeltaX = Math.min(this.sliderWidth - thumbWidth, Math.max(0, currentX - startX));

      if (!this.animationFrameId) {
        this.animateThumb();
      }
    };

    const onEnd = () => {
      this.isSliding = false;
      const sliderProgress = this.targetDeltaX / (this.sliderWidth - thumbWidth);

      if (sliderProgress >= 0.95) {
        this.targetDeltaX = this.sliderWidth - thumbWidth;
        this.animateThumb(() => this.completeAction());
      } else {
        this.resetSlider();
      }

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchend', onEnd);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  }

  private animateThumb(callback?: () => void): void {
    this.animationFrameId = requestAnimationFrame(() => {
      const smoothingFactor = 0.15;
      const thumbWidth = 60;
      const maxDeltaX = this.sliderWidth - thumbWidth;

      this.currentDeltaX += (this.targetDeltaX - this.currentDeltaX) * smoothingFactor;

      this.thumbPosition = `translateX(${this.currentDeltaX}px)`;
      const sliderProgress = this.currentDeltaX / maxDeltaX;
      this.arrowOffsetStyle = `${this.currentDeltaX}px`; // Desplazamiento dinámico de flechas

      // Actualizar colores dinámicamente
      this.sliderBackgroundColor =
        this.sliderAction === 'confirmar'
          ? `rgba(92, 184, 92, ${sliderProgress})` // Verde para confirmar
          : `rgba(217, 83, 79, ${sliderProgress})`; // Rojo para cancelar


      this.textPosition = `${(1 - sliderProgress) * 100}%`;
      this.textOpacity = 1 - sliderProgress;

      if (Math.abs(this.currentDeltaX - this.targetDeltaX) > 0.5) {
        this.animateThumb(callback);
      } else {
        this.animationFrameId = null;
        if (callback) callback();
      }
    });
  }

  resetSlider(): void {
    this.targetDeltaX = 0;
    this.isSliding = false;

    if (!this.animationFrameId) {
      this.animateThumb();
    }
  }

  completeAction(): void {
    this.actionCompleted = true;
    if (this.sliderAction === 'confirmar') {
      this.sliderBackgroundColor = '#5cb85c'; // Verde
      this.confirmarReserva();
    } else if (this.sliderAction === 'cancelar') {
      this.sliderBackgroundColor = '#d9534f'; // Rojo
      this.cancelarReserva();
    }
  }
}
