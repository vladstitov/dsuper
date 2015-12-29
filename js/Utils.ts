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
        constructor(private action?:string){

        }
        post(obj:any,url?:string):JQueryPromise<string>{
            if(typeof obj == 'object') obj = JSON.stringify(obj);
            if(!url)url=this.action || '';
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
        logError(str):JQueryPromise<string>{
            return  $.post(this.service+'?a=ERROR',str);
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
    export class SimpleForm extends DisplayObject{

        inputs:HTMLInputElement[];
       ind:_.Dictionary<HTMLInputElement>;
        $submit:JQuery;
        conn:Connector;
        message:string='Form error';
        constructor(public $view,service:string,name?:string){
            super($view,name);
            this.conn = new Connector(service);        }
        init(){
           this. $view.find( "form" ).submit(function( evt ) { evt.preventDefault(); });
            var ar:HTMLInputElement[]=[];
            var dic:any={};
            this.$view.find('input').each(function(i,el){
                dic[el.getAttribute('data-id')]=el;
                ar.push(el);
            })
            this.inputs = ar;
            this.ind=dic;
            this.$submit = this.$view.find('[type=submit]').click(()=>this.onSubmitClick())
        }
        onSubmitClick():void{
            var valid = true;
            var ar = this.inputs;
            var data:any={};
            for(var i=0,n=ar.length;i<n;i++){
               if(!ar[i].checkValidity()) valid = false;
                if(ar[i].type=='checkbox') data[ar[i].name]=ar[i].checked;
                else data[ar[i].name]=ar[i].value;
            }
            if(valid){
                var btn:JQuery = this.$submit.prop('disabled',true);
                setTimeout(function(){
                 btn.prop('disabled',false)
                },3000)
                this.onSubmit(data);
            }
        }
        onComplete(res:VOResult):void{

        }
        onError(res:VOResult):void{
            var msg:string = res.message || this.message
            this.showMessage(msg);
            console.log(msg);
        }
        onResult(res:VOResult):void{
            if(res.success)this.onComplete(res);
            else this.onError(res)
        }

        onRespond(s:string):void{
            var res:VOResult;
            try{
                res = JSON.parse(s);
            }catch (e){
                this.showMessage('Communication Error logged on server <br/> We will contact you soon');
                this.conn.Email(this.name+this.conn.service+'  '+s);
              //  console.log(s);
                return;
            }
            if(res) this.onResult(res);
        }
        send(obj){
            this.conn.post(obj).done((s:string)=>this.onRespond(s))
        }

        onSubmit(data:any){
            this.send(data);
        }
        timeout:number;
        showMessage(str:string){
            var msg = this.$view.find('[data-id=message]').html(str).removeClass('hidden').fadeIn();
            clearTimeout(this.timeout);
           this.timeout =  setTimeout(function(){ msg.fadeOut(); },5000);
        }


    }

}