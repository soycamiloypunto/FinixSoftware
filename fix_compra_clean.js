const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/compras/compra/compra.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
ts = ts.replace("import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';", "import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';\nimport { FormsModule } from '@angular/forms';");

ts = ts.replace("imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, \r\nMatSnackBarModule],", "imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, FormsModule],");
ts = ts.replace("imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, \nMatSnackBarModule],", "imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, FormsModule],");
ts = ts.replace("imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule],", "imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, FormsModule],");

ts = ts.replace("export class CompraComponent implements OnInit {", "export class CompraComponent implements OnInit, AfterViewInit {");

ts = ts.replace("compras = signal<CompraModel[]>([]);", "dataSource = new MatTableDataSource<CompraModel>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n  fechaFiltro: string = new Date().toISOString().substring(0,10);");

ts = ts.replace("  ngOnInit() {\r\n    this.cargarCompras();\r\n  }", "  ngOnInit() {\n    this.cargarCompras();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");
ts = ts.replace("  ngOnInit() {\n    this.cargarCompras();\n  }", "  ngOnInit() {\n    this.cargarCompras();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }");

let cc1 = "  cargarCompras() {\r\n    this.compraService.getCompras().subscribe(data => this.compras.set(data));\r\n  }";
let cc2 = "  cargarCompras() {\n    this.compraService.getCompras().subscribe(data => this.compras.set(data));\n  }";
let ncc = "  cargarCompras() {\n    const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();\n    const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();\n    this.compraService.getCompras().subscribe(data => {\n        const filtered = data.filter(e => {\n             const d = new Date(e.fecha);\n             const s = new Date(start);\n             const en = new Date(end);\n             return d >= s && d <= en;\n        });\n        this.dataSource.data = filtered;\n    });\n  }";
ts = ts.replace(cc1, ncc);
ts = ts.replace(cc2, ncc);

fs.writeFileSync(tsPath, ts);

let htmlPath = "finix_frontend/src/app/features/compras/compra/compra.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Historial de Compras</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Historial de Compras</h1>
        <div class="flex items-center space-x-4 mx-4">
            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarCompras()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>`);

html = html.replace(/\[dataSource\]="compras\(\)"/g, '[dataSource]="dataSource"');
html = html.replace(/@if \(!compras\(\)\.length\) \{/g, '@if (!dataSource.data.length) {');
html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');

fs.writeFileSync(htmlPath, html);
console.log("Compras fixed");
