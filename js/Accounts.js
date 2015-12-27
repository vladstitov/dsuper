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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var uplight;
(function (uplight) {
    var CLICK = CLICK || 'click';
    var Accounts = (function (_super) {
        __extends(Accounts, _super);
        function Accounts($view, opt) {
            var _this = this;
            _super.call(this, $view, opt);
            this.addAccount = new uplight.AddAccountCtr($view.find('[data-ctr=AddAccount]'));
            this.addAccount.onClose = function () {
                _this.addAccount.$view.hide();
                // this.addAccount.reset();
            };
            this.addAccount.onComplete = function () {
                console.log('account added loading data');
                _this.addAccount.hide();
                _this.loadData();
            };
            //  var data='{"success":"success","result":{"namespace":"namespase","account_name":"account name","description":"Account description","KioskMobile":"true","Kiosk1080":"","Kiosk1820":"true","sendemail":"true","admin-email":"email@email","admin_name":"Admin name","username":"username1","password":"password1","folder":"\/dist\/namespase","server":"http:\/\/localhost","uid":"2","root":"C:\/wamp\/www","pub":"\/pub\/","data":"\/data\/","db":"directories.db","https":"https:\/\/frontdes-wwwss24.ssl.supercp.com","adminurl":"https:\/\/frontdes-wwwss24.ssl.supercp.com\/dist\/namespaseAdmin"}}';
            // this.addAccount.setData(data).show();
            // var ctr = this.addAccount.goto(3);
            // this.addAccount.show();
            // ctr.onServer(data);
            _super.prototype.renderHeader.call(this, '<tr><th><small>Info</small></th><th>Name</th><th>Description</th></tr>');
        }
        Accounts.prototype.onInit = function () {
            var _this = this;
            this.$list.on(CLICK, '.btn', function (evt) {
                setTimeout(function () {
                    if (!_this.accountInfo) {
                        _this.accountInfo = new uplight.AccountInfo(_this.$view.find('[data-ctr=AccountInfo]'), 'AccountInfo');
                        _this.accountInfo.onDataError = function () {
                            _this.loadData();
                        };
                    }
                    _this.accountInfo.setData(_this.selectedItem);
                    _this.accountInfo.show();
                }, 10);
                // var i:number = Number($(evt.currentTarget).parent().parent().data('i'));
                //if(isNaN(i))return;
                // var item
            });
        };
        Accounts.prototype.renderItem = function (item, i) {
            return '<tr data-i="' + i + '"><td><a class="btn fa fa-info-circle"></a></td><td>' + item.name + '</td><td>' + item.description + '</td></tr>';
        };
        Accounts.prototype.onEdit = function (item) {
            var _this = this;
            if (!this.accountEdit)
                this.accountEdit = new uplight.AccountEditCtr(this.$view.find('[data-ctr=AccountEditCtr]:first'), 'editor', 'AccountEditCtr');
            this.accountEdit.setItem(item).show();
            this.accountEdit.onComplete = function () {
                _this.accountEdit.hide();
                _this.loadData();
            };
        };
        Accounts.prototype.onAdd = function () {
            this.addAccount.reset().start();
            this.addAccount.show();
        };
        return Accounts;
    })(uplight.ListEditor);
    uplight.Accounts = Accounts;
    var UAccount = (function () {
        function UAccount() {
        }
        return UAccount;
    })();
    uplight.UAccount = UAccount;
    var AccCfg = (function () {
        function AccCfg(data) {
            for (var str in data)
                this[str] = data[str];
        }
        return AccCfg;
    })();
    uplight.AccCfg = AccCfg;
    var AccData = (function () {
        function AccData(data) {
            for (var str in data)
                this[str] = data[str];
            this.config = new AccCfg(this.config);
        }
        return AccData;
    })();
    uplight.AccData = AccData;
})(uplight || (uplight = {}));
//# sourceMappingURL=Accounts.js.map