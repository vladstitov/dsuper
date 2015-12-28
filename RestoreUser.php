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
        #loginForm{
            width: 350px;
            height: 250px;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }

        #Message{
            position: absolute;
            bottom: 20px;
            padding: 5px;
            background-color: #faebcc;
            border-radius: 5px;
            box-shadow: 5px 5px 5px gray;
        }



    </style>   

    <link href="css/bootstrap.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<div class="container">
    <div class="row">
    	<? 
			include('htms/RestoreUser.htm');

		?>  
        
    </div>
    <div class="row">
       <? include('htms/RestorePassword.htm'); ?>
    </div>
</div>

</body>
</html>