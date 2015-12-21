/**
 * Created by VladHome on 12/13/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='Connector.ts' />
    declare var MD5:any;
module uplight{
    export class Login{
        onComplete:Function;
        $user:JQuery;
        $pass:JQuery;
        $msg:JQuery;
        constructor(public $view:JQuery, public conn:Connector){
            $view.find( "form" ).submit(function( evt ) { evt.preventDefault(); });

            this.$user= $view.find('[data-index=user]');
            this.$pass = $view.find('[data-index=pass]');
            this.$msg =  this.$view.find('.Message');
            $view.find('button[type=submit]:first').click((evt:JQueryEventObject)=> {
                        var btn = $(evt.currentTarget).prop('disabled',true);
                        setTimeout(function(){btn.prop('disabled',false)},3000);
                        evt.preventDefault();
                        var user = this.$user.val();
                        var pass = this.$pass.val();

                        this.send(MD5(user)+','+MD5(pass));

            });




            $view.find('[data-index=chkPass]:first').change((el)=>{
                if($(el.currentTarget).prop('checked')){
                    this.$pass.prop('type','text')
                }else this.$pass.prop('type','password');
            })


        }

        send(str){
           var  obj ={credetials:'login,'+str};
            this.conn.post(obj).done((s:string)=>this.onResult(s));
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
            var res:VOResult =   JSON.parse(s);
            console.log(res);
            if(res.success){
                if(res.success=='loggedin' && this.onComplete)this.onComplete(res);
               else this.message('Please check your Username and Password')

            } else  this.message(res.result);
        }

        message(msg):void{
               var m=this.$msg;
                m.html(msg).removeClass('hidden').fadeIn();
                setTimeout(function(){ m.fadeOut(); },5000);
        }

    }
}