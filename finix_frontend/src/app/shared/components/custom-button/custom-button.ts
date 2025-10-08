import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="onClick($event)"
      [ngClass]="getButtonClasses()"
      class="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
      @if (loading) {
        <mat-progress-spinner
          [diameter]="20"
          mode="indeterminate"
          [ngClass]="variant === 'stroked' ? 'text-slate-600' : 'text-white'"
        ></mat-progress-spinner>
        <span>Procesando...</span>
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    /* Ajustes para que el spinner se vea bien en botones de diferentes colores */
    .mat-primary .mat-mdc-progress-spinner {
        --mdc-circular-progress-active-indicator-color: white;
    }
    .mat-accent .mat-mdc-progress-spinner {
        --mdc-circular-progress-active-indicator-color: white;
    }
    .mat-warn .mat-mdc-progress-spinner {
        --mdc-circular-progress-active-indicator-color: white;
    }
  `]
})
export class CustomButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'flat' | 'stroked' = 'flat';
  @Input() color: 'primary' | 'accent' | 'warn' | 'default' = 'default';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }

  getButtonClasses(): string[] {
    const baseClasses = [];

    if (this.disabled || this.loading) {
      baseClasses.push('cursor-not-allowed');
    }

    if (this.variant === 'flat') {
      switch (this.color) {
        case 'primary':
          baseClasses.push('bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 focus:ring-indigo-500');
          break;
        case 'accent':
          baseClasses.push('bg-pink-600 text-white hover:bg-pink-700 disabled:bg-pink-300 focus:ring-pink-500');
          break;
        case 'warn':
          baseClasses.push('bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 focus:ring-red-500');
          break;
        default:
          baseClasses.push('bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 focus:ring-slate-400');
      }
    } else { // variant === 'stroked'
      baseClasses.push('bg-transparent border');
       switch (this.color) {
        case 'primary':
          baseClasses.push('border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500');
          break;
        case 'accent':
          baseClasses.push('border-pink-600 text-pink-600 hover:bg-pink-50 focus:ring-pink-500');
          break;
        case 'warn':
           baseClasses.push('border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500');
          break;
        default:
          baseClasses.push('border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400');
      }
    }
    return baseClasses;
  }
}
