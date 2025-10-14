import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

// --- Importaciones de Angular Material ---
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// --- Servicios y Modelos ---
// (Asegúrate de que las rutas de importación sean correctas para tu proyecto)
import { VentaService } from '../../venta/services/venta.services';
import { CompraService } from '../../compras/services/compra.service';
import { EgresoService } from '../../egreso/services/egreso.service';
import { VentaModel } from '../../venta/models/venta.model';
import { CompraModel } from '../../compras/models/compra.model';
import { EgresoModel } from '../../egreso/models/egreso.model';


@Component({
  selector: 'app-reporte-diario',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CurrencyPipe, DatePipe,
    MatCardModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule,
    MatInputModule, MatButtonModule, MatIconModule, MatTableModule, MatProgressSpinnerModule
  ],
  templateUrl: './reporte.diario.component.html',
  styleUrls: ['./reporte.diario.component.css']
})
export class ReporteDiarioComponent implements OnInit {
  // --- Inyección de Servicios ---
  private ventaService = inject(VentaService);
  private compraService = inject(CompraService);
  private egresoService = inject(EgresoService);

  // --- Signals para el estado ---
  public isLoading = signal(false);
  public ventas = signal<VentaModel[]>([]);
  public compras = signal<CompraModel[]>([]);
  public egresos = signal<EgresoModel[]>([]);

  // --- Columnas para las tablas ---
  public displayedColumnsVentas: string[] = ['id', 'fecha', 'totalVenta'];
  public displayedColumnsCompras: string[] = ['id', 'fecha', 'totalCompra'];
  public displayedColumnsEgresos: string[] = ['id', 'fecha', 'monto', 'concepto'];

  // --- Formulario para el rango de fechas ---
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // --- Señales Calculadas (Computed Signals) para los totales ---
  public totalVentas = computed(() => this.ventas().reduce((sum, venta) => sum + venta.totalVenta, 0));
  public totalCompras = computed(() => this.compras().reduce((sum, compra) => sum + compra.totalCompra, 0));
  public totalEgresos = computed(() => this.egresos().reduce((sum, egreso) => sum + egreso.monto, 0));
  
  public totalEnCaja = computed(() => this.totalVentas() - (this.totalCompras() + this.totalEgresos()));

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.buscarReporte();
  }

  private setDefaultDateRange(): void {
    const hoy = new Date();
    const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
    const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
    this.range.setValue({ start: inicioDelDia, end: finDelDia });
  }

  public buscarReporte(): void {
    if (!this.range.value.start || !this.range.value.end) {
      return;
    }
    this.isLoading.set(true);
    
    // Ajustamos las horas para cubrir todo el día seleccionado
    const fechaInicio = this.range.value.start;
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = this.range.value.end;
    fechaFin.setHours(23, 59, 59, 999);

    forkJoin({
      ventas: this.ventaService.findByFechaBetween(fechaInicio, fechaFin),
      compras: this.compraService.findByFechaBetween(fechaInicio, fechaFin),
      egresos: this.egresoService.findByFechaBetween(fechaInicio, fechaFin)
    }).subscribe({
      next: (resultados) => {
        this.ventas.set(resultados.ventas);
        this.compras.set(resultados.compras);
        this.egresos.set(resultados.egresos);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error al buscar el reporte:", err);
        this.isLoading.set(false);
        // Aquí podrías mostrar una notificación de error al usuario
      }
    });
  }
}