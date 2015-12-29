<?
if(isset($_SESSION['directories_userid']) && $_SESSION['directories_userid']){

    echo shell_exec('git pull 2>&1');
}else echo 'Hello World';
?>
