import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import {ToastrModule} from "ngx-toastr";

// bootstrapApplication(AppComponent, {
//   ...appConfig,
//   providers: [
//     ...(appConfig.providers || []),
//     importProvidersFrom(BrowserAnimationsModule)
//   ]
// })
//   .catch((err) => console.error(err));




bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(
      BrowserAnimationsModule, // Para animaciones de ngx-toastr
      ToastrModule.forRoot({
        timeOut: 1000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        progressBar: true,
        closeButton: true,
      })
    )
  ]
}).catch((err) => console.error(err));
