import { Injectable } from '@angular/core';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generarPDF(datos: any[], columnas: string[]): Blob {
    const doc = new jsPDF();
    const encabezados = [columnas];
    const filas = datos.map((item) => columnas.map((col) => item[col]));

    autoTable(doc, {
      head: encabezados,
      body: filas,
      startY: 10,
    });

    const blob = doc.output('blob');
    return blob;
  }
}
