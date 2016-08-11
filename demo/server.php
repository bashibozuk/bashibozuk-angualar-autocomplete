<?php

$data = [
    'Jimmy Cricket',
    'Pinocchio',
    'Stromboli',
    'Geppetto',
    'Cleo',
    'Honest John',
    'Gideon',
    'Monstro',
];

$q = isset($_GET['q']) ? $_GET['q'] : '' ;
$result = [];

if (!$q) {
    die(json_encode($result));
}

foreach ($data as $key => $value) {
    if (mb_strpos($value, $q, 0, 'UTF-8') !== false) {
        $result[] = $value;
     }
}

die(json_encode($result));