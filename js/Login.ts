/**
 * Created by VladHome on 12/13/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='Utils.ts' />
    declare var MD5:any;
module uplight{
    export class LoginController{

        constructor($view:JQuery){
            var login = new uplight.Login($('#FirstLogin'));
            login.onComplete = function(res){
                console.log(res);
                if(res.success ==='create_user'){
                    console.log('new user');
                    login.hide();
                    var newsup = new uplight.NewSuper($('#CreateUser'));
                    newsup.show();
                    newsup.onComplete = function(res){
                        console.log(res);

                        if(res.success=='usercreated'){
                            console.log(res);
                            newsup.showMessage('User created. Redirecting to Administrator page');
                                setTimeout(()=>{
                                  window.location.href=res.result;
                              },3000);

                        }
                    }
                }

            }
        }
    }

    export class Login extends SimpleForm{
        constructor(public $view:JQuery){
           super($view,'login','LoginForm');
            this.init();
            this.show();
            var pwd:JQuery =  $view.find('[name=password]');
           var chk:JQuery =  $view.find('[data-id=chkPass]').click(()=>{
                if(chk.prop('checked')) pwd.attr('type','text');
               else  pwd.attr('type','password');

            })
        }
        credentials:string='welcome';

        onSubmit(obj){
            var  obj2 ={credentials:this.credentials+','+obj.username+','+obj.password};
            this.send(obj2);
        }
    }
    export class NewSuper extends SimpleForm{
        constructor(public $view:JQuery){
            super($view,'login','NewSuper');
            this.init();
            this.show();
            var pwd:JQuery =  $view.find('[name=password]');
            var chk:JQuery =  $view.find('[data-id=chkPass]').click(()=>{
                if(chk.prop('checked')) pwd.attr('type','text');
                else  pwd.attr('type','password');

            })
        }
        onSubmit(obj){
            var  obj2 ={credentials:'createuser,'+obj.username+','+obj.password+','+obj.email};
            this.send(obj2);
        }



    }
}