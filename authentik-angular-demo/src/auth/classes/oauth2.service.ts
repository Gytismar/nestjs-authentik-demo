import { Router } from '@angular/router';
import { AuthConfig, OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  of,
  from,
} from 'rxjs';
import { AuthService, LoginOptions } from '../auth.service';
import { User } from '../user.entity';

export interface OAuth2ServiceConfig {
  /**
   * Example: `http://localhost/application/o/myapp/`
   */
  issuerUri: string;
  /**
   * Examples: `http://localhost:4200/`, `http://localhost:4200/auth/callback`
   */
  redirectUri: string;
  /**
   * Example: `xSa5s_SOME_CLIENT_ID_XaWwqZ3s31aSdWWws`
   */
  clientId: string;
  /**
   * Example: `code`
   */
  responseType: string;
  /**
   * Example: `openid profile email offline_access`
   */
  scope: string;
  /**
   * Default: `false`
   */
  useDebugLogging?: boolean;
  /**
   * Default: `/`
   */
  defaultLoginRedirectTo?: string;
  /**
   * Default: `/auth/login`
   */
  loginLoadingRoutePath?: string;
  /**
   * Default: `/auth/callback`
   */
  authCallbackRoutePath?: string;
  /**
   * Function that maps claims in the token to a User object
   */
  claimsToUserMapper: (claims: Record<string, any>) => User;
}

export class OAuth2Service implements AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isReadySubject = new BehaviorSubject<boolean>(false);
  private readonly config: Required<OAuth2ServiceConfig>;

  constructor(
    oAuth2Config: OAuth2ServiceConfig,
    private readonly router: Router,
    private readonly oauthService: OAuthService
  ) {
    console.log('OAuth2Service instance created');

    this.config = {
      ...oAuth2Config,
      useDebugLogging: oAuth2Config.useDebugLogging ?? false,
      defaultLoginRedirectTo: oAuth2Config.defaultLoginRedirectTo ?? '/',
      loginLoadingRoutePath:
        oAuth2Config.loginLoadingRoutePath ?? '/auth/login',
      authCallbackRoutePath:
        oAuth2Config.authCallbackRoutePath ?? '/auth/callback',
    };

    this.configureOAuth(
      {
        issuer: oAuth2Config.issuerUri,
        redirectUri: oAuth2Config.redirectUri,
        clientId: oAuth2Config.clientId,
        responseType: oAuth2Config.responseType,
        scope: oAuth2Config.scope,
        showDebugInformation: oAuth2Config.useDebugLogging,
        strictDiscoveryDocumentValidation: false,
        oidc: true,
        checkOrigin: false,
      },
      this.handleOAuthEvent.bind(this)
    );
  }

  private configureOAuth(
    config: AuthConfig,
    oauth2EventHandler: (event: OAuthEvent) => void
  ) {
    this.oauthService.events.subscribe(oauth2EventHandler);

    this.oauthService.configure(config);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.setupAutomaticSilentRefresh();
    this.updateCurrentUser();
  }

  private handleOAuthEvent(event: OAuthEvent) {
    console.log('OAuth event', event);

    switch (event.type) {
      case 'discovery_document_load_error':
        this.isReadySubject.next(false);
        break;
      case 'discovery_document_loaded':
        this.isReadySubject.next(true);
        this.updateCurrentUser();
        break;
      case 'token_received':
        this.updateCurrentUser();
        break;
      case 'token_refreshed':
        this.updateCurrentUser();
        this.handleTokenRefreshed();
        break;
      case 'token_refresh_error':
        this.handleTokenRefreshError();
        break;
    }
  }

  private handleTokenRefreshed() {
    if (this.isAtCallbackRoute()) {
      if (this.oauthService.state) {
        const { returnTo } = this.decodeStateFromURIandBase64<{
          returnTo: string;
        }>(this.oauthService.state);

        this.router.navigate([returnTo]);
      } else {
        this.router.navigate([this.config.defaultLoginRedirectTo]);
      }
    }
  }

  private handleTokenRefreshError() {
    if (this.isAtCallbackRoute()) {
      this.router.navigate([this.config.defaultLoginRedirectTo]);
    }
  }

  private isAtCallbackRoute(): boolean {
    return this.router.url.startsWith(this.config.authCallbackRoutePath);
  }

  public isReady(timeoutMs?: number): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      const subscription = this.isReadySubject.subscribe((ready) => {
        if (ready) {
          subscriber.next(true);
          subscriber.complete();
        }
      });

      let timeoutId: any;
      if (timeoutMs != null && timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          subscriber.next(false);
          subscriber.complete();
        }, timeoutMs);
      }

      return () => {
        subscription.unsubscribe();
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    });
  }

  public get user(): Observable<User | null> {
    return this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  }

  public get type(): string {
    return 'OAuth2';
  }

  public login(options?: LoginOptions): Observable<void> {
    const returnTo = options?.returnTo;

    let additionalState: string | undefined;
    if (returnTo) {
      additionalState = this.encodeStateToBase64({ returnTo });
    }

    this.oauthService.initCodeFlow(additionalState);

    this.router.navigate([this.config.loginLoadingRoutePath]);

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

  private encodeStateToBase64<T>(state: T): string {
    const encodedString = btoa(JSON.stringify(state));
    return encodedString;
  }

  private decodeStateFromURIandBase64<T>(encodedState: string): T {
    console.log('encodedState', encodedState);
    const urlDecodedString = decodeURIComponent(encodedState);
    console.log('urlDecodedString', urlDecodedString);
    const decodedObj = JSON.parse(atob(urlDecodedString)) as T;
    console.log('decodedObj', decodedObj);
    return decodedObj;
  }

  private updateCurrentUser() {
    const claims = this.oauthService.getIdentityClaims();

    if (!claims) {
      this.currentUserSubject.next(null);

      return;
    }

    const user = this.config.claimsToUserMapper(claims);

    this.currentUserSubject.next(user);
  }
}
