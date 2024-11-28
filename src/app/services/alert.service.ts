import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  success(message: string, title: string = 'Éxito') {
    Swal.fire({
      position: "top-end",
      icon: 'success',
      title,
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      position: "top-end",
      icon: 'error',
      title,
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  warning(message: string, title: string = 'Advertencia') {
    Swal.fire({
      // position: "top-end",
      icon: 'warning',
      title,
      text: message,
      showConfirmButton: false,
      timer: 1000
    });
  }

  modalConIconoError(message: string, title: string = 'Oops ...') {
    Swal.fire({
      icon: 'error',
      title,
      text: message
    });
  }



  showConfirmAlert(text: string, confirmText: string = 'Sí, eliminar', cancelText: string = 'Cancelar') {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText
    });
  }
}
