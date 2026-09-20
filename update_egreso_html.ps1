$htmlPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\egreso\egreso\egreso.html"
$html = Get-Content $htmlPath -Raw
$html = $html -replace '<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestin de Egresos</h1>', "<h1 class=`"text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto`">Gestión de Egresos</h1>`n        <div class=`"flex items-center space-x-4 mx-4`">`n            <input type=`"date`" [(ngModel)]=`"fechaFiltro`" (change)=`"cargarEgresos()`" class=`"p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600`">`n            <input type=`"text`" (keyup)=`"applyFilter(`$event)`" placeholder=`"Buscar...`" class=`"p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600`">`n        </div>"
$html = $html -replace '\[dataSource\]="egresos\(\)"', '[dataSource]="dataSource"'
$html = $html -replace '@if \(!egresos\(\)\.length\) \{', '@if (!dataSource.data.length) {'
$html = $html -replace '</table>', "</table>`n        <mat-paginator [pageSizeOptions]=`"[10, 25, 50]`" showFirstLastButtons></mat-paginator>"
Set-Content $htmlPath -Value $html
