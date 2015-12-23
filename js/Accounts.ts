/**
 * Created by VladHome on 12/13/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="AddAccount.ts"/>

module uplight{
    var CLICK = CLICK || 'click';
    export class Accounts extends ListEditor{

        constructor($view:JQuery,opt:any){
            super($view,opt);
            this.addAccount = new AddAccount($view.find('[data-ctr=AddAccount]'));
            this.addAccount.onClose = ()=>{
                this.addAccount.$view.hide();
                // this.addAccount.reset();


            }

            this.addAccount.onComplete  = ()=>{
                console.log('account added loading data');
                this.addAccount.hide();
                this.loadData();
            }

          //  var data=JSON.parse('[{"index":"namespace","value":"account3"},{"index":"account-name","value":"Name of new account"},{"index":"description","value":"Some description goes here "},{"index":"mobile","label":"Mobile ","value":true},{"index":"kiosk1080","label":"Kiosks 1080x1920","value":true},{"index":"kiosk1920","label":"Kiosks 1920x1080","value":false},{"index":"sendemail","value":true},{"index":"admin-email","value":"adminemail@mail.com"},{"index":"admin-name","value":"admin Name"},{"index":"username","value":"adminuserbane"},{"index":"password","value":"adminpass"}]');

           // this.addAccount.setData(data).show();
           // this.addAccount.goto(3);

            super.renderHeader('<tr><th><small>Info</small></th><th>Name</th><th>Description</th></tr>');
        }
        onInit():void{
            this.$list.on(CLICK,'.btn',(evt)=>{
                setTimeout(()=>{
                    if(!this.accountInfo)this.accountInfo = new AccountInfo(this.$view.find('[data-ctr=AccountInfo]'),'AccountInfo');
                    this.accountInfo.setData(this.selectedItem);
                    this.accountInfo.show();
                },10)

               // var i:number = Number($(evt.currentTarget).parent().parent().data('i'));
                //if(isNaN(i))return;
               // var item
            })
        }

        renderItem(item:any, i:number){
            return '<tr data-i="'+i+'"><td><a class="btn fa fa-info-circle"></a></td><td>'+item.name+'</td><td>'+item.description+'</td></tr>';
        }


        addAccount:AddAccount;
        accountEdit:AccountEdit;
        accountInfo:AccountInfo;

        onAdd():void{
            this.addAccount.reset().start();
            this.addAccount.show();

        }



    }
    export class AccountEdit extends ModuleView{
        constructor($view:JQuery,name?:string) {
            super($view, name);
        }


    }

    export class UAccount{
        id:number;
        user_id:number;
        folder:string;
        name:string;
        description:string
        stamp:string;
    }
    export class AccCfg{
        folder:string;
        ns:string;
        uid:number;
        root:string;
        pub:string;
        data:string;
        db:string;
        adminUrl:string;
        mobile:boolean;
        mobileUrl:string;
        kiosksUrls:string[];
        constructor(data:any){
            for(var str in data)this[str] = data[str];
        }
    }
    export class AccData{
        config: AccCfg;
        admins:{name:string;email:string}[];
        server:string;
        adminUrl:string;
        constructor(data:any){
           for(var str in data)this[str] = data[str];
            this.config = new AccCfg(this.config);
        }
    }

    export class AccountInfo  extends ModuleView{
        constructor($view:JQuery,name?:string) {
            super($view, name);
        }

        private renderData(data:AccData):void{
           console.log(data);
            var url:string = 'http://'+data.server+'/'+data.config.folder+data.config.pub;
            if(data.config.mobile)  this.$view.find('[data-id=mobile]:first').text(url+data.config.mobileUrl).attr('href',url+data.config.mobileUrl);
            else this.$view.find('[data-id=mobile]:first').parent().hide();
            var admUrl:string=data.adminUrl+data.config.folder+data.config.pub+data.config.adminUrl;
            this.$view.find('[data-id=admin-url]:first').text(admUrl).attr('href',admUrl);
            var admins:string ='';
            var ar = data.admins
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                admins+='<tr><td>'+item.name+'</td><td><a href="mailto:'+item.email+'" >'+item.email+'</a></td>';
            }
            this.$view.find('[data-id=admins]:first').html(admins);
            var kiosks:string='';
            var ar2 = data.config.kiosksUrls;

            if(ar2){
                for(var i=0,n=ar2.length;i<n;i++)   kiosks+='<a href="'+url+ar2[i]+'" target="_blank" class="list-group-item">'+url+ar2[i]+'</a>';
                if(n===0) this.$view.find('[data-id=kiosks]:first').parent().hide();
                else this.$view.find('[data-id=kiosks]:first').html(kiosks);
            }




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