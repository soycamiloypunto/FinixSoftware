import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './custom-input.html',
  styleUrls: ['./custom-input.css'],
  // Proveedor necesario para la integración con ControlValueAccessor
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  // Entradas para hacer el componente configurable desde fuera
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text'; // text, number, email, etc.
  @Input() hint: string = '';

  // Propiedades internas para ControlValueAccessor
  value: any = '';
  isDisabled: boolean = false;
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // --- Implementación de ControlValueAccessor ---

  // Escribe un nuevo valor desde el formulario de Angular hacia nuestro componente.
  writeValue(value: any): void {
    this.value = value;
  }

  // Registra una función de callback que debemos llamar cuando el valor en nuestro componente cambie.
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra una función de callback para cuando el control se "toca" (ej. en el evento blur).
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Se llama cuando el estado de deshabilitado del control cambia.
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // --- Métodos para conectar el template con ControlValueAccessor ---

  // Se llama cuando el valor del input en el HTML cambia.
  onValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(this.value); // Informamos a Angular del cambio.
  }

  // Se llama cuando el usuario sale del input.
  onBlur(): void {
    this.onTouched(); // Informamos a Angular que el control fue "tocado".
  }
}