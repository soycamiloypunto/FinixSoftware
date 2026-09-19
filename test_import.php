<?php
try {
    $pdo = new PDO('mysql:host=grupoinnovate.co;port=3306;dbname=grupoin6_finixsoftware', 'grupoin6_finixuser', 'FinixPass2027...', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "Connected successfully.\n";
    
    $sql = file_get_contents('inserts_solamente.sql');
    $queries = explode(';', $sql);
    
    foreach ($queries as $q) {
        $q = trim($q);
        if (empty($q)) continue;
        
        try {
            $pdo->exec($q);
        } catch (PDOException $e) {
            echo "ERROR ON QUERY:\n";
            echo substr($q, 0, 200) . "...\n";
            echo "ERROR: " . $e->getMessage() . "\n";
            exit(1);
        }
    }
    echo "ALL QUERIES EXECUTED SUCCESSFULLY!\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}