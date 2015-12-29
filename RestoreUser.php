<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Admin super panel">
    <meta name="author" content="ulight Vlad">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <title>Admin Super Login</title>
    <script type="text/javascript" src="js/libs/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="js/libs/require.js"></script>

    <style>
        .login-form{
            width: 350px;
            height: 250px;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            top: 200px;
        }


    </style>   

    <link href="css/bootstrap.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="login-form">
           <h6 class="text-right">
               <small><a href="index" class="btn">To Admin panel</a></small>
           </h6>
                <div class="panel panel-default">
                    <div class="panel-body">
                <?	include('htms/RestoreUser.htm');	?>
                     </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-body">
                <? include('htms/RestorePassword.htm'); ?>
                    </div>
                </div>

        </div>
    </div>
</div>

</body>
</html>