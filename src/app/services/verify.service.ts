import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class VerifyService {
  private apiUrl = 'http://127.0.0.1:8000/api/clientes/';
  private lada = '+52'; // Lada estática configurada

  constructor(private http: HttpClient,) { }

  sendVerificationCode(phoneNumber: string): Observable<any> {
    const body = { phone_number: `${this.lada}${phoneNumber}` };
    console.log(`${this.lada}${phoneNumber}`);

    return this.http.post(`${this.apiUrl}send-verification-code/`, body).pipe(
      catchError((error) => {
        console.error('Error al enviar el codigo:', error);
        return throwError(() => new Error('Error al enviar el codigo.'));
      })
    )
  }

  verifyCode(phoneNumber: string, code: string): Observable<any> {
    const body = {
      phone_number: `${this.lada}${phoneNumber}`,
      code: code,
    };

    return this.http.post<any>(`${this.apiUrl}verify-code/`, body).pipe(
      catchError((error) => {
        console.error('Error al verificar el codigo:', error);
        return throwError(() => new Error('Error al verificar el codigo.'));
      })
    );
  }
}
