// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout.component/layout.component';
import { HomeComponent } from './features/home-component/home-component/home-component'; 
import { LoginComponent } from './features/auth/login/login';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    
    // 1. RUTA PÚBLICA (LOGIN)
    // Esta ruta debe ir fuera del LayoutComponent, ya que el login no debe tener headers ni navbars.
    { path: 'login', component: LoginComponent },

    // 2. RUTA PRINCIPAL PROTEGIDA CON LAYOUT
    // Este bloque de rutas representa toda la aplicación interna (dashboard, features).
    {
        path: '',
        component: LayoutComponent,
        // Proteger todas las rutas hijas con el AuthGuard
        canActivate: [AuthGuard], 
        children: [
            // Ruta Raíz Protegida (Redirige a la página principal después de login)
            {
                path: '',
                component: HomeComponent, 
                pathMatch: 'full' 
            },
            
            // RUTAS DE FEATURES (YA PROTEGIDAS POR EL canActivate del PADRE)
            { 
                path: 'tiempos', 
                loadComponent: () => import('../app/features/tiempo/gestion-tiempo/gestion-tiempo.component').then(m => m.GestionTiempoComponent) 
            },
            { 
                path: 'ventas', 
                loadComponent: () => import('../app/features/venta/venta/venta.component').then(m => m.VentaComponent) 
            },
            { 
                path: 'compras', 
                loadComponent: () => import('../app/features/compras/compra/compra').then(m => m.CompraComponent) 
            },
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
            // [Opcional] Añadir una ruta para crear usuarios aquí.
        ]
    },
    
    // 3. RUTA CATCH-ALL (404 / Redirección)
    // Redirige cualquier URL desconocida a la ruta de login si no hay token, 
    // o al home si la hay (gracias al AuthGuard en la ruta padre).
    {
        path: '**', 
        redirectTo: '', // Redirige a la raíz ('/'), que ahora está protegida
        pathMatch: 'full' 
    }
];