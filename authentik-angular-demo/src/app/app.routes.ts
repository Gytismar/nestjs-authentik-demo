import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NeedsPermissionComponent } from './needs-permission/needs-permission.component';
import { canActivateWithAuth } from '../auth/auth.guard';

export const routes: Routes = [
  {
    path: 'needs-permission',
    component: NeedsPermissionComponent,
    canActivate: [canActivateWithAuth],
  },
  { path: '**', redirectTo: '' },
];
