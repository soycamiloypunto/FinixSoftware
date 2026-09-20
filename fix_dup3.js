const fs = require('fs');

let tsPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

while(ts.indexOf("applyFilter(event: Event) {") !== ts.lastIndexOf("applyFilter(event: Event) {")) {
  let firstIdx = ts.indexOf("applyFilter(event: Event) {");
  let secondIdx = ts.indexOf("applyFilter(event: Event) {", firstIdx + 1);
  ts = ts.substring(0, firstIdx) + ts.substring(secondIdx);
}
fs.writeFileSync(tsPath, ts);
console.log("Dups applyFilter removed");
