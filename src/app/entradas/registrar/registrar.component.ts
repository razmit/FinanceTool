import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EntradaService } from '../../services/entrada.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-entrada',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css',
})
export class RegistrarEntradaComponent {
  tipo = '';
  monto!: number;
  fecha = '';
  facturaFile: File | null = null;
  error = '';
  loading = false;

  tipos = ['Salario', 'Venta', 'Otro']; // Ajusta según tus categorías

  constructor(
    private entradaSvc: EntradaService,
    private auth: AuthService,
    private router: Router
  ) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.facturaFile = input.files?.[0] ?? null;
  }

  onSubmit() {
    if (!this.tipo || !this.monto || !this.fecha) {
      this.error = 'Todos los campos salvo factura son obligatorios.';
      return;
    }
    const data = new FormData();
    data.append('tipo', this.tipo);
    data.append('monto', this.monto.toString());
    data.append('fecha', this.fecha);
    if (this.facturaFile) {
      data.append('factura', this.facturaFile);
    }

    this.loading = true;
    this.entradaSvc.create(data).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Entrada registrada',
          text: 'Tu transacción se guardó correctamente.',
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al registrar la entrada.';
      },
    });
  }
}
