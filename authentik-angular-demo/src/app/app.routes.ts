import { Routes } from '@angular/router';
import { NeedsPermissionComponent } from './needs-permission/needs-permission.component';
import { canActivateChildWithPermission, canActivateWithAuth } from '../auth/auth.guard';
import { Permission } from '../auth/user.entity';
import { HomeComponent } from './home.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AuthCallbackComponent } from '../auth/components/callback/auth-callback.component';
import { AuthLogin } from '../auth/components/login/auth-login.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'needs-permission',
    title: 'Needs Permission',
    component: NeedsPermissionComponent,
    canActivate: [canActivateWithAuth, canActivateChildWithPermission([Permission.ReadTitleDetails])],
  },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: '/error/404', pathMatch: 'full' },
      {
        path: 'login',
        component: AuthLogin,
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
