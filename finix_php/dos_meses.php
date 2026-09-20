<?php
require_once 'header.php';

// Obtener las últimas 8 semanas (aprox 2 meses)
$weeks = [];
for ($i = 7; $i >= 0; $i--) {
    $ref_date = strtotime("-$i weeks");
    $dow = date('N', $ref_date); // 1 (Lunes) a 7 (Domingo)
    
    $start = date('Y-m-d 00:00:00', strtotime("-" . ($dow - 1) . " days", $ref_date));
    $end = date('Y-m-d 23:59:59', strtotime("+" . (7 - $dow) . " days", $ref_date));
    
    $label = date('d M', strtotime($start)) . ' - ' . date('d M', strtotime($end));
    $weeks[] = ['start' => $start, 'end' => $end, 'label' => $label];
}

$labels = [];
$data_ventas = [];
$data_ingresos = [];
$data_egresos = [];
$data_compras = [];
$data_utilidad = [];

foreach ($weeks as $w) {
    $labels[] = $w['label'];
    
    $stmt = $pdo->prepare("SELECT IFNULL(SUM(total_venta), 0) FROM venta WHERE fecha BETWEEN ? AND ?");
    $stmt->execute([$w['start'], $w['end']]);
    $v = (float) $stmt->fetchColumn();
    $data_ventas[] = $v;

    $stmt = $pdo->prepare("SELECT IFNULL(SUM(valor), 0) FROM ingreso WHERE fecha BETWEEN ? AND ?");
    $stmt->execute([substr($w['start'], 0, 10), substr($w['end'], 0, 10)]);
    $i = (float) $stmt->fetchColumn();
    $data_ingresos[] = $i;

    $stmt = $pdo->prepare("SELECT IFNULL(SUM(monto), 0) FROM egreso WHERE fecha BETWEEN ? AND ?");
    $stmt->execute([$w['start'], $w['end']]);
    $e = (float) $stmt->fetchColumn();
    $data_egresos[] = $e;

    $stmt = $pdo->prepare("SELECT IFNULL(SUM(total_compra), 0) FROM compra WHERE fecha BETWEEN ? AND ?");
    $stmt->execute([$w['start'], $w['end']]);
    $c = (float) $stmt->fetchColumn();
    $data_compras[] = $c;

    $data_utilidad[] = ($v + $i) - ($e + $c);
}
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fa-solid fa-chart-line text-info"></i> Evolución 2 Meses (Por Semana)</h2>
</div>

<div class="card shadow-sm mb-4">
    <div class="card-body">
        <canvas id="trimestreChart" height="100"></canvas>
    </div>
</div>

<script>
const ctx = document.getElementById('trimestreChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: <?= json_encode($labels) ?>,
        datasets: [
            {
                label: 'Utilidad Neta',
                data: <?= json_encode($data_utilidad) ?>,
                borderColor: '#198754',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true
            },
            {
                label: 'Ventas',
                data: <?= json_encode($data_ventas) ?>,
                borderColor: '#0d6efd',
                borderDash: [5, 5],
                tension: 0.3
            },
            {
                label: 'Otros Ingresos',
                data: <?= json_encode($data_ingresos) ?>,
                borderColor: '#0dcaf0',
                borderDash: [5, 5],
                tension: 0.3
            },
            {
                label: 'Egresos',
                data: <?= json_encode($data_egresos) ?>,
                borderColor: '#dc3545',
                borderDash: [5, 5],
                tension: 0.3
            },
            {
                label: 'Compras',
                data: <?= json_encode($data_compras) ?>,
                borderColor: '#fd7e14',
                borderDash: [5, 5],
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': $' + context.raw.toLocaleString('es-CO');
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value) { return '$' + value.toLocaleString('es-CO'); }
                }
            }
        }
    }
});
</script>

<?php require_once 'footer.php'; ?>