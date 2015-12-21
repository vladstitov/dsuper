var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by VladHome on 12/13/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='Connector.ts' />
///<reference path='Login.ts' />
var uplight;
(function (uplight) {
    var NewSuper = (function (_super) {
        __extends(NewSuper, _super);
        function NewSuper() {
            _super.apply(this, arguments);
        }
        NewSuper.prototype.onResult = function (s) {
            var res = JSON.parse(s);
            console.log(res);
            if (res.success && this.onComplete)
                this.onComplete(res);
            else
                this.message(res.result);
        };
        NewSuper.prototype.checkUser = function (str) {
            var d = $.Deferred();
            return d.promise();
        };
        NewSuper.prototype.send = function (str) {
            var _this = this;
            var obj = { credetials: 'createuser,' + str };
            this.conn.post(obj).done(function (s) { return _this.onCreated(s); });
        };
        NewSuper.prototype.onCreated = function (s) {
            var res = JSON.parse(s);
            console.log(res);
            if (res.success == 'taken') {
                this.message('User with this name exists. Please use your email address or change username');
            }
            else if (res.success = 'usercreated') {
                localStorage.setItem('newuser', this.$user.val());
                //localStorage.setItem('pass',this.$pass.val());
                if (this.onComplete)
                    this.onComplete(res);
            }
        };
        return NewSuper;
    })(uplight.Login);
    uplight.NewSuper = NewSuper;
})(uplight || (uplight = {}));
//# sourceMappingURL=NewSuper.js.map