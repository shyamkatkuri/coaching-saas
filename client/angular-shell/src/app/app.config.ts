import {
  ApplicationConfig, provideBrowserGlobalErrorListeners, inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  AuthService,
} from './core/auth/auth.service';

import {
  authInterceptor,
} from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
    ),

    provideHttpClient(
      withInterceptors([
        authInterceptor,
      ]),
    ),

    provideAppInitializer(
      () => {
        const auth =
          inject(AuthService);

        return auth.initialize();
      },
    ),
  ]
};
