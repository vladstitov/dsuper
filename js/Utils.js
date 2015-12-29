/**
 * Created by VladHome on 12/15/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var uplight;
(function (uplight) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.message = function (text, vis, time) {
            if (!time)
                time = 3;
            var msg = $('<div>').addClass('message').css(vis.offset()).text(text).appendTo('body');
            msg.hide();
            msg.show('fast');
            setTimeout(function () {
                msg.hide('fast', function () {
                    msg.remove();
                });
            }, time * 1000);
        };
        return Utils;
    })();
    uplight.Utils = Utils;
    var VOResult = (function () {
        function VOResult() {
        }
        return VOResult;
    })();
    uplight.VOResult = VOResult;
    var Connector = (function () {
        function Connector(action) {
            this.action = action;
            this.service = 'rem/service.php';
        }
        Connector.prototype.post = function (obj, url) {
            if (typeof obj == 'object')
                obj = JSON.stringify(obj);
            if (!url)
                url = this.action || '';
            return $.post(this.service + '?a=' + url, obj);
        };
        Connector.prototype.get = function (url) {
            return $.get(this.service + '?a=' + url);
        };
        Connector.prototype.logout = function () {
            return this.post({ credetials: 'logout' });
        };
        Connector.prototype.Log = function (str) {
            return $.post(this.service + '?a=LOG', str);
        };
        Connector.prototype.logError = function (str) {
            return $.post(this.service + '?a=ERROR', str);
        };
        Connector.prototype.Email = function (str) {
            return $.post(this.service + '?a=EMAIL', str);
        };
        Connector.inst = new Connector();
        return Connector;
    })();
    uplight.Connector = Connector;
    var Registry = (function () {
        function Registry() {
        }
        return Registry;
    })();
    uplight.Registry = Registry;
    var DisplayObject = (function () {
        function DisplayObject($view, name) {
            this.$view = $view;
            this.name = name;
        }
        DisplayObject.prototype.onShow = function () { };
        DisplayObject.prototype.onHide = function () { };
        DisplayObject.prototype.onAdded = function () { };
        DisplayObject.prototype.onRemoved = function () { };
        DisplayObject.prototype.destroy = function () {
            this.$view.remove();
        };
        DisplayObject.prototype.show = function () {
            this.isVisuble = true;
            this.onShow();
            this.$view.show();
            return this;
        };
        DisplayObject.prototype.hide = function () {
            if (this.isVisuble) {
                this.isVisuble = false;
                this.$view.hide();
                this.onHide();
            }
            return this;
        };
        DisplayObject.prototype.appendTo = function (parent) {
            parent.append(this.$view);
            this.onAdded();
            return this;
        };
        DisplayObject.prototype.remove = function () {
            this.$view.detach();
            this.onRemoved();
            return this;
        };
        DisplayObject.prototype.setData = function (data) {
            this.data = data;
            return this;
        };
        DisplayObject.prototype.getData = function () {
            return this.data;
        };
        return DisplayObject;
    })();
    uplight.DisplayObject = DisplayObject;
    var WindowView = (function (_super) {
        __extends(WindowView, _super);
        function WindowView($view, opt, name) {
            var _this = this;
            _super.call(this, $view, name);
            this.$view.find('[data-id=btnClose]').click(function () { return _this.onClose(); });
        }
        WindowView.prototype.onClose = function () {
            this.hide();
        };
        return WindowView;
    })(DisplayObject);
    uplight.WindowView = WindowView;
    var ModuleView = (function (_super) {
        __extends(ModuleView, _super);
        function ModuleView($view, opt, name) {
            _super.call(this, $view, name);
        }
        return ModuleView;
    })(WindowView);
    uplight.ModuleView = ModuleView;
    var SimpleForm = (function (_super) {
        __extends(SimpleForm, _super);
        function SimpleForm($view, service, name) {
            _super.call(this, $view, name);
            this.$view = $view;
            this.message = 'Form error';
            this.conn = new Connector(service);
        }
        SimpleForm.prototype.init = function () {
            var _this = this;
            this.$view.find("form").submit(function (evt) { evt.preventDefault(); });
            var ar = [];
            var dic = {};
            this.$view.find('input').each(function (i, el) {
                dic[el.getAttribute('data-id')] = el;
                ar.push(el);
            });
            this.inputs = ar;
            this.ind = dic;
            this.$submit = this.$view.find('[type=submit]').click(function () { return _this.onSubmitClick(); });
        };
        SimpleForm.prototype.onSubmitClick = function () {
            var valid = true;
            var ar = this.inputs;
            var data = {};
            for (var i = 0, n = ar.length; i < n; i++) {
                if (!ar[i].checkValidity())
                    valid = false;
                if (ar[i].type == 'checkbox')
                    data[ar[i].name] = ar[i].checked;
                else
                    data[ar[i].name] = ar[i].value;
            }
            if (valid) {
                var btn = this.$submit.prop('disabled', true);
                setTimeout(function () {
                    btn.prop('disabled', false);
                }, 3000);
                this.onSubmit(data);
            }
        };
        SimpleForm.prototype.onComplete = function (res) {
        };
        SimpleForm.prototype.onError = function (res) {
            var msg = res.message || this.message;
            this.showMessage(msg);
            console.log(msg);
        };
        SimpleForm.prototype.onResult = function (res) {
            if (res.success)
                this.onComplete(res);
            else
                this.onError(res);
        };
        SimpleForm.prototype.onRespond = function (s) {
            var res;
            try {
                res = JSON.parse(s);
            }
            catch (e) {
                this.showMessage('Communication Error logged on server <br/> We will contact you soon');
                this.conn.Email(this.name + this.conn.service + '  ' + s);
                //  console.log(s);
                return;
            }
            if (res)
                this.onResult(res);
        };
        SimpleForm.prototype.send = function (obj) {
            var _this = this;
            this.conn.post(obj).done(function (s) { return _this.onRespond(s); });
        };
        SimpleForm.prototype.onSubmit = function (data) {
            this.send(data);
        };
        SimpleForm.prototype.showMessage = function (str) {
            var msg = this.$view.find('[data-id=message]').html(str).removeClass('hidden').fadeIn();
            clearTimeout(this.timeout);
            this.timeout = setTimeout(function () { msg.fadeOut(); }, 5000);
        };
        return SimpleForm;
    })(DisplayObject);
    uplight.SimpleForm = SimpleForm;
})(uplight || (uplight = {}));
//# sourceMappingURL=Utils.js.map