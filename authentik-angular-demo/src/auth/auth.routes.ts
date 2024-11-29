import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { AuthService } from './auth.service';
import { FakeAuthService } from './classes/fake-auth.service';
import { OAuth2Service } from './classes/oauth2.service';
import { AuthCallbackComponent } from './components/callback/auth-callback.component';
import { FakeLogin } from './components/login/fake-login.component';
import { OAuth2Login } from './components/login/oauth2-login.component';

export const authRoute: Route = {
  path: 'auth',
  children: [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
      path: 'login',
      redirectTo: () => `/auth/login-${inject(AuthService).type.toLowerCase()}`,
    },
    {
      path: 'login-' + OAuth2Service.getType().toLowerCase(),
      pathMatch: 'full',
      component: OAuth2Login,
    },
    {
      path: 'login-' + FakeAuthService.getType().toLowerCase(),
      pathMatch: 'full',
      component: FakeLogin,
    },
    {
      path: 'callback',
      component: AuthCallbackComponent,
    },
  ],
};
