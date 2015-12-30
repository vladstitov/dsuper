var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by VladHome on 12/24/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path="ListEditor.ts"/>
///<reference path="Utils.ts"/>
///<reference path="AddAccountCtr.ts"/>
///<reference path="Accounts.ts"/>
var uplight;
(function (uplight) {
    var AccountInfo = (function (_super) {
        __extends(AccountInfo, _super);
        function AccountInfo($view, name) {
            _super.call(this, $view, name);
        }
        AccountInfo.prototype.renderData = function (data) {
            console.log(data);
            var cfg = data.config;
            var url = cfg.server + '/';
            if (cfg.KioskMobile)
                this.$view.find('[data-id=mobile]:first').text(url + cfg.KioskMobile).attr('href', url + cfg.KioskMobile).parent().show();
            else
                this.$view.find('[data-id=mobile]:first').parent().hide();
            this.$view.find('[data-id=admin-url]:first').text(cfg.adminurl).attr('href', cfg.adminurl);
            var admins = '';
            var ar = data.admins;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                admins += '<tr><td>' + item.name + '</td><td><a href="mailto:' + item.email + '" >' + item.email + '</a></td>';
            }
            this.$view.find('[data-id=admins]:first').html(admins);
            var kiosks = '';
            var ar2 = [];
            if (cfg.Kiosk1080)
                ar2.push(cfg.Kiosk1080);
            if (cfg.Kiosk1920)
                ar2.push(cfg.Kiosk1920);
            if (ar2 && ar2.length) {
                for (var i = 0, n = ar2.length; i < n; i++)
                    kiosks += '<a href="' + url + ar2[i] + '" target="_blank" class="list-group-item">' + url + ar2[i] + '</a>';
            }
            this.$view.find('[data-id=kiosks]:first').html(kiosks);
        };
        AccountInfo.prototype.onDataError = function () {
        };
        AccountInfo.prototype.reset = function () {
            this.$view.find('[data-id=name]').text('');
            this.$view.find('[data-id=description]').text('');
            this.$view.find('[data-id=admin-url]:first').text('').attr('href', '');
            this.$view.find('[data-id=mobile]:first').text('').attr('href', '');
            this.$view.find('[data-id=admins]:first').html('');
            this.$view.find('[data-id=kiosks]:first').html('');
        };
        AccountInfo.prototype.onShow = function () {
            var _this = this;
            this.reset();
            var data = this.data;
            console.log(data);
            this.$view.find('[data-id=name]').text(data.name);
            this.$view.find('[data-id=description]').text(data.description);
            uplight.Connector.inst.get('account.get_info&id=' + data.id).done(function (s) {
                var data;
                try {
                    var resp = JSON.parse(s);
                    if (resp.success == 'success')
                        data = new uplight.AccData(resp);
                }
                catch (e) {
                    console.log(e);
                }
                if (data)
                    _this.renderData(data);
                else
                    _this.onDataError();
            });
        };
        return AccountInfo;
    })(uplight.ModuleView);
    uplight.AccountInfo = AccountInfo;
})(uplight || (uplight = {}));
//# sourceMappingURL=AccountInfo.js.map