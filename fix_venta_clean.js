const fs = require('fs');
let vPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
let vts = fs.readFileSync(vPath, 'utf8');

// The VentaComponent is the 3rd class.
// export class VentaComponent implements OnInit {

vts = vts.replace("export class VentaComponent implements OnInit {", "export class VentaComponent implements OnInit, AfterViewInit {");

vts = vts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
vts = vts.replace("MatTableModule, MatDialogModule,", "MatTableModule, MatDialogModule, MatPaginatorModule, FormsModule,");

vts = vts.replace("ventasRecientes = signal<VentaModel[]>([]);", "ventasRecientes = signal<VentaModel[]>([]);\n  dataSource = new MatTableDataSource<VentaModel>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n  fechaFiltro: string = new Date().toISOString().substring(0,10);");

// The correct cargarVentasRecientes
let originalCargar = "cargarVentasRecientes(): void {\r\n    this.ventaService.getUltimasVentas(20).subscribe(data => {\r\n      this.ventasRecientes.set(data);\r\n    });\r\n  }";
let newCargar = "ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }\n\n  cargarVentasRecientes(): void {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.ventaService.getVentasByDateRange(start, end).subscribe(data => {\n      this.ventasRecientes.set(data);\n      this.dataSource.data = data;\n    });\n  }";
vts = vts.replace(originalCargar, newCargar);

// Try \n version
let originalCargar2 = "cargarVentasRecientes(): void {\n    this.ventaService.getUltimasVentas(20).subscribe(data => {\n      this.ventasRecientes.set(data);\n    });\n  }";
vts = vts.replace(originalCargar2, newCargar);

fs.writeFileSync(vPath, vts);

let htmlPath = "finix_frontend/src/app/features/venta/venta/venta.component.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('Historial de Ventas</h1>', 'Historial de Ventas</h1>\n        <div class="flex items-center space-x-4 mx-4">\n            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarVentasRecientes()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">\n            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">\n        </div>');

html = html.replace(/\[dataSource\]="ventasRecientes\(\)"/g, '[dataSource]="dataSource"');
html = html.replace(/@if \(!ventasRecientes\(\)\.length\) \{/g, '@if (!dataSource.data.length) {');
html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
fs.writeFileSync(htmlPath, html);

console.log("Ventas fixed precisely");
