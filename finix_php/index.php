<?php require_once 'header.php'; ?>
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Bienvenido, <?= htmlspecialchars($_SESSION['username']) ?></h2>
</div>

<div class="row">
    <div class="col-md-4 mb-4">
        <a href="fechas.php" class="text-decoration-none">
            <div class="stat-card bg-blue shadow-sm h-100">
                <div>
                    <h5>Reporte por Fechas</h5>
                    <p class="mb-0 opacity-75">Ventas, ingresos y egresos detallados.</p>
                </div>
                <i class="fa-solid fa-calendar-alt fa-3x opacity-50"></i>
            </div>
        </a>
    </div>
    <div class="col-md-4 mb-4">
        <a href="top_productos.php" class="text-decoration-none">
            <div class="stat-card bg-purple shadow-sm h-100">
                <div>
                    <h5>Top Productos</h5>
                    <p class="mb-0 opacity-75">Los más vendidos semana/mes.</p>
                </div>
                <i class="fa-solid fa-trophy fa-3x opacity-50"></i>
            </div>
        </a>
    </div>
    <div class="col-md-4 mb-4">
        <a href="dos_meses.php" class="text-decoration-none">
            <div class="stat-card bg-green shadow-sm h-100">
                <div>
                    <h5>Gráfica 2 Meses</h5>
                    <p class="mb-0 opacity-75">Evolución de utilidades.</p>
                </div>
                <i class="fa-solid fa-chart-line fa-3x opacity-50"></i>
            </div>
        </a>
    </div>
</div>

<div class="card shadow-sm mt-2">
    <div class="card-body text-center p-5">
        <i class="fa-solid fa-chart-pie fa-4x text-muted mb-3"></i>
        <h4>Sistema de Reportes Finix</h4>
        <p class="text-muted">Seleccione un reporte del menú lateral para comenzar a analizar la información de su negocio.</p>
    </div>
</div>

<?php require_once 'footer.php'; ?>
