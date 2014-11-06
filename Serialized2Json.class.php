<?php

use lang\ClassLoader;
use util\cmd\Console;

class Serialized2Json extends \lang\Object {

  public static function dialog_class_loader($classname) {
    // Console::$out->writeLine('Loading '.$classname);
    ClassLoader::defineClass($classname, 'lang.Object', [], '{}');
  }

  public static function main($args) {

    // Define class autoloader (autodefiner)
    spl_autoload_register(__CLASS__.'::dialog_class_loader');

    foreach ($args as $arg) {
      Console::writeLine('Converting '.$arg);
      
      $data= unserialize(file_get_contents($arg));
      $json= json_encode($data);
      
      file_put_contents($arg.'.json', $json);
    }
  }
}