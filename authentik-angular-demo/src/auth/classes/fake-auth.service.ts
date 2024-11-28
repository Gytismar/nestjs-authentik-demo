import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService, LoginOptions } from '../auth.service';
import { User, Role } from '../user.entity';

export interface FakeAuthServiceConfig {
  user?: User;
  isReady?: boolean;
  loggedIn?: boolean;
}

export class FakeAuthService implements AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isReadySubject = new BehaviorSubject<boolean>(true);

  constructor(private config: FakeAuthServiceConfig) {
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

  public get type(): string {
    return 'FakeAuth';
  }


  public login(_options?: LoginOptions): Observable<void> {
    if (this.config.user) {
      this.currentUserSubject.next(this.config.user);
    }

    return of();
  }

  public logout(): Observable<void> {
    this.currentUserSubject.next(null);

    return of();
  }
}
