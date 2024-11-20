import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'http://localhost/application/o/netix/', /*AUTHENTIK_ISSUER_URL */
  redirectUri: window.location.origin + '/', /* or 'http://localhost:4200/' */
  clientId: 'NIC1m9rgpXsmX4jXaC13qFAsIaMFv2TmQxSrgLsF', /* AUTHENTIK_CLIENT_ID */
  responseType: 'code',
  scope: 'openid profile email', /* what to ask for from AUTHENTIK */
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  oidc: true,
  checkOrigin: false,
};

// export enum UserRole {
//   Viewer = 'viewer',
//   Manager = 'manager',
// }
// export interface User {
//   username: string;
//   email: string;
//   roles: UserRole[];
// }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }

  private configureOAuth() {
    this.oauthService.events.subscribe({
      next: (event) => {
        console.log('OAuth event', event);
        switch (event.type) {
          case 'token_received':
          case 'token_refreshed':
            /* Do nothing for now */
            break;
        }
      },
    });
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  get token() {
    return this.oauthService.getAccessToken();
  }

  get username() {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? claims['preferred_username'] : null;
  }
}
