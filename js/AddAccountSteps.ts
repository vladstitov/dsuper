/**
 * Created by VladHome on 12/13/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>

module uplight{

    export class ConfigurationCtr extends EditorForm{

        constructor($view:JQuery,opts:any){
            super($view,opts);

        }
        getData():UItem[]{
            var out:UItem[]=[];
            this.getView().find('.form-group').each((i,el:HTMLElement)=>{
                var item:UItem = new UItem();
                var $el = $(el);
                item.index =$el.data('id');
                item.label = $el.find('label').text();
                item.value = $el.find('input').prop('checked');
                out.push(item);
            });
            return out;

        }
        isBlocked:boolean = false;
        onSave():void{
            if(this.isBlocked) return;
            var ar =  this.getElements();
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
                if(!this.$items) this.getElements();
                var ar = this.$items;
                for(var i=0,n=ar.length;i<n;i++){
                    ar[i].checked=true;
                }
                this.isDirty = false;
            }
            return this;
        }



    }

    export class AdministratorsCtr  extends EditorForm{
        constructor($view:JQuery,opts:any){
            super($view,opts);

            $view.find('[data-id=btnAddAdmin]').click(()=>this.addAdmin())
            this.templ =   $view.find('[data-id=admin-item]:first').clone();
            $view.find('[data-id=btnRemove]:first').remove();
this.conn = new Connector();
        }
conn:Connector;
        private templ:JQuery;
        private addAdmin():void{
            var admin:JQuery = this.templ.clone();
            admin.insertAfter(this.getView().find('[data-id=admin-item]').last());
            admin.find('[data-id=btnRemove]').click(function () {
                admin.remove();
            })
        }

        onSave():void {
            var items:HTMLInputElement[] = this.getElements();
            var ar = items;
            for(var i=0,n=ar.length;i<n;i++){
                if(!ar[i].checkValidity()) return;
            }
            this.onComplete();
        }

    }

    export class NamespaceCtr  extends EditorForm{
        constructor($view:JQuery,opts:any){
            super($view,opts);
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
            var items:HTMLInputElement[] = this.getElements();
            var ar = items;
            for(var i=0,n=ar.length;i<n;i++){
                if(!ar[i].checkValidity()) return;
            }
            this.checkName();
        }

        checkName(){
            var $item:JQuery;
            var ar = this.getElements();
            $item = $(ar[0]);

            var val:string = $item.val();
            if(val.length){
                this.conn.get('account.check_url&url='+val).done((s)=>{
                    var res:VOResult = JSON.parse(s);
                    if(res.success =='OK') this.onComplete();
                    else if(res.success=='ISOK'){
                        $($item).val(res.result);
                    }else if(res.success=='message')this.showMessage(res.message);
                    else if(res.success=='exists')this.showMessage('This url exists please use another one');


                });
            }
        }

    }
}