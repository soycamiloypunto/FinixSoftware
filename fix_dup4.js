const fs = require('fs');
let vPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
let vts = fs.readFileSync(vPath, 'utf8');

while(vts.indexOf("ngOnInit(): void {") !== vts.lastIndexOf("ngOnInit(): void {")) {
  let firstIdx = vts.indexOf("ngOnInit(): void {");
  let secondIdx = vts.indexOf("ngOnInit(): void {", firstIdx + 1);
  vts = vts.substring(0, firstIdx) + vts.substring(secondIdx);
}
fs.writeFileSync(vPath, vts);

let tsPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');
while(ts.indexOf("ngOnInit(): void {") !== ts.lastIndexOf("ngOnInit(): void {")) {
  let firstIdx = ts.indexOf("ngOnInit(): void {");
  let secondIdx = ts.indexOf("ngOnInit(): void {", firstIdx + 1);
  ts = ts.substring(0, firstIdx) + ts.substring(secondIdx);
}
fs.writeFileSync(tsPath, ts);

console.log("Dups ngOnInit removed");
