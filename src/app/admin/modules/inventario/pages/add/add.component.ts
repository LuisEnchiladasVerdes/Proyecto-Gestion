import { Component, signal } from '@angular/core';
import { NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Categoria } from '../../../../../models/categoria.models';
import { CategoriaService } from "../../../../../services/categoria.service";
import { ProductoService } from "../../../../../services/producto.service";
import {Producto} from "../../../../../models/producto.models";

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  producto: Producto = {
    id: 0,
    nombre: '',
    categoria: { id: 0, nombre: '' },
    descripcion: '',
    stock: 0,
    precio_actual: 0,
    precio: 0,
    media_relacionado: []
  };

  categorias: Categoria[] = [];
  selectedCategory: number | null = null;

  nameError = '';
  categoryError = '';
  quantityError = '';
  descriptionError = '';
  precioError = '';
  imageError = '';

  selectedImage: File | null = null;
  imageUrl = signal<string | null>(null);

  constructor(
    private categoriasService: CategoriaService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (data: Categoria[]) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl.set(reader.result as string);
        this.selectedImage = file;
      };

      reader.readAsDataURL(file);
    }
  }

  validateName(): void {
    this.nameError = this.producto.nombre.trim()
      ? /^[^0-9]+$/.test(this.producto.nombre)
        ? ''
        : 'El nombre no debe contener números'
      : 'El nombre es obligatorio';
  }

  validateCategory(): void {
    this.categoryError = this.selectedCategory
      ? ''
      : 'Por favor selecciona una categoría';
  }

  validateQuantity(): void {
    this.quantityError = this.producto.stock > 0
      ? ''
      : 'La cantidad debe ser mayor que 0';
  }

  validateDescription(): void {
    this.descriptionError = this.producto.descripcion.trim()
      ? ''
      : 'La descripción no debe estar vacía';
  }

  validatePrecio(): void {
    this.precioError = this.producto.precio > 0
      ? ''
      : 'El precio debe ser mayor que 0.';
  }


  validateImage(): void {
    this.imageError = this.selectedImage ? '' : 'Se debe seleccionar una imagen';
  }

  onSaveItem(event: Event): void {
    event.preventDefault();

    this.validateName();
    this.validateCategory();
    this.validateQuantity();
    this.validateDescription();
    this.validateImage();


    this.agregarProducto();

  }

  agregarProducto(): void {
    if (this.validarFormulario()) {
      const formData = new FormData();

      // Asignar categoria_id desde selectedCategory
      this.producto.categoria_id = this.selectedCategory!;

      // Agregar campos al FormData
      formData.append('nombre', this.producto.nombre);
      formData.append('descripcion', this.producto.descripcion);
      formData.append('stock', this.producto.stock.toString());
      formData.append('precio', this.producto.precio.toString());
      formData.append('categoria_id', this.producto.categoria_id.toString());

      // Agregar imagen (o imágenes)
      if (this.selectedImage) {
        formData.append('media', this.selectedImage);
      }

      // Enviar datos al servicio
      this.productoService.addProducto(formData).subscribe({
        next: (response) => {
          alert('Producto creado exitosamente.');
          this.resetForm();
        },
        error: (err) => {
          console.error('Error al crear el producto', err);
          alert('Hubo un error al crear el producto.');
        }
      });
    } else {
      alert('Por favor, completa todos los campos obligatorios.');
    }
  }


  validarFormulario(): boolean {
    console.log('Validando formulario:');
    console.log('Nombre:', this.producto.nombre);
    console.log('Descripción:', this.producto.descripcion);
    console.log('Stock:', this.producto.stock);
    console.log('Precio:', this.producto.precio);
    console.log('Categoría:', this.selectedCategory);
    console.log('Imagen seleccionada:', this.selectedImage);

    let valid = true;

    if (!this.producto.nombre.trim()) {
      this.nameError = 'El nombre es obligatorio.';
      valid = false;
    } else {
      this.nameError = '';
    }

    if (!this.producto.descripcion.trim()) {
      this.descriptionError = 'La descripción es obligatoria.';
      valid = false;
    } else {
      this.descriptionError = '';
    }

    if (this.producto.stock <= 0) {
      this.quantityError = 'El stock debe ser mayor que 0.';
      valid = false;
    } else {
      this.quantityError = '';
    }

    if (this.producto.precio <= 0) {
      this.precioError = 'El precio debe ser mayor que 0.';
      valid = false;
    } else {
      this.precioError = '';
    }

    if (!this.selectedCategory) {
      this.categoryError = 'Por favor selecciona una categoría.';
      valid = false;
    } else {
      this.categoryError = '';
    }

    if (!this.selectedImage) {
      this.imageError = 'Se debe seleccionar al menos una imagen.';
      valid = false;
    } else {
      this.imageError = '';
    }

    console.log('Formulario válido:', valid);
    return valid;
  }



  resetForm(): void {
    this.producto = {
      id: 0,
      nombre: '',
      categoria: { id: 0, nombre: '' },
      descripcion: '',
      stock: 0,
      precio_actual: 0,
      precio: 0,
      media_relacionado: []
    };
    this.selectedCategory = null;
    this.imageUrl.set(null);
    this.nameError = '';
    this.categoryError = '';
    this.quantityError = '';
    this.descriptionError = '';
    this.imageError = '';
  }
}
