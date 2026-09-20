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
        .sidebar { min-height: 100vh; background-color: var(--finix-dark) !important; color: white; padding-top: 20px; }
        .sidebar a { color: #e2e8f0 !important; text-decoration: none; padding: 12px 20px; display: block; font-weight: 500; transition: 0.3s; }
        .sidebar a:hover, .sidebar a.active { background-color: rgba(255,255,255,0.1) !important; color: var(--finix-yellow) !important; border-left: 4px solid var(--finix-yellow) !important; }
        .sidebar i { width: 25px; }
        .main-content { padding: 30px; }
        .card { border: none; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 24px; }
        .card-header { background-color: white; border-bottom: 1px solid #f0f0f0; font-weight: bold; padding: 15px 20px; }
        .stat-card { padding: 20px; border-radius: 10px; color: white; display: flex; align-items: center; justify-content: space-between; }
        .stat-card h3 { margin: 0; font-size: 28px; font-weight: bold; }
        .bg-purple { background: linear-gradient(45deg, var(--finix-dark), var(--finix-light)); }
        .bg-green { background: linear-gradient(45deg, #198754, #20c997); }
        .bg-red { background: linear-gradient(45deg, #dc3545, #f87171); }
        .bg-blue { background: linear-gradient(45deg, #0d6efd, #3b82f6); }
        .bg-orange { background: linear-gradient(45deg, var(--finix-orange), var(--finix-red)); }
        .btn-primary { background-color: var(--finix-orange); border-color: var(--finix-orange); }
        .btn-primary:hover { background-color: var(--finix-red); border-color: var(--finix-red); }
        .table th { background-color: #f8f9fa; color: #495057; font-weight: 600; }
        .navbar-brand { font-size: 24px; font-weight: bold; padding: 0 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; display: block; color: white; text-decoration: none;}
    </style>
    <link rel="stylesheet" href="finix-palette.css">
</head>
<body>
<nav class="navbar navbar-dark d-md-none" style="background-color: var(--finix-dark);">
  <div class="container-fluid">
    <a class="navbar-brand m-0 border-0 p-0" href="index.php" style="font-size:18px;">
      <img src="finix_logo_new.png" alt="Finix" style="width:30px;height:30px;vertical-align:middle;margin-right:10px;">
      Reportes
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu">
      <span class="navbar-toggler-icon"></span>
    </button>
  </div>
</nav>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-3 col-lg-2 px-0 sidebar offcanvas-md offcanvas-start" id="sidebarMenu" style="background-color: var(--finix-dark) !important; --bs-offcanvas-bg: var(--finix-dark);">
            <div class="offcanvas-header d-md-none border-bottom" style="border-color: rgba(255,255,255,0.1) !important;">
                <h5 class="offcanvas-title text-white">Menú</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
            </div>
            <a href="index.php" class="navbar-brand text-center d-none d-md-block">
                <img src="finix_logo_new.png" alt="Finix" style="width:80px;height:80px;display:block;margin:0 auto 10px;">
                <span style="font-size: 18px; font-weight: 500; color: #e2e8f0;">Reportes</span>
            </a>
            <a href="index.php" class="<?= $current_page == 'index.php' ? 'active' : '' ?>"><i class="fa-solid fa-home"></i> Inicio</a>
            <a href="fechas.php" class="<?= $current_page == 'fechas.php' ? 'active' : '' ?>"><i class="fa-solid fa-calendar-alt"></i> Por Fechas</a>
            <a href="top_productos.php" class="<?= $current_page == 'top_productos.php' ? 'active' : '' ?>"><i class="fa-solid fa-trophy"></i> Top Productos</a>
            
            <a href="mes.php" class="<?= $current_page == 'mes.php' ? 'active' : '' ?>"><i class="fa-solid fa-calendar-days"></i> Último Mes</a>
            <a href="dos_meses.php" class="<?= $current_page == 'dos_meses.php' ? 'active' : '' ?>"><i class="fa-solid fa-chart-line"></i> Últimos 2 Meses</a>
            <a href="anio.php" class="<?= $current_page == 'anio.php' ? 'active' : '' ?>"><i class="fa-solid fa-calendar-check"></i> Utilidad Año Actual</a>
            <a href="logout.php" class="mt-5 text-danger"><i class="fa-solid fa-sign-out-alt"></i> Salir</a>
        </div>
        <div class="col-md-9 col-lg-10 main-content">
