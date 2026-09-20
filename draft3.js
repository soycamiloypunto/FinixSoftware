const fs = require('fs');
let tsPath = "finix_frontend/src/app/features/compras/compra/compra.ts";
let ts = fs.readFileSync(tsPath, 'utf8');

ts = ts.replace("imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, \r\nMatSnackBarModule],", "imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, FormsModule],");
ts = ts.replace("imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, \nMatSnackBarModule],", "imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, FormsModule],");
ts = ts.replace("imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule],", "imports: [CommonModule, MatToolbarModule, CustomButtonComponent, MatTableModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, FormsModule],");

fs.writeFileSync(tsPath, ts);
