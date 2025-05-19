import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalidaService {
  private apiUrl = 'http://localhost:3000/api/salidas';

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, formData, {
      withCredentials: true,
    });
  }
}
