$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\tiempo\models\sesiontiempo.model.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "export interface SesionProductoAdicionalDTO \{[\s\S]*?\}", ""
$ts = $ts -replace "adicionales\?: SesionProductoAdicionalDTO\[\];", "productosAdicionales?: any[];"
Set-Content $tsPath -Value $ts

$htmlPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\tiempo\gestion-tiempo\gestion-tiempo.component.html"
$html = Get-Content $htmlPath -Raw
$html = $html -replace "prod\.productoNombre", "prod.nombreProducto"
$html = $html -replace "prod\.totalVenta", "prod.total"
$html = $html -replace "let prod of s\.adicionales", "let prod of s.productosAdicionales"
$html = $html -replace "adicionales', 'cobrado", "productosAdicionales', 'cobrado"
$html = $html -replace "<ng-container matColumnDef=`"adicionales`">", "<ng-container matColumnDef=`"productosAdicionales`">"
Set-Content $htmlPath -Value $html

$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\tiempo\gestion-tiempo\gestion-tiempo.component.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "'adicionales', 'cobrado'", "'productosAdicionales', 'cobrado'"
Set-Content $tsPath -Value $ts
