/**
 * Created by VladHome on 12/13/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path="ListEditor.ts"/>
///<reference path="Utils.ts"/>
///<reference path="AddAccount.ts"/>
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
            this.addAccount = new uplight.AddAccount($view.find('[data-ctr=AddAccount]'));
            this.addAccount.onClose = function () {
                _this.addAccount.$view.hide();
                // this.addAccount.reset();
            };
            this.addAccount.onComplete = function () {
                console.log('account added loading data');
                _this.addAccount.hide();
                _this.loadData();
            };
            var data = '{"success":"success","result":{"namespace":"namespase","account_name":"account name","description":"Account description","KioskMobile":"true","Kiosk1080":"","Kiosk1820":"true","sendemail":"true","admin-email":"email@email","admin_name":"Admin name","username":"username1","password":"password1","folder":"\/dist\/namespase","server":"http:\/\/localhost","uid":"2","root":"C:\/wamp\/www","pub":"\/pub\/","data":"\/data\/","db":"directories.db","https":"https:\/\/frontdes-wwwss24.ssl.supercp.com","adminurl":"https:\/\/frontdes-wwwss24.ssl.supercp.com\/dist\/namespaseAdmin"}}';
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
                    if (!_this.accountInfo)
                        _this.accountInfo = new AccountInfo(_this.$view.find('[data-ctr=AccountInfo]'), 'AccountInfo');
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
        Accounts.prototype.onAdd = function () {
            this.addAccount.reset().start();
            this.addAccount.show();
        };
        return Accounts;
    })(uplight.ListEditor);
    uplight.Accounts = Accounts;
    var AccountEdit = (function (_super) {
        __extends(AccountEdit, _super);
        function AccountEdit($view, name) {
            _super.call(this, $view, name);
        }
        return AccountEdit;
    })(uplight.ModuleView);
    uplight.AccountEdit = AccountEdit;
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
    var AccountInfo = (function (_super) {
        __extends(AccountInfo, _super);
        function AccountInfo($view, name) {
            _super.call(this, $view, name);
        }
        AccountInfo.prototype.renderData = function (data) {
            console.log(data);
            var url = 'http://' + data.server + '/' + data.config.folder + data.config.pub;
            if (data.config.mobile)
                this.$view.find('[data-id=mobile]:first').text(url + data.config.mobileUrl).attr('href', url + data.config.mobileUrl).parent().show();
            else
                this.$view.find('[data-id=mobile]:first').parent().hide();
            var admUrl = data.adminUrl + data.config.folder + data.config.pub + data.config.adminUrl;
            this.$view.find('[data-id=admin-url]:first').text(admUrl).attr('href', admUrl);
            var admins = '';
            var ar = data.admins;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                admins += '<tr><td>' + item.name + '</td><td><a href="mailto:' + item.email + '" >' + item.email + '</a></td>';
            }
            this.$view.find('[data-id=admins]:first').html(admins);
            var kiosks = '';
            var ar2 = data.config.kiosksUrls;
            if (ar2 || ar2.length) {
                for (var i = 0, n = ar2.length; i < n; i++)
                    kiosks += '<a href="' + url + ar2[i] + '" target="_blank" class="list-group-item">' + url + ar2[i] + '</a>';
            }
            this.$view.find('[data-id=kiosks]:first').html(kiosks);
        };
        AccountInfo.prototype.onShow = function () {
            var _this = this;
            var data = this.data;
            console.log(data);
            this.$view.find('[data-id=name]').text(data.name);
            this.$view.find('[data-id=description]').text(data.description);
            uplight.Connector.inst.get('account.get_info&id=' + data.id).done(function (s) {
                var data;
                try {
                    var resp = JSON.parse(s);
                    if (resp.success == 'success')
                        data = new AccData(resp);
                }
                catch (e) {
                    console.log(e);
                }
                if (data)
                    _this.renderData(data);
            });
        };
        return AccountInfo;
    })(uplight.ModuleView);
    uplight.AccountInfo = AccountInfo;
})(uplight || (uplight = {}));
//# sourceMappingURL=Accounts.js.map