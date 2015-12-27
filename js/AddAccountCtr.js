/**
 * Created by VladHome on 12/17/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path="ListEditor.ts"/>
///<reference path="Utils.ts"/>
///<reference path="AddAccountSteps.ts"/>
///<reference path="InstallProcess.ts"/>
///<reference path="FinalResultCtr.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var uplight;
(function (uplight) {
    var AddAccountCtr = (function (_super) {
        __extends(AddAccountCtr, _super);
        function AddAccountCtr($view) {
            _super.call(this, $view, 'AddAccount');
            this.$view = $view;
            this.init();
            console.log('Add Account');
        }
        AddAccountCtr.prototype.init = function () {
            var _this = this;
            var ar = [];
            var ed = new uplight.NamespaceCtr(this.$view.find('[data-ctr=NamespaceCtr]'), 'NS', 'NamespaceCtr');
            ar.push(ed);
            ed.onBack = function () {
            };
            ed.onComplete = function () {
                console.log('first step compolete');
                _this.steps[0].hide();
                _this.steps[1].show();
            };
            ed = new uplight.ConfigurationCtr(this.$view.find('[data-ctr=ConfigurationCtr]'), 'config', 'ConfigurationCtr');
            ed.onComplete = function () {
                console.log('second step compolete');
                _this.steps[1].hide();
                _this.admins.show();
            };
            ed.onBack = function () {
                _this.steps[0].show();
                _this.steps[1].hide();
            };
            ar.push(ed);
            var admins = new uplight.AdministratorsCtr(this.$view.find('[data-ctr=AdministratorsCtr]'), 'admins', 'AdministratorsCtr');
            admins.onComplete = function () {
                console.log('third step compolete');
                _this.admins.hide();
                if (!_this.final)
                    _this.initFinal();
                _this.final.show();
                var ar = _this.steps;
                var out = [];
                for (var i = 0, n = ar.length; i < n; i++) {
                    out = out.concat(ar[i].getData());
                }
                var final = new uplight.UFinal();
                final.admins = admins.getAdmins();
                ;
                final.config = out;
                _this.final.setData1(final);
            };
            admins.onBack = function () {
                _this.steps[1].show();
                _this.admins.hide();
            };
            // ar.push(ed);
            this.admins = admins;
            this.steps = ar;
            for (var i = 0, n = ar.length; i < n; i++) {
                ar[i].onClose = function () {
                    _this.onClose();
                };
            }
            //  this.steps[2].show();
            // this.$view.show();
        };
        AddAccountCtr.prototype.initFinal = function () {
            var _this = this;
            this.final = new uplight.FinalResultCtr(this.$view.find('[data-ctr=FinalResultCtr]'), 'FinalResultCtr');
            this.final.onClose = function () {
                _this.onClose();
            };
            this.final.onBack = function () {
                _this.admins.show();
                _this.final.hide();
            };
            this.final.onSave = function () {
                var data = _this.final.getData();
                if (!_this.installProcess) {
                    _this.installProcess = new uplight.InstallProcess(_this.$view.find('[data-ctr=InstallProcess]:first'), 'Installprocess');
                    _this.installProcess.onComplete = function (res) {
                        console.log('InstallProcess complete');
                        _this.onComplete();
                    };
                    _this.installProcess.onClose = function () {
                        _this.onClose();
                    };
                }
                // console.log(JSON.stringify(data));
                _this.installProcess.setData(data);
                _this.final.hide();
                _this.installProcess.show();
                _this.installProcess.start();
            };
        };
        AddAccountCtr.prototype.onClose = function () {
            console.log(' on close ', this);
        };
        AddAccountCtr.prototype.onBack = function (editor) {
            var i = this.steps.indexOf(editor);
            console.log(i);
        };
        AddAccountCtr.prototype.onComplete = function () {
        };
        AddAccountCtr.prototype.onDataReady = function () {
            console.log('data ready');
        };
        AddAccountCtr.prototype.start = function () {
            this.steps[0].show();
        };
        AddAccountCtr.prototype.goto = function (num) {
            if (num == this.steps.length) {
                if (!this.final)
                    this.initFinal();
                this.final.show();
                return this.final;
            }
            else
                this.steps[num].show();
        };
        AddAccountCtr.prototype.reset = function () {
            var ar = this.steps;
            for (var i = 0, n = ar.length; i < n; i++) {
                ar[i].reset().hide();
            }
            if (this.final)
                this.final.reset().hide();
            if (this.installProcess)
                this.installProcess.reset().hide();
            if (this.admins)
                this.admins.reset().hide();
            return this;
        };
        return AddAccountCtr;
    })(uplight.DisplayObject);
    uplight.AddAccountCtr = AddAccountCtr;
})(uplight || (uplight = {}));
//# sourceMappingURL=AddAccountCtr.js.map