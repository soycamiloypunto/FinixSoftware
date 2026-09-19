<?php
require_once 'db.php';
checkAuth();
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reportes Finix</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .sidebar { min-height: 100vh; background-color: #343a40; color: white; padding-top: 20px; }
        .sidebar a { color: #adb5bd; text-decoration: none; padding: 12px 20px; display: block; font-weight: 500; transition: 0.3s; }
        .sidebar a:hover, .sidebar a.active { background-color: #495057; color: white; border-left: 4px solid #6f42c1; }
        .sidebar i { width: 25px; }
        .main-content { padding: 30px; }
        .card { border: none; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 24px; }
        .card-header { background-color: white; border-bottom: 1px solid #f0f0f0; font-weight: bold; padding: 15px 20px; }
        .stat-card { padding: 20px; border-radius: 10px; color: white; display: flex; align-items: center; justify-content: space-between; }
        .stat-card h3 { margin: 0; font-size: 28px; font-weight: bold; }
        .bg-purple { background: linear-gradient(45deg, #6f42c1, #8555da); }
        .bg-green { background: linear-gradient(45deg, #198754, #20c997); }
        .bg-red { background: linear-gradient(45deg, #dc3545, #f87171); }
        .bg-blue { background: linear-gradient(45deg, #0d6efd, #3b82f6); }
        .table th { background-color: #f8f9fa; color: #495057; font-weight: 600; }
        .navbar-brand { font-size: 24px; font-weight: bold; padding: 0 20px 20px; border-bottom: 1px solid #4a5056; margin-bottom: 15px; display: block; color: white; text-decoration: none;}
    </style>
</head>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-3 col-lg-2 px-0 sidebar d-none d-md-block">
            <a href="index.php" class="navbar-brand"><i class="fa-solid fa-chart-pie me-2"></i>Finix Reportes</a>
            <a href="index.php" class="<?= $current_page == 'index.php' ? 'active' : '' ?>"><i class="fa-solid fa-home"></i> Inicio</a>
            <a href="fechas.php" class="<?= $current_page == 'fechas.php' ? 'active' : '' ?>"><i class="fa-solid fa-calendar-alt"></i> Por Fechas</a>
            <a href="top_productos.php" class="<?= $current_page == 'top_productos.php' ? 'active' : '' ?>"><i class="fa-solid fa-trophy"></i> Top Productos</a>
            
            <a href="mes.php" class="<?= $current_page == 'mes.php' ? 'active' : '' ?>"><i class="fa-solid fa-calendar-days"></i> Último Mes</a>
            <a href="dos_meses.php" class="<?= $current_page == 'dos_meses.php' ? 'active' : '' ?>"><i class="fa-solid fa-chart-line"></i> Últimos 2 Meses</a>
            <a href="anio.php" class="<?= $current_page == 'anio.php' ? 'active' : '' ?>"><i class="fa-solid fa-calendar-check"></i> Utilidad Año Actual</a>
            <a href="logout.php" class="mt-5 text-danger"><i class="fa-solid fa-sign-out-alt"></i> Salir</a>
        </div>
        <div class="col-md-9 col-lg-10 main-content">
