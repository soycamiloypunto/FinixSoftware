const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/proveedor/proveedor/proveedor.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
ts = ts.replace("MatTableModule, MatFormFieldModule", "MatTableModule, MatFormFieldModule, MatPaginatorModule");

ts = ts.replace("proveedores = signal<ProveedorModel[]>([]);", "dataSource = new MatTableDataSource<ProveedorModel>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;");
ts = ts.replace("implements OnInit {", "implements OnInit, AfterViewInit {");

ts = ts.replace("ngOnInit(): void {\n    this.cargarProveedores();\n  }", "ngOnInit(): void {\n    this.cargarProveedores();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");

ts = ts.replace("cargarProveedores() {\n    this.proveedorService.getProveedores().subscribe({\n      next: (data) => this.proveedores.set(data),", "cargarProveedores() {\n    this.proveedorService.getProveedores().subscribe({\n      next: (data) => this.dataSource.data = data,");

// Note: it uses this.proveedores() for computed property filter!
// Let's replace usages of this.proveedores() and this.proveedores.set in the whole file safely.
ts = ts.replace(/this\.proveedores\(\)/g, "this.dataSource.data");

fs.writeFileSync(tsPath, ts);

let htmlPath = "finix_frontend/src/app/features/proveedor/proveedor/proveedor.component.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Directorio de Proveedores</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Directorio de Proveedores</h1>
      <div class="flex items-center space-x-4 mx-4">
          <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
      </div>`);

// It uses filteredProveedores() in HTML instead of proveedores()!
// Wait! Let's check how it binds.
