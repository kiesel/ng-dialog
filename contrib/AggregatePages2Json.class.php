<?php

use util\cmd\Console;

class AggregatePages2Json extends \lang\Object {

  public static function main($args) {
    $prefix= rtrim($args[0], DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;

    $index= 0;
    $length= -1;
    $entries= [];

    do {
      $file= $prefix.'page_'.$index++.'.idx';
      $data= unserialize(file_get_contents($file));
      if (!$data) {
        Console::$err->writeLine('File not found: '.$file.' not found.');
        return;
      }

      foreach ($data['entries'] as $name => $value) {
        $entries[$name]= $value;
      }

      if ($length == -1) {
        $length= $data['total'];
      }

    } while (sizeof($entries) < $length);

    Console::writeLine('---> Writing '.sizeof($entries).' entries out to '.$prefix.'allpages.json');
    file_put_contents($prefix.'allpages.json', json_encode($entries));
  }
}
