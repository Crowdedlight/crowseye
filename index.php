<?php

  #CONFIG DEFAULTS and some other stuff
  $version = "1.2.2";
  $projectName = "Crow's Eye";
  $doctype = '<!DOCTYPE html>';
  $charset = "utf-8";
  $homePassword = "";
  $news = "";
  $crest_clientID = "";
  $crest_secretKey = "";
  #END OF DEFAULTS
  
  if (file_exists("config.php")) {
    include("config.php"); #for things like setting a password
  }

  foreach (glob("views/*.php") as $file) {
    include $file;
  }

  session_start(); 

  require_once("urls.php");

  foreach ($urls as $value => $func) {
    if (preg_match("@".$value."@i", $_SERVER['REQUEST_URI'], $args)) {
      header('Content-Type: text/html; charset='.$charset);
      $func($args);
      exit();
    } 
  }


  requestError(404, $_SERVER);
?>
