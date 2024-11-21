import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Permission, User } from '../auth/user.entity';

@Component({
  selector: 'app-root',
  template: `
    <h1>Authentik Angular Demo</h1>
    @if (username) {
      <h3>Welcome, {{ username }}</h3>
    }
    <div>
      <button (click)="getViewer()">Viewer Only</button>
      <button (click)="getManager()">Manager Only</button>
      <button (click)="getAuthenticated()">Authenticated Only</button>
      <button (click)="getLogin()">Login</button>
      <button (click)="getLogout()">Logout</button>
    </div>
    <div id='details'>
      <hr />
      <div><small>Auth type: {{ authType ?? 'N/A' }}</small></div>
      <div><small>Username: {{ username ?? 'N/A' }}</small></div>
      <div><small>Roles: {{ user?.roles?.join(',') ?? 'N/A' }}</small></div>
      <div>
        <small>Permissions:</small>
        @for (p of permissions; track p) {
          <div>
            <small style='margin: 10px'>{{ user?.hasPermission(p) ? '+' : '-' }} {{ p }} </small>
          </div>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  authType?: string;
  username?: string;
  user?: User;
  permissions = Object.values(Permission);

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.authType = this.auth.getAuthType();
    this.auth.user.subscribe((user) => {
      this.username = user?.username ?? undefined;
      this.user = user ?? undefined;
    });
  }

  getViewer() {
    this.http.get('http://localhost:3000/api/only-for-viewer').subscribe(
      (data) => console.log(data),
      (error) => console.log(error)
    );
  }

  getManager() {
    this.http.get('http://localhost:3000/api/only-for-manager').subscribe(
      (data) => console.log(data),
      (error) => console.log(error)
    );
  }

  getAuthenticated() {
    this.http.get('http://localhost:3000/api/for-any-authenticated-user').subscribe(
      (data) => console.log(data),
      (error) => console.log(error)
    );
  }

  getLogin() {
    this.auth.login();
  }

  getLogout() {
    this.auth.logout();
  }
}
