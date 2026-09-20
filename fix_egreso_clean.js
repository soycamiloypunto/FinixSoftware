const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/egreso/egreso/egreso.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

// Imports
ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';\nimport { FormsModule } from '@angular/forms';");

ts = ts.replace("imports: [\r\n    CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule,\r\n    MatDialogModule, MatSnackBarModule, MatButtonModule, MatTooltipModule\r\n  ],", "imports: [\n    CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule,\n    MatDialogModule, MatSnackBarModule, MatButtonModule, MatTooltipModule, MatPaginatorModule, FormsModule\n  ],");
ts = ts.replace(/imports: \[\s*CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule,\s*MatDialogModule, MatSnackBarModule, MatButtonModule, MatTooltipModule\s*\]/, "imports: [\n    CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule,\n    MatDialogModule, MatSnackBarModule, MatButtonModule, MatTooltipModule, MatPaginatorModule, FormsModule\n  ]");

ts = ts.replace("export class EgresoComponent implements OnInit {", "export class EgresoComponent implements OnInit, AfterViewInit {");
ts = ts.replace("egresos = signal<EgresoModel[]>([]);", "dataSource = new MatTableDataSource<EgresoModel>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n  fechaFiltro: string = new Date().toISOString().substring(0,10);");

// Remove duplicates if any
ts = ts.replace("  ngOnInit() {\r\n    this.cargarEgresos();\r\n    if (!this.authService.getUserRoles().includes('ROLE_ADMINISTRADOR')) {\r\n      this.displayedColumns = this.displayedColumns.filter(c => c !== 'acciones');\r\n    }\r\n  }", "  ngOnInit() {\n    this.cargarEgresos();\n    if (!this.authService.getUserRoles().includes('ROLE_ADMINISTRADOR')) {\n      this.displayedColumns = this.displayedColumns.filter(c => c !== 'acciones');\n    }\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");
ts = ts.replace("  ngOnInit() {\n    this.cargarEgresos();\n    if (!this.authService.getUserRoles().includes('ROLE_ADMINISTRADOR')) {\n      this.displayedColumns = this.displayedColumns.filter(c => c !== 'acciones');\n    }\n  }", "  ngOnInit() {\n    this.cargarEgresos();\n    if (!this.authService.getUserRoles().includes('ROLE_ADMINISTRADOR')) {\n      this.displayedColumns = this.displayedColumns.filter(c => c !== 'acciones');\n    }\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");

let cargarE = "  cargarEgresos() {\r\n    this.egresoService.getEgresos().subscribe(data => this.egresos.set(data));\r\n  }";
let cargarE2 = "  cargarEgresos() {\n    this.egresoService.getEgresos().subscribe(data => this.egresos.set(data));\n  }";
let newCargarE = "  cargarEgresos() {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    // Asumimos que getEgresos puede filtrarse en frontend o usar un endpoint de backend\n    // Por ahora filtramos en frontend si no hay endpoint.\n    this.egresoService.getEgresos().subscribe(data => {\n        const filtered = data.filter(e => {\n             const d = new Date(e.fecha);\n             const s = new Date(start);\n             const en = new Date(end);\n             return d >= s && d <= en;\n        });\n        this.dataSource.data = filtered;\n    });\n  }";
ts = ts.replace(cargarE, newCargarE);
ts = ts.replace(cargarE2, newCargarE);

fs.writeFileSync(tsPath, ts);

let htmlPath = "finix_frontend/src/app/features/egreso/egreso/egreso.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestión de Egresos</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestión de Egresos</h1>
      <div class="flex items-center space-x-4 mx-4">
          <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarEgresos()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>`);
html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestin de Egresos</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestión de Egresos</h1>
      <div class="flex items-center space-x-4 mx-4">
          <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarEgresos()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>`);

html = html.replace(/\[dataSource\]="egresos\(\)"/g, '[dataSource]="dataSource"');
html = html.replace(/@if \(!egresos\(\)\.length\) \{/g, '@if (!dataSource.data.length) {');
html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');

fs.writeFileSync(htmlPath, html);
console.log("Egreso fixed");
