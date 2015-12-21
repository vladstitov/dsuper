/**
 * Created by VladHome on 12/15/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
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
        return Connector;
    })();
    uplight.Connector = Connector;
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
})(uplight || (uplight = {}));
//# sourceMappingURL=Utils.js.map