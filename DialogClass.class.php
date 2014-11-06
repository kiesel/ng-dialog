<?php

class DialogClass extends \lang\Object implements JsonSerializable {

  public function jsonSerialize() {
    $data= get_object_vars($this);
    unset($data['__id']);
    $data['__type']= get_class($this);

    return $data;
  }
}