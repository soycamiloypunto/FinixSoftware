$htmlPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\compras\compra\compra.html"
$html = Get-Content $htmlPath -Raw
$html = $html -replace '<h1>(.*?)</h1>', "<h1>`$1</h1>`n        <div class=`"flex items-center space-x-4 mx-4`">`n            <input type=`"date`" [(ngModel)]=`"fechaFiltro`" (change)=`"cargarCompras()`" class=`"p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600`">`n            <input type=`"text`" (keyup)=`"applyFilter(`$event)`" placeholder=`"Buscar...`" class=`"p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600`">`n        </div>"
$html = $html -replace '\[dataSource\]="compras\(\)"', '[dataSource]="dataSource"'
$html = $html -replace '@if \(!compras\(\)\.length\) \{', '@if (!dataSource.data.length) {'
$html = $html -replace '</table>', "</table>`n        <mat-paginator [pageSizeOptions]=`"[10, 25, 50]`" showFirstLastButtons></mat-paginator>"
Set-Content $htmlPath -Value $html
