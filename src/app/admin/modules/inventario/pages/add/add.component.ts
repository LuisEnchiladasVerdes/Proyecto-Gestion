import { Component } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import { MueblesService } from '../../../../../services/muebles.service';
import { Categoria } from '../../../../../models/categoria.models';
import { Item } from '../../../../../models/item.model';
import { ItemService } from '../../../../../services/item.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    RouterLink
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {

  categorias: any[] = []; // Array para almacenar las categorías
  selectedCategory: number | null = null; // Para almacenar la categoría seleccionada

  nameError = '';
  categoryError = '';
  quantityError = '';
  descriptionError = '';
  imageError = '';

  // constructor(private mueblesService : MueblesService) {}
  constructor(private itemService : ItemService, private mueblesService : MueblesService) {}

  validateName() {
    const nameInput = (document.getElementById('name') as HTMLInputElement).value;
    this.nameError = /^[^0-9]+$/.test(nameInput) ? '' : 'El nombre no debe contener números';
  }

  validateQuantity() {
    const quantityInput = (document.getElementById('quantity') as HTMLInputElement).value;
    this.quantityError = +quantityInput > 0 ? '' : 'La cantidad debe ser mayor que 0';
  }

  validateDescription() {
    const descriptionInput = (document.getElementById('description') as HTMLTextAreaElement).value;
    this.descriptionError = descriptionInput ? '' : 'La descripción no debe estar vacía';
  }

  validateImage() {
    const imageInput = (document.getElementById('file-upload') as HTMLInputElement).files;
    this.imageError = imageInput && imageInput.length > 0 ? '' : 'Se debe seleccionar una imagen';
  }

  onSaveItem(event: Event) {
    event.preventDefault(); // Evita la recarga de la página

    // Ejecuta todas las validaciones
    this.validateName();
    this.validateCategory();
    this.validateQuantity();
    this.validateDescription();
    this.validateImage();

    // Si no hay errores, muestra el mensaje de éxito                         && !this.imageError
    if (!this.nameError && !this.categoryError && !this.quantityError && !this.descriptionError ) {
      const nuevoItem: Item = {
        name: (document.getElementById('name') as HTMLInputElement).value,
        stock: +(document.getElementById('quantity') as HTMLInputElement).value,
        desc: (document.getElementById('description') as HTMLTextAreaElement).value,
        // imagenUrl: 'url_de_imagen', // Actualiza esto según la carga de imagen que desees implementar
        categoria: this.selectedCategory as number // Solo el ID de la categoría
      };
      
      this.itemService.addItem(nuevoItem).subscribe(
        (response) => {
          alert('Producto agregado correctamente');
        },
        (error) => {
          console.error('Error al agregar el mueble', error);
        }
      );
      this.limpiarCampos();
    }
  }


  ngOnInit(): void {
    // Obtener las categorías desde el servicio
    this.mueblesService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
        console.log(this.categorias); // Verificar los datos
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
      }
    );
  }

  validateCategory(): void {
    if (!this.selectedCategory) {
      this.categoryError = 'Por favor selecciona una categoría';
    } else {
      this.categoryError = '';
    }
  }

  limpiarCampos() {
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('quantity') as HTMLInputElement).value = '';
    (document.getElementById('description') as HTMLTextAreaElement).value = '';
    (document.getElementById('file-upload') as HTMLInputElement).value = '';
    this.selectedCategory = null;

    this.nameError = '';
    this.categoryError = '';
    this.quantityError = '';
    this.descriptionError = '';
    this.imageError = '';
  }

}
