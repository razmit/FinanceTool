import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido a Finance-Man!',
            text: 'Has iniciado sesión correctamente.',
            timer: 1500,
            showConfirmButton: false,
          });
          this.auth.fetchUser().subscribe((u) => {
            this.auth.setUser(u);
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => {
          this.error = err.error?.message || 'Error de autenticación';
        },
      });
  }
}
