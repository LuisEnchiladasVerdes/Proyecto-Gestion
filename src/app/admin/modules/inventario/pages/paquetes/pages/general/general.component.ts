import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { PaquetesService } from '../../../../../../../services/paquetes.service';
import { Paquetes } from '../../../../../../../models/paquetes.models';
import {NgForOf} from "@angular/common";
import {AlertService} from "../../../../../../../services/alert.service";

@Component({
  selector: 'app-general',
  standalone: true,
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
  imports: [
    RouterLink,
    NgForOf
  ]
})
export class GeneralComponent implements OnInit {
  paquetes: Paquetes[] = [];

  constructor(private paquetesService: PaquetesService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.cargarPaquetes();
  }

  cargarPaquetes(): void {
    this.paquetesService.getPaquetes().subscribe({
      next: (data) => {
        this.paquetes = data;
      },
      error: (err) => {
        console.error('Error al cargar paquetes:', err);
      },
    });
  }

  eliminarPaquete(id: number): void {
    this.alertService.showConfirmAlert(
      'Este paquete sera eliminado de manera permanente'
    ).then((result) => {
      if (result.isConfirmed) {
        this.paquetesService.deletePaquete(id).subscribe({
          next: () => {
            this.paquetes = this.paquetes.filter((paquete) => paquete.id !== id);
            this.alertService.success('Producto eliminado correctamente.');
          },
          error: (err) => {
            console.error('Error al eliminar paquete:', err);
          },
        });
      }
    });
  }

  onEdit(paqueteId: number): void {
    this.paquetesService.getPaqueteById(paqueteId).subscribe({
      next: (paquete: Paquetes) => {
      },
      error: () => this.alertService.error('Error al obtener el paquete seleccionado.'),
    });
  }
}
