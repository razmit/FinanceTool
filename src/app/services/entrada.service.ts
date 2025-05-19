import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class EntradaService {
  private api = 'http://localhost:3000/api/entradas';
  constructor(private http: HttpClient) {}
  create(data: FormData) {
    return this.http.post(this.api, data, { withCredentials: true });
  }
}
