import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgFor, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    RouterLink
  ],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent {
  nameError = '';
  quantityError = '';
  descriptionError = '';
  imageError = '';

  // constructor(private mueblesService : MueblesService) {}
  // constructor(private itemService : ItemService) {}

  validateName() {
    const nameInput = (document.getElementById('name') as HTMLInputElement).value;
    this.nameError = /^[^0-9]+$/.test(nameInput) ? '' : 'El nombre no debe contener números';
  }

  validateDescription() {
    const descriptionInput = (document.getElementById('description') as HTMLTextAreaElement).value;
    this.descriptionError = descriptionInput ? '' : 'La descripción no debe estar vacía';
  }

  validateImage() {
    const imageInput = (document.getElementById('file-upload') as HTMLInputElement).files;
    this.imageError = imageInput && imageInput.length > 0 ? '' : 'Se debe seleccionar una imagen';
  }

  limpiarCampos() {
    // (document.getElementById('name') as HTMLInputElement).value = '';
    // (document.getElementById('quantity') as HTMLInputElement).value = '';
    // (document.getElementById('description') as HTMLTextAreaElement).value = '';
    // (document.getElementById('file-upload') as HTMLInputElement).value = '';
    //
    // this.nameError = '';
    // this.descriptionError = '';
    // this.imageError = '';
  }

  onSaveItem(event: Event) {
    event.preventDefault(); // Evita la recarga de la página

    // Ejecuta todas las validaciones
    this.validateName();
    this.validateDescription();
    this.validateImage();

    // Si no hay errores, muestra el mensaje de éxito                         && !this.imageError
    if (!this.nameError && !this.descriptionError) {

      alert('Item agregado');


      this.limpiarCampos();
    }


  }


}
