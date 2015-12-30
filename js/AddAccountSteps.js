/**
 * Created by VladHome on 12/13/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path="ListEditor.ts"/>
///<reference path="Utils.ts"/>
///<reference path="FinalResultCtr.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var uplight;
(function (uplight) {
    var ConfigurationCtr = (function (_super) {
        __extends(ConfigurationCtr, _super);
        function ConfigurationCtr($view, index, name) {
            _super.call(this, $view, index, name);
            this.isBlocked = false;
        }
        ConfigurationCtr.prototype.getData = function () {
            var ar = this.inputs;
            var out = [];
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = new uplight.UItem();
                item.index = this.index;
                var el = ar[i];
                item.id = el.getAttribute('data-id');
                item.value = el.checked ? 'true' : '';
                out.push(item);
            }
            return out;
        };
        ConfigurationCtr.prototype.onSave = function () {
            var _this = this;
            if (this.isBlocked)
                return;
            var ar = this.inputs;
            var isAny = false;
            for (var i = 0, n = ar.length; i < n; i++) {
                if (ar[i].checked)
                    isAny = true;
            }
            if (!isAny) {
                this.showMessage('You can add device later');
                this.isBlocked = true;
                setTimeout(function () {
                    _this.isBlocked = false;
                    _this.showMessage('&nbsp');
                    _this.onComplete();
                }, 3000);
            }
            else
                this.onComplete();
        };
        ConfigurationCtr.prototype.reset = function () {
            if (this.isDirty) {
                var ar = this.inputs;
                for (var i = 0, n = ar.length; i < n; i++) {
                    ar[i].checked = true;
                }
                this.isDirty = false;
            }
            return this;
        };
        return ConfigurationCtr;
    })(uplight.EditorForm);
    uplight.ConfigurationCtr = ConfigurationCtr;
    var AdministratorsCtr = (function (_super) {
        __extends(AdministratorsCtr, _super);
        function AdministratorsCtr($view, index, name) {
            var _this = this;
            _super.call(this, $view, name);
            this.admins = [];
            $view.find('[data-id=btnAddAdmin]').click(function () { return _this.addAdmin(); });
            // this.$btnSubmit = this.$view.find('[data-id=btnSave]').click(()=>this.onSave());
            // this.$btnBack =  this.$view.find('[data-id=btnBack]').click(()=>{this.onBack()});
            var form = new uplight.EditorForm($view.find('[data-id=admin-item]:first'), 'admin');
            form.init();
            this.templ = form.$view.clone();
            $view.find('[data-id=btnRemove]:first').remove();
            this.admins.push(form);
            ///this.conn = new Connector();
        }
        AdministratorsCtr.prototype.addAdmin = function () {
            var _this = this;
            var admin = this.templ.clone();
            var editor = new uplight.EditorForm(admin, 'admin');
            admin.insertAfter(this.$view.find('[data-id=admin-item]').last());
            admin.find('[data-id=btnRemove]').click(function () {
                _this.admins.splice(editor.i, 1);
                editor.remove();
            });
            editor.i = this.admins.length;
            editor.init();
            this.admins.push(editor);
            return editor;
        };
        AdministratorsCtr.prototype.reset = function () {
            var ar = this.admins;
            for (var i = 1, n = ar.length; i < n; i++) {
                ar[i].remove();
            }
            this.admins = [ar[0].reset()];
            return this;
        };
        AdministratorsCtr.prototype.indexAr = function (data) {
            var out = {};
            var ar = data;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                out[item.id] = item.value;
            }
            return out;
        };
        AdministratorsCtr.prototype.getAdmins = function () {
            var admins = [];
            var ar = this.admins;
            var names = [];
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                var data = item.getData();
                data[0].value = item.getElement(0).checked ? 'true' : '';
                admins.push(this.indexAr(data));
            }
            return admins;
        };
        AdministratorsCtr.prototype.onComplete = function () {
        };
        AdministratorsCtr.prototype.onBack = function () {
        };
        AdministratorsCtr.prototype.onSave = function () {
            var ar = this.admins;
            for (var i = 0, n = ar.length; i < n; i++) {
                if (!ar[i].isValid())
                    return;
            }
            console.log('AdministratorsCtr valid');
            this.onComplete();
        };
        return AdministratorsCtr;
    })(uplight.EditorForm);
    uplight.AdministratorsCtr = AdministratorsCtr;
    var NamespaceCtr = (function (_super) {
        __extends(NamespaceCtr, _super);
        function NamespaceCtr($view, index, name) {
            var _this = this;
            _super.call(this, $view, index, name);
            this.conn = new uplight.Connector();
            this.conn.get('account.server_url').done(function (s) {
                console.log(s);
                var server = JSON.parse(s);
                _this.$view.find('[data-id=server]:first').text(server.success);
                _this.$view.find('[data-id=server-admin]:first').text(server.result);
            });
        }
        NamespaceCtr.prototype.onSave = function () {
            var items = this.inputs;
            var ar = items;
            for (var i = 0, n = ar.length; i < n; i++) {
                if (!ar[i].checkValidity())
                    return;
            }
            this.checkName();
        };
        NamespaceCtr.prototype.checkName = function () {
            var _this = this;
            console.log('checkName');
            var $item;
            var ar = this.inputs;
            $item = $(ar[0]);
            var val = $item.val();
            if (val.length) {
                this.$btnSubmit.prop('disabled', true);
                this.conn.get('account.check_url&url=' + val).done(function (s) {
                    _this.$btnSubmit.prop('disabled', false);
                    console.log('check name ' + s);
                    var res = JSON.parse(s);
                    if (res.success == 'OK')
                        _this.onComplete();
                    else if (res.success == 'ISOK') {
                        $($item).val(res.result);
                    }
                    else if (res.success == 'message')
                        _this.showMessage(res.message);
                    else if (res.error == 'exists')
                        _this.showMessage('This url exists please use another one');
                });
            }
        };
        return NamespaceCtr;
    })(uplight.EditorForm);
    uplight.NamespaceCtr = NamespaceCtr;
})(uplight || (uplight = {}));
//# sourceMappingURL=AddAccountSteps.js.map