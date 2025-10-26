import { Component, OnInit, signal, inject, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Observable, startWith, map, forkJoin, finalize } from 'rxjs';

// --- Módulos de Angular Material (solo los necesarios) ---
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule, MatError } from '@angular/material/form-field'; // Para Autocomplete y Textarea
import { MatInputModule } from '@angular/material/input'; // Para Autocomplete y Textarea

// --- Modelos y Servicios ---
import { ProductoModel } from '../models/producto.model';
import { ProductoService } from '../services/producto.services';
import { ProveedorModel } from '../../proveedor/models/proveedor.model';
import { ProveedorService } from '../../proveedor/services/proveedor.services';

// --- COMPONENTES GENÉRICOS ---
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button';
import { DialogFrameComponent } from '../../../shared/components/dialog-frame/dialog-frame';

// --- Importaciones para MatTableDataSource y Paginación ---
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Importa MatPaginator y su módulo
import { ViewChild, AfterViewInit } from '@angular/core'; // Para inyectar el paginador

// --- Modulo MatCard para el Filtro ---
import { MatCardModule } from '@angular/material/card';

// --- Componente de Diálogo (Hijo) ---
@Component({
  selector: 'dialog-producto',
  template: `
    <app-dialog-frame (closeDialog)="onNoClick()">

      <span dialog-title>{{ data.producto?.id ? 'Editar Producto' : 'Crear Nuevo Producto' }}</span>

      <form [formGroup]="form" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        
        <div class="sm:col-span-2">
            <app-custom-input formControlName="nombre" label="Nombre">
              @if(form.get('nombre')?.hasError('required')) {
                <mat-error>El nombre es obligatorio.</mat-error>
              }
            </app-custom-input>
        </div>

        <div class="sm:col-span-2">
            <mat-form-field appearance="fill" class="w-full">
                <mat-label>Descripción</mat-label>
                <textarea matInput formControlName="descripcion"></textarea>
            </mat-form-field>
        </div>

        <app-custom-input formControlName="precioVenta" label="Precio Venta" type="number">
            @if(form.get('precioVenta')?.hasError('required')) {
                <mat-error>El precio de venta es obligatorio.</mat-error>
            }
        </app-custom-input>

        <app-custom-input formControlName="precioCompra" label="Precio Compra" type="number"></app-custom-input>
        
        <app-custom-input formControlName="stock" label="Cantidad en Stock" type="number">
            @if(form.get('stock')?.hasError('required')) {
                <mat-error>El stock es obligatorio.</mat-error>
            }
        </app-custom-input>

        <mat-form-field appearance="fill" class="w-full">
            <mat-label>Proveedor</mat-label>
            <input type="text" placeholder="Buscar proveedor..." matInput [formControl]="proveedorCtrl" [matAutocomplete]="auto">
            <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayProveedor" (optionSelected)="proveedorSeleccionado($event)">
                @for (p of filteredProveedores | async; track p.id) {
                    <mat-option [value]="p">{{ p.nombre }}</mat-option>
                }
            </mat-autocomplete>
            @if(form.get('proveedorId')?.hasError('required')) {
                <mat-error>Debe seleccionar un proveedor.</mat-error>
            }
        </mat-form-field>

        <div class="col-span-2 flex items-center mt-2">
            <mat-checkbox formControlName="esServicioDeTiempo">Es un servicio de tiempo (PC/Consola)</mat-checkbox>
        </div>

      </form>

      <div dialog-actions>
        <app-custom-button variant="stroked" (buttonClick)="onNoClick()">Cancelar</app-custom-button>
        <app-custom-button color="primary" [disabled]="form.invalid" (buttonClick)="guardar()">Guardar</app-custom-button>
      </div>

    </app-dialog-frame>
  `,
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatCheckboxModule,
    MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatError,
    // --- Genéricos ---
    CustomInputComponent, CustomButtonComponent, DialogFrameComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ProductoDialogComponent>);
  
  public data = inject(MAT_DIALOG_DATA) as {
    producto: Partial<ProductoModel> | null,
    proveedores: ProveedorModel[]
  };

  proveedorCtrl = new FormControl();
  filteredProveedores!: Observable<ProveedorModel[]>;

  form: FormGroup = this.fb.group({
    id: [null as number | null],
    nombre: ['', Validators.required],
    descripcion: [''],
    precioVenta: [null as number | null, [Validators.required, Validators.min(0)]],
    precioCompra: [null as number | null, Validators.min(0)],
    stock: [0, [Validators.required, Validators.min(0)]],
    proveedorId: [null as number | null, Validators.required],
    esServicioDeTiempo: [false]
  });

  ngOnInit(): void {
    if (this.data.producto) {
      this.form.patchValue(this.data.producto);
      if (this.data.producto.proveedor && this.data.producto.proveedor.id) {
        this.form.patchValue({ proveedorId: this.data.producto.proveedor.id });
        const proveedorInicial = this.data.proveedores.find(p => p.id === this.data.producto!.proveedor!.id);
        if (proveedorInicial) {
          this.proveedorCtrl.setValue(proveedorInicial);
        }
      }
    }

    this.filteredProveedores = this.proveedorCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name || '';
      }),
      map(nombre => (nombre ? this._filter(nombre) : this.data.proveedores.slice()))
    );
  }

  private _filter(nombre: string): ProveedorModel[] {
    const filterValue = nombre.toLowerCase();
    return this.data.proveedores.filter(p => p.nombre.toLowerCase().includes(filterValue));
  }

  displayProveedor(proveedor: ProveedorModel): string {
    return proveedor?.nombre || '';
  }
  
  proveedorSeleccionado(event: MatAutocompleteSelectedEvent): void {
    this.form.patchValue({ proveedorId: event.option.value.id });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.form.valid) {
      const selectedProveedorId = this.form.value.proveedorId;
      const selectedProveedor = this.data.proveedores.find(p => p.id === selectedProveedorId);
      const finalProduct = { 
          ...this.data.producto, 
          ...this.form.value,
          proveedor: selectedProveedor 
      };
      delete (finalProduct as any).proveedorId;
      this.dialogRef.close(finalProduct);
    }
  }
}

// --- Componente Principal (Padre) ---
@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatToolbarModule, MatIconModule, MatDialogModule, 
    MatSnackBarModule, MatTooltipModule, CustomButtonComponent,
    // --- NUEVOS MÓDULOS PARA FILTRO Y PAGINACIÓN ---
    MatPaginatorModule, 
    MatFormFieldModule, // Necesario para el input de filtro
    MatInputModule,     // Necesario para el input de filtro
    MatCardModule
  ],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoComponent implements OnInit {
  private productoService = inject(ProductoService);
  private proveedorService = inject(ProveedorService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  
  // Referencia al componente mat-paginator en el HTML
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public dataSource: MatTableDataSource<ProductoModel> = new MatTableDataSource<ProductoModel>([]);
  public proveedores: ProveedorModel[] = []; 
  public isLoading = signal(true);
  
displayedColumns: string[] = ['nombre', 'precioVenta','precioCompra', 'stock', 'proveedor', 'acciones'];

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    
    // Opcional: Configurar la función de filtrado personalizado
    this.dataSource.filterPredicate = this.customFilterPredicate;
  }

  cargarDatos(): void {
    this.isLoading.set(true);
    forkJoin({
      proveedores: this.proveedorService.getAll(),
      productos: this.productoService.getAll()
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (resultado) => {
        this.proveedores = resultado.proveedores; 
        
        // Asignar los productos al dataSource y actualizar el signal (solo para la referencia)
        this.dataSource.data = resultado.productos;
        
        // Si tienes código que usa el signal 'productos', debes actualizarlo:
        // this.productos.set(resultado.productos); // Se puede eliminar si no se usa
      },
      error: () => this.mostrarNotificacion('Error al cargar los datos iniciales', 'error')
    });
  }

  // --- LÓGICA DE FILTRADO ---
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Se aplica el filtro a los datos. El paginador y la tabla se actualizan solos.
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Resetear el paginador a la primera página después de filtrar
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Función de Predicado Personalizado para buscar en propiedades anidadas (Proveedor)
  // y en todas las columnas relevantes (Nombre, Precio, Stock)
  customFilterPredicate(data: ProductoModel, filter: string): boolean {
    const dataStr = (data.nombre + data.descripcion + data.precioVenta + data.stock + (data.proveedor?.nombre || '')).toLowerCase();
    return dataStr.indexOf(filter) !== -1;
  }

  abrirDialogoProducto(producto?: ProductoModel): void {
    const dialogRef = this.dialog.open(ProductoDialogComponent, {
      width: 'clamp(500px, 60vw, 800px)', // Ancho flexible
      maxWidth: '95vw', // Responsive en móviles
      disableClose: true,
      panelClass: 'custom-dialog-container', // <--- CLASE CLAVE PARA ESTILOS
      data: {
        producto: producto ? { ...producto } : null,
        proveedores: this.proveedores,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarProducto(result);
      }
    });
  }

  guardarProducto(producto: ProductoModel): void {
    const operacion = producto.id
      ? this.productoService.update(producto.id, producto)
      : this.productoService.create(producto);

    operacion.subscribe({
      next: () => {
        this.mostrarNotificacion('Producto guardado exitosamente');
        this.cargarDatos();
      },
      error: () => this.mostrarNotificacion('Error al guardar el producto', 'error')
    });
  }

  eliminarProducto(id: number | undefined): void {
    if (id === undefined) return;
    this.productoService.delete(id).subscribe({
      next: () => {
        this.mostrarNotificacion('Producto eliminado');
        this.cargarDatos();
      },
      error: () => this.mostrarNotificacion('Error al eliminar el producto', 'error')
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-500', 'text-white'] : ['bg-red-500', 'text-white']
    });
  }
}