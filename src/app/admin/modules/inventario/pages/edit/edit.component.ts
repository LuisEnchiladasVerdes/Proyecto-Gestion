import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../../../../../services/item.service';
import { MueblesService } from '../../../../../services/muebles.service';
import { Categoria } from '../../../../../models/categoria.models';
import { Item } from '../../../../../models/item.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    RouterLink
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  item: Item = {
    id: 0,
    name: '',
    categoria: 0,
    desc: '',
    stock: 0
  }; // Definimos un item vacío para inicializar

  formValid = {
    name: true,
    categoria: true,
    stock: true
  };

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener el id del item desde la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarItem(id);
    }
  }

  cargarItem(id: string): void {
    this.itemService.getItemById(id).subscribe(
      (item: Item) => {
        this.item = item; // Asignamos los datos del item
      },
      (error: any) => {
        console.error('Error al cargar el item', error);
      }
    );
  }

  validarFormulario(): boolean {
    let valid = true;
    // Verificar cada campo
    if (!this.item.name) {
      this.formValid.name = false;
      valid = false;
    }
    if (this.item.categoria === 0) {
      this.formValid.categoria = false;
      valid = false;
    }
    if (this.item.stock <= 0) {
      this.formValid.stock = false;
      valid = false;
    }
    return valid;
  }

  guardarCambios(): void {
    // this.itemService.updateItem(this.item).subscribe(
    //   (response) => {
    //     alert('Producto editado correctamente');
    //     this.router.navigate(['/admin/inventario/general']); // Redirigir al listado de items después de guardar
    //   },
    //   (error) => {
    //     console.error('Error al guardar los cambios', error);
    //   }
    // );
    if (this.validarFormulario()) {
      this.itemService.updateItem(this.item).subscribe(
        (response) => {
          alert('Producto editado correctamente');
          this.router.navigate(['/admin/inventario/general']); // Redirigir al listado de items después de guardar
        },
        (error) => {
          console.error('Error al guardar los cambios', error);
        }
      );
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }



}
