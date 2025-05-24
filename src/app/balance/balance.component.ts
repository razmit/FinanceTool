import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntradaService } from '../services/entrada.service';
import { SalidaService } from '../services/salida.service';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

@Component({
  selector: 'app-balance',
  imports: [CommonModule, RouterModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css',
})
export class BalanceComponent implements OnInit {
  @ViewChild('lineChartCanvas', { static: false })
  lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChartCanvas', { static: false })
  pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfContent', { static: false })
  pdfContent!: ElementRef<HTMLDivElement>;

  balance = 0;
  allEntradas: any[] = [];
  allSalidas: any[] = [];
  loading = true;

  private lineChart!: Chart;
  private pieChart!: Chart;

  constructor(
    private entradas: EntradaService,
    private salidas: SalidaService,
    private cd: ChangeDetectorRef
  ) {}

  // Cargar la data de transferencias del usuario logged in
  ngOnInit() {
    forkJoin({
      e: this.entradas.getAll(),
      s: this.salidas.getAll(),
    }).subscribe(({ e, s }) => {
      // 1) Datos completos para tablas
      this.allEntradas = e;
      this.allSalidas = s;

      // 2) Balance
      const totalE = e.reduce((sum, x) => sum + parseFloat(x.monto), 0);
      const totalS = s.reduce((sum, x) => sum + parseFloat(x.monto), 0);
      this.balance = totalE - totalS;

      // 3) Preparar series by date (mismos labels)
      const dates = Array.from(
        new Set([...e.map((x) => x.fecha), ...s.map((x) => x.fecha)])
      ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      const dataE = dates.map((d) =>
        e
          .filter((x) => x.fecha === d)
          .reduce((sum, x) => sum + parseFloat(x.monto), 0)
      );
      const dataS = dates.map((d) =>
        s
          .filter((x) => x.fecha === d)
          .reduce((sum, x) => sum + parseFloat(x.monto), 0)
      );

      // 4) Delay para garantizar que los <canvas> estén en el DOM
      setTimeout(() => {
        this.renderLineChart(dates, dataE, dataS);
        this.renderPieChart(totalE, totalS);
        this.loading = false;
      }, 0);
    });
  }

  private renderLineChart(
    labels: string[],
    entradas: number[],
    salidas: number[]
  ) {
    const ctx = this.lineCanvas.nativeElement.getContext('2d')!;
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Entradas',
            data: entradas,
            tension: 0.3,
            borderColor: '#10B981',
          },
          {
            label: 'Salidas',
            data: salidas,
            tension: 0.3,
            borderColor: '#EF4444',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 20, bottom: 20 },
        },
      },
    });
  }

  private renderPieChart(totalE: number, totalS: number) {
    const ctx = this.pieCanvas.nativeElement.getContext('2d')!;
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Entradas', 'Salidas'],
        datasets: [
          {
            data: [totalE, totalS],
            backgroundColor: ['#10B981', '#EF4444'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }

  async exportPDF() {
    // 1) Capture the charts as images
    const lineImg = this.lineChart.toBase64Image();
    const pieImg = this.pieChart.toBase64Image();

    // 2) Create the PDF
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // 3) Title and balance
    doc.setFontSize(18);
    doc.text(`Balance Actual: €${this.balance.toFixed(2)}`, pageWidth / 2, 40, {
      align: 'center',
    });

    // 4) Embed Line Chart
    doc.addImage(lineImg, 'PNG', 40, 60, pageWidth - 80, 200);

    // 5) Embed Pie Chart
    doc.addImage(pieImg, 'PNG', 40, 280, pageWidth / 2 - 60, 200);

    // 6) Entradas table
    autoTable(doc, {
      head: [['Fecha', 'Tipo', 'Monto']],
      body: this.allEntradas.map((e) => [e.fecha, e.tipo, e.monto]),
      startY: 500,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
    });

    // 7) Salidas table (directly after the first table)
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    autoTable(doc, {
      head: [['Fecha', 'Tipo', 'Monto']],
      body: this.allSalidas.map((s) => [s.fecha, s.tipo, s.monto]),
      startY: finalY,
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68] },
    });

    // 8) Save
    doc.save('reporte-financiero.pdf');
  }
}
