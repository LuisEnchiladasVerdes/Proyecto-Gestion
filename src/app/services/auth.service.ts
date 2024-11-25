import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  private users = [
    { username: 'admin', password: '1234' }, // Usuario predefinido
    { username: 'user', password: 'abcd' }  // Otro usuario
  ];

  constructor() { }


  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);

    if (user) {
      this.isLoggedIn = true;
      return true; // Inicio de sesión exitoso
    } else {
      this.isLoggedIn = false;
      return false; // Credenciales incorrectas
    }
  }

  logout(): void {
    this.isLoggedIn = false; // Elimina cualquier sesión activa
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
