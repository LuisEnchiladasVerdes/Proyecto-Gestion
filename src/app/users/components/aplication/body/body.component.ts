import { Component } from '@angular/core';
import {ImageCarouselComponent} from "../../common/image-carousel/image-carousel.component";

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [
    ImageCarouselComponent
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

}
