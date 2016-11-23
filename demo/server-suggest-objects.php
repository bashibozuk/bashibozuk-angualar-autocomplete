<?php
$data = [
    [
        'name' => 'Jimmy Cricket',
        'id' => 1
    ],
    [
        'name' => 'Pinocchio',
        'id' => 2
    ],
    [
        'name' => 'Stromboli',
        'id' => 3
    ],
    [
        'name' => 'Geppetto',
        'id' => 4
    ],
    [
        'name' => 'Cleo',
        'id' =>5
    ],
    [
        'name' => 'Honest John',
        'id' => 6
    ],
    [
        'name' => 'Gideon',
        'id' => 7
    ],
    [
        'name' => 'Monstro',
        'id' => 8
    ],
];

$q = isset($_GET['q']) ? $_GET['q'] : '' ;
$result = [];

if (!$q) {
    die(json_encode($result));
}

foreach ($data as $key => $value) {
    if (mb_strpos($value['name'], $q, 0, 'UTF-8') !== false) {
        $result[] = $value;
    }
}

die(json_encode($result));