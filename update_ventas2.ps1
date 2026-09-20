$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\venta\venta\venta.component.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "import \{ CommonModule \} from '@angular/common';", "import { CommonModule } from '@angular/common';`nimport { FormsModule } from '@angular/forms';"
$ts = $ts -replace "imports: \[", "imports: [FormsModule,"
Set-Content $tsPath -Value $ts
