import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorFn } from '../auth/auth.interceptor';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authRoute } from '../auth/auth.routes';
import { authProviders } from '../auth/auth.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    ...authProviders,
    provideRouter([authRoute, ...routes]),
    provideHttpClient(withInterceptors([authInterceptorFn])),
  ],
};
