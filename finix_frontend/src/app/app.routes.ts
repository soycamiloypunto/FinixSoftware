import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout.component/layout.component';
import { HomeComponent } from './features/home-component/home-component/home-component'; // ¡Importamos el nuevo componente!

export const routes: Routes = [
  // 1. RUTA DE INICIO (HomeComponent)
  // Esta ruta manejará la raíz del sitio (/)
  {
    path: '',
    component: HomeComponent, // Muestra el HomeComponent al inicio
    pathMatch: 'full' // Asegura que solo coincida con la ruta exacta '/'
  },
  
  // 2. RUTA PRINCIPAL CON LAYOUT
  // Esta ruta padre utiliza el LayoutComponent como plantilla para el resto de la aplicación.
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Nota: El path: '' anterior ahora es solo '/' y está fuera de este bloque
      { 
        path: 'tiempos', 
        // Carga perezosa: el componente solo se descarga cuando se visita la ruta.
        loadComponent: () => import('../app/features/tiempo/gestion-tiempo/gestion-tiempo.component').then(m => m.GestionTiempoComponent) 
      },
      { 
        path: 'ventas', 
        loadComponent: () => import('../app/features/venta/venta/venta.component').then(m => m.VentaComponent) 
      },
      // --- RUTA NUEVA ---
      { 
        path: 'compras', 
        loadComponent: () => import('../app/features/compras/compra/compra').then(m => m.CompraComponent) 
      },
      // --- RUTA NUEVA ---
      { 
        path: 'egresos', 
        loadComponent: () => import('../app/features/egreso/egreso/egreso').then(m => m.EgresoComponent) 
      },
      { 
        path: 'productos', 
        loadComponent: () => import('../app/features/producto/producto/producto.component').then(m => m.ProductoComponent) 
      },
      { 
        path: 'proveedores', 
        loadComponent: () => import('../app/features/proveedor/proveedor/proveedor.component').then(m => m.ProveedorComponent) 
      },
      {
        path: 'reporte-diario',
        loadComponent: () => import('../app/features/reportediario/reporte.diario.component/reporte.diario.component').then(m => m.ReporteDiarioComponent)
      },
    ]
  },
  
  // 3. RUTA CATCH-ALL (404)
  // Esta ruta atrapará CUALQUIER otra URL que no haya coincidido con las anteriores
  {
    path: '**', // Doble asterisco significa "cualquier cosa"
    redirectTo: '', // Redirige de vuelta a la ruta raíz (que ahora es HomeComponent)
    pathMatch: 'full' 
  }
];
