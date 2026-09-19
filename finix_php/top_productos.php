<?php
require_once 'header.php';

// Fechas Semana
$start_this_week = date('Y-m-d 00:00:00', strtotime('monday this week'));
$end_this_week = date('Y-m-d 23:59:59', strtotime('sunday this week'));

$start_last_week = date('Y-m-d 00:00:00', strtotime('monday last week'));
$end_last_week = date('Y-m-d 23:59:59', strtotime('sunday last week'));

// Fechas Mes
$start_this_month = date('Y-m-01 00:00:00');
$end_this_month = date('Y-m-t 23:59:59');

$start_last_month = date('Y-m-d 00:00:00', strtotime('first day of last month'));
$end_last_month = date('Y-m-d 23:59:59', strtotime('last day of last month'));

function getTopProducts($pdo, $start, $end) {
    $stmt = $pdo->prepare("
        SELECT p.nombre, SUM(vd.cantidad) as cantidad
        FROM venta_detalle vd
        JOIN venta v ON vd.venta_id = v.id
        JOIN producto p ON vd.producto_id = p.id
        WHERE v.fecha BETWEEN ? AND ?
        GROUP BY p.id, p.nombre
        ORDER BY cantidad DESC
        LIMIT 10
    ");
    $stmt->execute([$start, $end]);
    return $stmt->fetchAll();
}

$top_tw = getTopProducts($pdo, $start_this_week, $end_this_week);
$top_lw = getTopProducts($pdo, $start_last_week, $end_last_week);
$top_tm = getTopProducts($pdo, $start_this_month, $end_this_month);
$top_lm = getTopProducts($pdo, $start_last_month, $end_last_month);

$best_tw = $top_tw[0]['nombre'] ?? 'Sin datos';
$best_tw_cant = $top_tw[0]['cantidad'] ?? 0;

$best_tm = $top_tm[0]['nombre'] ?? 'Sin datos';
$best_tm_cant = $top_tm[0]['cantidad'] ?? 0;
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fa-solid fa-trophy text-warning"></i> Top 10 Productos</h2>
</div>

<div class="row mb-4">
    <div class="col-md-6">
        <div class="card shadow-sm h-100 border-0 bg-purple text-white">
            <div class="card-body d-flex align-items-center">
                <i class="fa-solid fa-medal fa-3x me-4 opacity-50"></i>
                <div>
                    <h6 class="text-uppercase mb-1 opacity-75">Líder Esta Semana</h6>
                    <h3 class="mb-0 fw-bold"><?= htmlspecialchars($best_tw) ?></h3>
                    <small><?= $best_tw_cant ?> unidades</small>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card shadow-sm h-100 border-0 bg-blue text-white">
            <div class="card-body d-flex align-items-center">
                <i class="fa-solid fa-crown fa-3x me-4 opacity-50"></i>
                <div>
                    <h6 class="text-uppercase mb-1 opacity-75">Líder Este Mes</h6>
                    <h3 class="mb-0 fw-bold"><?= htmlspecialchars($best_tm) ?></h3>
                    <small><?= $best_tm_cant ?> unidades</small>
                </div>
            </div>
        </div>
    </div>
</div>

<ul class="nav nav-tabs mb-4" id="topTabs">
  <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#semanas">Comparativa Semanal</a></li>
  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#meses">Comparativa Mensual</a></li>
</ul>

<div class="tab-content">
    <div class="tab-pane fade show active" id="semanas">
        <div class="row">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header">Esta Semana (Corriendo)</div>
                    <div class="card-body"><canvas id="c_tw" height="250"></canvas></div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header">Semana Pasada</div>
                    <div class="card-body"><canvas id="c_lw" height="250"></canvas></div>
                </div>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="meses">
        <div class="row">
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header">Este Mes (Corriendo)</div>
                    <div class="card-body"><canvas id="c_tm" height="250"></canvas></div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="card-header">Mes Pasado</div>
                    <div class="card-body"><canvas id="c_lm" height="250"></canvas></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function createChart(id, labels, data, color) {
    new Chart(document.getElementById(id).getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Unidades', data: data, backgroundColor: color, borderWidth: 1 }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

createChart('c_tw', <?= json_encode(array_column($top_tw, 'nombre')) ?>, <?= json_encode(array_column($top_tw, 'cantidad')) ?>, 'rgba(111, 66, 193, 0.6)');
createChart('c_lw', <?= json_encode(array_column($top_lw, 'nombre')) ?>, <?= json_encode(array_column($top_lw, 'cantidad')) ?>, 'rgba(108, 117, 125, 0.6)');

createChart('c_tm', <?= json_encode(array_column($top_tm, 'nombre')) ?>, <?= json_encode(array_column($top_tm, 'cantidad')) ?>, 'rgba(13, 110, 253, 0.6)');
createChart('c_lm', <?= json_encode(array_column($top_lm, 'nombre')) ?>, <?= json_encode(array_column($top_lm, 'cantidad')) ?>, 'rgba(108, 117, 125, 0.6)');
</script>

<?php require_once 'footer.php'; ?>