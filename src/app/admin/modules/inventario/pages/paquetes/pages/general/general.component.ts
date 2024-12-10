import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { PaquetesService } from '../../../../../../../services/paquetes.service';
import { Paquetes } from '../../../../../../../models/paquetes.models';
import {NgForOf} from "@angular/common";

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

  constructor(private paquetesService: PaquetesService, private router: Router) {}

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
    if (confirm('¿Estás seguro de que deseas eliminar este paquete?')) {
      this.paquetesService.deletePaquete(id).subscribe({
        next: () => {
          this.paquetes = this.paquetes.filter((paquete) => paquete.id !== id);
          alert('Paquete eliminado con éxito.');
        },
        error: (err) => {
          console.error('Error al eliminar paquete:', err);
        },
      });
    }
  }
}
