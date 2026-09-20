const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/proveedor/proveedor/proveedor.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
ts = ts.replace("MatTableModule, MatFormFieldModule,", "MatTableModule, MatFormFieldModule, MatPaginatorModule,");

ts = ts.replace("export class ProveedorComponent implements OnInit {", "export class ProveedorComponent implements OnInit, AfterViewInit {");

ts = ts.replace("proveedores = signal<ProveedorModel[]>([]);", "dataSource = new MatTableDataSource<ProveedorModel>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;");

ts = ts.replace("  ngOnInit(): void {\r\n    this.cargarProveedores();\r\n  }", "  ngOnInit(): void {\n    this.cargarProveedores();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");
ts = ts.replace("  ngOnInit(): void {\n    this.cargarProveedores();\n  }", "  ngOnInit(): void {\n    this.cargarProveedores();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");

ts = ts.replace("  cargarProveedores() {\r\n    this.proveedorService.getProveedores().subscribe({\r\n      next: (data) => this.proveedores.set(data),", "  cargarProveedores() {\n    this.proveedorService.getProveedores().subscribe({\n      next: (data) => this.dataSource.data = data,");
ts = ts.replace("  cargarProveedores() {\n    this.proveedorService.getProveedores().subscribe({\n      next: (data) => this.proveedores.set(data),", "  cargarProveedores() {\n    this.proveedorService.getProveedores().subscribe({\n      next: (data) => this.dataSource.data = data,");

fs.writeFileSync(tsPath, ts);

let htmlPath = "finix_frontend/src/app/features/proveedor/proveedor/proveedor.component.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Directorio de Proveedores</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Directorio de Proveedores</h1>
      <div class="flex items-center space-x-4 mx-4">
          <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>`);

html = html.replace(/\[dataSource\]="filteredProveedores\(\)"/g, '[dataSource]="dataSource"');
html = html.replace(/@if \(!filteredProveedores\(\)\.length\) \{/g, '@if (!dataSource.data.length) {');
html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
fs.writeFileSync(htmlPath, html);

console.log("Proveedor fixed");
