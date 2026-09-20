const fs = require('fs');

let htmlPath = "finix_frontend/src/app/features/compras/compra/compra.html";
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600"/g, 'class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"');
fs.writeFileSync(htmlPath, html);

let eHtmlPath = "finix_frontend/src/app/features/egreso/egreso/egreso.html";
let eHtml = fs.readFileSync(eHtmlPath, 'utf8');
eHtml = eHtml.replace(/class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600"/g, 'class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"');
fs.writeFileSync(eHtmlPath, eHtml);

let pntHtmlPath = "finix_frontend/src/app/features/proveedor/proveedor/proveedor.component.html";
let pntHtml = fs.readFileSync(pntHtmlPath, 'utf8');
pntHtml = pntHtml.replace(/class="p-2 rounded border dark:bg-slate-700 dark:text-white dark:border-slate-600"/g, 'class="p-2 rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"');
fs.writeFileSync(pntHtmlPath, pntHtml);

console.log("Styling fixed for forms");
