const fs = require('fs');

let tsPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
ts = ts.replace("MatTableModule, MatDialogModule,", "MatTableModule, MatDialogModule, MatPaginatorModule,");
ts = ts.replace("export class VentaComponent implements OnInit {", "export class VentaComponent implements OnInit, AfterViewInit {");
ts = ts.replace("ventasRecientes = signal<VentaModel[]>([]);", "ventasRecientes = signal<VentaModel[]>([]);\n  dataSource = new MatTableDataSource<VentaModel>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;");

ts = ts.replace("  ngOnInit(): void {\r\n    this.cargarVentasRecientes();\r\n  }", "  ngOnInit(): void {\n    this.cargarVentasRecientes();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");
ts = ts.replace("  ngOnInit(): void {\n    this.cargarVentasRecientes();\n  }", "  ngOnInit(): void {\n    this.cargarVentasRecientes();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");

ts = ts.replace("this.ventasRecientes.set(data);", "this.ventasRecientes.set(data);\n      this.dataSource.data = data;");
fs.writeFileSync(tsPath, ts);

let htmlPath = "finix_frontend/src/app/features/venta/venta/venta.component.html";
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('<div class="flex items-center space-x-4 mx-4">\r\n            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarVentasRecientes()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">\r\n        </div>', '<div class="flex items-center space-x-4 mx-4">\n            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarVentasRecientes()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">\n            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">\n        </div>');
html = html.replace('<div class="flex items-center space-x-4 mx-4">\n            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarVentasRecientes()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">\n        </div>', '<div class="flex items-center space-x-4 mx-4">\n            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarVentasRecientes()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">\n            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">\n        </div>');

html = html.replace(/\[dataSource\]="ventasRecientes\(\)"/g, '[dataSource]="dataSource"');
html = html.replace(/@if \(!ventasRecientes\(\)\.length\) \{/g, '@if (!dataSource.data.length) {');
html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
fs.writeFileSync(htmlPath, html);
console.log("Ventas paginator fixed");
