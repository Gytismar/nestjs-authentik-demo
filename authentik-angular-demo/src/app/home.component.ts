import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Permission, User } from '../auth/user.entity';

@Component({
  selector: 'app-home',
  template: `
    <h1>Authentik Angular Demo</h1>
    @if (user) {
    <h3>Welcome, {{ user!.username }}</h3>
    }
    <div id="navigation">
      <h3>Navigation</h3>
      <div><a href="/">Home page</a></div>
      <div><a href="/needs-permission">Needs permission page</a></div>
      <br />
      <div>
        @if (user) {
        <button (click)="getLogout()">Logout</button>
        } @else {
        <button (click)="getLogin()">Login</button>
        }
      </div>
    </div>
    <hr />
    <div id="api-calls">
      <h3>API Calls</h3>
      <div>
        <button (click)="getViewer()">Viewer Only</button>
        <button (click)="getManager()">Manager Only</button>
        <button (click)="getAuthenticated()">Authenticated Only</button>
      </div>
      <div>
        @if (apiResponse) {
        <div><small>Response:</small></div>
        <div style="margin-left: 10px">
          <small>OK: {{ apiResponse.ok }}</small>
        </div>
        <div style="margin-left: 10px">
          <small>Status: {{ apiResponse.status }}</small>
        </div>
        <div style="margin-left: 10px">
          <small>Message: {{ apiResponse.message }}</small>
        </div>
        }
      </div>
    </div>
    <hr />
    <div id="details">
      <h3>Details</h3>
      <div>
        <small>Auth type: {{ authType ?? 'N/A' }}</small>
      </div>
      <div>
        <small>Username: {{ user?.username ?? 'N/A' }}</small>
      </div>
      <div>
        <small>Roles: {{ user?.roles?.join(',') ?? 'N/A' }}</small>
      </div>
      <div>
        <small>Permissions:</small>
        @for (p of permissions; track p) {
        <div>
          <small style="margin-left: 10px"
            >{{ user?.hasPermission(p) ? '+' : '-' }} {{ p }}
          </small>
        </div>
        }
      </div>
    </div>
  `,
  standalone: true,
})
export class HomeComponent {
  authType?: string;
  user?: User;
  permissions = Object.values(Permission);
  apiResponse?: { ok: boolean; status: number; message: string };

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.authType = this.auth.type;
    this.auth.user.subscribe((user) => {
      this.user = user ?? undefined;
    });
  }

  getViewer() {
    this.makeApiCall('http://localhost:3000/api/only-for-viewer');
  }

  getManager() {
    this.makeApiCall('http://localhost:3000/api/only-for-manager');
  }

  getAuthenticated() {
    this.makeApiCall('http://localhost:3000/api/for-any-authenticated-user');
  }

  makeApiCall(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (data) => {
        this.apiResponse = { ok: true, status: 200, message: data };
        console.log(data);
      },
      error: (error) => {
        this.apiResponse = {
          ok: false,
          status: error.status,
          message: error.message,
        };
        console.log(error);
      },
    });
  }

  getLogin() {
    this.auth.login();
  }

  getLogout() {
    this.auth.logout();
  }
}
