/**
 * Created by VladHome on 12/24/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="AddAccountCtr.ts"/>
    ///<reference path="Accounts.ts"/>
module uplight{
    export class AccountInfo  extends ModuleView{
        constructor($view:JQuery,name?:string) {
            super($view, name);
        }

        private renderData(data:AccData):void{
            console.log(data);
            var cfg:AccCfg= data.config;
            var url:string = cfg.server+'/';
            if(cfg.KioskMobile)  this.$view.find('[data-id=mobile]:first').text(url+cfg.KioskMobile).attr('href',url+cfg.KioskMobile).parent().show();
            else this.$view.find('[data-id=mobile]:first').parent().hide();

            this.$view.find('[data-id=admin-url]:first').text(cfg.adminurl).attr('href',cfg.adminurl);

            var admins:string ='';
            var ar = data.admins;
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                admins+='<tr><td>'+item.name+'</td><td><a href="mailto:'+item.email+'" >'+item.email+'</a></td>';
            }
            this.$view.find('[data-id=admins]:first').html(admins);
            var kiosks:string='';

            var ar2 = []

            if(cfg.Kiosk1080) ar2.push(cfg.Kiosk1080);
            if(cfg.Kiosk1920) ar2.push(cfg.Kiosk1920);
            if(ar2 && ar2.length){
                for(var i=0,n=ar2.length;i<n;i++)   kiosks+='<a href="'+url+ar2[i]+'" target="_blank" class="list-group-item">'+url+ar2[i]+'</a>';
                //  this.$view.find('[data-id=kiosks]:first').html(kiosks).parent().show();
            }

            this.$view.find('[data-id=kiosks]:first').html(kiosks)



        }
        onDataError(){

        }
        reset(){
            this.$view.find('[data-id=name]').text('');
            this.$view.find('[data-id=description]').text('');
            this.$view.find('[data-id=admin-url]:first').text('').attr('href','');
            this.$view.find('[data-id=mobile]:first').text('').attr('href','');
            this.$view.find('[data-id=admins]:first').html('');
            this.$view.find('[data-id=kiosks]:first').html('')

        }
        onShow():void{
           this.reset();
            var data:UAccount = this.data;
            console.log(data);
            this.$view.find('[data-id=name]').text(data.name);
            this.$view.find('[data-id=description]').text(data.description);
            Connector.inst.get('account.get_info&id='+data.id).done((s)=>{
                var data:AccData;
                try{
                    var resp:VOResult =  JSON.parse(s);
                    if(resp.success=='success')  data = new AccData(resp)
                }catch (e){
                    console.log(e);
                }

                if(data)this.renderData(data);
                else this.onDataError();
            });
        }
    }
}