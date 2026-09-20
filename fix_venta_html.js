const fs = require('fs');
let htmlPath = "finix_frontend/src/app/features/venta/venta/venta.component.html";
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600"', 'class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"');
fs.writeFileSync(htmlPath, html);
