import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Modelos y Servicios ---
import { ClienteModel } from '../models/cliente.model';
import { ClienteService } from '../services/cliente.service';

// --- Módulos de Angular Material ---
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  // --- Inyección de dependencias ---
  private clienteService = inject(ClienteService);
  private snackBar = inject(MatSnackBar);
  
  // --- Estado del componente con Signals ---
  clientes = signal<ClienteModel[]>([]);
  clienteSeleccionado = signal<ClienteModel | null>(null);
  displayedColumns: string[] = ['nombre', 'documento', 'acciones'];

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => this.clientes.set(data),
      error: () => this.mostrarNotificacion('Error al cargar los clientes', 'error')
    });
  }

  seleccionarCliente(cliente: ClienteModel | null): void {
    // Si se pasa null, crea un objeto vacío para el formulario de "nuevo cliente"
    this.clienteSeleccionado.set(cliente ? { ...cliente } : { nombre: '' });
  }

  guardarCliente(): void {
    const cliente = this.clienteSeleccionado();
    if (!cliente || !cliente.nombre) {
      this.mostrarNotificacion('El nombre del cliente es obligatorio', 'error');
      return;
    }

    const operacion = cliente.id
      ? this.clienteService.update(cliente.id, cliente)
      : this.clienteService.create(cliente);

    operacion.subscribe({
      next: () => {
        this.mostrarNotificacion('Cliente guardado con éxito');
        this.cargarClientes();
        this.seleccionarCliente(null); // Limpiar el formulario
      },
      error: () => this.mostrarNotificacion('Error al guardar el cliente', 'error')
    });
  }

  eliminarCliente(id: number | undefined): void {
    if (id === undefined) return;

    // Aquí podrías agregar un diálogo de confirmación
    this.clienteService.delete(id).subscribe({
      next: () => {
        this.mostrarNotificacion('Cliente eliminado');
        this.cargarClientes();
      },
      error: () => this.mostrarNotificacion('Error al eliminar el cliente', 'error')
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-500', 'text-white'] : ['bg-red-500', 'text-white']
    });
  }
}
