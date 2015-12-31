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
    var InstallProcess = (function (_super) {
        __extends(InstallProcess, _super);
        function InstallProcess($view, name) {
            var _this = this;
            _super.call(this, $view, name);
            this.$view = $view;
            this.name = name;
            this._message = '';
            this.step = 0;
            this.installCount = 0;
            this.service = 'account.';
            console.log(this.$view);
            $view.find('[data-id=btnClose]').click(function () {
                if (confirm('You want to cancel installation process?'))
                    _this.onCancel();
                else
                    _this.resume();
            });
            this.$message = this.$view.find('[data-id=message]:first');
            this.conn = new uplight.Connector();
        }
        InstallProcess.prototype.addWait = function () {
            this.$message.html(this._message + '<img src="css/wait.gif" />');
        };
        InstallProcess.prototype.message = function (str) {
            this._message += '<li>' + str + '</li>';
            this.$message.html(this._message);
        };
        InstallProcess.prototype.resume = function () {
        };
        InstallProcess.prototype.onCancel = function () {
            this.isCancel = true;
            this.conn.get(this.service + 'cancel_install').done(function (s) {
                console.log('cancel install ' + s);
            });
            this.onClose();
        };
        InstallProcess.prototype.onClose = function () {
        };
        InstallProcess.prototype.onInstall = function (s) {
            var _this = this;
            console.log('onInstall isCancel ' + this.isCancel + '  ' + s);
            if (this.isCancel)
                return;
            if (s == 'INSTALL_FINISHED') {
                this.message('Installation completed');
                this.ask('check_install');
                this.message('Checking installation');
            }
            else {
                this.message('Please wait..');
                this.addWait();
                setTimeout(function () {
                    _this.message('Checking installation');
                    _this.ask('check_install');
                }, 30000);
            }
        };
        InstallProcess.prototype.onRespond = function (s) {
            console.log('onRespond isCancel ' + this.isCancel + '  ' + s);
            if (this.isCancel)
                return;
            var res;
            try {
                res = JSON.parse(s);
            }
            catch (e) {
                console.log('Server error with respond ' + s);
                this.conn.Log(s);
                return;
            }
            if (res.error) {
                this.onError(res);
                return;
            }
            this.nextStep(res);
        };
        InstallProcess.prototype.nextStep = function (res) {
            var _this = this;
            if (this.isCancel)
                return;
            this.onStep(res.success);
            switch (res.success) {
                case 'ready':
                    this.step = 1;
                    this.message('Server Ready');
                    this.conn.get(this.service + 'install').done(function (s) { return _this.onInstall(s); });
                    this.message('Installing kiosk Application at ' + res.result);
                    this.message('Please wait a minute ');
                    this.addWait();
                    break;
                case 'check_complete':
                    this.message('Creating administrators');
                    this.sendAdmins();
                    break;
                case 'admins_created':
                    this.message('Created accounts for ' + res.result);
                    this.step = 5;
                    this.ask('register');
                    this.message('Registering Application on server');
                    break;
                case 'admins_created_email':
                    this.message('Created accounts for ' + res.result);
                    this.step = 6;
                    this.ask('send_email_notification');
                    this.message('Sending email ');
                    this.ask('register');
                    this.message('Registering Application on server');
                    break;
                case 'registered':
                    this.step = 7;
                    this.message('Installation Complete');
                    setTimeout(function () {
                        _this.onComplete(res);
                    }, 1000);
                    break;
            }
        };
        InstallProcess.prototype.onComplete = function (res) {
        };
        InstallProcess.prototype.onError = function (res) {
        };
        InstallProcess.prototype.onStep = function (res) {
        };
        InstallProcess.prototype.start = function () {
            this.isCancel = false;
            this.installCount = 0;
            this._message = '';
            console.log('Install process start');
            this.message('Sending request to server');
            this.ask('start_create');
        };
        InstallProcess.prototype.reset = function () {
            this.$message.html('');
            return this;
        };
        InstallProcess.prototype.ask = function (str) {
            var _this = this;
            this.conn.get(this.service + str).done(function (s) { return _this.onRespond(s); });
        };
        InstallProcess.prototype.sendAdmins = function () {
            var _this = this;
            this.conn.post(JSON.stringify(this.data.admins), this.service + 'create_admins').done(function (s) { return _this.onRespond(s); });
        };
        return InstallProcess;
    })(uplight.DisplayObject);
    uplight.InstallProcess = InstallProcess;
})(uplight || (uplight = {}));
//# sourceMappingURL=InstallProcess.js.map