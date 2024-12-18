import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../../../services/producto.service';
import {Reserva} from "../../../../../models/Reserva.models";
import { ReservacionService } from '../../../../../services/reservacion.service';


@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  reserva!: Reserva;
  BASE_URL: string; // URL base para las imágenes
  mensaje: string = '';

  thumbPosition = 'translateX(0px)'; // Posición inicial del slider
  sliderBackgroundColor = '#f8f8f8'; // ColZor inicial del fondo
  isSliding = false; // Indicador de si el usuario está deslizando
  sliderWidth = 0; // Ancho del contenedor del slider
  actionCompleted = false; // Controla si la acción ya fue completada
  textPosition = 'calc(50% - 60px)'; // Alineado al centro
  textOpacity = 1;

  private animationFrameId: number | null = null; // Controla el frame actual
  private currentDeltaX = 0; // Guarda la posición actual del thumb
  private targetDeltaX = 0; // Guarda la posición objetivo
  private arrowMoveFactor = 0.5; // Factor de movimiento de las flechas
  public currentArrowOffset = 0; // Desplazamiento de las flechas
  public arrowOffsetStyle = '0px'; // Nueva variable de estilo dinámico

  constructor(private router: Router, private http: HttpClient, private productoService: ProductoService,     private reservacionService: ReservacionService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    this.reserva = state?.['reserva'] ?? null; // Acceso seguro con index signature
    console.log('Reserva inicial:', this.reserva);


    if (!this.reserva) {
      console.error('No se encontró información de la reserva.');
      this.router.navigate(['/']); // Cambia la ruta según corresponda
    }

    // Asignar la URL base del servicio
    this.BASE_URL = this.productoService.getMediaBaseUrl();
  }




  ngOnInit(): void {
    setTimeout(() => {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras.state;

      if (state?.['reserva']) {
        this.reserva = state['reserva'];
        console.log('Reserva recibida con retraso:', this.reserva);
      } else {
        console.error('No se encontró información de la reserva.');
      }
    }, 100);
  }





  // Método auxiliar para manejar imágenes faltantes
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/default-image.jpg'; // Imagen predeterminada
  }

  // Enviar la solicitud al backend
  enviarSolicitudCancelacion(): void {
    if (this.reserva.estado !== 'CONFIRMADA') {
      this.mensaje = 'No se puede cancelar una reserva que no está CONFIRMADA.';
      console.warn('La reserva no está confirmada.');
      return;
    }
    const url = `http://127.0.0.1:8000/api/clientes/reservas/${this.reserva.codigo_pedido}/solicitud/`;
    const body = { solicitud: 'CANCELAR' };

    this.http.post(url, body).subscribe({
      next: (response: any) => {
        this.mensaje = 'La solicitud de cancelación ha sido enviada.';
        console.log('Solicitud enviada:', response);
        this.reserva.estado_solicitud = 'CANCELAR'; // Actualizar localmente
      },
      error: (error) => {
        this.mensaje = 'Error al enviar la solicitud. Inténtalo de nuevo.';
        console.error('Error:', error);
      }
    });
  }

  // Manejo de deslizamiento con ratón
  onMouseDown(event: MouseEvent): void {
    this.startSliding(event.clientX, event);
  }

  // Manejo de deslizamiento con toque táctil
  onTouchStart(event: TouchEvent): void {
    this.startSliding(event.touches[0].clientX, event);
  }

  // Método auxiliar
  mostrarSlider(): boolean {
    // Mostrar el slider solo si la reserva está CONFIRMADA y no hay una solicitud previa
    return this.reserva.estado === 'CONFIRMADA' && this.reserva.estado_solicitud === 'SIN_SOLICITUD';
  }

  private startSliding(startX: number, originalEvent: MouseEvent | TouchEvent): void {
    // Si la reserva no está en estado válido, no permitir la interacción
    if (!this.mostrarSlider()) {
      console.warn('La reserva no está en un estado válido para cancelar.');
      return;
    }

    const sliderContainer = (originalEvent.target as HTMLElement).closest('.slider-container') as HTMLElement;
    this.isSliding = true;
    this.sliderWidth = sliderContainer.offsetWidth;

    const thumbWidth = 60; // Ancho del thumb
    const maxDelta = this.sliderWidth - thumbWidth;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isSliding) return;

      // Captura el movimiento del mouse/touch
      const currentX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      this.targetDeltaX = Math.min(maxDelta, Math.max(0, currentX - startX));

      if (!this.animationFrameId) {
        this.animateThumb();
      }
    };

    const onEnd = () => {
      this.isSliding = false;

      // Verificar si el progreso es mayor o igual al 95% al soltar
      const sliderProgress = this.targetDeltaX / maxDelta;
      if (sliderProgress >= 0.95) {
        this.targetDeltaX = maxDelta; // Forzar el slider hasta el final
        this.animateThumb(() => this.completeAction()); // Continuar animación y completar
      } else {
        this.resetSlider(); // Regresar a la posición inicial
      }

      // Eliminar los listeners
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
      const smoothingFactor = 0.15; // Factor de suavizado
      const thumbWidth = 60; // Ancho del thumb
      const maxDeltaX = this.sliderWidth - thumbWidth; // Máximo desplazamiento

      // Interpolación suave
      this.currentDeltaX += (this.targetDeltaX - this.currentDeltaX) * smoothingFactor;

      // ===== Actualizar posiciones y estilos =====
      this.thumbPosition = `translateX(${this.currentDeltaX}px)`; // Posición del thumb
      const sliderProgress = this.currentDeltaX / maxDeltaX;

      // Actualizar estilos dinámicos
      this.sliderBackgroundColor = `rgba(229, 115, 115, ${sliderProgress})`;
      this.textPosition = `${(1 - sliderProgress) * 100}%`; // Movimiento inverso del texto
      this.textOpacity = 1 - sliderProgress; // Opacidad del texto
      this.arrowOffsetStyle = `${this.currentDeltaX}px`; // Desplazamiento dinámico de flechas

      // Continuar la animación
      if (Math.abs(this.currentDeltaX - this.targetDeltaX) > 0.5) {
        this.animateThumb(callback); // Continuar animación
      } else {
        this.animationFrameId = null;

        // Si hay un callback (al soltar el mouse/touch), ejecutarlo
        if (callback) {
          callback();
        }
      }
    });
  }

  resetSlider(): void {
    this.targetDeltaX = 0; // Regresar al inicio
    this.isSliding = false;

    if (!this.animationFrameId) {
      this.animateThumb(); // Inicia animación para regresar suavemente
    }
  }

  completeAction(): void {
    this.actionCompleted = true;
    this.sliderBackgroundColor = '#d9534f';
    this.enviarSolicitudCancelacion();
  }


}
