import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((response: any) => {
        // Guardar tokens y roles en localStorage
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
        localStorage.setItem('is_staff', String(response.is_staff));
        localStorage.setItem('is_superuser', String(response.is_superuser));
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    });

    return this.http.post(`${this.apiUrl}/logout/`, {}, { headers }).pipe(
      tap(() => this.logoutAndRedirect()),
      catchError((error) => {
        console.error('Error al cerrar sesión:', error);
        this.logoutAndRedirect();
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
      this.logoutAndRedirect();
      return throwError(() => new Error('Token de refresco no encontrado.'));
    }

    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
      tap((response: any) => {
        localStorage.setItem('access', response.access);
        if (response.refresh) {
          localStorage.setItem('refresh', response.refresh);
        }
      }),
      catchError((error) => {
        console.error('Error al renovar token:', error);
        this.logoutAndRedirect();
        return throwError(() => error);
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logoutAndRedirect(): void {
    localStorage.clear(); // Limpia todo el localStorage
    this.router.navigate(['/admin/login']);
  }

  isAdminUser(): boolean {
    const isStaff = localStorage.getItem('is_staff') === 'true';
    const isSuperuser = localStorage.getItem('is_superuser') === 'true';
    return isStaff || isSuperuser;
  }
}
