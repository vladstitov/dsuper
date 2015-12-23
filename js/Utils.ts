/**
 * Created by VladHome on 12/15/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />

module uplight{
   export class Utils{

       static message(text:string,vis:JQuery,time?:number){
           if(!time) time=3;
           var msg =  $('<div>').addClass('message').css(vis.offset()).text(text).appendTo('body');
           msg.hide();
           msg.show('fast');
           setTimeout(function(){
               msg.hide('fast',function(){
                   msg.remove();
               })
           },time*1000);
       }

   }


    export class VOResult{
        success:string;
        error:string;
        result:string;
        message:string;
    }


    export class Connector{
        static inst:Connector = new Connector();
       service:string = 'rem/service.php';
        static results:_.Dictionary<VOResult>;
        post(obj:any,url?:string):JQueryPromise<string>{
            if(!url)url='';
            return  $.post(this.service+'?a='+url,obj);
        }
        get(url:string):JQueryPromise<string>{
            return  $.get(this.service+'?a='+url);
        }
        logout():JQueryPromise<string>{
            return this.post({credetials:'logout'});
        }
        Log(str):JQueryPromise<string>{
            return  $.post(this.service+'?a=LOG',str);
        }
        Email(str):JQueryPromise<string>{
            return  $.post(this.service+'?a=EMAIL',str);
        }
    }

   export class Registry{
       static connector:Connector;
       static data:any;
       static settings:any;
   }


    export class DisplayObject{
        constructor(public $view:JQuery,public name?:string){

        }
        data:any;
        onShow():void{ }
        onHide():void{}
        onAdded():void{}
        onRemoved():void{}
        destroy():void{
            this.$view.remove();
        }
        id:number;
        isVisuble:boolean;
        show():DisplayObject{
            this.isVisuble = true;
            this.onShow();
            this.$view.show();
            return this;
        }

        hide():DisplayObject{
            if(this.isVisuble){
                this.isVisuble = false;
                this.$view.hide();
                this.onHide();
            }
            return this;
        }

        appendTo(parent:JQuery):DisplayObject{
            parent.append(this.$view);
            this.onAdded();
            return this;
        }
        remove():DisplayObject{
            this.$view.detach();
            this.onRemoved();
            return this;
        }
        setData(data:any):DisplayObject{
            this.data= data;
            return this;
        }
        getData():any{
            return this.data;
        }


    }

    export class WindowView extends  DisplayObject{
        constructor($view:JQuery,opt:any,name?:string) {
            super($view, name);
            this.$view.find('[data-id=btnClose]').click(()=>this.onClose());
        }
        onClose():void{
            this.hide();
        }

    }
    export class ModuleView extends  WindowView{
        constructor($view:JQuery,opt:any,name?:string) {
            super($view, name);
        }

    }



}