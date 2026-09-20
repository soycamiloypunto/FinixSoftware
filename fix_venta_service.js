const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/venta/services/venta.services.ts";
let ts = fs.readFileSync(tsPath, 'utf8');
ts = ts.replace(/this\.http\.get<VentaModel\[\]>\(\$\{this\.apiUrl\}\/by-date/g, "this.http.get<VentaModel[]>(this.apiUrl + '/by-date'");
fs.writeFileSync(tsPath, ts);
