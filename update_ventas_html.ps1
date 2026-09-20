$htmlPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\venta\venta\venta.component.html"
$html = Get-Content $htmlPath -Raw
$html = $html -replace '<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestin de Ventas</h1>', "<h1 class=`"text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto`">Gestión de Ventas</h1>`n        <div class=`"flex items-center space-x-4 mx-4`">`n            <input type=`"date`" [(ngModel)]=`"fechaFiltro`" (change)=`"cargarVentasRecientes()`" class=`"p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600`">`n        </div>"
Set-Content $htmlPath -Value $html
