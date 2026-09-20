$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\tiempo\gestion-tiempo\gestion-tiempo.component.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "import \{ MatTableModule \} from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';`nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';`nimport { ViewChild, AfterViewInit } from '@angular/core';"
$ts = $ts -replace "imports: \[", "imports: [MatPaginatorModule,"
$ts = $ts -replace "sesionesFinalizadas = signal<SesionTiempoUI\[\]>\(\[\]\);", "sesionesFinalizadas = signal<SesionTiempoUI[]>([]);`n    dataSourceFinalizadas = new MatTableDataSource<SesionTiempoUI>([]);`n    @ViewChild(MatPaginator) paginator!: MatPaginator;`n    fechaFiltro: string = new Date().toISOString().substring(0,10);"
$ts = $ts -replace "implements OnInit, OnDestroy", "implements OnInit, OnDestroy, AfterViewInit"
$ts = $ts -replace "ngOnInit\(\) \{", "ngAfterViewInit() { this.dataSourceFinalizadas.paginator = this.paginator; }`n`n    applyFilter(event: Event) {`n      const filterValue = (event.target as HTMLInputElement).value;`n      this.dataSourceFinalizadas.filter = filterValue.trim().toLowerCase();`n    }`n`n    ngOnInit() {"
$ts = $ts -replace "cargarHistorial\(\) \{[\s\S]*?\}", "cargarHistorial() {`n      const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();`n      const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();`n      this.tiempoService.getHistorialFinalizadas(start, end).subscribe(data => {`n        const list = data.map(s => this.mapearSesionParaUI(s));`n        this.sesionesFinalizadas.set(list);`n        this.dataSourceFinalizadas.data = list;`n      });`n    }"
$ts = $ts -replace "getSesionesFinalizadas\(\)", "getSesionesFinalizadas(start, end)"
Set-Content $tsPath -Value $ts
