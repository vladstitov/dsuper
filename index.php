<?
session_start();
if(!isset($_SESSION['directories_role']) || !isset($_SESSION['directories_userid']) || $_SESSION['directories_userid']===0 || $_SESSION['directories_role']=='welcome'){
	 echo file_get_contents('Login.html');
	  exit;
}
$role = $_SESSION['directories_role'];

$user_id=$_SESSION['directories_userid'];


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Admin panel">
    <meta name="author" content="ulight Vlad">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link href="css/reset.css" rel="stylesheet" type="text/css"/>
    <link href="css/bootstrap.css" rel="stylesheet" type="text/css"/>
    <link href="css/font-awesome.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="js/libs/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="js/libs/underscore-min.js"> </script>
    <script type="text/javascript" src="js/libs/require.js"> </script>
    <style>
        .message{
            position: fixed;
        }
        .selected{
            background-color: khaki;
        }

    </style>
    <script>
        requirejs.config({
            baseUrl: 'js',
            paths:{
                'easel' :'libs/tweenjs-0.6.1.min',
                'tween':'libs/easeljs-0.8.1.min',
                'ListEdit':'ListEditor'
            }
        }); var urole ='<?=$role.$user_id;?>';
    </script>
        <title data-id="">Super Admin</title>
</head>
<body>
<div class="container">
    <div class="row">
        <h4 ><span>Interactive Directory Super Admin </span>
            <a id="btnLogout" data-id="btnLogout" class="btn pull-right"><span class="fa fa-user-times"></span> LogOut</a>
        </h4>

    </div>

<div class="row text-center">

</div>
</div>
<div id="Content" >



</div>
<script type="text/javascript" src="js/Utils.js"> </script>
<script>
    $(document).ready(function(){
       require(['Main'],function(){
          var main =  new uplight.Controller();
       //    // return main
     });
    })

</script>

</body>
</html>