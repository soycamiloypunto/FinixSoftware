const fs = require('fs');

let tsPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

while(ts.indexOf("ngAfterViewInit() {") !== ts.lastIndexOf("ngAfterViewInit() {")) {
  let firstIdx = ts.indexOf("ngAfterViewInit() {");
  let secondIdx = ts.indexOf("ngAfterViewInit() {", firstIdx + 1);
  ts = ts.substring(0, firstIdx) + ts.substring(secondIdx);
}
fs.writeFileSync(tsPath, ts);

let vPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
let vts = fs.readFileSync(vPath, 'utf8');

while(vts.indexOf("ngAfterViewInit() {") !== vts.lastIndexOf("ngAfterViewInit() {")) {
  let firstIdx = vts.indexOf("ngAfterViewInit() {");
  let secondIdx = vts.indexOf("ngAfterViewInit() {", firstIdx + 1);
  vts = vts.substring(0, firstIdx) + vts.substring(secondIdx);
}
// Also remove duplicate applyFilter in case it was left over
while(vts.indexOf("applyFilter(event: Event) {") !== vts.lastIndexOf("applyFilter(event: Event) {")) {
  let firstIdx = vts.indexOf("applyFilter(event: Event) {");
  let secondIdx = vts.indexOf("applyFilter(event: Event) {", firstIdx + 1);
  vts = vts.substring(0, firstIdx) + vts.substring(secondIdx);
}

fs.writeFileSync(vPath, vts);

console.log("Dups removed");
