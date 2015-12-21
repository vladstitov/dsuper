/**
 * Created by VladHome on 12/13/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="AddAccount.ts"/>

module uplight{
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

            var data=JSON.parse('[{"index":"namespace","value":"account3"},{"index":"account-name","value":"Name of new account"},{"index":"description","value":"Some description goes here "},{"index":"mobile","label":"Mobile ","value":true},{"index":"kiosk1080","label":"Kiosks 1080x1920","value":true},{"index":"kiosk1920","label":"Kiosks 1920x1080","value":false},{"index":"sendemail","value":true},{"index":"admin-email","value":"adminemail@mail.com"},{"index":"admin-name","value":"admin Name"},{"index":"username","value":"adminuserbane"},{"index":"password","value":"adminpass"}]');

            this.addAccount.setData(data).show();
            this.addAccount.goto(3);

            super.renderHeader('<tr><th><small>ID</small></th><th>Name</th><th>Description</th></tr>');
        }

        renderItem(item:any, i:number){
            return '<tr data-i="'+i+'"><td><small>'+item.id+'</small></td><td>'+item.name+'</td><td>'+item.description+'</td></tr>';
        }


        addAccount:AddAccount;

        onAdd():void{
            this.addAccount.reset().start();
            this.addAccount.show();

        }



    }



}