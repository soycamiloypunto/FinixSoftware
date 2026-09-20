const fs = require('fs');
let htmlPath = "finix_frontend/src/app/features/compras/compra/compra.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Historial de Compras</h1>', `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Historial de Compras</h1>
    <div class="flex items-center space-x-4 mx-4">
        <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarCompras()" class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
        <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600">
    </div>`);

html = html.replace(/\[dataSource\]="compras\(\)"/g, '[dataSource]="dataSource"');
html = html.replace(/@if \(!compras\(\)\.length\) \{/g, '@if (!dataSource.data.length) {');
html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
fs.writeFileSync(htmlPath, html);
console.log("HTML fixed for compras.");
