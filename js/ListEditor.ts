/**
 * Created by VladHome on 12/14/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
///<reference path='Utils.ts' />
'use strict'
module uplight{
    var CLICK = CLICK || 'click';
    var SELECTED = SELECTED || 'selected';


    export class EditorItem extends DisplayObject{
        constructor($view:JQuery,opt:any,name?:string){
            super($view,name);
            $view.submit(function(){  return false;  });
            this.id = $view.data('ctr');
            for(var str in opt) this[str] = opt[str];
            this.initButtons();
            this.initItems();
        }
        i:number;
        value_id:string='input';
        item:any;
        model:any;
        $title:JQuery;
        $items:HTMLInputElement[];

        initButtons():void{
            this.$view.find('[data-id=btnClose]').click(()=>this.onClose());
            this.$view.find('[data-id=btnSave]').click(()=>this.onSave());
            this.$view.find('[data-id=btnBack]').click(()=>{this.onBack()});
            this.$title = this.$view.find('[data-id=title]');

        }
        initItems():void{
           // var model:any = {};
          //  var value_id:string =  this.value_id;
           // this.$view.find('input').each((i,el)=>{
               // var  $el:JQuery = $(el);
               // var ind:string  = $el.data('index').toString();
               // var $el = $el.find(value_id);
                //if(!$el.length)console.log('error cant find value element for index '+ind+ ' with selecyor '+value_id);
                //else model[ind] = $el;
            //})

           // this.model = model;
        }

        onSave():void{  console.log('onSave '+this.id); }
        onClose():void{  console.log('onClose '+this.id); }
        onBack():void{  console.log('onBack '+this.id);  }
        onComplete():void{  console.log('onComplete '+this.id); }

        getView():JQuery{
            return this.$view;
        }

        isDirty:boolean;
        reset():EditorItem{
            if(this.isDirty){
                if(!this.$items) this.getElements();
                var ar = this.$items;
                for(var i=0,n=ar.length;i<n;i++){
                        ar[i].value='';
                }
                this.isDirty = false;
            }
            return this;
        }

        showMessage(str:string):void{
            var msg = this.$view.find('[data-id=message]').html(str);
            msg.show();
            setTimeout(function(){
                msg.hide();
            },3000);
        }
        getData():UItem[]{
            var out:UItem[]=[];
            this.$view.find('input').each((i,el:HTMLElement)=>{
                var item:UItem = new UItem();
                var $el = $(el);
                item.index =$el.data('id');
                if($el.attr('type')=='checkbox') item.value = $el.prop('checked');
                else item.value = $el.val();
                out.push(item);
            });
            return out;

        }
        getElement(i:number):HTMLElement{
            return this.$items[i];
        }
        getElements():HTMLInputElement[]{
            var out:HTMLInputElement[]=[];
            this.$view.find('input').each((i,el:HTMLInputElement)=>{
                out.push(el);
            });
            this.$items = out;
           return out;
        }

    }


    export class UItem{
        index:string;
        label:string;
        value:string;
    }


    export class ListEditor extends DisplayObject{
        constructor($view:JQuery,options:{service_id:string},name?:string){
            super($view,name)
            for(var str in options) this[str] = options[str];
            this.conn = new Connector();
            this.$btnAdd = $view.find('[data-id=btnAdd]').click(()=>this.onAddClick());
            this.$btnEdit = $view.find(this.btn_edit_id).click(()=>this.onEditClick());
            this.$btnDelete = $view.find('[data-id=btnDelete]').click(()=>this.onDeleteClick());
            this.$btnClose = $view.find('[data-id=btnClose]').click(()=>this.onCloseClick());
            this.$list = $view.find(this.list_id).on(CLICK,'tr',(evt)=>this.onListClick(evt));
            this.$num_records = $view.find(this.num_records_id);
            this.$deleteView = $view.find(this.delete_view_id);
            this.$deleteView.find('[data-id=btnSave]').click(()=>this.onDeleteConfirmed())
            this.$deleteView.find(this.btn_close_id).click(()=>this.hideDelete());
           if(this.auto_start) this.loadData();
        }


        conn:Connector;
        editItem:EditorItem;

        visuals:_.Dictionary<JQuery>;
        $btnAdd:JQuery;
        $btnEdit:JQuery;
        btn_edit_id:string='[data-id=btnEdit]';
        $btnDelete:JQuery;
        $btnSave:JQuery;
        $btnClose:JQuery;
        $list:JQuery;
        data:any[];
        selectedItem:any;
        selectedIndex:number;
        $selected:JQuery;
        onSelect:Function;
        btn_close_id:string='[data-id=btnClose]';
        service:string='rem/service.php';
        service_id:string='list_editor';
        getall:string='get_all';
        getone:string='get_one';
        delete:string='delete';
        update:string='update';
        insert:string='insert';
        list_id:string='[data-id=list]';
        num_records_id:string='[data-id=num_records]';
        $num_records:JQuery;
        edit_view_id='[data-id=edit-view]';
        $deleteView:JQuery;
        delete_view_id='[data-id=delete-view]';
        auto_start:boolean = true;

         onData(s:string):void {
            // console.log(s);
             try {
                 var res:any[] = JSON.parse(s);
             }catch (e){
                 console.log(e);
                return;
             }
            this.data = res;
             this.render();
        }


        renderHeader(header:string){
            this.$view.find('[data-id=list-header]').html(header);
        }
        renderItem(item:any, i:number){
            return '<tr data-i="'+i+'"><td><small>'+item.id+'</small></td><td>'+item.name+'</td><td>'+item.description+'</td></tr>';
        }

        render():void{
            var ar = this.data;
            var out:string='';
            for(var i=0,n=ar.length;i<n;i++) out+= this.renderItem(ar[i],i);
            this.$list.html(out);
            this.$num_records.text(n);
        }

        onListClick(evt:JQueryEventObject):void{
            var $el:JQuery = $(evt.currentTarget);
            var i:number = Number($el.data('i'));
            if(isNaN(i))return;
            this.deselect();
            this.$selected = $el.addClass(SELECTED);
            this.selectedItem = this.data[i];
            this.selectedIndex = $el.index();
            if(this.onSelect)this.onSelect(this.selectedItem);
        }
        destroy():void{
            this.onSelect = null;
            this.data= null;
        }
        deselect():void{
            if(this.$selected){
                this.$selected.removeClass(SELECTED);
                this.selectedItem=null;
            }
        }

        onAdd():void{

        }
        private onAddClick():void{
            this.deselect();
            this.selectedItem = {id:0};
            this.selectedIndex =-1;
            this.onAdd();
        }
        onEditShow():void{

        }
        showEdit():void{
            if(!this.selectedItem) return;
            this.onEditShow();
            //this.editItem.setItem(this.selectedItem);
           // this.editItem.$view.show();
        }
        onEditClick():void{
           this.showEdit();
        }
        onEditCloseClick():void{
            if(this.selectedIndex==-1)this.selectedItem=null;
            this.hideEditView();
        }
        hideEditView():void{
            //this.editItem.$view.hide();
        }

        hideDelete():void{
            this.$deleteView.hide();
        }
        onDeleteShow():void{

        }
        showDelete():void{
            if(!this.selectedItem) return;
            var name :string = this.selectedItem.name || '';
            this.$deleteView.find('[data-id=message]').html('You want to delete '+name+'?');
            this.$deleteView.show();
        }
        onDeleteClick():void{
              this.showDelete();
        }
        onDeleteConfirmed():void{
            console.log('delete confirmed');

            this.$deleteView.hide();
            this.deleteRecord();
            this.deselect();
            this.selectedIndex=-1;
        }
        onSaveResult(s:string):void{
            var res:VOResult = JSON.parse(s);
            if(res.success=='inserted'){
                var id:number= Number(res.result);
               // this.editItem.setItem({index:index});
                Utils.message('New record inserted', this.$btnSave)

            }else if(res.success=='updated'){

            }
        }
        saveRecord(item:any):void{
            $.post(this.service+'?a='+this.service_id+'.'+this.update,item).done((s)=>this.onSaveResult(s));
        }
        onDeleteResult(s:string):void{
                this.loadData();
        }
        deleteRecord():void{
            $.get(this.service+'?a='+this.service_id+'.'+this.delete+'&id='+this.selectedItem.id).done((s)=>this.onDeleteResult(s));

        }
        onSaveClick():void{
           // var item:any = this.editItem.getElement();
           // console.log(item);
            //this.saveRecord(item);
        }
        onCloseClick():void{

        }

        loadData():void{
            this.conn.get(this.service_id+'.'+this.getall).done((s)=>this.onData(s));

        }


    }


}