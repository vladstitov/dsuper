<?
$id = isset($_SESSION['directories_userid'])?$_SESSION['directories_userid']:0;
if($id){

    echo shell_exec('git pull 2>&1');
}else echo 'Hello World '.$id;
?>
