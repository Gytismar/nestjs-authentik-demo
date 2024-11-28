import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { User } from './user.entity';
import { Router } from '@angular/router';
import { AuthServiceFactory } from './classes/auth-service.factory';
import { ClaimsToUserMapper } from './mappings/claims-to-user.mapper';

export interface LoginOptions {
  returnTo?: string;
}

@Injectable({
  providedIn: 'root',
  useFactory: (router: Router, oauthService: OAuthService) =>
    AuthServiceFactory.makeOAuth2(
      {
        clientId: 'NIC1m9rgpXsmX4jXaC13qFAsIaMFv2TmQxSrgLsF',
        issuerUri: 'http://localhost/application/o/netix/',
        redirectUri: window.location.origin + '/auth/callback',
        responseType: 'code',
        scope: 'openid profile email offline_access',
        authCallbackRoutePath: '/auth/callback',
        defaultLoginRedirectTo: '/',
        loginLoadingRoutePath: '/auth/login',
        useDebugLogging: true,
        claimsToUserMapper: (claims) =>
          ClaimsToUserMapper.mapAuthentikClaimsToUser(claims),
      },
      router,
      oauthService
    ),
  deps: [Router, OAuthService],
})
export abstract class AuthService {
  public abstract isReady(timeoutMs?: number): Observable<boolean>;
  public abstract get user(): Observable<User | null>;
  public abstract get type(): string;
  public abstract login(options?: LoginOptions): Observable<void>;
  public abstract logout(): Observable<void>;
}
