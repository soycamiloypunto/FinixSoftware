// src/app/shared/components/dialog-frame/dialog-frame.component.ts

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-frame',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './dialog-frame.html',
  styleUrls: ['./dialog-frame.css']
})
export class DialogFrameComponent {
  // Creamos un evento de salida para notificar cuando se debe cerrar el diálogo.
  @Output() closeDialog = new EventEmitter<void>();
}