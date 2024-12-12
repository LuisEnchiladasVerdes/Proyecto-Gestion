import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportToExcel(datos: any[], columnas: string[]): void {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos, { header: columnas });
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja 1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    const wbouta = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const filename = 'productos.xlsx';
    XLSX.writeFile(wb, filename);
  }
}
