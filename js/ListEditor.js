/**
 * Created by VladHome on 12/14/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path='Utils.ts' />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var uplight;
(function (uplight) {
    var CLICK = CLICK || 'click';
    var SELECTED = SELECTED || 'selected';
    var EditorForm = (function (_super) {
        __extends(EditorForm, _super);
        function EditorForm($view, index, name) {
            _super.call(this, $view, name);
            this.value_id = 'input';
            this.index = index;
            $view.submit(function () { return false; });
        }
        EditorForm.prototype.init = function () {
            var _this = this;
            this.$btnClose = this.$view.find('[data-id=btnClose]').click(function () { return _this.onClose(); });
            this.$btnSubmit = this.$view.find('[data-id=btnSave]').click(function () { return _this.onSave(); });
            this.$btnBack = this.$view.find('[data-id=btnBack]').click(function () { _this.onBack(); });
            this.$title = this.$view.find('[data-id=title]');
            var out = [];
            var inds = {};
            this.$view.find('input').each(function (i, el) {
                el.addEventListener(CLICK, function (evt) { return _this.onFocus(evt); });
                out.push(el);
                inds[el.getAttribute('data-id')] = el;
            });
            this.inputs = out;
            this.inputsInd = inds;
            this.isInit = true;
            this.onInit();
        };
        EditorForm.prototype.onFocus = function (evt) {
            this.currentInput = evt.currentTarget;
            this.isDirty = true;
            ///console.log('this.isDirty '+this.isDirty +' '+this.name);
        };
        EditorForm.prototype.onInit = function () {
        };
        EditorForm.prototype.onShow = function () {
            if (!this.isInit)
                this.init();
        };
        EditorForm.prototype.onSave = function () { console.log('onSave ' + this.id); };
        EditorForm.prototype.onClose = function () { console.log('onClose ' + this.id); };
        EditorForm.prototype.onBack = function () { console.log('onBack ' + this.id); };
        EditorForm.prototype.onComplete = function () { console.log('onComplete ' + this.id); };
        EditorForm.prototype.getView = function () {
            return this.$view;
        };
        EditorForm.prototype.isValid = function () {
            var ar = this.inputs;
            for (var i = 0, n = ar.length; i < n; i++) {
                if (!ar[i].checkValidity())
                    return false;
            }
            return true;
        };
        EditorForm.prototype.reset = function () {
            //console.log(this.isDirty+' '+this.name);
            if (this.isDirty) {
                this.currentInput = null;
                var ar = this.inputs;
                for (var i = 0, n = ar.length; i < n; i++) {
                    ar[i].value = '';
                }
                this.isDirty = false;
            }
            return this;
        };
        EditorForm.prototype.showMessage = function (str) {
            var msg = this.$view.find('[data-id=message]').html(str);
            msg.show();
            setTimeout(function () {
                msg.hide();
            }, 3000);
        };
        EditorForm.prototype.setData = function (data) {
            this.data = data;
            return this;
        };
        EditorForm.prototype.setItemData = function (item, el) {
            el.value = item.value;
        };
        EditorForm.prototype.render = function () {
            var ar = this.data;
            for (var i = 0, n = ar.length; i < n; i++) {
                var el = this.inputsInd[ar[i].id];
                if (!el)
                    console.log('no element with index ' + ar[i].id);
                else
                    this.setItemData(ar[i], el);
            }
        };
        EditorForm.prototype.getInputData = function (el) {
            var item = new UItem();
            item.id = el.getAttribute('data-id');
            item.index = this.index;
            item.value = el.value;
            return item;
        };
        EditorForm.prototype.getData = function () {
            var out = [];
            var ar = this.inputs;
            if (ar)
                for (var i = 0, n = ar.length; i < n; i++)
                    out.push(this.getInputData(ar[i]));
            else
                console.log('call init first');
            /*  this.$view.find('input').each((i,el:HTMLElement)=>{
                  var item:UItem = new UItem();
                  var $el = $(el);
                  item.index =$el.data('id');
                  if($el.attr('type')=='checkbox') item.value = $el.prop('checked');
                  else item.value = $el.val();
                  out.push(item);
              });*/
            return out;
        };
        EditorForm.prototype.getElement = function (i) {
            return this.inputs[i];
        };
        return EditorForm;
    })(uplight.DisplayObject);
    uplight.EditorForm = EditorForm;
    var UItem = (function () {
        function UItem() {
        }
        return UItem;
    })();
    uplight.UItem = UItem;
    var ListEditor = (function (_super) {
        __extends(ListEditor, _super);
        function ListEditor($view, options, name) {
            _super.call(this, $view, name);
            this.btn_edit_id = '[data-id=btnEdit]';
            this.btn_close_id = '[data-id=btnClose]';
            this.service = 'rem/service.php';
            this.service_id = 'list_editor';
            this.getall = 'get_all';
            this.getone = 'get_one';
            this.delete = 'delete';
            this.update = 'update';
            this.insert = 'insert';
            this.list_id = '[data-id=list]';
            this.num_records_id = '[data-id=num_records]';
            this.edit_view_id = '[data-id=edit-view]';
            this.delete_view_id = '[data-id=delete-view]';
            this.auto_start = true;
            for (var str in options)
                this[str] = options[str];
            this.init();
            this.onInit();
        }
        ListEditor.prototype.init = function () {
            var _this = this;
            var $view = this.$view;
            this.conn = new uplight.Connector();
            this.$btnAdd = $view.find('[data-id=btnAdd]').click(function () { return _this.onAddClick(); });
            this.$btnEdit = $view.find(this.btn_edit_id).click(function () { return _this.onEditClick(); });
            this.$btnDelete = $view.find('[data-id=btnDelete]').click(function () { return _this.onDeleteClick(); });
            this.$btnClose = $view.find('[data-id=btnClose]').click(function () { return _this.onCloseClick(); });
            this.$list = $view.find(this.list_id).on(CLICK, 'tr', function (evt) { return _this.onListClick(evt); });
            this.$num_records = $view.find(this.num_records_id);
            this.$deleteView = $view.find(this.delete_view_id);
            this.$deleteView.find('[data-id=btnSave]').click(function () { return _this.onDeleteConfirmed(); });
            this.$deleteView.find(this.btn_close_id).click(function () { return _this.hideDelete(); });
            if (this.auto_start)
                this.loadData();
        };
        ListEditor.prototype.onInit = function () {
        };
        ListEditor.prototype.onData = function (s) {
            // console.log(s);
            try {
                var res = JSON.parse(s);
            }
            catch (e) {
                console.log(e);
                return;
            }
            this.data = res;
            this.render();
        };
        ListEditor.prototype.renderHeader = function (header) {
            this.$view.find('[data-id=list-header]').html(header);
        };
        ListEditor.prototype.renderItem = function (item, i) {
            return '<tr data-i="' + i + '"><td><small>' + item.id + '</small></td><td>' + item.name + '</td><td>' + item.description + '</td></tr>';
        };
        ListEditor.prototype.onRendered = function () {
        };
        ListEditor.prototype.render = function () {
            var ar = this.data;
            var out = '';
            for (var i = 0, n = ar.length; i < n; i++)
                out += this.renderItem(ar[i], i);
            this.$list.html(out);
            this.$num_records.text(n);
            this.onRendered();
        };
        ListEditor.prototype.onListClick = function (evt) {
            var $el = $(evt.currentTarget);
            var i = Number($el.data('i'));
            if (isNaN(i))
                return;
            this.deselect();
            this.$selected = $el.addClass(SELECTED);
            this.selectedItem = this.data[i];
            this.selectedIndex = $el.index();
            if (this.onSelect)
                this.onSelect(this.selectedItem);
        };
        ListEditor.prototype.destroy = function () {
            this.onSelect = null;
            this.data = null;
        };
        ListEditor.prototype.deselect = function () {
            if (this.$selected) {
                this.$selected.removeClass(SELECTED);
                this.selectedItem = null;
            }
        };
        ListEditor.prototype.onAdd = function () {
        };
        ListEditor.prototype.onAddClick = function () {
            this.deselect();
            this.selectedItem = { id: 0 };
            this.selectedIndex = -1;
            this.onAdd();
        };
        ListEditor.prototype.onEdit = function (item) {
        };
        ListEditor.prototype.showEdit = function () {
            if (!this.selectedItem)
                return;
            this.onEdit(this.selectedItem);
            //this.editItem.setItem(this.selectedItem);
            // this.editItem.$view.show();
        };
        ListEditor.prototype.onEditClick = function () {
            this.showEdit();
        };
        ListEditor.prototype.onEditCloseClick = function () {
            if (this.selectedIndex == -1)
                this.selectedItem = null;
            this.hideEditView();
        };
        ListEditor.prototype.hideEditView = function () {
            //this.editItem.$view.hide();
        };
        ListEditor.prototype.hideDelete = function () {
            this.$deleteView.hide();
        };
        ListEditor.prototype.onDeleteShow = function () {
        };
        ListEditor.prototype.showDelete = function () {
            if (!this.selectedItem)
                return;
            var name = this.selectedItem.name || '';
            this.$deleteView.find('[data-id=message]').html('You want to delete ' + name + '?');
            this.$deleteView.show();
        };
        ListEditor.prototype.onDeleteClick = function () {
            this.showDelete();
        };
        ListEditor.prototype.onDeleteConfirmed = function () {
            console.log('delete confirmed');
            this.$deleteView.hide();
            this.deleteRecord();
            this.deselect();
            this.selectedIndex = -1;
        };
        ListEditor.prototype.onSaveResult = function (s) {
            var res = JSON.parse(s);
            if (res.success == 'inserted') {
                var id = Number(res.result);
                // this.editItem.setItem({index:index});
                uplight.Utils.message('New record inserted', this.$btnSave);
            }
            else if (res.success == 'updated') {
            }
        };
        ListEditor.prototype.saveRecord = function (item) {
            var _this = this;
            $.post(this.service + '?a=' + this.service_id + '.' + this.update, item).done(function (s) { return _this.onSaveResult(s); });
        };
        ListEditor.prototype.onDeleteResult = function (s) {
            this.loadData();
        };
        ListEditor.prototype.deleteRecord = function () {
            var _this = this;
            $.get(this.service + '?a=' + this.service_id + '.' + this.delete + '&id=' + this.selectedItem.id).done(function (s) { return _this.onDeleteResult(s); });
        };
        ListEditor.prototype.onSaveClick = function () {
            // var item:any = this.editItem.getElement();
            // console.log(item);
            //this.saveRecord(item);
        };
        ListEditor.prototype.onCloseClick = function () {
        };
        ListEditor.prototype.loadData = function () {
            var _this = this;
            this.conn.get(this.service_id + '.' + this.getall).done(function (s) { return _this.onData(s); });
        };
        return ListEditor;
    })(uplight.DisplayObject);
    uplight.ListEditor = ListEditor;
})(uplight || (uplight = {}));
//# sourceMappingURL=ListEditor.js.map