import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, HTTP_INTERCEPTORS, withFetch } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { provideRouter, Routes } from '@angular/router';
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // provideHttpClient(withFetch()),
    // OAuthService,
    provideOAuthClient(),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
