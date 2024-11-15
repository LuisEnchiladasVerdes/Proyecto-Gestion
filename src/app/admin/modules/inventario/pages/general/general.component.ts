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

  items: Item[] = []; // Definir un arreglo para los items
  // firstItemName: string | null = null;

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

}
