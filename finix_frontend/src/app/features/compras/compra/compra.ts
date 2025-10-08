import { Component, OnInit, signal, inject, Inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, startWith, map, forkJoin } from 'rxjs';

// --- Modelos y Servicios ---
import { CompraModel, CompraDetalleUI} from '../models/compra.model';
import { CompraService } from '../services/compra.service';
import { ProveedorModel } from '../../proveedor/models/proveedor.model';
import { ProveedorService } from '../../proveedor/services/proveedor.services';
import { ProductoModel } from '../../producto/models/producto.model';
import { ProductoService } from '../../producto/services/producto.services';

// --- Módulos y Componentes Genéricos ---
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';
import { DialogFrameComponent } from '../../../shared/components/dialog-frame/dialog-frame';

// --- Componente de Diálogo para Registrar Compra ---
@Component({
  selector: 'dialog-compra',
  template: `
    <app-dialog-frame (closeDialog)="onNoClick()" [title]="'Registrar Nueva Compra'">
      <span dialog-title>{{ 'Registrar Nueva Compra' }}</span>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
        <div class="lg:col-span-3 flex flex-col gap-4">
            <mat-card>
                <mat-card-content class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" [formGroup]="compraForm">
                    <mat-form-field appearance="fill" class="w-full">
                        <mat-label>Proveedor</mat-label>
                        <input type="text" matInput [formControl]="proveedorCtrl" [matAutocomplete]="autoProv" [readonly]="detallesCompra().length > 0">
                        <mat-autocomplete #autoProv="matAutocomplete" [displayWith]="displayProveedor" (optionSelected)="onProveedorSelected($event)">
                            @for(p of proveedoresFiltrados | async; track p.id){ <mat-option [value]="p">{{ p.nombre }}</mat-option> }
                        </mat-autocomplete>
                         @if(compraForm.get('proveedor')?.hasError('required')) { <mat-error>Seleccione un proveedor.</mat-error> }
                    </mat-form-field>
                    <app-custom-input label="Nº Factura (Opcional)" formControlName="numeroFactura"></app-custom-input>
                </mat-card-content>
            </mat-card>

            <mat-card [class.opacity-50]="!compraForm.get('proveedor')?.valid">
                <mat-card-content class="pt-4">
                    <form [formGroup]="addItemForm" (ngSubmit)="anadirItem()" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                        <mat-form-field appearance="fill" class="sm:col-span-5">
                            <mat-label>Producto</mat-label>
                            <input type="text" matInput [formControl]="productoCtrl" [matAutocomplete]="autoProd">
                            <mat-autocomplete #autoProd="matAutocomplete" [displayWith]="displayProducto" (optionSelected)="onProductoSelected($event)">
                                @for(p of productosFiltrados | async; track p.id){ <mat-option [value]="p">{{ p.nombre }}</mat-option> }
                            </mat-autocomplete>
                        </mat-form-field>
                        <app-custom-input class="sm:col-span-3" label="Costo Unitario" type="number" formControlName="costoUnitario"></app-custom-input>
                        <app-custom-input class="sm:col-span-2" label="Cantidad" type="number" formControlName="cantidad"></app-custom-input>
                        <div class="sm:col-span-2">
                            <app-custom-button type="submit" color="accent" [disabled]="addItemForm.invalid" class="w-full h-[52px]"><mat-icon>add</mat-icon></app-custom-button>
                        </div>
                    </form>
                </mat-card-content>
            </mat-card>
        </div>

        <!-- Columna Derecha: Resumen y Tabla -->
        <div class="lg:col-span-2">
            <mat-card class="h-full">
                <mat-card-header><mat-card-title>Detalle de Compra</mat-card-title></mat-card-header>
                <mat-card-content>
                    @if(detallesCompra().length > 0){
                        <table mat-table [dataSource]="detallesCompra()" class="w-full">
                            <ng-container matColumnDef="producto"><th mat-header-cell *matHeaderCellDef>Producto</th><td mat-cell *matCellDef="let item">{{item.producto.nombre}}</td></ng-container>
                            <ng-container matColumnDef="cantidad"><th mat-header-cell *matHeaderCellDef>Cant.</th><td mat-cell *matCellDef="let item">{{item.cantidad}}</td></ng-container>
                            <ng-container matColumnDef="subtotal"><th mat-header-cell *matHeaderCellDef>Subtotal</th><td mat-cell *matCellDef="let item">{{item.subtotal | number}}</td></ng-container>
                            <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let item"><button mat-icon-button color="warn" (click)="eliminarItem(item)"><mat-icon>delete</mat-icon></button></td></ng-container>
                            <tr mat-header-row *matHeaderRowDef="['producto', 'cantidad', 'subtotal', 'acciones']"></tr>
                            <tr mat-row *matRowDef="let row; columns: ['producto', 'cantidad', 'subtotal', 'acciones'];"></tr>
                        </table>
                    } @else {
                        <p class="text-center text-gray-500 py-8">Añada productos a la compra</p>
                    }
                </mat-card-content>
            </mat-card>
        </div>
      </div>
      <div dialog-actions class="!justify-between">
          <div class="text-xl font-bold">Total: <span class="text-primary">{{ totalCompra() | number:'1.0-0' }} COP</span></div>
          <div class="flex gap-x-2">
            <app-custom-button variant="stroked" (buttonClick)="onNoClick()">Cancelar</app-custom-button>
            <app-custom-button color="primary" [disabled]="detallesCompra().length === 0 || compraForm.invalid" (buttonClick)="guardarCompra()">Guardar Compra</app-custom-button>
          </div>
      </div>
    </app-dialog-frame>
  `,
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, MatCardModule,
    MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule,
    CustomButtonComponent, CustomInputComponent, DialogFrameComponent, MatError, MatTooltipModule
  ],
  // --- CORRECCIÓN DE ESTILO ---
  styles: [`
    :host ::ng-deep .mat-mdc-form-field.mat-mdc-form-field-type-mat-input .mat-mdc-form-field-infix .mat-mdc-input-element {
      color: #1f2937; /* Un color de texto oscuro (Tailwind gray-800) */
    }
  `]
})
export class CompraDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CompraDialogComponent>);
  
  // --- Formularios ---
  compraForm: FormGroup;
  addItemForm: FormGroup;
  
  // --- Autocompletado (controles separados) ---
  proveedorCtrl = new FormControl<ProveedorModel | string>('');
  productoCtrl = new FormControl<ProductoModel | string>('');
  proveedoresFiltrados!: Observable<ProveedorModel[]>;
  productosFiltrados!: Observable<ProductoModel[]>;

  // --- Estado ---
  detallesCompra = signal<CompraDetalleUI[]>([]);
  totalCompra = computed(() => this.detallesCompra().reduce((acc, item) => acc + item.subtotal, 0));
  
  constructor(
    // Inyección de datos en el constructor para mayor compatibilidad
    @Inject(MAT_DIALOG_DATA) public data: { proveedores: ProveedorModel[], productos: ProductoModel[] }
  ) {
    this.compraForm = this.fb.group({
      proveedor: [null, Validators.required],
      numeroFactura: ['']
    });
    this.addItemForm = this.fb.group({
      producto: [null, Validators.required],
      costoUnitario: [null, [Validators.required, Validators.min(0)]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.setupAutocompletes();
    this.addItemForm.get('producto')?.disable(); 
  }
  
  private setupAutocompletes() {
    this.proveedoresFiltrados = this.proveedorCtrl.valueChanges.pipe(
      startWith(''),
      map(val => (typeof val === 'string' ? val : val?.nombre) || ''),
      map(nombre => nombre ? this._filterProveedores(nombre) : this.data.proveedores.slice())
    );
    this.productosFiltrados = this.productoCtrl.valueChanges.pipe(
      startWith(''),
      map(val => (typeof val === 'string' ? val : val?.nombre) || ''),
      map(nombre => nombre ? this._filterProductos(nombre) : this.data.productos.slice())
    );
  }

  private _filterProveedores = (nombre: string) => this.data.proveedores.filter(p => p.nombre.toLowerCase().includes(nombre.toLowerCase()));
  private _filterProductos = (nombre: string) => this.data.productos.filter(p => p.nombre.toLowerCase().includes(nombre.toLowerCase()));

  displayProveedor = (p: ProveedorModel) => p?.nombre || '';
  displayProducto = (p: ProductoModel) => p?.nombre || '';
  
  onProveedorSelected(event: MatAutocompleteSelectedEvent){
    const proveedor = event.option.value as ProveedorModel;
    this.compraForm.patchValue({ proveedor: proveedor });
    this.addItemForm.get('producto')?.enable();
  }
  
  onProductoSelected(event: MatAutocompleteSelectedEvent) {
      const producto = event.option.value as ProductoModel;
      // --- CORRECCIÓN LÓGICA ---
      // Se actualiza tanto el costo como el producto en el formulario
      this.addItemForm.patchValue({ 
        costoUnitario: producto.precioCompra,
        producto: producto
      });
  }

  anadirItem() {
    if (this.addItemForm.invalid) return;
    const formVal = this.addItemForm.value;
    const nuevoItem: CompraDetalleUI = {
      producto: formVal.producto,
      cantidad: formVal.cantidad,
      costoUnitario: formVal.costoUnitario,
      subtotal: formVal.cantidad * formVal.costoUnitario
    };

    this.detallesCompra.update(items => [...items, nuevoItem]);
    this.addItemForm.reset({ cantidad: 1 });
    this.productoCtrl.setValue('');
  }
  
  eliminarItem(itemAEliminar: CompraDetalleUI) {
      this.detallesCompra.update(items => items.filter(item => item !== itemAEliminar));
  }

  guardarCompra() {
    if (this.compraForm.invalid || this.detallesCompra().length === 0) return;
    
    const compraFinal: CompraModel = {
      fecha: new Date().toISOString(),
      proveedor: this.compraForm.value.proveedor,
      totalCompra: this.totalCompra(),
      numeroFactura: this.compraForm.value.numeroFactura,
      detalles: this.detallesCompra().map(d => ({
        producto: { id: d.producto.id },
        cantidad: d.cantidad,
        costoUnitario: d.costoUnitario
      }))
    };
    this.dialogRef.close(compraFinal);
  }

  onNoClick = () => this.dialogRef.close();
}


// --- Componente Padre ---
@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './compra.html',
  styleUrls: ['./compra.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompraComponent implements OnInit {
  private compraService = inject(CompraService);
  private proveedorService = inject(ProveedorService);
  private productoService = inject(ProductoService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  compras = signal<CompraModel[]>([]);
  displayedColumns = ['id', 'fecha', 'proveedor', 'total'];

  ngOnInit() {
    this.cargarCompras();
  }

  cargarCompras() {
    this.compraService.getCompras().subscribe(data => this.compras.set(data));
  }

  abrirDialogoCompra() {
    forkJoin({
      proveedores: this.proveedorService.getAll(),
      productos: this.productoService.getAll()
    }).subscribe(({ proveedores, productos }) => {
      const dialogRef = this.dialog.open(CompraDialogComponent, {
        width: 'clamp(800px, 80vw, 1200px)',
        disableClose: true,
        panelClass: 'custom-dialog-container',
        data: { proveedores, productos }
      });

      dialogRef.afterClosed().subscribe((result: CompraModel) => {
        if (result) {
          this.compraService.registrarCompra(result).subscribe({
            next: () => {
              this.mostrarNotificacion('Compra registrada con éxito');
              this.cargarCompras();
            },
            error: () => this.mostrarNotificacion('Error al registrar la compra', 'error')
          });
        }
      });
    });
  }
  
  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-500', 'text-white'] : ['bg-red-500', 'text-white']
    });
  }
}
