/**
 * Created by VladHome on 12/13/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="FinalResultCtr.ts"/>


module uplight{

    export class ConfigurationCtr extends EditorForm{
        constructor($view:JQuery,index:string,name?:string){
            super($view,index,name);
        }

        getData():UItem[]{
            var ar = this.inputs;
            var out:UItem[]=[];
            for(var i=0,n=ar.length;i<n;i++){
                var item:UItem = new UItem();
                item.index = this.index;
                var el:HTMLInputElement = ar[i];
                item.id=el.getAttribute('data-id');
                item.value = el.checked?'true':'';
                out.push(item);
            }
            return out;
        }
        isBlocked:boolean = false;
        onSave():void{
            if(this.isBlocked) return;
            var ar =  this.inputs;
            var isAny:boolean = false;
            for(var i=0,n=ar.length;i<n;i++){
                if(ar[i].checked) isAny = true;

            }
            if(!isAny) {
                this.showMessage('You can add device later');
                this.isBlocked = true;
                setTimeout(()=>{
                    this.isBlocked = false;
                    this.showMessage('&nbsp');
                    this.onComplete();
                },3000);
            }
            else  this.onComplete();
        }

        reset():EditorForm{
            if(this.isDirty){
                var ar = this.inputs;
                for(var i=0,n=ar.length;i<n;i++){
                    ar[i].checked=true;
                }
                this.isDirty = false;
            }
            return this;
        }



    }

    export class AdministratorsCtr extends EditorForm{
        constructor($view:JQuery,index:string,name?:string){
            super($view,name);
            $view.find('[data-id=btnAddAdmin]').click(()=>this.addAdmin());
           // this.$btnSubmit = this.$view.find('[data-id=btnSave]').click(()=>this.onSave());
           // this.$btnBack =  this.$view.find('[data-id=btnBack]').click(()=>{this.onBack()});
            var form:EditorForm = new EditorForm($view.find('[data-id=admin-item]:first'),'admin');
            form.init();
            this.templ =   form.$view.clone();
            $view.find('[data-id=btnRemove]:first').remove();
            this.admins.push(form);
            ///this.conn = new Connector();
        }
        conn:Connector;
        $btnSubmit:JQuery;
        $btnBack:JQuery;
        private templ:JQuery;
        private admins:EditorForm[]=[];
        private addAdmin():EditorForm{
            var admin:JQuery = this.templ.clone();
            var editor:EditorForm = new EditorForm(admin,'admin');
            admin.insertAfter(this.$view.find('[data-id=admin-item]').last());
            admin.find('[data-id=btnRemove]').click( ()=>{
                this.admins.splice(editor.i,1);
                editor.remove();
            })
            editor.i =  this.admins.length;
            editor.init();
            this.admins.push(editor);
            return editor;
        }

        reset():AdministratorsCtr{
            var ar = this.admins;
            for(var i=1,n=ar.length;i<n;i++){
                ar[i].remove();
            }
            this.admins=[ar[0].reset()];
            return this;
        }

        private indexAr(data:UItem[]):any{
            var out:any = {};
            var ar = data;
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                out[item.id]=item.value;
            }
            return out;
        }
        getAdmins():UAdmin[]{
            var admins:any[]=[];
            var ar = this.admins;
            var names:string[]=[];
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                var data:UItem[]= item.getData();
                data[0].value = item.getElement(0).checked?'true':''
                admins.push(this.indexAr(data));
            }
            return admins;
        }

        onComplete():void{

        }
        onBack():void{

        }
        onSave():void {
            var ar = this.admins;
           for(var i=0,n=ar.length;i<n;i++){
               if(!ar[i].isValid()) return;
           }
            console.log('AdministratorsCtr valid');
           this.onComplete();
        }

    }

    export class NamespaceCtr  extends EditorForm{
        constructor($view:JQuery,index:string,name?:string){
            super($view,index,name);
            this.conn=new Connector();
            this.conn.get('account.server_url').done((s)=>{
                console.log(s);
                var server:VOResult = JSON.parse(s);
                this.$view.find('[data-id=server]:first').text(server.success);
                this.$view.find('[data-id=server-admin]:first').text(server.result);
            })
        }

        conn:Connector
        onSave():void{
            var items:HTMLInputElement[] = this.inputs;
            var ar = items;
            for(var i=0,n=ar.length;i<n;i++){
                if(!ar[i].checkValidity()) return;
            }
            this.checkName();
        }

        checkName(){
            console.log('checkName');
            var $item:JQuery;
            var ar = this.inputs;
            $item = $(ar[0]);

            var val:string = $item.val();
            if(val.length){
                this.$btnSubmit.prop('disabled',true);
                this.conn.get('account.check_url&url='+val).done((s)=>{
                    this.$btnSubmit.prop('disabled',false);
                    console.log('check name '+s);

                    var res:VOResult = JSON.parse(s);

                    if(res.success =='OK') this.onComplete();
                    else if(res.success=='ISOK'){
                        $($item).val(res.result);
                    }else if(res.success=='message')this.showMessage(res.message);
                    else if(res.error=='exists')this.showMessage('This url exists please use another one');


                });
            }
        }

    }
}