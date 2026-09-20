const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');
ts = ts.replace("ventasRecientes = signal<VentaModel[]>([]);", "ventasRecientes = signal<VentaModel[]>([]);\n  fechaFiltro: string = new Date().toISOString().substring(0,10);");
ts = ts.replace("import { CommonModule, CurrencyPipe } from '@angular/common';", "import { CommonModule, CurrencyPipe } from '@angular/common';\nimport { FormsModule } from '@angular/forms';");
ts = ts.replace("imports: [\n    CommonModule,", "imports: [\n    CommonModule, FormsModule,");
ts = ts.replace("cargarVentasRecientes(): void {\n    this.ventaService.getUltimasVentas(20).subscribe(data => {\n      this.ventasRecientes.set(data);\n    });\n  }", "cargarVentasRecientes(): void {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.ventaService.getVentasByDateRange(start, end).subscribe(data => {\n      this.ventasRecientes.set(data);\n    });\n  }");
fs.writeFileSync(tsPath, ts);

let htmlPath = "finix_frontend/src/app/features/venta/venta/venta.component.html";
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Ventas Registradas</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Ventas Registradas</h1>
    <div class="flex items-center space-x-4 mx-4">
        <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarVentasRecientes()" class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
    </div>`);
fs.writeFileSync(htmlPath, html);

let srvPath = "finix_frontend/src/app/features/venta/services/venta.services.ts";
let srv = fs.readFileSync(srvPath, 'utf8');
srv = srv.replace("import { HttpClient } from '@angular/common/http';", "import { HttpClient, HttpParams } from '@angular/common/http';");
srv = srv.replace("getUltimasVentas(limite: number): Observable<VentaModel[]> {", "getVentasByDateRange(fechaInicio: string, fechaFin: string): Observable<VentaModel[]> {\n    let params = new HttpParams();\n    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);\n    if (fechaFin) params = params.set('fechaFin', fechaFin);\n    return this.http.get<VentaModel[]>(this.apiUrl + '/by-date', { params });\n  }\n\n  getUltimasVentas(limite: number): Observable<VentaModel[]> {");
fs.writeFileSync(srvPath, srv);
