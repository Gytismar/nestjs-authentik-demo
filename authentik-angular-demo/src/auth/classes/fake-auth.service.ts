import { BehaviorSubject, Observable, of, switchMap, timer } from 'rxjs';
import { AuthService, LoginOptions } from '../auth.service';
import { User, Role } from '../user.entity';
import { Router } from '@angular/router';

export interface FakeAuthServiceConfig {
  user?: User;
  isReady?: boolean;
  loggedIn?: boolean;
}

export class FakeAuthService implements AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isReadySubject = new BehaviorSubject<boolean>(true);

  constructor(
    private config: FakeAuthServiceConfig,
    private readonly router: Router
  ) {
    if (!config.user) {
      config.user = {
        id: 'fake-user-id',
        username: 'fake-username',
        email: 'fakeuser@mail.mail',
        roles: [Role.Manager],
        hasPermission: (_) => true,
      };
    }

    if (config.loggedIn) {
      this.currentUserSubject.next(config.user);
    }

    this.isReadySubject.next(config.isReady ?? true);
  }

  public isReady(timeoutMs?: number): Observable<boolean> {
    return this.isReadySubject.asObservable();
  }

  public get user(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  public get type() {
    return FakeAuthService.getType();
  }

  public static getType(): 'fake' {
    return 'fake';
  }

  public login(options?: LoginOptions): Observable<void> {
    return timer(500).pipe(
      switchMap(() => {
        if (this.config.user) {
          this.currentUserSubject.next(this.config.user);
        }
        this.router.navigate([options?.returnTo ?? '/']);
        return of();
      })
    );
  }

  public logout(): Observable<void> {
    this.currentUserSubject.next(null);

    return of();
  }
}
