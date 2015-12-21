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
            var data = JSON.parse('[{"index":"namespace","value":"account3"},{"index":"account-name","value":"Name of new account"},{"index":"description","value":"Some description goes here "},{"index":"mobile","label":"Mobile ","value":true},{"index":"kiosk1080","label":"Kiosks 1080x1920","value":true},{"index":"kiosk1920","label":"Kiosks 1920x1080","value":false},{"index":"sendemail","value":true},{"index":"admin-email","value":"adminemail@mail.com"},{"index":"admin-name","value":"admin Name"},{"index":"username","value":"adminuserbane"},{"index":"password","value":"adminpass"}]');
            this.addAccount.setData(data).show();
            this.addAccount.goto(3);
            _super.prototype.renderHeader.call(this, '<tr><th><small>ID</small></th><th>Name</th><th>Description</th></tr>');
        }
        Accounts.prototype.renderItem = function (item, i) {
            return '<tr data-i="' + i + '"><td><small>' + item.id + '</small></td><td>' + item.name + '</td><td>' + item.description + '</td></tr>';
        };
        Accounts.prototype.onAdd = function () {
            this.addAccount.reset().start();
            this.addAccount.show();
        };
        return Accounts;
    })(uplight.ListEditor);
    uplight.Accounts = Accounts;
})(uplight || (uplight = {}));
//# sourceMappingURL=Accounts.js.map