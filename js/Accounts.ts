/**
 * Created by VladHome on 12/13/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="AddAccountCtr.ts"/>
    ///<reference path="AccountInfo.ts"/>
    ///<reference path="AccountEditCtr.ts"/>


module uplight{
    var CLICK = CLICK || 'click';
    export class Accounts extends ListEditor{

        constructor($view:JQuery,opt:any){
            super($view,opt);
            this.addAccount = new AddAccountCtr($view.find('[data-ctr=AddAccount]'));
            this.addAccount.onClose = ()=>{
                this.addAccount.$view.hide();
                // this.addAccount.reset();


            }

            this.addAccount.onComplete  = ()=>{
                console.log('account added loading data');
                this.addAccount.hide();
                this.loadData();
            }

        //  var data='{"success":"success","result":{"namespace":"namespase","account_name":"account name","description":"Account description","KioskMobile":"true","Kiosk1080":"","Kiosk1820":"true","sendemail":"true","admin-email":"email@email","admin_name":"Admin name","username":"username1","password":"password1","folder":"\/dist\/namespase","server":"http:\/\/localhost","uid":"2","root":"C:\/wamp\/www","pub":"\/pub\/","data":"\/data\/","db":"directories.db","https":"https:\/\/frontdes-wwwss24.ssl.supercp.com","adminurl":"https:\/\/frontdes-wwwss24.ssl.supercp.com\/dist\/namespaseAdmin"}}';
           // this.addAccount.setData(data).show();
          // var ctr = this.addAccount.goto(3);
           // this.addAccount.show();
           // ctr.onServer(data);

            super.renderHeader('<tr><th><small>Info</small></th><th>Name</th><th>Description</th></tr>');
        }
        onInit():void{
            this.$list.on(CLICK,'.btn',(evt)=>{
                setTimeout(()=>{
                    if(!this.accountInfo){
                        this.accountInfo = new AccountInfo(this.$view.find('[data-ctr=AccountInfo]'),'AccountInfo');
                        this.accountInfo.onDataError = ()=>{
                            this.loadData();
                        }
                    }
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

        onEdit(item):void{
            if(!this.accountEdit) this.accountEdit = new AccountEditCtr(this.$view.find('[data-ctr=AccountEditCtr]:first'),'editor','AccountEditCtr');
            this.accountEdit.setItem(item).show();
            this.accountEdit.onComplete = ()=>{
                this.accountEdit.hide();
                this.loadData();
            }
        }

        addAccount:AddAccountCtr;
        accountEdit:AccountEditCtr;
        accountInfo:AccountInfo;


        onAdd():void{
            this.addAccount.reset().start();
            this.addAccount.show();

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
        server:string;
        adminurl:string;
        KioskMobile:string;
        Kiosk1080:string;
        Kiosk1920:string;
        Admin:string;
        constructor(data:any){
            for(var str in data)this[str] = data[str];
        }
    }
    export class AccData{
        config: AccCfg;
        server:string;
        admins:{name:string;email:string}[];


        constructor(data:any){
           for(var str in data)this[str] = data[str];
            this.config = new AccCfg(this.config);
        }
    }





}