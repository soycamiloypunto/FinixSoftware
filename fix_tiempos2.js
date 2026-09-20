const fs = require('fs');

let tsPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

// Imports
ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
ts = ts.replace("imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,", "imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatPaginatorModule,");

ts = ts.replace("export class GestionTiempoComponent implements OnInit, OnDestroy {", "export class GestionTiempoComponent implements OnInit, OnDestroy, AfterViewInit {");

ts = ts.replace("sesionesFinalizadas = signal<SesionTiempoUI[]>([]);", "sesionesFinalizadas = signal<SesionTiempoUI[]>([]);\n  dataSourceFinalizadas = new MatTableDataSource<SesionTiempoUI>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n  fechaFiltro: string = new Date().toISOString().substring(0,10);");
ts = ts.replace("displayedColumnsFinalizadas: string[] = ['servicio', 'duracion', 'total', 'fechaFin'];", "displayedColumnsFinalizadas: string[] = ['servicio', 'duracion', 'productosAdicionales', 'total', 'fechaFin'];");

ts = ts.replace("  ngOnInit(): void {", "  ngAfterViewInit() {\n    this.dataSourceFinalizadas.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSourceFinalizadas.filter = filterValue.trim().toLowerCase();\n  }\n\n  ngOnInit(): void {");

ts = ts.replace("sesionesFinalizadas: this.tiempoService.getSesionesFinalizadas()", "sesionesFinalizadas: this.tiempoService.getSesionesFinalizadas(new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString(), new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString())");

ts = ts.replace("this.sesionesFinalizadas.set(sesionesFinalizadasUI);", "this.sesionesFinalizadas.set(sesionesFinalizadasUI);\n          this.dataSourceFinalizadas.data = sesionesFinalizadasUI;");

ts = ts.replace("  cargarHistorial(): void {\r\n    this.tiempoService.getSesionesFinalizadas().subscribe(sesiones => {\r\n      const sesionesUI = this.mapToSesionUI(sesiones);\r\n      this.sesionesFinalizadas.set(sesionesUI);\r\n    });\r\n  }", "  cargarHistorial(): void {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.tiempoService.getSesionesFinalizadas(start, end).subscribe(sesiones => {\n      const sesionesUI = this.mapToSesionUI(sesiones);\n      this.sesionesFinalizadas.set(sesionesUI);\n      this.dataSourceFinalizadas.data = sesionesUI;\n    });\n  }");
ts = ts.replace("  cargarHistorial(): void {\n    this.tiempoService.getSesionesFinalizadas().subscribe(sesiones => {\n      const sesionesUI = this.mapToSesionUI(sesiones);\n      this.sesionesFinalizadas.set(sesionesUI);\n    });\n  }", "  cargarHistorial(): void {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.tiempoService.getSesionesFinalizadas(start, end).subscribe(sesiones => {\n      const sesionesUI = this.mapToSesionUI(sesiones);\n      this.sesionesFinalizadas.set(sesionesUI);\n      this.dataSourceFinalizadas.data = sesionesUI;\n    });\n  }");

fs.writeFileSync(tsPath, ts);

let htmlPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('Historial de Tiempos Cobrados\r\n            </h2>', `Historial de Tiempos Cobrados\r\n            </h2>\n      <div class="flex items-center space-x-4 mb-4">\n          <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarHistorial()" class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">\n          <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">\n      </div>`);
html = html.replace('Historial de Tiempos Cobrados\n            </h2>', `Historial de Tiempos Cobrados\n            </h2>\n      <div class="flex items-center space-x-4 mb-4">\n          <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarHistorial()" class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">\n          <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">\n      </div>`);

html = html.replace(/\[dataSource\]="sesionesFinalizadas\(\)"/g, '[dataSource]="dataSourceFinalizadas"');
html = html.replace(/@if \(!sesionesFinalizadas\(\)\.length\) \{/g, '@if (!dataSourceFinalizadas.data.length) {');

html = html.replace('<ng-container matColumnDef="total">', `<ng-container matColumnDef="productosAdicionales">\n              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600 dark:text-gray-300"> Productos </th>\n              <td mat-cell *matCellDef="let element" class="text-gray-800 dark:text-gray-200 py-3">\n                 <ul class="text-xs m-0 pl-4">\n                    <li *ngFor="let prod of element.productosAdicionales">\n                       {{prod.cantidad}}x {{prod.nombreProducto}} ($\{{prod.total | number:'1.0-0'}})\n                    </li>\n                 </ul>\n              </td>\n            </ng-container>\n\n            <ng-container matColumnDef="total">`);

html = html.replace('</mat-table>', '</mat-table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
fs.writeFileSync(htmlPath, html);

let srvPath = "finix_frontend/src/app/features/tiempo/services/gestiontiempo.service.ts";
let srv = fs.readFileSync(srvPath, 'utf8');
srv = srv.replace("import { HttpClient } from '@angular/common/http';", "import { HttpClient, HttpParams } from '@angular/common/http';");
srv = srv.replace("  getSesionesFinalizadas(): Observable<SesionTiempo[]> {\r\n    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/finalizadas`);\r\n  }", "  getSesionesFinalizadas(fechaInicio?: string, fechaFin?: string): Observable<SesionTiempo[]> {\n    let params = new HttpParams();\n    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);\n    if (fechaFin) params = params.set('fechaFin', fechaFin);\n    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/finalizadas`, { params });\n  }");
srv = srv.replace("  getSesionesFinalizadas(): Observable<SesionTiempo[]> {\n    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/finalizadas`);\n  }", "  getSesionesFinalizadas(fechaInicio?: string, fechaFin?: string): Observable<SesionTiempo[]> {\n    let params = new HttpParams();\n    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);\n    if (fechaFin) params = params.set('fechaFin', fechaFin);\n    return this.http.get<SesionTiempo[]>(`${this.apiUrl}/finalizadas`, { params });\n  }");
fs.writeFileSync(srvPath, srv);

let modelPath = "finix_frontend/src/app/features/tiempo/models/sesiontiempo.model.ts";
let model = fs.readFileSync(modelPath, 'utf8');
model = model.replace("puesto?: string;", "puesto?: string;\n    productosAdicionales?: any[];");
fs.writeFileSync(modelPath, model);

console.log("Tiempos fixed");
