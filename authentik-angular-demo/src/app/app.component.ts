import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

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
      <button (click)="getUser()">Get user</button>
      <button (click)="getLogin()">Login</button>
    </div>
  `,
  standalone: true,
})
export class AppComponent {
  username?: string;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.username ?? null;
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

  getUser() {
    this.username = this.authService.username ?? null;
  }

  getLogin() {
    this.authService.login();
  }
}
