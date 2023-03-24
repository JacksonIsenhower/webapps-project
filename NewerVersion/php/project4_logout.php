<?php
// You can't fire someone if they have no idea that they're fired
session_start();
 
// Set all session variables to a null value
$_SESSION = array();
session_destroy();
 
header("location: <INSERT LOGIN PAGE HERE>");
exit;
?>