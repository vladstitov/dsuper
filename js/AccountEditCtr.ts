/**
 * Created by VladHome on 12/26/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="FinalResultCtr.ts"/>
    ///<reference path="Accounts.ts"/>
module uplight{
    export class AccountEditCtr extends EditorForm {
        constructor($view:JQuery,index:string,name?:string){
            super($view,index,name);
            this.init();
        }
        onClose(){
            this.hide();
        }
        onSave(){
            var data:any = this.item;
            for(var str in data) if(this.inputsInd[str])data[str] = this.inputsInd[str].value;
            Connector.inst.post(JSON.stringify(data),'account.update').done((s)=>{
                var res:VOResult;
                try{
                    res = JSON.parse(s)
                }catch (e){
                    return
                }
                if(res && res.success)this.onComplete();

            });
        }
        item:any;
        accountData:AccData;

        isAccountData:boolean;
        renderAccountdata():void{

        }
        showAccountData(){
            this.isAccountData = true;
        }
        hideAccountData(){
            this.isAccountData = false;
        }
        setItem(data:any):AccountEditCtr{
            this.isAccountData = false;
          for(var str in data) if(this.inputsInd[str])this.inputsInd[str].value = data[str];
            this.item = data;
            Connector.inst.get('account.get_info&id='+data.id).done((s)=>{
                var res:AccData;
                try{
                    res = JSON.parse(s)
                }catch(e){
                    return;
                }
                if(res){
                    this.accountData = res;
                    this.renderAccountdata();
                    console.log(res);
                }
            });
            return this;
        }


    }
}