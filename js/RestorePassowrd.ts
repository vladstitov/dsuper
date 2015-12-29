/**
 * Created by VladHome on 12/27/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path='Utils.ts' />

module uplight{
    export class RestorePassowrd extends SimpleForm{
        constructor($view,service:string,name:string){
            super($view,service,name);
            this.init();
        }
       /* onResult(res:VOResult){
            console.log(res)

        }*/
        onComplete(res:VOResult):void{
            this.$view.find('[data-id=message]').text(res.message).show();
            this.$view.find('form').hide();
        }

    }
}