import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    // Realizar la solicitud de inicio de sesión a la API
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  saveToken(token: string): void {
    // Guardar el token en el almacenamiento local (localStorage)
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    // Obtener el token del almacenamiento local
    return localStorage.getItem(this.tokenKey);
  }
  isLoggedIn(): boolean {
    // Verificar si el token está presente en el almacenamiento local
    return !!this.getToken();
  }

}
