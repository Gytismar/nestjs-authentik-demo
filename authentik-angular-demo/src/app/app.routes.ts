import { Routes } from '@angular/router';
import { NeedsPermissionComponent } from './needs-permission/needs-permission.component';
import {
  canActivateWithAuth,
  canActivateWithPermission,
} from '../auth/auth.guard';
import { Permission } from '../auth/user.entity';
import { HomeComponent } from './home.component';
import { ErrorPageComponent } from './error-page/error-page.component';

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
