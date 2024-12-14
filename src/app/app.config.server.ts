import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { appConfig } from './app.config';
import { AuthInterceptor } from './services/auth.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
