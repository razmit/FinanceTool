// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: User | null = null;

  constructor(private http: HttpClient) {}

  login(creds: { username: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/login', creds, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      'http://localhost:3000/api/auth/logout',
      {},
      { withCredentials: true }
    );
  }

  fetchUser(): Observable<User> {
    return this.http.get<User>('http://localhost:3000/api/auth/me', {
      withCredentials: true,
    });
  }

  setUser(user: User | null) {
    this.user = user;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  getUsername(): string {
    return this.user?.username ?? '';
  }
}
