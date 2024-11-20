import { Injectable } from '@angular/core';
// import { jwtDecode } from "jwt-decode";

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

  // isTokenExpired(): boolean {
  //   const token = this.getToken();
  //   if (!token) return true;

  //   const decoded: any = jwtDecode(token);
  //   return decoded.exp < Date.now() / 1000;
  // }

  clearToken(): void {
    this.storage.removeItem(this.jwtTokenKey);
  }
}
