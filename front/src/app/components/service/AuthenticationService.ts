import { EventEmitter, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userAuthenticated = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private setItem(key: string, value: any): void {
    if (this.isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  private removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  private getItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.API}/user/auth`, { username, password })
      .pipe(
        map(response => {
          const { data } = response;
          if (response?.success && data?.ativo === 1) {
            this.setItem('nome', data.nome);
            this.setItem('cargo', data.cargo);
            this.setItem('user', data.user);
            this.setItem('permissao', data.permissao);
            this.setItem('ativo', data.ativo);
            this.setItem('token', data.token);
            this.userAuthenticated.emit(true);
          }
          return response;
        }),
        catchError(error => throwError(error))
      );
  }

  logout(): void {
    this.userAuthenticated.emit(false);
    this.router.navigate(['/login']);
    this.removeItem('user');
    this.removeItem('nome');
    this.removeItem('cargo');
    this.removeItem('permissao');
    this.removeItem('ativo');
    this.removeItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  getAuthHeadersMulti(): HttpHeaders {
    const token = this.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  isAuthenticated(): boolean {
    return !!this.getItem('token');
  }

  getToken(): string | null { 
    return this.getItem('token');
  }

  getAuthHeadersFile(): HttpHeaders {
    const token = this.getItem('token');
    return new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      //'Content-Type': 'text/csv',
      // Only include Authorization header if token exists
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }
}