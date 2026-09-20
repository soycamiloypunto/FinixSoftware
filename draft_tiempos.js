const fs = require('fs');

let tsPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

// Imports
ts = ts.replace("import { MatTableModule } from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { ViewChild, AfterViewInit } from '@angular/core';");
ts = ts.replace("imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,", "imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatPaginatorModule,");

// Class body
ts = ts.replace("export class GestionTiempoComponent implements OnInit, OnDestroy {", "export class GestionTiempoComponent implements OnInit, OnDestroy, AfterViewInit {");

ts = ts.replace("sesionesFinalizadas = signal<SesionTiempoUI[]>([]);", "sesionesFinalizadas = signal<SesionTiempoUI[]>([]);\n  dataSourceFinalizadas = new MatTableDataSource<SesionTiempoUI>([]);\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n  fechaFiltro: string = new Date().toISOString().substring(0,10);");
ts = ts.replace("displayedColumnsFinalizadas: string[] = ['servicio', 'duracion', 'total', 'fechaFin'];", "displayedColumnsFinalizadas: string[] = ['servicio', 'duracion', 'productosAdicionales', 'total', 'fechaFin'];");

ts = ts.replace("ngOnInit(): void {", "ngAfterViewInit() {\n    this.dataSourceFinalizadas.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSourceFinalizadas.filter = filterValue.trim().toLowerCase();\n  }\n\n  ngOnInit(): void {");

// forkJoin replacement (we need to be precise, or just edit the single method).
// In ngOnInit, the forkJoin has: sesionesFinalizadas: this.tiempoService.getSesionesFinalizadas()
// wait, the service method returns Observables without parameters. I should update the service method to take parameters.
