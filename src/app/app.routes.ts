import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RegistrarEntradaComponent } from './entradas/registrar/registrar.component';
import { RegistrarSalidaComponent } from './salidas/registrar/registrar.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'entradas/registrar',
    component: RegistrarEntradaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'salidas/registrar',
    component: RegistrarSalidaComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' },
];
