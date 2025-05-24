import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RegistrarEntradaComponent } from './entradas/registrar/registrar.component';
import { RegistrarSalidaComponent } from './salidas/registrar/registrar.component';
import { EntradasHistorialComponent } from './entradas/historial/historial.component';
import { SalidasHistorialComponent } from './salidas/historial/historial.component';
import { BalanceComponent } from './balance/balance.component';
import { HistorialComponent } from './historial/historial.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'balance',
    component: BalanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'entradas/registrar',
    component: RegistrarEntradaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'entradas/historial',
    component: EntradasHistorialComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'salidas/registrar',
    component: RegistrarSalidaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'salidas/historial',
    component: SalidasHistorialComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];
