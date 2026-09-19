<?php
require_once 'header.php';

$fecha_inicio = $_POST['fecha_inicio'] ?? date('Y-m-d 00:00:00');
$fecha_fin = $_POST['fecha_fin'] ?? date('Y-m-d 23:59:59');

$ventas = [];
$egresos = [];
$ingresos = [];
$compras = [];

$tot_ventas = 0;
$tot_egresos = 0;
$tot_ingresos = 0;
$tot_compras = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' || true) { // Always load default date
    // Ventas
    $stmt = $pdo->prepare("
        SELECT p.nombre, SUM(vd.cantidad) as cantidad, MAX(vd.precio_unitario) as precio_unitario, SUM(vd.subtotal) as total
        FROM venta_detalle vd
        JOIN venta v ON vd.venta_id = v.id
        JOIN producto p ON vd.producto_id = p.id
        WHERE v.fecha BETWEEN ? AND ?
        GROUP BY p.id, p.nombre
        ORDER BY total DESC
    ");
    $stmt->execute([$fecha_inicio, $fecha_fin]);
    $ventas = $stmt->fetchAll();
    
    // Egresos
    $stmt = $pdo->prepare("SELECT concepto, fecha, monto FROM egreso WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC");
    $stmt->execute([$fecha_inicio, $fecha_fin]);
    $egresos = $stmt->fetchAll();
    
    // Ingresos
    $date_ini = substr($fecha_inicio, 0, 10);
    $date_fin = substr($fecha_fin, 0, 10);
    $stmt = $pdo->prepare("SELECT descripcion as concepto, fecha, valor as monto FROM ingreso WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC");
    $stmt->execute([$date_ini, $date_fin]);
    $ingresos = $stmt->fetchAll();
    
    // Compras
    $stmt = $pdo->prepare("SELECT CONCAT('Compra Fac: ', IFNULL(numero_factura, 'S/N')) as concepto, fecha, total_compra as monto FROM compra WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC");
    $stmt->execute([$fecha_inicio, $fecha_fin]);
    $compras = $stmt->fetchAll();

    foreach ($ventas as $v) $tot_ventas += $v['total'];
    foreach ($egresos as $e) $tot_egresos += $e['monto'];
    foreach ($ingresos as $i) $tot_ingresos += $i['monto'];
    foreach ($compras as $c) $tot_compras += $c['monto'];
}

$utilidad = ($tot_ventas + $tot_ingresos) - ($tot_egresos + $tot_compras);
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fa-solid fa-calendar-alt text-primary"></i> Reporte por Fechas</h2>
</div>

<div class="card mb-4 shadow-sm">
    <div class="card-body">
        <form method="POST" class="row g-3 align-items-end">
            <div class="col-md-4">
                <label class="form-label">Fecha y Hora Inicio</label>
                <input type="datetime-local" class="form-control" name="fecha_inicio" value="<?= date('Y-m-d\TH:i', strtotime($fecha_inicio)) ?>" step="1">
            </div>
            <div class="col-md-4">
                <label class="form-label">Fecha y Hora Fin</label>
                <input type="datetime-local" class="form-control" name="fecha_fin" value="<?= date('Y-m-d\TH:i', strtotime($fecha_fin)) ?>" step="1">
            </div>
            <div class="col-md-4">
                <button type="submit" class="btn btn-primary w-100"><i class="fa-solid fa-search"></i> Generar Reporte</button>
            </div>
        </form>
    </div>
</div>

<div class="row mb-4">
    <div class="col-md-2 mb-2">
        <div class="stat-card bg-blue shadow-sm p-3">
            <div><p class="mb-0 fs-6">Ventas</p><h5>$<?= number_format($tot_ventas, 2) ?></h5></div>
        </div>
    </div>
    <div class="col-md-2 mb-2">
        <div class="stat-card bg-green shadow-sm p-3">
            <div><p class="mb-0 fs-6">Ingresos</p><h5>$<?= number_format($tot_ingresos, 2) ?></h5></div>
        </div>
    </div>
    <div class="col-md-2 mb-2">
        <div class="stat-card bg-red shadow-sm p-3">
            <div><p class="mb-0 fs-6">Egresos</p><h5>$<?= number_format($tot_egresos, 2) ?></h5></div>
        </div>
    </div>
    <div class="col-md-2 mb-2">
        <div class="stat-card bg-warning text-dark shadow-sm p-3">
            <div><p class="mb-0 fs-6">Compras</p><h5>$<?= number_format($tot_compras, 2) ?></h5></div>
        </div>
    </div>
    <div class="col-md-4 mb-2">
        <div class="stat-card <?= $utilidad >= 0 ? 'bg-purple' : 'bg-secondary' ?> shadow-sm p-3 h-100">
            <div><p class="mb-0 fs-5">Utilidad Neta del Rango</p><h3>$<?= number_format($utilidad, 2) ?></h3></div>
        </div>
    </div>
</div>

<ul class="nav nav-tabs mb-4" id="reportTabs">
  <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#ventas">Ventas</a></li>
  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#ingresos">Ingresos</a></li>
  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#egresos">Egresos</a></li>
  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#compras">Compras</a></li>
</ul>

<div class="tab-content">
  <div class="tab-pane fade show active" id="ventas">
      <div class="card shadow-sm"><div class="card-body p-0"><div class="table-responsive">
          <table class="table table-hover mb-0">
              <thead class="table-light"><tr><th>Producto</th><th>Cantidad</th><th>Vr. Unitario</th><th>Vr. Total</th></tr></thead>
              <tbody>
                  <?php foreach($ventas as $v): ?>
                  <tr>
                      <td><?= htmlspecialchars($v['nombre']) ?></td>
                      <td><?= $v['cantidad'] ?></td>
                      <td>$<?= number_format($v['precio_unitario'], 2) ?></td>
                      <td class="fw-bold text-success">$<?= number_format($v['total'], 2) ?></td>
                  </tr>
                  <?php endforeach; ?>
                  <?php if(empty($ventas)) echo "<tr><td colspan='4' class='text-center py-3'>No hay ventas en estas fechas.</td></tr>"; ?>
              </tbody>
          </table>
      </div></div></div>
  </div>

  <div class="tab-pane fade" id="ingresos">
      <div class="card shadow-sm"><div class="card-body p-0"><div class="table-responsive">
          <table class="table table-hover mb-0">
              <thead class="table-light"><tr><th>Fecha</th><th>Descripción</th><th>Valor</th></tr></thead>
              <tbody>
                  <?php foreach($ingresos as $i): ?>
                  <tr><td><?= $i['fecha'] ?></td><td><?= htmlspecialchars($i['concepto']) ?></td><td class="text-success fw-bold">$<?= number_format($i['monto'], 2) ?></td></tr>
                  <?php endforeach; ?>
                  <?php if(empty($ingresos)) echo "<tr><td colspan='3' class='text-center py-3'>Sin registros.</td></tr>"; ?>
              </tbody>
          </table>
      </div></div></div>
  </div>

  <div class="tab-pane fade" id="egresos">
      <div class="card shadow-sm"><div class="card-body p-0"><div class="table-responsive">
          <table class="table table-hover mb-0">
              <thead class="table-light"><tr><th>Fecha</th><th>Concepto</th><th>Monto</th></tr></thead>
              <tbody>
                  <?php foreach($egresos as $e): ?>
                  <tr><td><?= $e['fecha'] ?></td><td><?= htmlspecialchars($e['concepto']) ?></td><td class="text-danger fw-bold">$<?= number_format($e['monto'], 2) ?></td></tr>
                  <?php endforeach; ?>
                  <?php if(empty($egresos)) echo "<tr><td colspan='3' class='text-center py-3'>Sin registros.</td></tr>"; ?>
              </tbody>
          </table>
      </div></div></div>
  </div>

  <div class="tab-pane fade" id="compras">
      <div class="card shadow-sm"><div class="card-body p-0"><div class="table-responsive">
          <table class="table table-hover mb-0">
              <thead class="table-light"><tr><th>Fecha</th><th>Factura / Concepto</th><th>Monto</th></tr></thead>
              <tbody>
                  <?php foreach($compras as $c): ?>
                  <tr><td><?= $c['fecha'] ?></td><td><?= htmlspecialchars($c['concepto']) ?></td><td class="text-warning fw-bold">$<?= number_format($c['monto'], 2) ?></td></tr>
                  <?php endforeach; ?>
                  <?php if(empty($compras)) echo "<tr><td colspan='3' class='text-center py-3'>Sin registros.</td></tr>"; ?>
              </tbody>
          </table>
      </div></div></div>
  </div>
</div>

<?php require_once 'footer.php'; ?>