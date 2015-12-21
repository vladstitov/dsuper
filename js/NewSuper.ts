/**
 * Created by VladHome on 12/13/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
///<reference path='Connector.ts' />
    ///<reference path='Login.ts' />
module uplight{
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
            this.conn.post(obj).done((s)=>this.onCreated(s));
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