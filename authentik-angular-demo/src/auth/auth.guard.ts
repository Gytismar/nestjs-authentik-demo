import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";
import { Permission, Role } from "./user.entity";

export const canActivateWithAuth: CanActivateFn = (route, state): Observable<boolean> | boolean => {
  const auth = inject(AuthService);

  // TODO: remove these console.log statements
  console.log('[canActivateWithAuth] route.url', route.url);
  console.log('[canActivateWithAuth] state.url', state.url);
  
  return auth.user.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        auth.login({ returnTo: state.url});
        return false;
      }
    })
  );
};

export const canActivateWithRole: (
  allowedRoles: Role[]
) => CanActivateFn = (allowedRoles) => (_route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user.pipe(
    take(1),
    map((user) => {
      if (user?.roles.some(role => allowedRoles.includes(role))) {
        return true;
      } else {
        router.navigate(['/error/403']);
        return false;
      }
    })
  );
};

export const canActivateWithPermission: (
  requiredPermissions: Permission[]
) => CanActivateFn = (requiredPermissions) => (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user.pipe(
    take(1),
    map((user) => {
      if (user && requiredPermissions.every(permission => user.hasPermission(permission))) {
        return true;
      } else {
        router.navigate(['/error/403']);
        return false;
      }
    })
  );
};

export const canActivateChildWithAuth: CanActivateChildFn = canActivateWithAuth;

export const canActivateChildWithRole: (allowedRoles: Role[]) => CanActivateChildFn = (allowedRoles) => {
  return (route, state) => canActivateWithRole(allowedRoles)(route, state);
};

export const canActivateChildWithPermission: (
  requiredPermissions: Permission[]
) => CanActivateChildFn = (requiredPermissions) => {
  return (route, state) => canActivateWithPermission(requiredPermissions)(route, state);
};