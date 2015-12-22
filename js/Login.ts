/**
 * Created by VladHome on 12/13/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='Utils.ts' />
    declare var MD5:any;
module uplight{
    export class Login{
        onComplete:Function;
        $user:JQuery;
        $pass:JQuery;
        $msg:JQuery;
        conn:Connector;
        constructor(public $view:JQuery){
            this.conn = new Connector();
            $view.find( "form" ).submit(function( evt ) { evt.preventDefault(); });

            this.$user= $view.find('[data-id=user]');
            this.$pass = $view.find('[data-id=pass]');
            this.$msg =  this.$view.find('[data-id=message]');

            $view.find('button[type=submit]:first').click((evt:JQueryEventObject)=> {
                        var btn = $(evt.currentTarget).prop('disabled',true);
                        setTimeout(function(){btn.prop('disabled',false)},3000);
                        evt.preventDefault();

                        var user = this.$user.val();
                        var pass = this.$pass.val();
                        this.send(MD5(user)+','+MD5(pass));
            });

            $view.find('[data-id=chkPass]:first').change((el)=>{
                if($(el.currentTarget).prop('checked')){
                    this.$pass.prop('type','text');
                }else this.$pass.prop('type','password');
            })


        }

        send(str){
           var  obj ={credetials:'login,'+str};
            this.conn.post(obj,'login').done((s:string)=>this.onResult(s));
        }
        cleanFields():void{
            this.$user.val('');
            this.$pass.val('');
        }
        show(){
            this.$view.removeClass('hidden');
            this.$view.show('fast');
        }
        hide():void{
            this.$view.hide('fast');
        }

        onResult(s:string):void{
            console.log(s);
            try{
                var res:VOResult =   JSON.parse(s);
            }catch (e){
                console.log(s);
                return;
            }

            if(res.success){
                if(res.success=='loggedin' && this.onComplete)this.onComplete(res);
               else this.message('Please check your Username and Password')

            } else  this.message(res.result);
        }

        message(msg):void{
               var m=this.$msg;
            console.log(m);
                m.html(msg).removeClass('hidden').fadeIn();
                setTimeout(function(){ m.fadeOut(); },5000);
        }

    }
    export class NewSuper extends Login{
        onResult(s:string):void{
            var res:VOResult =   JSON.parse(s);
            console.log(res);
            if(res.success && this.onComplete)this.onComplete(res);
            else  this.message(res.result);
        }

        checkUser(str):JQueryPromise<boolean>{
            var d = $.Deferred();


            return  d.promise();
        }
        send(str):void{
            var  obj ={credetials:'createuser,'+str};
            this.conn.post(obj,'login').done((s)=>this.onCreated(s));
        }
        onCreated(s:string):void{
            var res:VOResult = JSON.parse(s);
            console.log(res);
            if(res.success=='taken'){
                this.message('User with this name exists. Please use your email address or change username');
            }else if(res.success='usercreated'){
                localStorage.setItem('newuser',this.$user.val());
                //localStorage.setItem('pass',this.$pass.val());
                if(this.onComplete)this.onComplete(res);
            }
        }
    }
}