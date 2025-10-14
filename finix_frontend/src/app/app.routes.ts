import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout.component/layout.component';

export const routes: Routes = [
  // Ruta padre que utiliza el LayoutComponent como plantilla.
  // Todos los componentes hijos se renderizarán dentro del <router-outlet> del Layout.
  {
    path: '',
    component: LayoutComponent,
    children: [
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
      // Redirección por defecto a 'tiempos' si no se especifica una ruta.
      { 
        path: '', 
        redirectTo: 'tiempos', 
        pathMatch: 'full' 
      }
    ]
  },
  // Ruta "catch-all" para cualquier URL que no coincida, redirige a la raíz.
  {
    path: '', 
    redirectTo: 'tiempos', 
    pathMatch: 'full' 
  }
];
