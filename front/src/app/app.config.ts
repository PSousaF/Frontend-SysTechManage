import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './components/service/AuthInterceptor';

import { AuthenticationService } from './components/service/AuthenticationService';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTasks, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from './components/service/ModalService';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    
    provideAnimations(),
    provideAnimationsAsync(),
    AuthenticationService,
    ModalService,
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        library.addIcons(faTasks, faUser, faCog);
        return library;
      }
    }
  ]
};