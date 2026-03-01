import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button 
      mat-icon-button
      class="transition-transform hover:scale-110"
      (click)="themeService.toggleTheme()"
      [attr.aria-label]="'Toggle theme'">
      
      <mat-icon *ngIf="!themeService.isDarkMode()" class="text-gray-700 dark:text-gray-300">dark_mode</mat-icon>
      <mat-icon *ngIf="themeService.isDarkMode()" class="text-gray-100">light_mode</mat-icon>
      
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
}
