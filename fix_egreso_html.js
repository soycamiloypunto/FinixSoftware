const fs = require('fs');
let htmlPath = "finix_frontend/src/app/features/egreso/egreso/egreso.html";
let html = fs.readFileSync(htmlPath, 'utf8');

// Title row
html = html.replace('Gesti\ufffdn de Egresos</h1>', `Gestión de Egresos</h1>
        <div class="flex items-center space-x-4 mx-4">
            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarEgresos()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>`);

html = html.replace('Gestión de Egresos</h1>', `Gestión de Egresos</h1>
        <div class="flex items-center space-x-4 mx-4">
            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarEgresos()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>`);

html = html.replace(/\[dataSource\]="egresos\(\)"/g, '[dataSource]="dataSource"');
html = html.replace(/@if \(!egresos\(\)\.length\) \{/g, '@if (!dataSource.data.length) {');
html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');

// Ensure no double addition
while (html.indexOf('<div class="flex items-center space-x-4 mx-4">') !== html.lastIndexOf('<div class="flex items-center space-x-4 mx-4">')) {
    html = html.replace(/<div class="flex items-center space-x-4 mx-4">[\s\S]*?<\/div>/, '');
}

fs.writeFileSync(htmlPath, html);
