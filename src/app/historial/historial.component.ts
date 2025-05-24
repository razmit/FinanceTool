import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EntradaService } from '../services/entrada.service';
import { SalidaService } from '../services/salida.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent implements OnInit {
  activeTab: 'entradas' | 'salidas' = 'entradas';
  entradas: any[] = [];
  salidas: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private entradaSvc: EntradaService,
    private salidaSvc: SalidaService
  ) {}

  ngOnInit(): void {
    
    // Determina si muestra entradas o salidas primero
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if(tab === 'salidas') {
      this.activeTab = 'salidas';
    }
    
    forkJoin({
      entradas: this.entradaSvc.getAll(),
      salidas: this.salidaSvc.getAll(),
    }).subscribe(({ entradas, salidas }) => {
      // ordenar descendente por fecha
      const sortDesc = (a: any, b: any) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime();

      this.entradas = entradas.sort(sortDesc);
      this.salidas = salidas.sort(sortDesc);
      this.loading = false;
    });
  }

  setTab(tab: 'entradas' | 'salidas') {
    this.activeTab = tab;
  } 
}
