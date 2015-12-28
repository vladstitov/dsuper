<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Admin First time">
    <meta name="author" content="ulight Vlad">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <title>Admin Super Login</title>
    <script type="text/javascript" src="js/libs/jquery-2.1.4.min.js"></script>
    <script src="js/libs/require.js"> </script>

    <style>
        .off{
            display: none;
        }
        #CreateUser>div, #FirstLogin>div {
            width: 350px;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            top: 200px;

        }

        .Message{
            position: absolute;
            bottom: 20px;
            padding: 5px;
            background-color: #faebcc;
            border-radius: 5px;
            box-shadow: 5px 5px 5px gray;
        }



    </style>
    <script>
        requirejs.config({
            baseUrl: 'js',
            paths:{
                'easel' :'libs/tweenjs-0.6.1.min',
                'tween':'libs/easeljs-0.8.1.min'
            }
        });
$(document).ready(function(){
    require(['Utils'],function(){
        require(['Login','Utils'],function(){
            var login = new uplight.LoginController($('[data-ctr=uplightLoginController]:first'));


        });
    });

})

    </script>

    <link href="css/bootstrap.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<div id="uplightLoginController" class="container" data-ctr="uplightLoginController">
    <div id="CreateUser"  class="row off">
        <div class="panel panel-default">
            <div class="panel-body">
                <div style="position: relative">
                    <div  class="Message hidden" data-id="message">

                    </div>
                </div>
                <h4>Create new user</h4>
                <form role="form">
                    <div class="form-group">
                        <label for="create-email">Email</label><small> (Reqired to restore password) </small>
                        <input type="email" class="form-control"  id="create-email" name="email" />
                    </div>
                   <!-- <div class="form-group">
                        <label for="create-email2">Confirm Email</label>
                        <input type="email" class="form-control" id="create-email2" data-id="email2" />
                    </div>-->
                    <div class="form-group">
                        <label for="create-user">Username</label>
                        <input type="text" min="" name="username" class="form-control" id="create-user" data-id="user" placeholder="Minimum 5 characters"  pattern=".{5,30}" required  />
                    </div>
                    <div class="form-group">
                        <label for="create-pwd">Password:</label>
                        <input type="password" name="password" class="form-control" id="create-pwd" data-id="pass" placeholder="Minimum 5 characters"  pattern=".{5,30}" required />
                    </div>

                    <div class="checkbox">
                        <label><input type="checkbox" data-id="chkPass"> Show password</label>
                    </div>
                    <button type="submit" class="btn btn-primary pull-right">Submit</button>
                </form>
            </div>
        </div>
    </div>
    <div id="FirstLogin" class="row">
        <div  class="panel panel-default">
            <div class="panel-body">
                <div style="position: relative">
                    <div  class=".Message hidden" data-id="message">

                    </div>
                </div>
                <form>
                    <div class="form-group">
                        <label for="welcome-user">Username</label>
                        <input type="text" name="username" class="form-control" id="welcome-user" data-id="user" required />
                    </div>
                    <div class="form-group">
                        <label for="welcome-pwd">Password:</label>
                        <input type="password" name="password" class="form-control" id="welcome-pwd" data-id="pass" required />
                    </div>
                    <div class="checkbox">
                        <label><input type="checkbox" data-id="chkPass"> Show password</label>
                    </div>
                    <button type="submit" class="btn btn-primary pull-right">Submit</button>
                </form>
            </div>
        </div>
    </div>
</div>

</body>
</html>