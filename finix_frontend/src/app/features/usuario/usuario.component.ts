// src/app/features/usuario/usuario.component.ts

import { Component, OnInit, signal, inject, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';

// --- Módulos de Angular Material ---
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

// --- COMPONENTES GENÉRICOS ---
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button';
import { DialogFrameComponent } from '../../shared/components/dialog-frame/dialog-frame';

// --- Modelos y Servicios ---
import { UsuarioService, UsuarioModel, RegistroUsuarioDTO } from './services/usuario.service';

// --- Componente de Diálogo de Usuario (Hijo) ---
@Component({
  selector: 'dialog-usuario',
  template: `
    <app-dialog-frame (closeDialog)="onNoClick()">

      <span dialog-title>{{ data.usuario?.id ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</span>

      <form [formGroup]="form" class="grid grid-cols-1 gap-y-3">
        
        <app-custom-input formControlName="username" label="Nombre de Usuario">
          @if(form.get('username')?.hasError('required')) {
            <mat-error>El nombre de usuario es obligatorio.</mat-error>
          }
        </app-custom-input>

        <app-custom-input formControlName="email" label="Correo Electrónico" type="email">
          @if(form.get('email')?.hasError('required')) {
            <mat-error>El correo electrónico es obligatorio.</mat-error>
          }
          @if(form.get('email')?.hasError('email')) {
            <mat-error>Ingrese un correo electrónico válido.</mat-error>
          }
        </app-custom-input>

        <app-custom-input formControlName="password" label="Contraseña" type="password" [placeholder]="data.usuario?.id ? 'Dejar en blanco para no cambiar' : ''">
          @if(!data.usuario?.id && form.get('password')?.hasError('required')) {
            <mat-error>La contraseña es obligatoria para nuevos usuarios.</mat-error>
          }
        </app-custom-input>

        <mat-form-field appearance="fill" class="w-full">
            <mat-label>Rol de Usuario</mat-label>
            <mat-select formControlName="rol" required>
              <mat-option value="ADMINISTRADOR">Administrador</mat-option>
              <mat-option value="ESTANDAR">Estándar</mat-option>
            </mat-select>
            @if(form.get('rol')?.hasError('required')) {
                <mat-error>Debe seleccionar un rol para el usuario.</mat-error>
            }
        </mat-form-field>

      </form>

      <div dialog-actions>
        <app-custom-button variant="stroked" (buttonClick)="onNoClick()">Cancelar</app-custom-button>
        <app-custom-button color="primary" [disabled]="form.invalid" (buttonClick)="guardar()">Guardar</app-custom-button>
      </div>

    </app-dialog-frame>
  `,
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatError, MatSelectModule,
    CustomInputComponent, CustomButtonComponent, DialogFrameComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);
  
  public data = inject(MAT_DIALOG_DATA) as {
    usuario: UsuarioModel | null
  };

  form!: FormGroup;

  ngOnInit(): void {
    const isEdit = !!this.data.usuario;
    
    // Obtener el rol actual
    let rolInicial = 'ESTANDAR';
    if (isEdit && this.data.usuario?.roles && this.data.usuario.roles.length > 0) {
      const rolName = this.data.usuario.roles[0].nombre;
      rolInicial = rolName.replace('ROLE_', '');
    }

    this.form = this.fb.group({
      id: [this.data.usuario?.id || null],
      username: [this.data.usuario?.username || '', Validators.required],
      email: [this.data.usuario?.email || '', [Validators.required, Validators.email]],
      password: ['', isEdit ? [] : [Validators.required]],
      rol: [rolInicial, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.form.valid) {
      const val = this.form.value;
      const dto: RegistroUsuarioDTO = {
        username: val.username,
        email: val.email,
        roles: [val.rol]
      };
      if (val.password && val.password.trim() !== '') {
        dto.password = val.password;
      }
      this.dialogRef.close(dto);
    }
  }
}

// --- Componente Principal (Padre) ---
@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatToolbarModule, MatIconModule, MatDialogModule, 
    MatSnackBarModule, MatTooltipModule, CustomButtonComponent, MatCardModule
  ],
  template: `
    <div class="p-4 sm:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
      
      <mat-toolbar class="bg-white dark:bg-slate-800 shadow-md rounded-lg mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestión de Usuarios</h1>
        <app-custom-button color="primary" (buttonClick)="abrirDialogoUsuario()">
          <mat-icon>person_add</mat-icon>
          <span>Nuevo Usuario</span>
        </app-custom-button>
      </mat-toolbar>

      <div class="mat-elevation-z4 overflow-hidden rounded-lg bg-white dark:bg-slate-800">
        @if (isLoading()) {
          <div class="flex justify-center items-center p-8 text-gray-500">
            Cargando usuarios...
          </div>
        } @else {
          <table mat-table [dataSource]="dataSource" class="w-full">

            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef class="dark:bg-slate-800 dark:text-slate-200"> Usuario </th>
              <td mat-cell *matCellDef="let u" class="font-medium dark:text-slate-300"> {{ u.username }} </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef class="dark:bg-slate-800 dark:text-slate-200"> Correo </th>
              <td mat-cell *matCellDef="let u" class="dark:text-slate-300"> {{ u.email }} </td>
            </ng-container>

            <ng-container matColumnDef="rol">
              <th mat-header-cell *matHeaderCellDef class="dark:bg-slate-800 dark:text-slate-200"> Rol </th>
              <td mat-cell *matCellDef="let u" class="dark:text-slate-300"> 
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="u.roles?.[0]?.nombre === 'ROLE_ADMINISTRADOR' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'">
                  {{ u.roles?.[0]?.nombre === 'ROLE_ADMINISTRADOR' ? 'Administrador' : 'Estándar' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="dark:bg-slate-800"> </th>
              <td mat-cell *matCellDef="let u" class="text-right">
                <button mat-icon-button class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-2" (click)="abrirDialogoUsuario(u)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" (click)="eliminarUsuario(u)" matTooltip="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 dark:hover:bg-slate-700/40"></tr>
          </table>
        }
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  
  public dataSource = new MatTableDataSource<UsuarioModel>([]);
  public isLoading = signal(true);
  
  displayedColumns: string[] = ['username', 'email', 'rol', 'acciones'];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading.set(true);
    this.usuarioService.getAll().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: () => this.mostrarNotificacion('Error al cargar la lista de usuarios', 'error')
    });
  }

  abrirDialogoUsuario(usuario?: UsuarioModel): void {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '450px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        usuario: usuario ? { ...usuario } : null
      }
    });

    dialogRef.afterClosed().subscribe((result: RegistroUsuarioDTO) => {
      if (result) {
        this.guardarUsuario(usuario?.id, result);
      }
    });
  }

  guardarUsuario(id: number | undefined, dto: RegistroUsuarioDTO): void {
    const operacion = id
      ? this.usuarioService.update(id, dto)
      : this.usuarioService.create(dto);

    operacion.subscribe({
      next: () => {
        this.mostrarNotificacion(id ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
        this.cargarUsuarios();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Error al guardar el usuario';
        this.mostrarNotificacion(errorMsg, 'error');
      }
    });
  }

  eliminarUsuario(usuario: UsuarioModel): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${usuario.username}?`)) {
      this.usuarioService.delete(usuario.id!).subscribe({
        next: () => {
          this.mostrarNotificacion('Usuario eliminado');
          this.cargarUsuarios();
        },
        error: () => this.mostrarNotificacion('Error al eliminar el usuario', 'error')
      });
    }
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-500', 'text-white'] : ['bg-red-500', 'text-white']
    });
  }
}
