$tsPath = "d:\CCTV\Projects\FinixSoftware\finix_frontend\src\app\features\tiempo\services\gestiontiempo.service.ts"
$ts = Get-Content $tsPath -Raw
$ts = $ts -replace "getSesionesFinalizadas\(\): Observable<SesionTiempo\[\]> \{", "getSesionesFinalizadas(fechaInicio: string, fechaFin: string): Observable<SesionTiempo[]> {`n        let params = new HttpParams();`n        if (fechaInicio) params = params.set('fechaInicio', fechaInicio);`n        if (fechaFin) params = params.set('fechaFin', fechaFin);"
$ts = $ts -replace "return this.http.get<SesionTiempo\[\]>\(`\$\{this.apiUrl\}/finalizadas`\);", "return this.http.get<SesionTiempo[]>(`${this.apiUrl}/finalizadas`, { params });"
Set-Content $tsPath -Value $ts
