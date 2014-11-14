<?php

use lang\ClassLoader;
use util\cmd\Console;

class Serialized2Json extends \lang\Object {

  public static function dialog_class_loader($classname) {

    // Console::$out->writeLine('Loading '.$classname);
    XPClass::forName('DialogClass');
    XPClass::forName('img.util.ExifData');
    XPClass::forName('img.util.IptcData');
    XPClass::forName('util.Date');

    if (!in_array($classname, [
      'Album', 
      'AlbumChapter', 
      'AlbumImage',
      'EntryCollection',
      'Topic',
      'SingleShot',
    ])) {
      Console::writeLine('Unknown class: ', $classname);
      return false;
    }

    ClassLoader::defineClass($classname, 'DialogClass', [], '{}');
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
