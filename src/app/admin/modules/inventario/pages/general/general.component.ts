import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ItemService } from '../../../../../services/item.service';
import { Item } from '../../../../../models/item.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    RouterLink
  ],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent {
  searchText: string = '';

  mostrarModal: boolean = false;
  mostrarModalEditar = false;
  mostrarAgregarCategoriaModal: boolean = false; // Controla la visibilidad del modal
  nuevaCategoria: string = ''; // Almacena el valor de la nueva categoría

  categorias = ['Mesas', 'Sillas', 'Paquetes']; // Opciones del dropdown
  categoriaSeleccionada = ''; // Categoría seleccionada

  items: Item[] = []; // Definir un arreglo para los items

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.cargar();
  }

  validarCategoria(categoria:number){
    if(categoria === 1){
      return 'Mesas';
    }
    else if(categoria === 2){
      return 'Sillas';
    }
    else if (categoria === 3){
      return 'Vajilla'
    }else return 'Extras'
  }

  validarStock(categoria : number, stock : number){
    if(categoria === 1 || categoria === 4){
      if(stock < 10) return 'Bajo Stock'
      else return 'En Stock'
    }else {
      if(stock < 50) return 'Bajo Stock'
      else return 'En Stock'
    }
  }

  cargar(){
    this.itemService.getItems().subscribe(
      (items: Item[]) => {
        if (items && items.length > 0) {
          this.items = items; // Asignar todos los items al arreglo
          // console.log(this.items); // Ver el array completo de items
        }
      },
      (error: any) => {
        console.error('Error al cargar los items', error);
      }
    );
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModalClickExterior(event: MouseEvent): void {
    // Este método se ejecuta si el usuario hace clic fuera del contenido del modal
    this.cerrarModal();
  }

  cerrarModal(): void {
    // Cierra el modal estableciendo la variable a false
    this.mostrarModal = false;
  }

  editarCategoria(): void {
    // alert('Editar Categoría seleccionado.');
    this.cerrarModal(); // Opcional: cerrar el modal después de seleccionar
    this.mostrarModalEditar = true;
  }

  cerrarEditarCategoriaClickExterior(event: MouseEvent): void {
    this.cerrarEditarCategoriaModal();
  }

  cerrarEditarCategoriaModal(): void {
    this.mostrarModalEditar = false;
  }

  eliminarCategoria(): void {
    if (this.categoriaSeleccionada) {
      this.categorias = this.categorias.filter(cat => cat !== this.categoriaSeleccionada);
      this.categoriaSeleccionada = ''; // Limpia el campo
      alert('Categoría eliminada exitosamente');
    } else {
      alert('Selecciona una categoría válida para eliminar.');
    }
  }

  actualizarCategoria(): void {
    if (this.categoriaSeleccionada) {
      const categoriaIndex = this.categorias.findIndex(cat => cat === this.categoriaSeleccionada);
      if (categoriaIndex !== -1) {
        alert('Categoría actualizada: ' + this.categoriaSeleccionada);
      }
      this.categoriaSeleccionada = ''; // Limpia el campo
    } else {
      alert('Escribe o selecciona una categoría válida.');
    }
  }

  volverAlModalPrincipal(): void {
    this.cerrarEditarCategoriaModal(); // Cierra el modal de editar categoría
    this.cerrarAgregarCategoriaModal();
    this.mostrarModal = true; // Reabre el modal principal
  }

  abrirAgregarCategoriaModal(): void {
    this.cerrarModal();
    this.mostrarAgregarCategoriaModal = true;
  }

  cerrarAgregarCategoriaModal(): void {
    this.mostrarAgregarCategoriaModal = false;
    this.nuevaCategoria = ''; // Limpia el campo al cerrar
  }

  adjuntarCategoria(): void {
    if (this.nuevaCategoria.trim()) {
      this.categorias.push(this.nuevaCategoria.trim());
      alert(`Categoría "${this.nuevaCategoria}" agregada con éxito.`);
      this.cerrarAgregarCategoriaModal(); // Cierra el modal tras agregar
    } else {
      alert('El nombre de la categoría no puede estar vacío.');
    }
  }

}
