<?php
require_once 'header.php';

$start_year = date('Y-01-01 00:00:00');
$end_year = date('Y-12-31 23:59:59');

$stmt = $pdo->prepare("SELECT IFNULL(SUM(total_venta), 0) FROM venta WHERE fecha BETWEEN ? AND ?");
$stmt->execute([$start_year, $end_year]);
$ventas = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT IFNULL(SUM(valor), 0) FROM ingreso WHERE fecha BETWEEN ? AND ?");
$stmt->execute([substr($start_year, 0, 10), substr($end_year, 0, 10)]);
$ingresos = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT IFNULL(SUM(monto), 0) FROM egreso WHERE fecha BETWEEN ? AND ?");
$stmt->execute([$start_year, $end_year]);
$egresos = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT IFNULL(SUM(total_compra), 0) FROM compra WHERE fecha BETWEEN ? AND ?");
$stmt->execute([$start_year, $end_year]);
$compras = $stmt->fetchColumn();

$utilidad = ($ventas + $ingresos) - ($egresos + $compras);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fa-solid fa-calendar-check text-success"></i> Utilidad Año Actual</h2>
    <h5 class="text-muted"><?= date('Y') ?></h5>
</div>

<div class="row mb-4">
    <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
            <div class="card-header bg-light">Cálculo de Utilidad Anual</div>
            <div class="card-body">
                <table class="table table-borderless fs-5">
                    <tr><td class="text-success"><i class="fa-solid fa-plus-circle"></i> Ventas</td><td class="text-end">$<?= number_format($ventas, 2) ?></td></tr>
                    <tr><td class="text-success"><i class="fa-solid fa-plus-circle"></i> Ingresos</td><td class="text-end">$<?= number_format($ingresos, 2) ?></td></tr>
                    <tr><td class="text-danger"><i class="fa-solid fa-minus-circle"></i> Egresos</td><td class="text-end text-danger">-$<?= number_format($egresos, 2) ?></td></tr>
                    <tr class="border-bottom"><td class="text-danger"><i class="fa-solid fa-minus-circle"></i> Compras</td><td class="text-end text-danger">-$<?= number_format($compras, 2) ?></td></tr>
                    <tr><th class="pt-3">UTILIDAD NETA</th><th class="text-end pt-3 <?= $utilidad >= 0 ? 'text-success' : 'text-danger' ?>">$<?= number_format($utilidad, 2) ?></th></tr>
                </table>
            </div>
        </div>
    </div>
    <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
            <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
                <?php if($utilidad > 0): ?>
                    <i class="fa-solid fa-face-smile-beam text-success fa-5x mb-3"></i>
                    <h3 class="text-success fw-bold">¡Buen Año!</h3>
                    <p class="text-muted">Tu negocio ha generado ganancias positivas este año.</p>
                <?php elseif($utilidad < 0): ?>
                    <i class="fa-solid fa-face-frown text-danger fa-5x mb-3"></i>
                    <h3 class="text-danger fw-bold">Año en Rojo</h3>
                    <p class="text-muted">Los gastos superaron a los ingresos. Revisa los egresos.</p>
                <?php else: ?>
                    <i class="fa-solid fa-face-meh text-secondary fa-5x mb-3"></i>
                    <h3 class="text-secondary fw-bold">Punto de Equilibrio</h3>
                    <p class="text-muted">No hubo ganancias ni pérdidas.</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>