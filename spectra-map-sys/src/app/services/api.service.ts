import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getdatos(): Observable<any> {
    // Realizar la solicitud de inicio de sesión a la API
    return this.http.get<any>(`${this.apiUrl}/login/echoping`);
  }

  getDepartamentos():Observable<any >{
    return this.http.get<any>(`${this.apiUrl}/departamento`);
  }

  getPedania(departamento:string):Observable<any >{
    return this.http.get<any>(`${this.apiUrl}/pedania?nomenclatura=${departamento}`);
  }

  getRadioUrbano(pedania:string):Observable<any >{
    return this.http.get<any>(`${this.apiUrl}/radiourbano?nomenclatura=${pedania}`);
  }

  getCircunscripciones(radiourbano:string):Observable<any >{
    return this.http.get<any>(`${this.apiUrl}/circunscripcion?nomenclatura=${radiourbano}`);
  }

  getMazanas(circunscripcion:string):Observable<any >{
    return this.http.get<any>(`${this.apiUrl}/manzana?nomenclatura=${circunscripcion}`);
  }

  getLotes(manzana:string):Observable<any >{
    return this.http.get<any>(`${this.apiUrl}/parcela/GetYps?nomenclatura=${manzana}`);
  }

  getPdf(url: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/parcela/GetPdfFile?url=${encodeURIComponent(url)}`, { responseType: 'blob' });
  }
  getPdfUrl(url: string): Observable<Blob> {
    return this.http.get<Blob>(url, { responseType: 'blob' as 'json' });
  }
}
