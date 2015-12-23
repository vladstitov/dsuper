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
        function Connector() {
            this.service = 'rem/service.php';
        }
        Connector.prototype.post = function (obj, url) {
            if (!url)
                url = '';
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
})(uplight || (uplight = {}));
//# sourceMappingURL=Utils.js.map