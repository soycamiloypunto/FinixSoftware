$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\tiempo\gestion-tiempo\gestion-tiempo.component.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "cargarHistorial\(\): void \{[\s\S]*?\}", "cargarHistorial(): void {`n      const start = new Date(this.fechaFiltro + 'T00:00:00-05:00').toISOString();`n      const end = new Date(this.fechaFiltro + 'T23:59:59-05:00').toISOString();`n      this.tiempoService.getSesionesFinalizadas(start, end).subscribe(sesiones => {`n        const sesionesUI = this.mapToSesionUI(sesiones);`n        this.sesionesFinalizadas.set(sesionesUI);`n        this.dataSourceFinalizadas.data = sesionesUI;`n      });`n    }"
$ts = $ts -replace "import \{ CommonModule \} from '@angular/common';", "import { CommonModule } from '@angular/common';`nimport { FormsModule } from '@angular/forms';"
$ts = $ts -replace "imports: \[MatPaginatorModule,", "imports: [MatPaginatorModule, FormsModule,"
Set-Content $tsPath -Value $ts
