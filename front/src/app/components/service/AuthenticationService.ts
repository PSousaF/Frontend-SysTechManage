import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

    userAuthenticated = new EventEmitter<boolean>();

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.API}/user/login`, { username: username, password: password })
          .pipe(
            map(response => {
              const { data } = response
                  if (response && response.success && data.ativo === 1) {
                    localStorage.setItem('user', JSON.stringify(data.user).replaceAll(/"/g, ''));
                    localStorage.setItem('line', JSON.stringify(data.line).replaceAll(/"/g, ''));
                    localStorage.setItem('turn', JSON.stringify(data.turn).replaceAll(/"/g, ''));
                    localStorage.setItem('access', JSON.stringify(data.access).replaceAll(/"/g, ''));
                    localStorage.setItem('code', JSON.stringify(data.code).replaceAll(/"/g, ''));
                    localStorage.setItem('token', JSON.stringify(data.token).replaceAll(/"/g, ''));
                    this.userAuthenticated.emit(true);
                  }
                  return response;
            }),
            catchError(error => {
              return throwError(error);
            })
          );
      }

    logout() {
        this.userAuthenticated.emit(false);
        this.router.navigate(['/login']);
        localStorage.removeItem('user');
        localStorage.removeItem('line');
        localStorage.removeItem('turn');
        localStorage.removeItem('access');
        localStorage.removeItem('code');
        localStorage.removeItem('token');
    }
    isAuthenticated(): boolean {
      const token = localStorage.getItem('token');
      return !!token;
  }
}