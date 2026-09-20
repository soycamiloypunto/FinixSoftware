const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/compras/compra/compra.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

// Imports
ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
ts = ts.replace("import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';", "import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';\nimport { FormsModule } from '@angular/forms';");

// @Component array
ts = ts.replace("imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, \r\nMatSnackBarModule],", "imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, FormsModule],");

ts = ts.replace("export class CompraComponent implements OnInit {", "export class CompraComponent implements OnInit, AfterViewInit {");

ts = ts.replace("compras = signal<CompraModel[]>([]);", "dataSource = new MatTableDataSource<CompraModel>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n  fechaFiltro: string = new Date().toISOString().substring(0,10);");

ts = ts.replace("  ngOnInit() {\r\n    this.cargarCompras();\r\n  }", "  ngOnInit() {\n    this.cargarCompras();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");

ts = ts.replace("  cargarCompras() {\r\n    this.compraService.getCompras().subscribe(data => this.compras.set(data));\r\n  }", "  cargarCompras() {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.compraService.getComprasByDateRange(start, end).subscribe(data => this.dataSource.data = data);\n  }");

// Handle the one inside the subscribe callback: `dialogRef.afterClosed().subscribe((result: CompraModel) => { if (result) { this.cargarCompras(); } });`
// wait, `compras()` is not used. 
fs.writeFileSync(tsPath, ts);
console.log("compra.ts fixed");
