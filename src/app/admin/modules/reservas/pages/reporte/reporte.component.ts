import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Registrar los componentes de `chart.js`
Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  imports: [],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  standalone: true
})
export class ReporteComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    this.initVentasMensualesChart();
    this.initCategoriasRentadasChart();
  }

  // Inicializa la gráfica de ventas mensuales
  initVentasMensualesChart(): void {
    const ctx = document.getElementById('ventasMensualesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: 'Ventas en $',
            data: [1200, 1900, 3000, 5000, 2300, 4000, 4500, 5200, 6000, 6300, 7000, 7500],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4, // Curvatura de las líneas
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Inicializa la gráfica de categorías más rentadas
  initCategoriasRentadasChart(): void {
    const ctx = document.getElementById('categoriasRentadasChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sillas', 'Mesas', 'Manteles', 'Vajilla', 'Decoración'],
        datasets: [
          {
            label: 'Rentas',
            data: [120, 150, 80, 200, 170],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
