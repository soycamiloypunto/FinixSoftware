$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\venta\venta\venta.component.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "cargarVentasRecientes\(\) \{[\s\S]*?\}", "cargarVentasRecientes() {`n      const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();`n      const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();`n      this.ventaService.getVentasByDateRange(start, end).subscribe(data => this.ventas.set(data));`n    }"
$ts = $ts -replace "ventas = signal<VentaModel\[\]>\(\[\]\);", "ventas = signal<VentaModel[]>([]);`n    fechaFiltro: string = new Date().toISOString().substring(0,10);"
Set-Content $tsPath -Value $ts
