import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {Producto} from "../../../../../models/producto.models";
import {ProductoService} from "../../../../../services/producto.service";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    RouterLink
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  // producto: Producto = {
  //   id: 0,
  //   nombre: '',
  //   categoria: ,
  //   descripcion: '',
  //   stock: 0
  // }; // Definimos un item vacío para inicializar
  //
  // formValid = {
  //   name: true,
  //   categoria: true,
  //   stock: true
  // };
  //
  // constructor(
  //   private productoService: ProductoService,
  //   private route: ActivatedRoute,
  //   private router: Router
  // ) { }
  //
  // ngOnInit(): void {
  //   // Obtener el id del item desde la URL
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id) {
  //     this.cargarItem(id);
  //   }
  // }
  //
  // cargarItem(id: string): void {
  //   this.productoService.getItemById(id).subscribe(
  //     (producto: Producto) => {
  //       this.producto = producto; // Asignamos los datos del item
  //     },
  //     (error: any) => {
  //       alert('Error al cargar el producto');
  //     }
  //   );
  // }
  //
  // validarFormulario(): boolean {
  //   let valid = true;
  //   // Verificar cada campo
  //   if (!this.producto.nombre) {
  //     this.formValid.name = false;
  //     valid = false;
  //   }
  //   if (this.producto.categoria === 0) {
  //     this.formValid.categoria = false;
  //     valid = false;
  //   }
  //   if (this.producto.stock <= 0) {
  //     this.formValid.stock = false;
  //     valid = false;
  //   }
  //   return valid;
  // }
  //
  // guardarCambios(): void {
  //   // this.itemService.updateItem(this.item).subscribe(
  //   //   (response) => {
  //   //     alert('Producto editado correctamente');
  //   //     this.router.navigate(['/admin/inventario/general']); // Redirigir al listado de items después de guardar
  //   //   },
  //   //   (error) => {
  //   //     console.error('Error al guardar los cambios', error);
  //   //   }
  //   // );
  //   if (this.validarFormulario()) {
  //     this.productoService.updateItem(this.producto).subscribe(
  //       (response) => {
  //         alert('Producto editado correctamente');
  //         this.router.navigate(['/admin/inventario/general']); // Redirigir al listado de items después de guardar
  //       },
  //       (error) => {
  //         console.error('Error al guardar los cambios', error);
  //       }
  //     );
  //   } else {
  //     alert('Por favor, complete todos los campos correctamente.');
  //   }
  // }
ngOnInit() {
}


}
