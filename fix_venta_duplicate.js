const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');
// Use regex to remove the exact line with optional spaces and newlines
ts = ts.replace(/import\s*\{\s*FormsModule\s*\}\s*from\s*'@angular\/forms';\r?\n?/, "");
fs.writeFileSync(tsPath, ts);
console.log("Fixed duplicate import");
