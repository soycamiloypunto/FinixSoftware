import { Component, OnInit, signal, inject, ChangeDetectionStrategy, Inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProveedorModel } from '../models/proveedor.model';
import { ProveedorService } from '../services/proveedor.services';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';
import { DialogFrameComponent } from '../../../shared/components/dialog-frame/dialog-frame';


// --- Módulos de Angular Material ---
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule,
    MatToolbarModule, MatTooltipModule, CustomButtonComponent
  ],
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProveedorComponent implements OnInit {

  private proveedorService = inject(ProveedorService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  proveedores = signal<ProveedorModel[]>([]);
  filtro = signal<string>('');
  
  proveedoresFiltrados = computed(() => {
    const proveedores = this.proveedores();
    const filtro = this.filtro().toLowerCase();
    if (!filtro) {
      return proveedores;
    }
    return proveedores.filter(p =>
      p.nombre.toLowerCase().includes(filtro) ||
      (p.nit && p.nit.toLowerCase().includes(filtro))
    );
  });

  displayedColumns: string[] = ['nombre', 'nit', 'telefono', 'acciones'];

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.getAll().subscribe({
      next: (data) => this.proveedores.set(data),
      error: () => this.mostrarNotificacion('Error al cargar los proveedores', 'error')
    });
  }

  onFiltroChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.filtro.set(valor);
  }

  abrirDialogoProveedor(proveedor?: ProveedorModel): void {
  const dialogRef = this.dialog.open(ProveedorDialogComponent, {
    width: 'clamp(500px, 60vw, 800px)', // Ancho flexible: mínimo 500px, idealmente 60% del ancho de la pantalla, máximo 800px
    maxWidth: '95vw', // Aseguramos que no se salga de la pantalla en móviles
    disableClose: true,
    // --- LÍNEA A AÑADIR ---
    // Esta clase nos permitirá personalizar el contenedor del diálogo desde CSS.
    panelClass: 'custom-dialog-container',
    // -----------------------
    data: proveedor ? { ...proveedor } : null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.guardarProveedor(result);
    }
  });
}


  guardarProveedor(proveedor: ProveedorModel): void {
    const operacion = proveedor.id
      ? this.proveedorService.update(proveedor.id, proveedor)
      : this.proveedorService.create(proveedor);

    operacion.subscribe({
      next: () => {
        this.mostrarNotificacion('Proveedor guardado con éxito');
        this.cargarProveedores();
      },
      error: () => this.mostrarNotificacion('Error al guardar el proveedor', 'error')
    });
  }

  eliminarProveedor(id: number | undefined): void {
    if (id === undefined) return;

    this.proveedorService.delete(id).subscribe({
      next: () => {
        this.mostrarNotificacion('Proveedor eliminado');
        this.cargarProveedores();
      },
      error: () => this.mostrarNotificacion('Error al eliminar el proveedor', 'error')
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-500', 'text-white'] : ['bg-red-500', 'text-white']
    });
  }
}

// --- Componente de Diálogo ---
@Component({
  selector: 'app-proveedor-dialog',
  template: `
    <app-dialog-frame (closeDialog)="onNoClick()">

      <span dialog-title>{{ data ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</span>

      <!-- Con la configuración de Tailwind correcta, estas clases ahora funcionarán -->
      <form [formGroup]="form" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        
        <app-custom-input formControlName="nombre" label="Nombre">
          @if(form.get('nombre')?.hasError('required')) {
            <mat-error>El nombre es obligatorio.</mat-error>
          }
        </app-custom-input>

        <app-custom-input formControlName="nit" label="NIT"></app-custom-input>
        
        <app-custom-input formControlName="telefono" label="Teléfono" type="tel"></app-custom-input>

        <app-custom-input formControlName="direccion" label="Dirección"></app-custom-input>

        <div class="sm:col-span-2">
          <app-custom-input
            formControlName="email"
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@correo.com">
            @if(form.get('email')?.hasError('email')) {
              <mat-error>Por favor, introduce un correo válido.</mat-error>
            }
          </app-custom-input>
        </div>

      </form>

      <div dialog-actions>
        <app-custom-button variant="stroked" (buttonClick)="onNoClick()">Cancelar</app-custom-button>
        <app-custom-button color="primary" [disabled]="form.invalid" (buttonClick)="onSaveClick()">Guardar</app-custom-button>
      </div>

    </app-dialog-frame>
  `,
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatError,
    MatInputModule, MatButtonModule, MatIconModule, CustomInputComponent,
    DialogFrameComponent, CustomButtonComponent
  ]
})


export class ProveedorDialogComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor(
    public dialogRef: MatDialogRef<ProveedorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProveedorModel | null
  ) {
    this.form = this.fb.group({
      id: [data?.id],
      nombre: [data?.nombre || '', Validators.required],
      nit: [data?.nit || ''],
      telefono: [data?.telefono || ''],
      direccion: [data?.direccion || ''],
      email: [data?.email || '', [Validators.email]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

}

