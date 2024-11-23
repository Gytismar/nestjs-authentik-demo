import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NeedsPermissionComponent } from './needs-permission/needs-permission.component';
import { canActivateChildWithPermission, canActivateWithAuth } from '../auth/auth.guard';
import { Permission } from '../auth/user.entity';

export const routes: Routes = [
  {
    path: 'needs-permission',
    component: NeedsPermissionComponent,
    canActivate: [canActivateWithAuth, canActivateChildWithPermission([Permission.ReadTitleDetails])],
  },
  { path: '**', redirectTo: '' },
];
