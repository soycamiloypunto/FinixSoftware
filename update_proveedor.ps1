$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\proveedor\proveedor\proveedor.component.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "import \{ MatTableModule \} from '@angular/material/table';", "import { MatTableModule, MatTableDataSource } from '@angular/material/table';`nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';`nimport { ViewChild, AfterViewInit } from '@angular/core';"
$ts = $ts -replace "import \{ CustomInputComponent \} from '../../../shared/components/custom-input/custom-input';", "import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input';`nimport { FormsModule } from '@angular/forms';"
$ts = $ts -replace "imports: \[", "imports: [MatPaginatorModule, FormsModule,"
$ts = $ts -replace "proveedores = signal<ProveedorModel\[\]>\(\[\]\);", "dataSource = new MatTableDataSource<ProveedorModel>([]);`n    @ViewChild(MatPaginator) paginator!: MatPaginator;"
$ts = $ts -replace "implements OnInit", "implements OnInit, AfterViewInit"
$ts = $ts -replace "cargarProveedores\(\) \{[\s\S]*?\}", "ngAfterViewInit() { this.dataSource.paginator = this.paginator; }`n`n    applyFilter(event: Event) {`n      const filterValue = (event.target as HTMLInputElement).value;`n      this.dataSource.filter = filterValue.trim().toLowerCase();`n    }`n`n    cargarProveedores() {`n      this.proveedorService.getProveedores().subscribe(data => this.dataSource.data = data);`n    }"
$ts = $ts -replace "proveedores\(\)", "dataSource.data"
Set-Content $tsPath -Value $ts
