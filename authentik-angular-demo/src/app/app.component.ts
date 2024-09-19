import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="getViewer()">Viewer Only</button>
    <button (click)="getManager()">Manager Only</button>
    <button (click)="getAuthenticated()">Authenticated Only</button>
  `,
  standalone: true,
  imports: [HttpClientModule],
})
export class AppComponent {
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.authService.login(); // Automatically trigger login on page load
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
}
