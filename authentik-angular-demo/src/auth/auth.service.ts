import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }

  private configureOAuth() {
    const authConfig: AuthConfig = {
      issuer: '<AUTHENTIK_ISSUER_URL>',
      redirectUri: window.location.origin + '/auth/callback',
      clientId: '<CLIENT_ID>',
      responseType: 'code',
      scope: 'openid profile email',
    };

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
}
