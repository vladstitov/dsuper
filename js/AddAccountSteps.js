/**
 * Created by VladHome on 12/13/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path="ListEditor.ts"/>
///<reference path="Utils.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var uplight;
(function (uplight) {
    var ConfigurationCtr = (function (_super) {
        __extends(ConfigurationCtr, _super);
        function ConfigurationCtr($view, opts) {
            _super.call(this, $view, opts);
            this.isBlocked = false;
        }
        ConfigurationCtr.prototype.getData = function () {
            var out = [];
            this.getView().find('.form-group').each(function (i, el) {
                var item = new uplight.UItem();
                var $el = $(el);
                item.index = $el.data('id');
                item.label = $el.find('label').text();
                item.value = $el.find('input').prop('checked');
                out.push(item);
            });
            return out;
        };
        ConfigurationCtr.prototype.onSave = function () {
            var _this = this;
            if (this.isBlocked)
                return;
            var ar = this.getElements();
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
                if (!this.$items)
                    this.getElements();
                var ar = this.$items;
                for (var i = 0, n = ar.length; i < n; i++) {
                    ar[i].checked = true;
                }
                this.isDirty = false;
            }
            return this;
        };
        return ConfigurationCtr;
    })(uplight.EditorItem);
    uplight.ConfigurationCtr = ConfigurationCtr;
    var AdministratorsCtr = (function (_super) {
        __extends(AdministratorsCtr, _super);
        function AdministratorsCtr($view, opts) {
            var _this = this;
            _super.call(this, $view, opts);
            $view.find('[data-id=btnAddAdmin]').click(function () { return _this.addAdmin(); });
            this.templ = $view.find('[data-id=admin-item]:first').clone();
            $view.find('[data-id=btnRemove]:first').remove();
            this.conn = new uplight.Connector();
        }
        AdministratorsCtr.prototype.addAdmin = function () {
            var admin = this.templ.clone();
            admin.insertAfter(this.getView().find('[data-id=admin-item]').last());
            admin.find('[data-id=btnRemove]').click(function () {
                admin.remove();
            });
        };
        AdministratorsCtr.prototype.onSave = function () {
            var items = this.getElements();
            var ar = items;
            for (var i = 0, n = ar.length; i < n; i++) {
                if (!ar[i].checkValidity())
                    return;
            }
            this.onComplete();
        };
        return AdministratorsCtr;
    })(uplight.EditorItem);
    uplight.AdministratorsCtr = AdministratorsCtr;
    var NamespaceCtr = (function (_super) {
        __extends(NamespaceCtr, _super);
        function NamespaceCtr($view, opts) {
            _super.call(this, $view, opts);
            this.conn = new uplight.Connector();
        }
        NamespaceCtr.prototype.onSave = function () {
            var items = this.getElements();
            var ar = items;
            for (var i = 0, n = ar.length; i < n; i++) {
                if (!ar[i].checkValidity())
                    return;
            }
            this.checkName();
        };
        NamespaceCtr.prototype.checkName = function () {
            var _this = this;
            var $item;
            var ar = this.getElements();
            $item = $(ar[0]);
            var val = $item.val();
            if (val.length) {
                this.conn.get('account.check_url&url=' + val).done(function (s) {
                    var res = JSON.parse(s);
                    if (res.success == 'OK')
                        _this.onComplete();
                    else if (res.success == 'ISOK') {
                        $($item).val(res.result);
                    }
                    else if (res.success == 'message')
                        _this.showMessage(res.message);
                    else if (res.success == 'exists')
                        _this.showMessage('This url exists please use another one');
                });
            }
        };
        return NamespaceCtr;
    })(uplight.EditorItem);
    uplight.NamespaceCtr = NamespaceCtr;
})(uplight || (uplight = {}));
//# sourceMappingURL=AddAccountSteps.js.map