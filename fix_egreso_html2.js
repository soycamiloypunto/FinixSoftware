const fs = require('fs');
let htmlPath = "finix_frontend/src/app/features/egreso/egreso/egreso.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace(/<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">.*?<\/h1>/g, `<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-auto">Gestión de Egresos</h1>
        <div class="flex items-center space-x-4 mx-4">
            <input type="date" [(ngModel)]="fechaFiltro" (change)="cargarEgresos()" class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="text" (keyup)="applyFilter($event)" placeholder="Buscar..." class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>`);

fs.writeFileSync(htmlPath, html);
