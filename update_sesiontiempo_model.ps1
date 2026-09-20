$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\tiempo\models\sesiontiempo.model.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "export interface SesionTiempo \{", "export interface SesionProductoAdicionalDTO { id: number; productoId: number; productoNombre: string; cantidad: number; precioUnitarioVenta: number; totalVenta: number; }`n`nexport interface SesionTiempo {"
$ts = $ts -replace "puesto\?: string;", "puesto?: string;`n    adicionales?: SesionProductoAdicionalDTO[];"
Set-Content $tsPath -Value $ts
