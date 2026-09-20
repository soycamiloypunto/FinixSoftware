const fs = require('fs');

function fixEgreso() {
    let tsPath = "finix_frontend/src/app/features/egreso/egreso/egreso.ts";
    let ts = fs.readFileSync(tsPath, 'utf8');
    ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
    ts = ts.replace("import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';", "import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';\nimport { FormsModule } from '@angular/forms';");
    ts = ts.replace("imports: [", "imports: [MatPaginatorModule, FormsModule,");
    ts = ts.replace("egresos = signal<EgresoModel[]>([]);", "dataSource = new MatTableDataSource<EgresoModel>([]);\n    @ViewChild(MatPaginator) paginator!: MatPaginator;\n    fechaFiltro: string = new Date().toISOString().substring(0,10);");
    ts = ts.replace("implements OnInit {", "implements OnInit, AfterViewInit {");
    ts = ts.replace("cargarEgresos() {\n    this.egresoService.getEgresos().subscribe(data => this.egresos.set(data));\n  }", "ngAfterViewInit() { this.dataSource.paginator = this.paginator; }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }\n\n  cargarEgresos() {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.egresoService.getEgresosByDateRange(start, end).subscribe(data => this.dataSource.data = data);\n  }");
    ts = ts.replace("this.egresos()", "this.dataSource.data");
    ts = ts.replace("!this.egresos().length", "!this.dataSource.data.length");
    fs.writeFileSync(tsPath, ts);

    let htmlPath = "finix_frontend/src/app/features/egreso/egreso/egreso.html";
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestin de Egresos</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestión de Egresos</h1>
        <div class="flex items-center space-x-4 mx-4">
            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarEgresos()" class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
        </div>`);
    html = html.replace('[dataSource]="egresos()"', '[dataSource]="dataSource"');
    html = html.replace('@if (!egresos().length) {', '@if (!dataSource.data.length) {');
    html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
    fs.writeFileSync(htmlPath, html);
}

function fixCompra() {
    let tsPath = "finix_frontend/src/app/features/compras/compra/compra.ts";
    let ts = fs.readFileSync(tsPath, 'utf8');
    ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
    ts = ts.replace("import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';", "import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';\nimport { FormsModule } from '@angular/forms';");
    ts = ts.replace("imports: [", "imports: [MatPaginatorModule, FormsModule,");
    ts = ts.replace("compras = signal<CompraModel[]>([]);", "dataSource = new MatTableDataSource<CompraModel>([]);\n    @ViewChild(MatPaginator) paginator!: MatPaginator;\n    fechaFiltro: string = new Date().toISOString().substring(0,10);");
    ts = ts.replace("implements OnInit {", "implements OnInit, AfterViewInit {");
    ts = ts.replace("cargarCompras() {\n    this.compraService.getCompras().subscribe(data => this.compras.set(data));\n  }", "ngAfterViewInit() { this.dataSource.paginator = this.paginator; }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }\n\n  cargarCompras() {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.compraService.getComprasByDateRange(start, end).subscribe(data => this.dataSource.data = data);\n  }");
    fs.writeFileSync(tsPath, ts);

    let htmlPath = "finix_frontend/src/app/features/compras/compra/compra.html";
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestin de Compras</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestión de Compras</h1>
        <div class="flex items-center space-x-4 mx-4">
            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarCompras()" class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
        </div>`);
    html = html.replace('[dataSource]="compras()"', '[dataSource]="dataSource"');
    html = html.replace('@if (!compras().length) {', '@if (!dataSource.data.length) {');
    html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
    fs.writeFileSync(htmlPath, html);
}

function fixVenta() {
    let tsPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
    let ts = fs.readFileSync(tsPath, 'utf8');
    ts = ts.replace("import { CommonModule } from '@angular/common';", "import { CommonModule } from '@angular/common';\nimport { FormsModule } from '@angular/forms';");
    ts = ts.replace("imports: [", "imports: [FormsModule,");
    ts = ts.replace("ventas = signal<VentaModel[]>([]);", "ventas = signal<VentaModel[]>([]);\n    fechaFiltro: string = new Date().toISOString().substring(0,10);");
    ts = ts.replace("cargarVentasRecientes() {\n    this.ventaService.getVentasRecientes().subscribe(data => {\n      this.ventas.set(data);\n      this.cargarNombresClientesYVendedores(data);\n    });\n  }", "cargarVentasRecientes() {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.ventaService.getVentasByDateRange(start, end).subscribe(data => {\n      this.ventas.set(data);\n      this.cargarNombresClientesYVendedores(data);\n    });\n  }");
    fs.writeFileSync(tsPath, ts);

    let htmlPath = "finix_frontend/src/app/features/venta/venta/venta.component.html";
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestin de Ventas</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestión de Ventas</h1>
        <div class="flex items-center space-x-4 mx-4">
            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarVentasRecientes()" class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
        </div>`);
    fs.writeFileSync(htmlPath, html);
}

function fixProveedor() {
    let tsPath = "finix_frontend/src/app/features/proveedor/proveedor/proveedor.component.ts";
    let ts = fs.readFileSync(tsPath, 'utf8');
    ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
    ts = ts.replace("import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';", "import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';\nimport { FormsModule } from '@angular/forms';");
    ts = ts.replace("imports: [", "imports: [MatPaginatorModule, FormsModule,");
    ts = ts.replace("proveedores = signal<ProveedorModel[]>([]);", "dataSource = new MatTableDataSource<ProveedorModel>([]);\n    @ViewChild(MatPaginator) paginator!: MatPaginator;");
    ts = ts.replace("implements OnInit {", "implements OnInit, AfterViewInit {");
    ts = ts.replace("cargarProveedores() {\n    this.proveedorService.getProveedores().subscribe(data => this.proveedores.set(data));\n  }", "ngAfterViewInit() { this.dataSource.paginator = this.paginator; }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }\n\n  cargarProveedores() {\n    this.proveedorService.getProveedores().subscribe(data => this.dataSource.data = data);\n  }");
    fs.writeFileSync(tsPath, ts);

    let htmlPath = "finix_frontend/src/app/features/proveedor/proveedor/proveedor.component.html";
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Directorio de Proveedores</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Directorio de Proveedores</h1>
        <div class="flex items-center space-x-4 mx-4">
            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
        </div>`);
    html = html.replace('[dataSource]="proveedores()"', '[dataSource]="dataSource"');
    html = html.replace('@if (!proveedores().length) {', '@if (!dataSource.data.length) {');
    html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
    fs.writeFileSync(htmlPath, html);
}

function fixTiempo() {
    let modelPath = "finix_frontend/src/app/features/tiempo/models/sesiontiempo.model.ts";
    let m = fs.readFileSync(modelPath, 'utf8');
    m = m.replace("export interface SesionTiempo {", "export interface SesionProductoAdicionalDTO { id: number; productoId: number; productoNombre: string; cantidad: number; precioUnitarioVenta: number; total: number; }\n\nexport interface SesionTiempo {");
    m = m.replace("puesto?: string;", "puesto?: string;\n    productosAdicionales?: SesionProductoAdicionalDTO[];");
    fs.writeFileSync(modelPath, m);

    let srvPath = "finix_frontend/src/app/features/tiempo/services/gestiontiempo.service.ts";
    let s = fs.readFileSync(srvPath, 'utf8');
    s = s.replace("import { HttpClient } from '@angular/common/http';", "import { HttpClient, HttpParams } from '@angular/common/http';");
    s = s.replace("getSesionesFinalizadas(): Observable<SesionTiempo[]> {\n    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/finalizadas`);\n  }", "getSesionesFinalizadas(fechaInicio?: string, fechaFin?: string): Observable<SesionTiempo[]> {\n    let params = new HttpParams();\n    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);\n    if (fechaFin) params = params.set('fechaFin', fechaFin);\n    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/finalizadas`, { params });\n  }");
    fs.writeFileSync(srvPath, s);

    let tsPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.ts";
    let ts = fs.readFileSync(tsPath, 'utf8');
    ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';\nimport { FormsModule } from '@angular/forms';");
    ts = ts.replace("imports: [", "imports: [MatPaginatorModule, FormsModule,");
    ts = ts.replace("sesionesFinalizadas = signal<SesionTiempoUI[]>([]);", "sesionesFinalizadas = signal<SesionTiempoUI[]>([]);\n    dataSourceFinalizadas = new MatTableDataSource<SesionTiempoUI>([]);\n    @ViewChild(MatPaginator) paginator!: MatPaginator;\n    fechaFiltro: string = new Date().toISOString().substring(0,10);");
    ts = ts.replace("implements OnInit, OnDestroy {", "implements OnInit, OnDestroy, AfterViewInit {");
    ts = ts.replace("displayedColumnsHistorial: string[] = ['equipo', 'inicio', 'fin', 'duracion', 'cobrado'];", "displayedColumnsHistorial: string[] = ['equipo', 'inicio', 'fin', 'duracion', 'productosAdicionales', 'cobrado'];");
    ts = ts.replace("cargarHistorial(): void {\n    this.tiempoService.getSesionesFinalizadas().subscribe(sesiones => {\n      const sesionesUI = this.mapToSesionUI(sesiones);\n      this.sesionesFinalizadas.set(sesionesUI);\n    });\n  }", "ngAfterViewInit() { this.dataSourceFinalizadas.paginator = this.paginator; }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSourceFinalizadas.filter = filterValue.trim().toLowerCase();\n  }\n\n  cargarHistorial(): void {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.tiempoService.getSesionesFinalizadas(start, end).subscribe(sesiones => {\n      const sesionesUI = this.mapToSesionUI(sesiones);\n      this.sesionesFinalizadas.set(sesionesUI);\n      this.dataSourceFinalizadas.data = sesionesUI;\n    });\n  }");
    fs.writeFileSync(tsPath, ts);

    let htmlPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.html";
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.replace('<h2><i class="fa-solid fa-clock-rotate-left mr-2"></i>Historial de Tiempos Cobrados</h2>', `<h2><i class="fa-solid fa-clock-rotate-left mr-2"></i>Historial de Tiempos Cobrados</h2>
        <div class="flex items-center space-x-4 mb-4">
            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarHistorial()" class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
        </div>`);
    html = html.replace('[dataSource]="sesionesFinalizadas()"', '[dataSource]="dataSourceFinalizadas"');
    html = html.replace('<ng-container matColumnDef="cobrado">', `<ng-container matColumnDef="productosAdicionales">
              <th mat-header-cell *matHeaderCellDef> Productos Adicionales </th>
              <td mat-cell *matCellDef="let s">
                 <ul class="text-xs m-0 pl-4">
                    <li *ngFor="let prod of s.productosAdicionales">
                       {{prod.cantidad}}x {{prod.nombreProducto}} (\${{prod.total | number:'1.0-0'}})
                    </li>
                 </ul>
              </td>
            </ng-container>

            <ng-container matColumnDef="cobrado">`);
    html = html.replace('@if (!sesionesFinalizadas().length) {', '@if (!dataSourceFinalizadas.data.length) {');
    html = html.replace('</table>\n      </div>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>\n      </div>');
    fs.writeFileSync(htmlPath, html);
}

try { fixEgreso(); } catch(e) { console.error('Error in fixEgreso:', e); }
try { fixCompra(); } catch(e) { console.error('Error in fixCompra:', e); }
try { fixVenta(); } catch(e) { console.error('Error in fixVenta:', e); }
try { fixProveedor(); } catch(e) { console.error('Error in fixProveedor:', e); }
try { fixTiempo(); } catch(e) { console.error('Error in fixTiempo:', e); }
console.log("Done");
