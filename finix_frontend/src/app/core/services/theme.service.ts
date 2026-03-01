import { Injectable, effect, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  public isDarkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
    }
    
    // Efecto reactivo: Cada vez que cambie isDarkMode, aplicamos al DOM y guardamos la preferencia
    effect(() => {
        if (!isPlatformBrowser(this.platformId)) return;

        const isDark = this.isDarkMode();
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
    } else if (savedTheme === 'light') {
      this.isDarkMode.set(false);
    } else {
      // Si no hay preferencia, usar el del Sistema Operativo
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }

    // Escuchar si el usuario cambia el tema del SO en tiempo real
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Solo cambiar dinámicamente si el usuario NO ha guardado uno manual
      if (!localStorage.getItem('theme')) {
        this.isDarkMode.set(e.matches);
      }
    });
  }

  public toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
  }
}
