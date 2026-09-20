$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\compras\compra\compra.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "import \{ MatTableModule \} from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';`nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';`nimport { ViewChild, AfterViewInit } from '@angular/core';"
$ts = $ts -replace "import \{ CustomInputComponent \} from '../../../shared/components/custom-input/custom-input';", "import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';`nimport { FormsModule } from '@angular/forms';"
$ts = $ts -replace "imports: \[", "imports: [MatPaginatorModule, FormsModule,"
$ts = $ts -replace "compras = signal<CompraModel\[\]>\(\[\]\);", "dataSource = new MatTableDataSource<CompraModel>([]);`n    @ViewChild(MatPaginator) paginator!: MatPaginator;`n    fechaFiltro: string = new Date().toISOString().substring(0,10);"
$ts = $ts -replace "implements OnInit", "implements OnInit, AfterViewInit"
$ts = $ts -replace "cargarCompras\(\) \{[\s\S]*?\}", "ngAfterViewInit() { this.dataSource.paginator = this.paginator; }`n`n    applyFilter(event: Event) {`n      const filterValue = (event.target as HTMLInputElement).value;`n      this.dataSource.filter = filterValue.trim().toLowerCase();`n    }`n`n    cargarCompras() {`n      const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();`n      const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();`n      this.compraService.getComprasByDateRange(start, end).subscribe(data => this.dataSource.data = data);`n    }"
$ts = $ts -replace "compras\(\)", "dataSource.data"
Set-Content $tsPath -Value $ts
