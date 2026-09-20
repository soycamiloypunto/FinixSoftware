const fs = require('fs');
let htmlPath = "finix_frontend/src/app/features/compras/compra/compra.html";
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('[dataSource]="compras()"', '[dataSource]="dataSource"');
html = html.replace('@if (!compras().length)', '@if (!dataSource.data.length)');
html = html.replace('</table>', '</table>\n        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>');
fs.writeFileSync(htmlPath, html);
