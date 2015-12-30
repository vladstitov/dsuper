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
///<reference path="AddAccountSteps.ts"/>
var uplight;
(function (uplight) {
    var UAdmin = (function () {
        function UAdmin() {
        }
        return UAdmin;
    })();
    uplight.UAdmin = UAdmin;
    var UFinal = (function () {
        function UFinal() {
        }
        return UFinal;
    })();
    uplight.UFinal = UFinal;
    var FinalResultCtr = (function (_super) {
        __extends(FinalResultCtr, _super);
        function FinalResultCtr($view, name) {
            _super.call(this, $view, name);
            this.conn = new uplight.Connector();
            this.initButtons();
        }
        FinalResultCtr.prototype.initButtons = function () {
            var _this = this;
            this.$view.find('[data-id=btnClose]').click(function () { return _this.onClose(); });
            this.$view.find('[data-id=btnSave]').click(function () { return _this.onSave(); });
            this.$view.find('[data-id=btnBack]').click(function () { _this.onBack(); });
            //this.$message = this.$view.find('[data-id=message]');
        };
        FinalResultCtr.prototype.onSave = function () {
        };
        FinalResultCtr.prototype.onClose = function () { console.log('onClose ' + this.id); };
        FinalResultCtr.prototype.onBack = function () { console.log('onBack ' + this.id); };
        FinalResultCtr.prototype.onComplete = function () { console.log('onComplete ' + this.id); };
        FinalResultCtr.prototype.reset = function () {
            return this;
        };
        FinalResultCtr.prototype.onServer = function (s) {
            /// console.log(this.name,s);
            var res;
            try {
                res = JSON.parse(s);
            }
            catch (e) {
            }
            if (res)
                this.render(res);
            else
                alert('Server Communication error.');
        };
        FinalResultCtr.prototype.setData1 = function (data) {
            var _this = this;
            this.data = data;
            var ar = data.admins;
            this.$view.find('.uadmin').detach();
            var out = '';
            for (var i = 0, n = ar.length; i < n; i++) {
                out += '<tr class="uadmin"><td>' + ar[i].name + '</td><td>' + ar[i].email + '</td>';
            }
            this.$view.find('[data-id=admins]').after(out);
            console.log('FinalResultCtr ', data);
            this.conn.post(JSON.stringify(data.config), 'account.create_config').done(function (s) { return _this.onServer(s); });
            return this;
        };
        FinalResultCtr.prototype.getData = function () {
            return this.data;
        };
        FinalResultCtr.prototype.getName = function (ar) {
            for (var i = 0, n = ar.length; i < n; i++) {
                if (ar[i].id == 'admin_name')
                    return ar[i].value;
            }
        };
        FinalResultCtr.prototype.render = function (config) {
            var server = config.server;
            var v = this.$view;
            var namespace = config.namespace;
            var url = config.server;
            v.find('[data-id=account_name]').children().last().text(config.account_name);
            v.find('[data-id=description]').children().last().text(config.description);
            v.find('[data-id=namespace]').children().last().text(config.namespace);
            v.find('[data-id=admin_url]').children().last().html('<small>' + config.adminurl + '</small>');
            if (config.KioskMobile)
                v.find('[data-id=KioskMobile]').show().children().last().html(url + '/' + config.KioskMobile);
            else
                v.find('[data-id=KioskMobile]').show().children().last().html('');
            if (config.Kiosk1080)
                v.find('[data-id=Kiosk1080]').show().children().last().html(url + '/' + config.Kiosk1080);
            else
                v.find('[data-id=Kiosk1080]').show().children().last().html('');
            if (config.Kiosk1920)
                v.find('[data-id=Kiosk1920]').show().children().last().html(url + '/' + config.Kiosk1920);
            else
                v.find('[data-id=Kiosk1920]').show().children().last().html('');
            //else v.find('[data-id=mobile]').hide()
            return;
        };
        return FinalResultCtr;
    })(uplight.DisplayObject);
    uplight.FinalResultCtr = FinalResultCtr;
})(uplight || (uplight = {}));
//# sourceMappingURL=FinalResultCtr.js.map