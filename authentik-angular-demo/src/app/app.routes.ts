import { Routes } from '@angular/router';
import { NeedsPermissionComponent } from './needs-permission/needs-permission.component';
import {
  canActivateWithAuth,
  canActivateWithPermission,
} from '../auth/auth.guard';
import { Permission } from '../auth/user.entity';
import { HomeComponent } from './home.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AuthCallbackComponent } from '../auth/components/callback/auth-callback.component';
import { OAuth2Login } from '../auth/components/login/oauth2-login.component';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { OAuth2Service } from '../auth/classes/oauth2.service';
import { FakeLogin } from '../auth/components/login/fake-login.component';
import { FakeAuthService } from '../auth/classes/fake-auth.service';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'needs-permission',
    title: 'Needs Permission',
    component: NeedsPermissionComponent,
    canActivate: [
      canActivateWithAuth,
      canActivateWithPermission([Permission.ReadTitleDetails]),
    ],
  },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: '/error/404', pathMatch: 'full' },
      {
        path: 'login',
        redirectTo: () =>
          `/auth/login-${inject(AuthService).type.toLowerCase()}`,
      },
      {
        path: 'login-' + OAuth2Service.getType().toLowerCase(),
        component: OAuth2Login,
      },
      {
        path: 'login-' + FakeAuthService.getType().toLowerCase(),
        component: FakeLogin,
      },
      {
        path: 'callback',
        component: AuthCallbackComponent,
      },
    ],
  },
  {
    path: 'error',
    children: [
      { path: '', redirectTo: '/error/404', pathMatch: 'full' },
      {
        path: '403',
        component: ErrorPageComponent,
        data: {
          title: '403 Forbidden',
          errorCode: 403,
          errorMessage: 'Forbidden',
          infoMessage: 'Access to this resource is forbidden.',
          redirectAfter: 1000,
          redirectTo: '/',
        },
      },
      {
        path: '404',
        component: ErrorPageComponent,
        data: {
          title: '404 Not Found',
          errorCode: 404,
          errorMessage: 'Not Found',
          infoMessage: 'The requested resource was not found.',
          redirectAfter: 2000,
          redirectTo: '/',
        },
      },
    ],
  },
  { path: '**', redirectTo: '/error/404' },
];
