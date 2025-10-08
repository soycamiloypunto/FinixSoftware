import { Component, OnInit, OnDestroy, signal, inject, Inject, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Observable, interval, Subscription, startWith, map, forkJoin, finalize } from 'rxjs';

// --- Módulos de Angular Material (solo los necesarios) ---
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// --- COMPONENTES GENÉRICOS ---
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button';
import { DialogFrameComponent } from '../../../shared/components/dialog-frame/dialog-frame';

// --- Modelos, DTOs y Servicios ---
import { SesionTiempo as SesionTiempoModel } from '../models/sesiontiempo.model';
import { IniciarSesionRequest } from '../dto/sesion.model';
import { GestionTiempoService } from '../services/sesiontiempo.service';
import { ProductoService } from '../../producto/services/producto.services';
import { ProductoModel } from '../../producto/models/producto.model';

// --- Modelos para la Venta ---
export interface VentaItem {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface SesionTiempoUI extends SesionTiempoModel {
  nombreProducto?: string;
  precioPorHora?: number;
  esContadorAscendente?: boolean;
  tiempoTranscurridoSegundos?: number;
  tiempoRestanteSegundos?: number;
  valorTiempo?: number;
  productosAdicionales?: VentaItem[];
  valorProductos?: number;
  valorTotal?: number;
}

// --- DIÁLOGO DE CONFIRMACIÓN REUTILIZABLE ---
@Component({
  selector: 'dialog-confirmacion-tiempo',
  template: `
    <app-dialog-frame (closeDialog)="onNoClick()">
      <span dialog-title>{{ data.titulo }}</span>
      <p [innerHTML]="data.mensaje" class="px-6 py-2 text-gray-600"></p>
      <div dialog-actions>
        <app-custom-button variant="stroked" (buttonClick)="onNoClick()">Cancelar</app-custom-button>
        <app-custom-button color="primary" (buttonClick)="onConfirmClick()">Confirmar</app-custom-button>
      </div>
    </app-dialog-frame>
  `,
  standalone: true,
  imports: [MatDialogModule, CustomButtonComponent, DialogFrameComponent]
})
export class ConfirmacionDialogComponent {
  public dialogRef = inject(MatDialogRef<ConfirmacionDialogComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { titulo: string, mensaje: string }) {}
  onNoClick(): void { this.dialogRef.close(false); }
  onConfirmClick(): void { this.dialogRef.close(true); }
}


// --- COMPONENTE DE DIÁLOGO PARA VENDER PRODUCTOS (sin cambios) ---
@Component({
  selector: 'dialog-vender-producto',
  template: `
    <app-dialog-frame (closeDialog)="onNoClick()">
      <span dialog-title>Añadir Producto a la Sesión</span>
      <form [formGroup]="form" class="flex flex-col gap-y-2">
        <mat-form-field appearance="fill" class="w-full">
            <mat-label>Buscar Producto</mat-label>
            <input type="text" placeholder="Escribe para buscar..." matInput [formControl]="productoCtrl" [matAutocomplete]="auto">
            <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayProducto" (optionSelected)="onProductoSelected($event)">
              @for (p of filteredProductos | async; track p.id) {
                <mat-option [value]="p">{{ p.nombre }}</mat-option>
              }
            </mat-autocomplete>
             @if(form.get('productoId')?.hasError('required')) {
                <mat-error>Debe seleccionar un producto.</mat-error>
            }
        </mat-form-field>
        <app-custom-input formControlName="cantidad" label="Cantidad" type="number">
            @if(form.get('cantidad')?.hasError('required')) { <mat-error>La cantidad es obligatoria.</mat-error> }
            @if(form.get('cantidad')?.hasError('min')) { <mat-error>La cantidad debe ser al menos 1.</mat-error> }
        </app-custom-input>
      </form>
      <div dialog-actions>
        <app-custom-button variant="stroked" (buttonClick)="onNoClick()">Cancelar</app-custom-button>
        <app-custom-button color="primary" [disabled]="!form.valid" (buttonClick)="onSaveClick()">Añadir</app-custom-button>
      </div>
    </app-dialog-frame>
  `,
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatAutocompleteModule,
    MatFormFieldModule, MatInputModule, MatError,
    CustomInputComponent, DialogFrameComponent, CustomButtonComponent
  ]
})
export class VenderProductoDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<VenderProductoDialogComponent>);

  public data = inject(MAT_DIALOG_DATA) as {
      producto: Partial<ProductoModel> | null,
      productos: ProductoModel[]
    };


  form: FormGroup;
  productoCtrl = new FormControl<string | ProductoModel>('');
  filteredProductos!: Observable<ProductoModel[]>;
  selectedProduct: ProductoModel | null = null;
  constructor() {
    this.form = this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }
  ngOnInit() {
    this.filteredProductos = this.productoCtrl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.nombre),
      map(nombre => nombre ? this._filter(nombre) : this.data.productos.slice())
    );
  }
  private _filter(nombre: string): ProductoModel[] {
    const filterValue = nombre.toLowerCase();
    return this.data.productos.filter(p => p.nombre.toLowerCase().includes(filterValue));
  }
  displayProducto(producto: ProductoModel): string { return producto?.nombre || ''; }
  onProductoSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedProduct = event.option.value;
    this.form.patchValue({ productoId: this.selectedProduct?.id });
    this.form.get('productoId')?.updateValueAndValidity();
  }
  onNoClick(): void { this.dialogRef.close(); }
  onSaveClick(): void {
    if (this.form.valid && this.selectedProduct) {
      const result: VentaItem = {
        productoId: this.selectedProduct.id!,
        nombreProducto: this.selectedProduct.nombre,
        cantidad: this.form.value.cantidad,
        precioUnitario: this.selectedProduct.precioVenta,
        total: this.selectedProduct.precioVenta * this.form.value.cantidad
      };
      this.dialogRef.close(result);
    }
  }
}

// --- COMPONENTE PRINCIPAL DE GESTIÓN DE TIEMPO ---
@Component({
  selector: 'app-gestion-tiempo',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, MatSnackBarModule,
    MatSelectModule, MatGridListModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule,
    MatFormFieldModule,
    CustomInputComponent, CustomButtonComponent
  ],
  templateUrl: './gestion-tiempo.component.html',
  styleUrls: ['./gestion-tiempo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionTiempoComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private tiempoService = inject(GestionTiempoService);
  private productoService = inject(ProductoService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);

  sesionesActivas = signal<SesionTiempoUI[]>([]);
  productosDeTiempo = signal<ProductoModel[]>([]);
  productosParaVenta = signal<ProductoModel[]>([]);
  isLoading = signal(true);
  nuevoProductoId?: number;
  nuevoTiempoMinutos?: number;
  private timerSubscription?: Subscription;
  private audioContext: AudioContext | null = null;

  ngOnInit(): void {
    this.cargarDatosIniciales();
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarTimer();
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) { this.audioContext = new AudioContext(); }
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.audioContext?.close();
  }
  
  // --- MÉTODO cobrarSesion ACTUALIZADO ---
  cobrarSesion(sesion: SesionTiempoUI): void {
    const totalFormateado = this.formatCurrency(sesion.valorTotal || 0);
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
      width: '450px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        titulo: 'Confirmar Cobro de Sesión',
        mensaje: `¿Está seguro de que desea finalizar y cobrar esta sesión por un total de <strong>${totalFormateado}</strong>?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        // Si el usuario confirma, procedemos con la lógica original
        this.tiempoService.finalizarSesion(sesion.id!).subscribe({
          next: () => {
            this.sesionesActivas.update(sesiones => sesiones.filter(s => s.id !== sesion.id));
            this.mostrarNotificacion(`Cobro finalizado. Total: ${totalFormateado}`);
          },
          error: () => this.mostrarNotificacion('Error al finalizar y cobrar la sesión', 'error')
        });
      }
    });
  }

  // (El resto de la lógica de la clase no necesita cambios)
  // ... cargarDatosIniciales, iniciarNuevaSesion, etc. ...
    cargarDatosIniciales(): void {
    this.isLoading.set(true);
    forkJoin({
      productos: this.productoService.getAll(),
      sesiones: this.tiempoService.getSesionesActivas()
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: ({ productos, sesiones }) => {
        this.productosDeTiempo.set(productos.filter(p => p.esServicioDeTiempo));
        this.productosParaVenta.set(productos.filter(p => !p.esServicioDeTiempo));
        const sesionesUI: SesionTiempoUI[] = sesiones
          .filter(s => s.productoServicio != null) 
          .map(s => ({
            ...s,
            nombreProducto: s.productoServicio?.nombre || 'Servicio no encontrado',
            precioPorHora: s.productoServicio?.precioVenta || 0,
            productosAdicionales: [],
          }));
        this.sesionesActivas.set(sesionesUI);
      },
      error: (err) => this.mostrarNotificacion('Error al cargar datos iniciales', 'error')
    });
  }

  iniciarNuevaSesion(): void {
    this.resumeAudioContext();
    if (!this.nuevoProductoId) return;
    const request: IniciarSesionRequest = { 
      productoServicioId: this.nuevoProductoId, 
      minutos: this.nuevoTiempoMinutos 
    };
    this.tiempoService.iniciarSesion(request).subscribe({
      next: (nuevaSesion) => {
        const sesionUI: SesionTiempoUI = {
            ...nuevaSesion,
            nombreProducto: nuevaSesion.productoServicio.nombre,
            precioPorHora: nuevaSesion.productoServicio.precioVenta,
            productosAdicionales: [],
        };
        this.sesionesActivas.update(sesiones => [...sesiones, sesionUI]);
        this.mostrarNotificacion('Sesión iniciada correctamente');
        this.nuevoProductoId = undefined;
        this.nuevoTiempoMinutos = undefined;
      },
      error: () => this.mostrarNotificacion('Error al iniciar la sesión', 'error')
    });
  }
  
  abrirDialogoVender(sesionId: number): void {
    const dialogRef = this.dialog.open(VenderProductoDialogComponent, {
      width: 'clamp(400px, 40vw, 500px)',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { productos: this.productosParaVenta() }
    });

    dialogRef.afterClosed().subscribe((newItem: VentaItem) => {
      if (newItem) {
        this.sesionesActivas.update(sesiones => sesiones.map(s => {
          if (s.id === sesionId) {
            const items = s.productosAdicionales || [];
            const existingItem = items.find(i => i.productoId === newItem.productoId);
            if (existingItem) {
                existingItem.cantidad += newItem.cantidad;
                existingItem.total = existingItem.cantidad * existingItem.precioUnitario;
            } else {
                items.push(newItem);
            }
            return { ...s, productosAdicionales: items };
          }
          return s;
        }));
      }
    });
  }
  
    private resumeAudioContext(): void {
        if (isPlatformBrowser(this.platformId) && this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
        }
    }
  
    reproducirSonidoAlerta(): void {
        if (!this.audioContext || this.audioContext.state === 'closed') return;
        this.resumeAudioContext();
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    iniciarTimer(): void {
        this.timerSubscription = interval(1000).subscribe(() => {
        this.sesionesActivas.update(sesiones => 
            sesiones.map(sesion => this.actualizarEstadoSesion(sesion))
        );
        });
    }

    actualizarEstadoSesion(sesion: SesionTiempoUI): SesionTiempoUI {
        if (sesion.estado !== 'ACTIVA') return sesion;
        const ahora = new Date();
        const inicio = new Date(sesion.horaInicio);
        sesion.tiempoTranscurridoSegundos = Math.floor((ahora.getTime() - inicio.getTime()) / 1000);
        sesion.esContadorAscendente = !sesion.duracionSolicitadaMinutos;

        if (!sesion.esContadorAscendente) {
        const finEstimado = inicio.getTime() + sesion.duracionSolicitadaMinutos! * 60 * 1000;
        const restante = Math.floor((finEstimado - ahora.getTime()) / 1000);
        sesion.tiempoRestanteSegundos = restante > 0 ? restante : 0;
        if (sesion.tiempoRestanteSegundos === 0) {
            this.reproducirSonidoAlerta();
            sesion.estado = 'FINALIZADA';
        }
        }
        const precioPorSegundo = (sesion.precioPorHora || 0) / 3600;
        sesion.valorTiempo = precioPorSegundo * (sesion.tiempoTranscurridoSegundos || 0);
        sesion.valorProductos = sesion.productosAdicionales?.reduce((total, item) => total + item.total, 0) || 0;
        sesion.valorTotal = sesion.valorTiempo + sesion.valorProductos;
        return {...sesion};
    }

    formatTiempo(segundos: number): string {
        if (isNaN(segundos) || segundos < 0) segundos = 0;
        const s = Math.floor(segundos % 60);
        const m = Math.floor(segundos / 60) % 60;
        const h = Math.floor(segundos / 3600);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  
    formatCurrency(value: number): string {
        if (isNaN(value)) value = 0;
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
    }

    private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
        this.snackBar.open(mensaje, 'Cerrar', {
        duration: 3000,
        panelClass: tipo === 'success' ? ['bg-green-500', 'text-white'] : ['bg-red-500', 'text-white']
        });
    }
}
