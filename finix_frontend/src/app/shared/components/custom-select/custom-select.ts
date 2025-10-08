import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './custom-select.html',
  styleUrls: ['./custom-select.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor {
  // --- Entradas de Configuración ---
  @Input() label: string = '';
  @Input() options: any[] = [];
  // 'bindValue' es la propiedad del objeto que se usará como valor (ej: 'id')
  @Input() bindValue: string = 'id';
  // 'bindLabel' es la propiedad que se mostrará al usuario (ej: 'nombre')
  @Input() bindLabel: string = 'nombre';

  // --- Propiedades de ControlValueAccessor ---
  value: any = '';
  isDisabled: boolean = false;
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // --- Implementación de ControlValueAccessor ---
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}