const fs = require('fs');

let tsPath = "finix_frontend/src/app/features/tiempo/gestion-tiempo/gestion-tiempo.component.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

// The duplicate block is:
//  ngAfterViewInit() { ... }
//  applyFilter(event: Event) { ... }
//  ngOnInit(): void {
//  ngAfterViewInit() { ... }
//  applyFilter(event: Event) { ... }
//  ngOnInit(): void {

let duplicateStr1 = "  ngAfterViewInit() {\n    this.dataSourceFinalizadas.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSourceFinalizadas.filter = filterValue.trim().toLowerCase();\n  }\n\n  ngOnInit(): void {\n  ngAfterViewInit() {\n    this.dataSourceFinalizadas.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSourceFinalizadas.filter = filterValue.trim().toLowerCase();\n  }\n\n  ngOnInit(): void {\n    this.cargarDatosIniciales();";

let targetStr1 = "  ngAfterViewInit() {\n    this.dataSourceFinalizadas.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSourceFinalizadas.filter = filterValue.trim().toLowerCase();\n  }\n\n  ngOnInit(): void {\n    this.cargarDatosIniciales();";

ts = ts.replace(duplicateStr1, targetStr1);
// Try without the carriage return differences or just with regex:
ts = ts.replace(/ngAfterViewInit\(\) {[\s\S]*?applyFilter\(event: Event\) {[\s\S]*?ngOnInit\(\): void {[\s\S]*?ngAfterViewInit\(\) {[\s\S]*?applyFilter\(event: Event\) {[\s\S]*?ngOnInit\(\): void {/g, targetStr1);
fs.writeFileSync(tsPath, ts);


let vPath = "finix_frontend/src/app/features/venta/venta/venta.component.ts";
let vts = fs.readFileSync(vPath, 'utf8');

let targetStr2 = "  ngOnInit(): void {\n    this.cargarVentasRecientes();\n  }\n\n  ngAfterViewInit() {\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event) {\n    const filterValue = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = filterValue.trim().toLowerCase();\n  }";

vts = vts.replace(/ngOnInit\(\): void {[\s\S]*?ngAfterViewInit\(\) {[\s\S]*?applyFilter\(event: Event\) {[\s\S]*?ngOnInit\(\): void {[\s\S]*?ngAfterViewInit\(\) {[\s\S]*?applyFilter\(event: Event\) {[\s\S]*?}/g, targetStr2);
fs.writeFileSync(vPath, vts);

console.log("Duplicates removed");
