// archivo: app/features/egreso/egreso.component.ts

import { Component, OnInit, signal, inject, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- Modelos y Servicios ---
import { EgresoModel } from '../models/egreso.model';
import { EgresoService } from '../services/egreso.service';

// --- Módulos y Componentes Genéricos ---
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';
import { DialogFrameComponent } from '../../../shared/components/dialog-frame/dialog-frame';


// --- Componente de Diálogo para Registrar Egreso ---
@Component({
  selector: 'dialog-egreso',
  template: `
    <app-dialog-frame (closeDialog)="onNoClick()" [title]="data.egreso ? 'Editar Egreso' : 'Registrar Nuevo Egreso'">
        <form [formGroup]="form" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 p-6">
            <div class="sm:col-span-2">
                <app-custom-input label="Concepto" formControlName="concepto">
                    @if(form.get('concepto')?.hasError('required')){ <mat-error>El concepto es obligatorio.</mat-error> }
                </app-custom-input>
            </div>
            <app-custom-input label="Monto" type="number" formControlName="monto">
                @if(form.get('monto')?.hasError('required')){ <mat-error>El monto es obligatorio.</mat-error> }
                @if(form.get('monto')?.hasError('min')){ <mat-error>El monto debe ser mayor a 0.</mat-error> }
            </app-custom-input>
            <app-custom-input label="Nombre del Beneficiario" formControlName="nombreBeneficiario">
                @if(form.get('nombreBeneficiario')?.hasError('required')){ <mat-error>El nombre es obligatorio.</mat-error> }
            </app-custom-input>
            <app-custom-input label="Tipo de Identificación" formControlName="tipoIdentificacion"></app-custom-input>
            <app-custom-input label="Número de Identificación" formControlName="numeroIdentificacion"></app-custom-input>
            <app-custom-input label="Teléfono (Opcional)" type="tel" formControlName="telefonoBeneficiario"></app-custom-input>
        </form>
        <div dialog-actions>
            <app-custom-button variant="stroked" (buttonClick)="onNoClick()">Cancelar</app-custom-button>
            <app-custom-button color="primary" [disabled]="form.invalid" (buttonClick)="guardar()">Guardar</app-custom-button>
        </div>
    </app-dialog-frame>
  `,
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatError, MatFormFieldModule,
    CustomButtonComponent, CustomInputComponent, DialogFrameComponent
  ]
})
export class EgresoDialogComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EgresoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { egreso: EgresoModel | null }
  ) {
    this.form = this.fb.group({
      id: [data.egreso?.id],
      monto: [data.egreso?.monto, [Validators.required, Validators.min(1)]],
      concepto: [data.egreso?.concepto, Validators.required],
      nombreBeneficiario: [data.egreso?.nombreBeneficiario, Validators.required],
      tipoIdentificacion: [data.egreso?.tipoIdentificacion],
      numeroIdentificacion: [data.egreso?.numeroIdentificacion],
      telefonoBeneficiario: [data.egreso?.telefonoBeneficiario]
    });
  }
  
  guardar() {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.form.value, fecha: new Date().toISOString() });
    }
  }
  onNoClick = () => this.dialogRef.close();
}


// --- Componente Padre ---
@Component({
  selector: 'app-egreso',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule,
    MatDialogModule, MatSnackBarModule, MatButtonModule, MatTooltipModule
  ],
  templateUrl: './egreso.html',
  styleUrls: ['./egreso.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgresoComponent implements OnInit {
  private egresoService = inject(EgresoService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  egresos = signal<EgresoModel[]>([]);
  displayedColumns = ['fecha', 'concepto', 'beneficiario', 'monto', 'acciones'];
  
  ngOnInit() {
    this.cargarEgresos();
  }
  
  cargarEgresos() {
    this.egresoService.getEgresos().subscribe(data => this.egresos.set(data));
  }
  
  abrirDialogoEgreso(egreso?: EgresoModel) {
    const dialogRef = this.dialog.open(EgresoDialogComponent, {
      width: 'clamp(500px, 60vw, 800px)',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { egreso: egreso ? { ...egreso } : null }
    });
    
    dialogRef.afterClosed().subscribe((result: EgresoModel) => {
        if(result) this.guardarEgreso(result);
    });
  }
  
  guardarEgreso(egreso: EgresoModel) {
      const operacion = egreso.id
        ? this.egresoService.updateEgreso(egreso.id, egreso)
        : this.egresoService.createEgreso(egreso);
        
      operacion.subscribe({
          next: () => {
              this.mostrarNotificacion('Egreso guardado con éxito');
              this.cargarEgresos();
          },
          error: () => this.mostrarNotificacion('Error al guardar el egreso', 'error')
      });
  }
  
  eliminarEgreso(id: number | undefined) {
      if(id === undefined) return;
      // Aquí podrías abrir un diálogo de confirmación si lo deseas
      this.egresoService.deleteEgreso(id).subscribe({
          next: () => {
              this.mostrarNotificacion('Egreso eliminado');
              this.cargarEgresos();
          },
          error: () => this.mostrarNotificacion('Error al eliminar el egreso', 'error')
      });
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-500', 'text-white'] : ['bg-red-500', 'text-white']
    });
  }
}