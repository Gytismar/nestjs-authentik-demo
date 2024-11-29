import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService {
  private readonly jwtTokenKey: string = 'access_token';
  private readonly storage: Storage = window.sessionStorage;

  getToken(): string | null {
    return this.storage.getItem(this.jwtTokenKey);
  }

  saveToken(token: string): void {
    this.storage.setItem(this.jwtTokenKey, token);
  }

  clearToken(): void {
    this.storage.removeItem(this.jwtTokenKey);
  }
}
