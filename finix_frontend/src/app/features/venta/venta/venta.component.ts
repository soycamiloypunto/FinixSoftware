// --- archivo: venta.component.ts (COMPLETO Y CON AJUSTES DE DISEÑO) ---

import { Component, OnInit, computed, inject, signal, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable, map, startWith, forkJoin } from 'rxjs';

// --- Módulos de Angular Material (solo los necesarios) ---
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// --- COMPONENTES GENÉRICOS ---
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button';
import { DialogFrameComponent } from '../../../shared/components/dialog-frame/dialog-frame';

// --- Modelos y Servicios ---
import { ProductoModel } from '../models/producto.model';
import { VentaModel, VentaDetalleModel } from '../models/venta.model';
import { ClienteModel } from '../../cliente/models/cliente.model';
import { ProductoService } from '../services/producto.service';
import { VentaService } from '../services/venta.services';
import { ClienteService } from '../../cliente/services/cliente.service';

// Interfaz para el manejo del carrito en la UI del diálogo
interface DetalleVentaConNombre extends VentaDetalleModel {
  nombreProducto: string;
  subtotal: number;
}

// --- DIÁLOGO DE CONFIRMACIÓN REUTILIZABLE (Refactorizado) ---
@Component({
  selector: 'dialog-confirmacion',
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


// ------------------------------------------------------------------------------------
// --- NUEVO DIÁLOGO PARA EL PUNTO DE VENTA (CON DISEÑO AJUSTADO) ---
// ------------------------------------------------------------------------------------
@Component({
  selector: 'app-venta-dialog',
  template: `
    <div class="p-4 bg-gray-50 min-h-full flex flex-col">
      
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold text-gray-800">Nueva Venta</h1>
        <button mat-icon-button (click)="onNoClick()" matTooltip="Cerrar ventana">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-card class="mb-4">
        <mat-card-content class="pt-4">
          <form [formGroup]="addItemForm" (ngSubmit)="anadirItemAlCarrito()" class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
            
            <mat-form-field appearance="fill" class="md:col-span-5">
              <mat-label>Buscar Producto</mat-label>
              <input type="text" matInput formControlName="producto" [matAutocomplete]="auto">
              <mat-autocomplete #auto="matAutocomplete" [displayWith]="mostrarNombreProducto" (optionSelected)="onProductoSelected($event)">
                @for (option of opcionesFiltradas | async; track option.id) {
                  <mat-option [value]="option">
                    <div class="flex justify-between items-center">
                      <span>{{option.nombre}}</span>
                      <span class="text-xs text-gray-500">Stock: {{option.stock}}</span>
                    </div>
                  </mat-option>
                }
              </mat-autocomplete>
            </mat-form-field>
            
            <app-custom-input class="md:col-span-2" label="Cantidad" type="number" formControlName="cantidad"></app-custom-input>

            <div class="md:col-span-3 text-center md:text-left pt-2">
              <div class="text-xs text-gray-500">Subtotal</div>
              <div class="text-xl font-semibold text-gray-800">{{ itemSubtotal() | currency:'COP':'symbol':'1.0-0' }}</div>
            </div>

            <div class="md:col-span-2">
              <app-custom-button color="accent" class="w-full" type="submit" [disabled]="addItemForm.invalid">
                <mat-icon>add_shopping_cart</mat-icon>
                <span>Añadir</span>
              </app-custom-button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        <div class="lg:col-span-2 h-full">
          <mat-card class="h-full flex flex-col">
            <mat-card-header class="border-b"><mat-card-title class="text-lg font-semibold">Carrito</mat-card-title></mat-card-header>
            <mat-card-content class="pt-4 flex-grow flex flex-col">
              @if (detallesVenta().length === 0) {
                <div class="flex-grow flex flex-col justify-center items-center p-12 text-gray-400 border rounded-lg mt-1 border-dashed"><mat-icon class="text-6xl">production_quantity_limits</mat-icon><p class="mt-2 font-medium">El carrito está vacío</p></div>
              } @else {
                <div class="overflow-auto border rounded-lg">
                  <table mat-table [dataSource]="detallesVenta()" class="w-full">
                    <ng-container matColumnDef="producto"><th mat-header-cell *matHeaderCellDef class="bg-gray-50">Producto</th><td mat-cell *matCellDef="let item" class="font-medium">{{item.nombreProducto}}</td></ng-container>
                    <ng-container matColumnDef="precio"><th mat-header-cell *matHeaderCellDef class="text-right bg-gray-50">Precio</th><td mat-cell *matCellDef="let item" class="text-right">{{item.precioUnitario | currency:'COP':'symbol':'1.0-0'}}</td></ng-container>
                    <ng-container matColumnDef="cantidad"><th mat-header-cell *matHeaderCellDef class="text-center bg-gray-50">Cantidad</th><td mat-cell *matCellDef="let item"><div class="flex items-center justify-center gap-2"><button mat-icon-button (click)="actualizarCantidad(item, -1)"><mat-icon>remove_circle_outline</mat-icon></button><span class="font-medium text-base w-6 text-center">{{item.cantidad}}</span><button mat-icon-button (click)="actualizarCantidad(item, 1)"><mat-icon>add_circle_outline</mat-icon></button></div></td></ng-container>
                    <ng-container matColumnDef="subtotal"><th mat-header-cell *matHeaderCellDef class="text-right bg-gray-50">Subtotal</th><td mat-cell *matCellDef="let item" class="text-right font-semibold">{{item.subtotal | currency:'COP':'symbol':'1.0-0'}}</td></ng-container>
                    <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef class="bg-gray-50"></th><td mat-cell *matCellDef="let item" class="text-right"><button mat-icon-button color="warn" (click)="eliminarItem(item.producto.id!)"><mat-icon>delete</mat-icon></button></td></ng-container>
                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
                  </table>
                </div>
              }
            </mat-card-content>
          </mat-card>
        </div>

        <div class="lg:col-span-1">
          <mat-card>
            <mat-card-header class="border-b"><mat-card-title class="text-lg font-semibold">Resumen y Pago</mat-card-title></mat-card-header>
            <mat-card-content class="pt-4 flex flex-col gap-3">
              <div class="flex justify-between items-baseline text-gray-700"><span class="text-xl font-medium">Total:</span><span class="font-bold text-3xl text-gray-800">{{ totalVenta() | currency:'COP':'symbol':'1.0-0' }}</span></div>
              <app-custom-input label="Paga con" type="number" placeholder="0" [ngModel]="pagoCon()" (ngModelChange)="pagoCon.set($event)"></app-custom-input>
              <div class="flex justify-between items-baseline text-gray-700"><span class="text-lg font-medium">Vueltas:</span><span class="font-semibold text-xl text-green-600">{{ vueltas() | currency:'COP':'symbol':'1.0-0' }}</span></div>
              <app-custom-button color="primary" class="w-full !py-2.5 !text-base !font-bold" (buttonClick)="finalizarVenta()" [disabled]="detallesVenta().length === 0"><mat-icon>check_circle</mat-icon><span>FINALIZAR VENTA</span></app-custom-button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, CurrencyPipe,
    MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
    MatSnackBarModule, MatTableModule, MatAutocompleteModule, MatTooltipModule, MatDialogModule,
    CustomInputComponent, CustomButtonComponent
  ],
  providers: [CurrencyPipe],
})
export class VentaDialogComponent implements OnInit {
  // La lógica interna de esta clase no necesita cambios.
  public dialogRef = inject(MatDialogRef<VentaDialogComponent>);
  public data = inject(MAT_DIALOG_DATA) as { clientes: ClienteModel[], productos: ProductoModel[] };
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private currencyPipe = inject(CurrencyPipe);
  private ventaService = inject(VentaService);
  private fb = inject(FormBuilder);

  productosDisponibles = signal<ProductoModel[]>([]);
  detallesVenta = signal<DetalleVentaConNombre[]>([]);
  displayedColumns: string[] = ['producto', 'precio', 'cantidad', 'subtotal', 'acciones'];
  addItemForm: FormGroup;
  opcionesFiltradas!: Observable<ProductoModel[]>;
  itemSubtotal = signal<number>(0);
  pagoCon = signal<number | null>(null);
  totalVenta = computed(() => this.detallesVenta().reduce((acc, item) => acc + item.subtotal, 0));
  vueltas = computed(() => {
      const total = this.totalVenta();
      const pago = this.pagoCon() ?? 0;
      return pago > total ? pago - total : 0;
  });

  constructor() {
      this.addItemForm = this.fb.group({
          producto: [null, Validators.required],
          cantidad: [1, [Validators.required, Validators.min(1)]]
      });
  }
  ngOnInit(): void {
      this.productosDisponibles.set(this.data.productos);
      const productoControl = this.addItemForm.get('producto') as FormControl;
      this.opcionesFiltradas = productoControl.valueChanges.pipe(
          startWith(''),
          map(value => {
              const name = typeof value === 'string' ? value : value?.nombre;
              return name ? this._filtrarProductos(name) : this.productosDisponibles().slice();
          }),
      );
      this.escucharCambiosFormularioItem();
  }
  escucharCambiosFormularioItem(): void {
      this.addItemForm.valueChanges.subscribe(value => {
          const producto = value.producto;
          const cantidad = value.cantidad;
          if (producto && typeof producto !== 'string' && cantidad > 0) {
              this.itemSubtotal.set(producto.precioVenta * cantidad);
          } else { this.itemSubtotal.set(0); }
      });
  }
  private _filtrarProductos(nombre: string): ProductoModel[] {
      const filterValue = nombre.toLowerCase();
      return this.productosDisponibles().filter(p => p.nombre.toLowerCase().includes(filterValue));
  }
  mostrarNombreProducto(producto: ProductoModel): string { return producto?.nombre || ''; }
  onProductoSelected(event: MatAutocompleteSelectedEvent): void {
      const producto = event.option.value as ProductoModel;
      const cantidadControl = this.addItemForm.get('cantidad');
      if (cantidadControl && producto.stock > 0 && cantidadControl.value > producto.stock) {
          cantidadControl.setValue(producto.stock);
      }
  }
  anadirItemAlCarrito(): void {
      if (this.addItemForm.invalid) return;
      const producto = this.addItemForm.value.producto as ProductoModel;
      const cantidad = this.addItemForm.value.cantidad as number;
      this.agregarAlCarrito(producto, cantidad);
      this.addItemForm.reset({ cantidad: 1 });
      const productoControl = this.addItemForm.get('producto');
      if (productoControl) {
          productoControl.setValue(null);
          productoControl.markAsPristine();
          productoControl.markAsUntouched();
      }
  }
  agregarAlCarrito(producto: ProductoModel, cantidad: number): void {
      if (producto.stock < cantidad) {
          this.mostrarNotificacion(`No hay stock suficiente para ${producto.nombre}`, 'error');
          return;
      }
      this.detallesVenta.update(detalles => {
          const itemExistente = detalles.find(d => d.producto.id === producto.id);
          if (itemExistente) {
              const nuevaCantidad = itemExistente.cantidad + cantidad;
              if (nuevaCantidad <= producto.stock) {
                  itemExistente.cantidad = nuevaCantidad;
                  itemExistente.subtotal = nuevaCantidad * itemExistente.precioUnitario;
              } else { this.mostrarNotificacion('Stock máximo alcanzado', 'error'); }
          } else {
              detalles.push({
                  producto: { id: producto.id },
                  nombreProducto: producto.nombre,
                  cantidad: cantidad,
                  precioUnitario: producto.precioVenta,
                  subtotal: producto.precioVenta * cantidad
              });
          }
          return [...detalles];
      });
  }
  actualizarCantidad(item: DetalleVentaConNombre, cambio: number): void {
      const productoStock = this.productosDisponibles().find(p => p.id === item.producto.id);
      this.detallesVenta.update(detalles => {
          const itemIndex = detalles.findIndex(d => d.producto.id === item.producto.id);
          if (itemIndex > -1) {
              const nuevaCantidad = detalles[itemIndex].cantidad + cambio;
              if (nuevaCantidad > 0 && nuevaCantidad <= (productoStock?.stock ?? 0)) {
                  detalles[itemIndex].cantidad = nuevaCantidad;
                  detalles[itemIndex].subtotal = nuevaCantidad * detalles[itemIndex].precioUnitario;
              } else if (nuevaCantidad <= 0) {
                  detalles.splice(itemIndex, 1);
              } else { this.mostrarNotificacion('Stock máximo alcanzado', 'error'); }
          }
          return [...detalles];
      });
  }
  eliminarItem(productoId: number): void {
      this.detallesVenta.update(detalles => detalles.filter(d => d.producto.id !== productoId));
  }
  finalizarVenta(): void {
      const totalFormateado = this.currencyPipe.transform(this.totalVenta(), 'COP', 'symbol', '1.0-0');
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
          data: {
              titulo: 'Confirmar Venta',
              mensaje: `¿Estás seguro de registrar esta venta por un total de <strong>${totalFormateado}</strong>?`
          },
          panelClass: 'custom-dialog-container',
          disableClose: true,
          width: '450px'
      });
      dialogRef.afterClosed().subscribe(confirmado => {
          if (confirmado) this.registrarVenta();
      });
  }
  registrarVenta(): void {
      const nuevaVenta: VentaModel = {
          fecha: new Date().toISOString(),
          cliente: undefined,
          totalVenta: this.totalVenta(),
          montoPagado: this.pagoCon() ?? this.totalVenta(),
          cambio: this.vueltas(),
          detalles: this.detallesVenta().map(item => ({
              producto: { id: item.producto.id },
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
              subtotal: item.subtotal
          }))
      };
      this.ventaService.registrarVenta(nuevaVenta).subscribe({
          next: (ventaCreada) => {
              this.mostrarNotificacion('Venta registrada con éxito');
              this.dialogRef.close(ventaCreada);
          },
          error: () => this.mostrarNotificacion('Error al registrar la venta', 'error')
      });
  }
  onNoClick(): void { this.dialogRef.close(); }
  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success'): void { this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 }); }
}


// ------------------------------------------------------------------------------------
// --- COMPONENTE PRINCIPAL (PADRE) - CON AJUSTE DE TAMAÑO DE DIÁLOGO ---
// ------------------------------------------------------------------------------------
@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, MatToolbarModule, MatIconModule,
    MatTableModule, MatDialogModule, MatSnackBarModule,
    CustomButtonComponent
  ],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  private ventaService = inject(VentaService);
  private productoService = inject(ProductoService);
  private clienteService = inject(ClienteService);
  private dialog = inject(MatDialog);
  
  isLoadingData = signal(false);
  ventasRecientes = signal<VentaModel[]>([]);
  displayedColumnsVentas: string[] = ['id', 'fecha', 'cliente', 'total'];

  ngOnInit(): void {
    this.cargarVentasRecientes();
  }

  cargarVentasRecientes(): void {
    this.ventaService.getUltimasVentas(20).subscribe(data => {
      this.ventasRecientes.set(data);
    });
  }

  abrirDialogoVenta(): void {
    this.isLoadingData.set(true);
    
    forkJoin({
      productos: this.productoService.getProductosParaVenta(),
      clientes: this.clienteService.getAll()
    }).subscribe(({ productos, clientes }) => {
      this.isLoadingData.set(false);
      const dialogRef = this.dialog.open(VentaDialogComponent, {
        // --- AJUSTE DE TAMAÑO ---
        // Usamos un ancho flexible y responsivo, con un máximo, y dejamos que la altura sea automática
        width: 'clamp(800px, 90vw, 1200px)',
        height: 'auto',
        maxHeight: '95vh', // Añadimos un maxHeight para evitar que sea demasiado alto en pantallas grandes
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: { productos, clientes }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cargarVentasRecientes();
        }
      });
    });
  }
}