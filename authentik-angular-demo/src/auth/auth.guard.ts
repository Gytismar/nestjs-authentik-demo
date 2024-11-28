import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
} from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';
import { Permission, Role } from './user.entity';

const AUTH_TIMEOUT = 5000;

export const canActivateWithAuth: CanActivateFn = (
  _route,
  state
): Observable<boolean> | boolean => {
  const auth = inject(AuthService);

  return auth.isReady(AUTH_TIMEOUT).pipe(
    switchMap((isReady) => {
      if (!isReady) {
        return of(false);
      }

      return auth.user.pipe(
        take(1),
        map((user) => {
          if (user) {
            return true;
          } else {
            auth.login({ returnTo: state.url });
            return false;
          }
        })
      );
    })
  );
};

export const canActivateWithRole: (allowedRoles: Role[]) => CanActivateFn =
  (allowedRoles) => (_route: ActivatedRouteSnapshot) => {
    console.log('called canActivateWithRole');

    const auth = inject(AuthService);
    const router = inject(Router);

    // return auth.user.pipe(
    //   take(1),
    //   map((user) => {
    //     if (user?.roles.some(role => allowedRoles.includes(role))) {
    //       return true;
    //     } else {
    //       router.navigate(['/error/403']);
    //       return false;
    //     }
    //   })
    // );
    return auth.isReady(AUTH_TIMEOUT).pipe(
      switchMap((isReady) => {
        if (!isReady) {
          return of(false);
        }

        return auth.user.pipe(
          take(1),
          map((user) => {
            if (user?.roles.some((role) => allowedRoles.includes(role))) {
              return true;
            } else {
              router.navigate(['/error/403']);
              return false;
            }
          })
        );
      })
    );
  };

export const canActivateWithPermission: (
  requiredPermissions: Permission[]
) => CanActivateFn =
  (requiredPermissions) => (_route: ActivatedRouteSnapshot) => {
    console.log('called canActivateWithPermission');

    const auth = inject(AuthService);
    const router = inject(Router);

    // return auth.user.pipe(
    //   take(1),
    //   map((user) => {
    //     if (
    //       user &&
    //       requiredPermissions.every((permission) =>
    //         user.hasPermission(permission)
    //       )
    //     ) {
    //       return true;
    //     } else {
    //       console.log(
    //         'User does not have permission, redirecting to /error/403'
    //       );
    //       router.navigate(['/error/403']);
    //       return false;
    //     }
    //   })
    // );

    return auth.isReady(AUTH_TIMEOUT).pipe(
      switchMap((isReady) => {
        if (!isReady) {
          return of(false);
        }

        return auth.user.pipe(
          take(1),
          map((user) => {
            if (
              user &&
              requiredPermissions.every((permission) =>
                user.hasPermission(permission)
              )
            ) {
              return true;
            } else {
              console.log(
                'User does not have permission, redirecting to /error/403'
              );
              router.navigate(['/error/403']);
              return false;
            }
          })
        );
      })
    );
  };

export const canActivateChildWithAuth: CanActivateChildFn = canActivateWithAuth;

export const canActivateChildWithRole: (
  allowedRoles: Role[]
) => CanActivateChildFn = (allowedRoles) => {
  return (route, state) => canActivateWithRole(allowedRoles)(route, state);
};

export const canActivateChildWithPermission: (
  requiredPermissions: Permission[]
) => CanActivateChildFn = (requiredPermissions) => {
  return (route, state) =>
    canActivateWithPermission(requiredPermissions)(route, state);
};
