/**
 * Created by VladHome on 12/17/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path="ListEditor.ts"/>
///<reference path="Utils.ts"/>
///<reference path="AddAccountSteps.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            if (this.isCancel)
                return;
            console.log(s);
            switch (s) {
                case 'INSTALL_FINISHED':
                    this.message('Checking installation');
                    this.checkInstall();
                    break;
                case 'INSTALL_SUCCESS':
                    this.message('Installation successful');
                    this.step = 4;
                    this.message('Creating accounts for administrators');
                    this.ask('create_admins');
                    break;
                default:
                    this.message('Please wait');
                    this.installCount++;
                    this.conn.Log('Error installing application ' + s);
                    if (this.installCount > 2) {
                        this.conn.Email('Error installing application ' + s);
                        alert('Error installation application. Email sent to application development team');
                    }
                    else {
                        setTimeout(function () {
                            _this.checkInstall();
                        }, 30000);
                    }
                    break;
            }
        };
        InstallProcess.prototype.checkInstall = function () {
            var _this = this;
            this.conn.get(this.service + 'check_install').done(function (s) { return _this.onInstall(s); });
        };
        InstallProcess.prototype.onRespond = function (s) {
            if (this.isCancel)
                return;
            console.log(s);
            // if(this.wait){
            //  this.setData(s);
            //return;
            //  }
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
                    this.sendData();
                    this.message('Sending data');
                    break;
                case 'saved':
                    this.step = 2;
                    this.message('Server Received data');
                    this.conn.get(this.service + 'install').done(function (s) { return _this.onInstall(s); });
                    this.message('Installing kiosk Application at ' + res.result);
                    break;
                case 'admins_created':
                    this.message('Created accounts for ' + res.result);
                    this.step = 5;
                    this.ask('registr');
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
            this.message('Sending requast to server');
            this.ask('start_create');
        };
        InstallProcess.prototype.reset = function () {
            this.$message.html('');
        };
        InstallProcess.prototype.ask = function (str) {
            var _this = this;
            this.conn.get(this.service + str).done(function (s) { return _this.onRespond(s); });
        };
        InstallProcess.prototype.sendData = function () {
            var _this = this;
            this.conn.post(JSON.stringify(this.data), this.service + 'save_data').done(function (s) { return _this.onRespond(s); });
        };
        return InstallProcess;
    })(uplight.DisplayObject);
    uplight.InstallProcess = InstallProcess;
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
        FinalResultCtr.prototype.onServer = function (s) {
            var res = JSON.parse(s);
            if (res.success)
                this.server = res;
            else
                alert('Server Communication error.');
            this.render();
        };
        FinalResultCtr.prototype.setData = function (data) {
            var _this = this;
            this.data = data;
            this.conn.get('account.server_url').done(function (s) { return _this.onServer(s); });
            return this;
        };
        FinalResultCtr.prototype.getData = function () {
            return this.data;
        };
        FinalResultCtr.prototype.render = function () {
            var server = this.server.success;
            var adminurl = this.server.result;
            var v = this.$view;
            var admins = [];
            var ar = this.data;
            console.log(ar);
            var namespace;
            var url;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                switch (item.index) {
                    case 'admin-name':
                        admins.push(item.value);
                        break;
                    case 'namespace':
                        namespace = item.value;
                        url = 'http://' + server + '/<span class="namespace">' + namespace + '</span>/';
                        v.find('[data-id=namespace]').children().last().text(namespace);
                        break;
                    case 'mobile':
                        if (item.value)
                            v.find('[data-id=mobile]').show().children().last().html(url + 'KioskMobile.php');
                        ;
                        break;
                    case 'kiosk1080':
                        if (item.value)
                            v.find('[data-id=kiosk1080]').show().children().last().html(url + 'Kiosk1080.php');
                        break;
                    case 'kiosk1920':
                        if (item.value)
                            v.find('[data-id=kiosk1920]').show().children().last().html(url + 'Kiosk1920.php');
                        break;
                    default:
                        v.find('[data-id=' + ar[i].index + ']').children().last().text(item.value);
                        break;
                }
            }
            v.find('[data-id=admin-url]').children().last().html('<small>' + adminurl + '/<span class="namespace">' + namespace + '</span>/' + 'Admin.php' + '</small>');
            v.find('[data-id=admins]').children().last().text(admins.join(' , '));
        };
        return FinalResultCtr;
    })(uplight.DisplayObject);
    uplight.FinalResultCtr = FinalResultCtr;
    var AddAccount = (function (_super) {
        __extends(AddAccount, _super);
        function AddAccount($view) {
            _super.call(this, $view, 'AddAccount');
            this.$view = $view;
            this.init();
            console.log('Add Account');
        }
        AddAccount.prototype.init = function () {
            var _this = this;
            var ar = [];
            var ed = new uplight.NamespaceCtr(this.$view.find('[data-ctr=NamespaceCtr]'), {});
            ar.push(ed);
            ed.onBack = function () {
            };
            ed.onComplete = function () {
                console.log('first step compolete');
                _this.steps[0].hide();
                _this.steps[1].show();
            };
            ed = new uplight.ConfigurationCtr(this.$view.find('[data-ctr=ConfigurationCtr]'), {});
            ed.onComplete = function () {
                console.log('second step compolete');
                _this.steps[1].hide();
                _this.steps[2].show();
            };
            ed.onBack = function () {
                _this.steps[0].show();
                _this.steps[1].hide();
            };
            ar.push(ed);
            ed = new uplight.AdministratorsCtr(this.$view.find('[data-ctr=AdministratorsCtr]'), {});
            ed.onComplete = function () {
                console.log('third step compolete');
                _this.steps[2].hide();
                _this.final.show();
                var ar = _this.steps;
                var out = [];
                for (var i = 0, n = ar.length; i < n; i++) {
                    out = out.concat(ar[i].getData());
                }
                _this.final.setData(out);
            };
            ed.onBack = function () {
                _this.steps[1].show();
                _this.steps[2].hide();
            };
            ar.push(ed);
            this.final = new FinalResultCtr(this.$view.find('[data-ctr=FinalResultCtr]'));
            this.final.onClose = function () {
                _this.onClose();
            };
            this.final.onBack = function () {
                _this.steps[2].show();
                _this.final.hide();
            };
            this.final.onSave = function () {
                var inst = new InstallProcess(_this.$view.find('[data-ctr=InstallProcess]:first'), 'Installprocess');
                var data = _this.final.getData();
                console.log(JSON.stringify(data));
                inst.setData(data);
                _this.final.hide();
                inst.show();
                inst.start();
                inst.onComplete = function (res) {
                    console.log('InstallProcess complete');
                    _this.onComplete();
                };
                inst.onClose = function () {
                    _this.onClose();
                };
            };
            this.steps = ar;
            for (var i = 0, n = ar.length; i < n; i++) {
                ar[i].onClose = function () {
                    _this.onClose();
                };
            }
            //  this.steps[2].show();
            // this.$view.show();
        };
        AddAccount.prototype.onClose = function () {
            console.log(' on close ', this);
        };
        AddAccount.prototype.onBack = function (editor) {
            var i = this.steps.indexOf(editor);
            console.log(i);
        };
        AddAccount.prototype.onComplete = function () {
        };
        AddAccount.prototype.onDataReady = function () {
            console.log('data ready');
        };
        AddAccount.prototype.start = function () {
            this.steps[0].show();
        };
        AddAccount.prototype.goto = function (num) {
            if (num == this.steps.length) {
                this.final.setData(this.getData());
                this.final.show();
            }
            else
                this.steps[num].show();
        };
        AddAccount.prototype.reset = function () {
            var ar = this.steps;
            for (var i = 0, n = ar.length; i < n; i++) {
                ar[i].reset().hide();
            }
            this.final.hide();
            return this;
        };
        return AddAccount;
    })(uplight.DisplayObject);
    uplight.AddAccount = AddAccount;
})(uplight || (uplight = {}));
//# sourceMappingURL=AddAccount.js.map