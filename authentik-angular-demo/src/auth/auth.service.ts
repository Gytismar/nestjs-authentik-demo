import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import {
  BehaviorSubject,
  distinctUntilChanged,
  from,
  Observable,
  of,
} from 'rxjs';
import {
  hasPermission,
  Permission,
  PermissionStrings,
  Role,
  User,
} from './user.entity';

const authConfig: AuthConfig = {
  issuer: 'http://localhost/application/o/netix/' /*AUTHENTIK_ISSUER_URL */,
  redirectUri: window.location.origin + '/' /* or 'http://localhost:4200/' */,
  clientId:
    'NIC1m9rgpXsmX4jXaC13qFAsIaMFv2TmQxSrgLsF' /* AUTHENTIK_CLIENT_ID */,
  responseType: 'code',
  scope:
    'openid profile email offline_access' /* what to ask for from AUTHENTIK */,
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  oidc: true,
  checkOrigin: false,
  // useSilentRefresh: true,
  // silentRefreshShowIFrame: true
};

@Injectable({
  providedIn: 'root',
})
export class OAuth2Service implements AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public get user(): Observable<User | null> {
    return this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  }

  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }

  private configureOAuth() {
    this.oauthService.events.subscribe({
      next: (event) => {
        console.log('OAuth event', event);
        switch (event.type) {
          case 'discovery_document_loaded':
          case 'token_received':
          case 'token_refreshed':
            this.updateCurrentUser();
            break;
        }
      },
    });
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.setupAutomaticSilentRefresh();
    this.updateCurrentUser();
  }

  public login(): Observable<void> {
    // this.oauthService.initImplicitFlow();
    this.oauthService.initCodeFlow();

    return of();
  }

  public logout(): Observable<void> {
    const logoutPromise = this.oauthService.revokeTokenAndLogout(
      {
        client_id: this.oauthService.clientId,
        returnTo: this.oauthService.redirectUri,
      },
      true
    );

    return from(logoutPromise);
  }

  public hasPermission(permission: Permission): boolean {
    const user = this.currentUserSubject.value;

    return user ? hasPermission(user, permission) : false;
  }

  public getAuthType(): string {
    return 'OAuth2';
  }

  private updateCurrentUser() {
    const claims = this.oauthService.getIdentityClaims();

    if (!claims) {
      this.currentUserSubject.next(null);

      return;
    }

    const sub = claims['sub'];
    const username = claims['preferred_username'];
    const email = claims['email'];
    const groups = claims['groups'];
    const roles = claims['roles'];

    if (
      !sub ||
      typeof sub !== 'string' ||
      !username ||
      typeof username !== 'string' ||
      !email ||
      typeof email !== 'string' ||
      !groups ||
      !Array.isArray(groups)
    ) {
      throw new Error('Invalid claims');
    }

    const user: User = {
      id: sub,
      username: username,
      email: email,
      roles: roles ?? this.mapGroupsToRoles(groups),
      hasPermission: (permission: Permission | PermissionStrings) =>
        hasPermission(user, permission),
    };

    this.currentUserSubject.next(user);
  }

  private mapGroupsToRoles(groups: string[]): Role[] {
    const groupToRoleTable: Record<string, Role> = {
      NetixUsers: Role.Viewer,
      NetixManagers: Role.Manager,
    };

    const roles = groups
      .filter((group) => groupToRoleTable.hasOwnProperty(group))
      .map((group) => groupToRoleTable[group]);

    return Array.from(new Set(roles));
  }
}

@Injectable({
  providedIn: 'root',
  // useClass: AuthService,
  // useFactory: (oauthService: OAuthService) => new AuthService(oauthService),
  // deps: [OAuthService],
  useExisting: OAuth2Service,
})
export abstract class AuthService {
  public abstract login(): Observable<void>;
  public abstract logout(): Observable<void>;
  public abstract get user(): Observable<User | null>;
  public abstract hasPermission(permission: Permission): boolean;
  public abstract getAuthType(): string;
}
