import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AlertService} from "../../../../../services/alert.service";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  formularioReserva: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private alertService: AlertService) {
    // Inicializamos el formulario con las validaciones
    this.formularioReserva = this.fb.group({
      codigo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/) // 6 dígitos numéricos
        ]
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/) // 10 dígitos numéricos
        ]
      ]
    });
  }

  // Manejo del envío del formulario
  onSubmit(): void {
    if (this.formularioReserva.valid) {
      console.log('Formulario válido:', this.formularioReserva.value);
      this.router.navigate(['/tracker/status']);
    } else {
      this.mostrarAlerta(); // Mostrar alerta si el formulario no es válido
      this.formularioReserva.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
    }
  }

  mostrarAlerta(): void {
    this.alertService.error('Por favor, revise que todos los campos sean correctos.');
  }
}
