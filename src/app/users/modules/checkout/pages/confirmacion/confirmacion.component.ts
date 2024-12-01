import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AlertService} from "../../../../../services/alert.service";

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent {
  formulario: FormGroup;
  botonDeshabilitado = true;
  mostrarModal = false; // Controla la visibilidad del modal
  codigo: string = ''; // Almacena el código ingresado

  constructor(private fb: FormBuilder, private router: Router, private alertService: AlertService) {
    this.formulario = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      correo: ['', [Validators.required, Validators.email]],
      calle: ['', [Validators.required]],
      colonia: ['', [Validators.required]],
      codigo_postal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      numero_exterior: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      numero_interior: [''],
      referencia: ['', [Validators.required]],
      metodo_pago: [null, [Validators.required]],
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.codigo = ''; // Limpia el código al cerrar
  }

  validarCodigo() {
    const codigoValido = /^\d{6}$/.test(this.codigo); // Verifica que el código tenga 6 dígitos
    if (codigoValido) {
      this.cerrarModal();
      this.botonDeshabilitado = false; // Habilita el botón "REALIZA TU ORDEN"
    } else {
      this.alertService.error('El código ingresado es incorrecto.');
    }
  }

  submitForm() {
    if (this.formulario.valid) {
      console.log('Formulario válido:', this.formulario.value);
      this.realizarOrden();
    } else {
      this.alertService.error('Por favor, completa todos los campos obligatorios.');
    }
  }

  realizarOrden() {
    this.router.navigate(['/carrito/realizado']);
  }
}
