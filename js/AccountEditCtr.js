var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by VladHome on 12/26/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path="ListEditor.ts"/>
///<reference path="Utils.ts"/>
///<reference path="FinalResultCtr.ts"/>
///<reference path="Accounts.ts"/>
var uplight;
(function (uplight) {
    var AccountEditCtr = (function (_super) {
        __extends(AccountEditCtr, _super);
        function AccountEditCtr($view, index, name) {
            _super.call(this, $view, index, name);
            this.init();
        }
        AccountEditCtr.prototype.onClose = function () {
            this.hide();
        };
        AccountEditCtr.prototype.onSave = function () {
            var _this = this;
            var data = this.item;
            for (var str in data)
                if (this.inputsInd[str])
                    data[str] = this.inputsInd[str].value;
            uplight.Connector.inst.post(JSON.stringify(data), 'account.update').done(function (s) {
                var res;
                try {
                    res = JSON.parse(s);
                }
                catch (e) {
                    return;
                }
                if (res && res.success)
                    _this.onComplete();
            });
        };
        AccountEditCtr.prototype.renderAccountdata = function () {
        };
        AccountEditCtr.prototype.showAccountData = function () {
            this.isAccountData = true;
        };
        AccountEditCtr.prototype.hideAccountData = function () {
            this.isAccountData = false;
        };
        AccountEditCtr.prototype.setItem = function (data) {
            var _this = this;
            this.isAccountData = false;
            for (var str in data)
                if (this.inputsInd[str])
                    this.inputsInd[str].value = data[str];
            this.item = data;
            uplight.Connector.inst.get('account.get_info&id=' + data.id).done(function (s) {
                var res;
                try {
                    res = JSON.parse(s);
                }
                catch (e) {
                    return;
                }
                if (res) {
                    _this.accountData = res;
                    _this.renderAccountdata();
                    console.log(res);
                }
            });
            return this;
        };
        return AccountEditCtr;
    })(uplight.EditorForm);
    uplight.AccountEditCtr = AccountEditCtr;
})(uplight || (uplight = {}));
//# sourceMappingURL=AccountEditCtr.js.map