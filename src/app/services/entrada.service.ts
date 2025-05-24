import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EntradaService {
  private api = 'http://localhost:3000/api/entradas';
  constructor(private http: HttpClient) {}
  create(data: FormData) {
    return this.http.post(this.api, data, { withCredentials: true });
  }

  // Obtener todas las entradas
  getAll(): Observable<
    {
      id: number;
      tipo: string;
      monto: string;
      fecha: string;
      factura_path?: string;
    }[]
  > {
    return this.http.get<any[]>(this.api, {
      withCredentials: true,
    });
  }
}
