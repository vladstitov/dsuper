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
    require(['Login','MD5','Utils'],function(){
        var login = new uplight.Login($('#FirstLogin'));
        login.onComplete = function(res){
            if(res.result ==='createuser'){
                login.hide();
                var newsup = new uplight.NewSuper($('#CreateUser'));
                newsup.show();
                newsup.cleanFields();
                newsup.onComplete = function(res){
                    console.log(res);
                    if(res.success=='usercreated'){
                        var ar = window.location.href.split('/');
                        ar.pop();
                        window.location.href=ar.join('/')+'/'+res.result;
                    }
                }
            }

        }

    });
})

    </script>

    <link href="css/bootstrap.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<div class="container">
    <div id="CreateUser"  class="row hidden">
        <div class="panel panel-default">
            <div class="panel-body">
                <div style="position: relative">
                    <div  class="Message hidden" data-id="message">

                    </div>
                </div>
                <h4>Create new user</h4>
                <form role="form">
                    <div class="form-group">
                        <label for="create-pwd">Username</label>
                        <input type="text" class="form-control" id="create-user" data-id="user">
                    </div>
                    <div class="form-group">
                        <label for="create-pwd">Password:</label>
                        <input type="password" class="form-control" id="create-pwd" data-id="pass">
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
                        <input type="text" class="form-control" id="welcome-user" data-id="user">
                    </div>
                    <div class="form-group">
                        <label for="welcome-pwd">Password:</label>
                        <input type="password" class="form-control" id="welcome-pwd" data-id="pass">
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