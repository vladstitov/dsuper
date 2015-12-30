/**
 * Created by VladHome on 12/24/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="AddAccountSteps.ts"/>
module uplight{

    export class UAdmin{
            email:string;
            name:string;
        sendemail:string;
        username:string;
        password:string;

    }
    export class UFinal{
        admins:UAdmin[];
        config:UItem[];
    }
    export class FinalResultCtr extends DisplayObject{
        constructor($view:JQuery,name?:string){
            super($view,name);
            this.conn = new Connector();
            this.initButtons()
        }
        initButtons():void{
            this.$view.find('[data-id=btnClose]').click(()=>this.onClose());
            this.$view.find('[data-id=btnSave]').click(()=>this.onSave());
            this.$view.find('[data-id=btnBack]').click(()=>{this.onBack()});

            //this.$message = this.$view.find('[data-id=message]');
        }

        conn:Connector;

        onSave():void{

        }
        onClose():void{  console.log('onClose '+this.id); }
        onBack():void{  console.log('onBack '+this.id);  }
        onComplete():void{  console.log('onComplete '+this.id); }


        data:UFinal;
        server:VOResult;
        isVisuble:boolean;

        reset():FinalResultCtr{
            return this;
        }
        onServer(s:string):void{
           /// console.log(this.name,s);
            var res:any
            try{
                res = JSON.parse(s);

            }catch (e){

            }
            if(res) this.render(res);
            // if(res.success) this.server = res;
            else alert('Server Communication error.');

        }

        setData1(data:UFinal):FinalResultCtr{
            this.data = data;
            var ar = data.admins;
            this.$view.find('.uadmin').detach();
            var out:string='';
            for(var i=0,n=ar.length;i<n;i++){
                out+='<tr class="uadmin"><td>'+ar[i].name+'</td><td>'+ar[i].email+'</td>';

            }

            this.$view.find('[data-id=admins]').after(out);
            console.log('FinalResultCtr ',data);
            this.conn.post(JSON.stringify(data.config),'account.create_config').done((s)=>this.onServer(s));
            return this;
        }
        getData():UFinal{
            return this.data;
        }

        private getName(ar:UItem[]){
            for(var i=0,n=ar.length;i<n;i++){
                if(ar[i].id=='admin_name') return ar[i].value ;
            }
        }
        render(config:any):void{
            var server:string = config.server;

            var v:JQuery = this.$view;
            var namespace:string = config.namespace;
            var url = config.server;

            v.find('[data-id=account_name]').children().last().text(config.account_name);
            v.find('[data-id=description]').children().last().text(config.description);
            v.find('[data-id=namespace]').children().last().text(config.namespace);
            v.find('[data-id=admin_url]').children().last().html('<small>'+config.adminurl+'</small>');

            if(config.KioskMobile) v.find('[data-id=KioskMobile]').show().children().last().html(url+'/'+config.KioskMobile);
            else v.find('[data-id=KioskMobile]').show().children().last().html('');

            if(config.Kiosk1080) v.find('[data-id=Kiosk1080]').show().children().last().html(url+'/'+config.Kiosk1080);
            else v.find('[data-id=Kiosk1080]').show().children().last().html('');
            if(config.Kiosk1920)  v.find('[data-id=Kiosk1920]').show().children().last().html(url+'/'+config.Kiosk1920);
            else v.find('[data-id=Kiosk1920]').show().children().last().html('');
            //else v.find('[data-id=mobile]').hide()



            return;

        }


    }
}