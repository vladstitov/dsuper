<?
$src ='C:/wamp/www/directories/dist/dir_test';
$dest ='C:/wamp/www/directories/est5';
$cmd = "git clone -l  $src $dest";
echo shell_exec($cmd);
?>