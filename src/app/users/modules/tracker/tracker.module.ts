import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackerRoutingModule } from './tracker-routing.module';
import {RouterLink} from "@angular/router";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrackerRoutingModule,
    RouterLink
  ]
})
export class TrackerModule { }
