import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaquetesService } from "../../../../../../../services/paquetes.service";
import { AlertService } from "../../../../../../../services/alert.service";
import { Producto } from "../../../../../../../models/producto.models";
import {FormsModule} from "@angular/forms";
import {FormPaqueteComponent} from "../../../../../../components/common/form-paquete/form-paquete.component";

@Component({
  selector: 'app-agregar',
  standalone: true,
  templateUrl: './agregar.component.html',
  imports: [
    FormsModule,
    FormPaqueteComponent
  ],
  styleUrl: './agregar.component.css'
})
export class AgregarComponent {
  nombrePaquete = '';
  descripcionPaquete = '';
  rows: Array<{ cantidad: number; categoria: string; producto: number | null; descuento?: number; items: Producto[] }> = [
    { cantidad: 1, categoria: '', producto: null, descuento: 0, items: [] }
  ];
  editMode: boolean = false;

  constructor(
    private paqueteService: PaquetesService,
    private alertService: AlertService,
    private router: Router
  ) {}

  onSaveItem(paquete: any): void {
    this.paqueteService.addPaquete(paquete).subscribe({
      next: () => {
        this.alertService.success('Paquete agregado exitosamente.');
        this.resetForm();
      },
      error: () => this.alertService.error('Error al guardar el paquete.')
    });
  }


  resetForm(): void {
    this.nombrePaquete = '';
    this.descripcionPaquete = '';
    this.rows = [{ cantidad: 1, categoria: '', producto: null, descuento: 0, items: [] }];
  }


}
