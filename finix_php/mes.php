<?php
require_once 'header.php';

$start_month = date('Y-m-d 00:00:00', strtotime('first day of last month'));
$end_month = date('Y-m-d 23:59:59', strtotime('last day of last month'));

$stmt = $pdo->prepare("SELECT IFNULL(SUM(total_venta), 0) FROM venta WHERE fecha BETWEEN ? AND ?");
$stmt->execute([$start_month, $end_month]);
$ventas = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT IFNULL(SUM(valor), 0) FROM ingreso WHERE fecha BETWEEN ? AND ?");
$stmt->execute([substr($start_month, 0, 10), substr($end_month, 0, 10)]);
$ingresos = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT IFNULL(SUM(monto), 0) FROM egreso WHERE fecha BETWEEN ? AND ?");
$stmt->execute([$start_month, $end_month]);
$egresos = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT IFNULL(SUM(total_compra), 0) FROM compra WHERE fecha BETWEEN ? AND ?");
$stmt->execute([$start_month, $end_month]);
$compras = $stmt->fetchColumn();

$utilidad = ($ventas + $ingresos) - ($egresos + $compras);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fa-solid fa-calendar-days text-primary"></i> Utilidad Último Mes</h2>
    <h5 class="text-muted"><?= date('F Y', strtotime($start_month)) ?></h5>
</div>

<div class="row mb-4">
    <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
            <div class="card-header bg-light">Cálculo de Utilidad Mensual</div>
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
        <div class="card shadow-sm h-100 bg-primary text-white">
            <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
                <i class="fa-solid fa-money-bill-trend-up fa-5x mb-3 opacity-75"></i>
                <h3 class="fw-bold">Resumen Mensual</h3>
                <p class="fs-5 mt-2">El mes cerró con un balance de <br><strong class="fs-2">$<?= number_format($utilidad, 2) ?></strong></p>
            </div>
        </div>
    </div>
</div>

<?php require_once 'footer.php'; ?>
