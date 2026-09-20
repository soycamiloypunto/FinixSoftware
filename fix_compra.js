const fs = require('fs');

let tsPath = "finix_frontend/src/app/features/compras/compra/compra.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

// Imports top level
ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
ts = ts.replace("import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';", "import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';\nimport { FormsModule } from '@angular/forms';");

// Component array
ts = ts.replace("imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule],", "imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, FormsModule],");

// Class body
ts = ts.replace("export class CompraComponent implements OnInit {", "export class CompraComponent implements OnInit, AfterViewInit {");

ts = ts.replace("compras = signal<CompraModel[]>([]);", "dataSource = new MatTableDataSource<CompraModel>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n  fechaFiltro: string = new Date().toISOString().substring(0,10);");

ts = ts.replace("ngOnInit() {\n    this.cargarCompras();\n  }", "ngOnInit() {\n    this.cargarCompras();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");

ts = ts.replace("cargarCompras() {\n    this.compraService.getCompras().subscribe(data => this.compras.set(data));\n  }", "cargarCompras() {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.compraService.getComprasByDateRange(start, end).subscribe(data => this.dataSource.data = data);\n  }");

// The only place `compras()` is used in the .ts is inside the template! The file has no `this.compras()` except if they refer to `this.compras`? Wait, I didn't see `this.compras()`.
fs.writeFileSync(tsPath, ts);

let srvPath = "finix_frontend/src/app/features/compras/services/compra.service.ts";
let srv = fs.readFileSync(srvPath, 'utf8');
srv = srv.replace("import { HttpClient } from '@angular/common/http';", "import { HttpClient, HttpParams } from '@angular/common/http';");
srv = srv.replace("getCompras(): Observable<CompraModel[]> {\n    return this.http.get<CompraModel[]>(this.apiUrl);\n  }", "getCompras(): Observable<CompraModel[]> {\n    return this.http.get<CompraModel[]>(this.apiUrl);\n  }\n\n  getComprasByDateRange(fechaInicio: string, fechaFin: string): Observable<CompraModel[]> {\n    let params = new HttpParams();\n    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);\n    if (fechaFin) params = params.set('fechaFin', fechaFin);\n    return this.http.get<CompraModel[]>(this.apiUrl + '/by-date', { params });\n  }");
fs.writeFileSync(srvPath, srv);
console.log("TS and Srv fixed for compras.");
