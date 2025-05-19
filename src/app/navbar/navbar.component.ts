import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() {
    this.auth.logout().subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Hasta luego!',
          text: 'Has cerrado sesión correctamente.',
          timer: 1500,
          showConfirmButton: false,
        });
        // Limpiar estado y redirigir
        this.auth.setUser(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cerrar la sesión. Moriremos todos.',
        });
      },
    });
  }
}
