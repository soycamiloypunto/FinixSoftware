const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');
ts = ts.replace("import { FormsModule } from '@angular/forms';\n", "");
fs.writeFileSync(tsPath, ts);
