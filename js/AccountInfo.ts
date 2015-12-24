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
            var url:string = 'http://'+data.server+'/'+data.config.folder+data.config.pub;
            if(data.config.mobile)  this.$view.find('[data-id=mobile]:first').text(url+data.config.mobileUrl).attr('href',url+data.config.mobileUrl).parent().show();
            else this.$view.find('[data-id=mobile]:first').parent().hide();
            var admUrl:string=data.adminUrl+data.config.folder+data.config.pub+data.config.adminUrl;
            this.$view.find('[data-id=admin-url]:first').text(admUrl).attr('href',admUrl);
            var admins:string ='';
            var ar = data.admins;
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                admins+='<tr><td>'+item.name+'</td><td><a href="mailto:'+item.email+'" >'+item.email+'</a></td>';
            }
            this.$view.find('[data-id=admins]:first').html(admins);
            var kiosks:string='';
            var ar2 = data.config.kiosksUrls;

            if(ar2 || ar2.length){
                for(var i=0,n=ar2.length;i<n;i++)   kiosks+='<a href="'+url+ar2[i]+'" target="_blank" class="list-group-item">'+url+ar2[i]+'</a>';
                //  this.$view.find('[data-id=kiosks]:first').html(kiosks).parent().show();
            }

            this.$view.find('[data-id=kiosks]:first').html(kiosks)



        }
        onShow():void{
            var data:UAccount = this.data;
            console.log(data);
            this.$view.find('[data-id=name]').text(data.name);
            this.$view.find('[data-id=description]').text(data.description);
            Connector.inst.get('account.get_info&id='+data.id).done((s)=>{
                var data:AccData
                try{
                    var resp:VOResult =  JSON.parse(s);
                    if(resp.success=='success')
                        data = new AccData(resp)
                }catch (e){
                    console.log(e);
                }

                if(data)this.renderData(data);
            });
        }
    }
}