var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path='typing/jquery.d.ts' />
///<reference path='Utils.ts' />
var uplight;
(function (uplight) {
    var Login = (function () {
        function Login($view) {
            var _this = this;
            this.$view = $view;
            this.conn = new uplight.Connector();
            $view.find("form").submit(function (evt) { evt.preventDefault(); });
            this.$user = $view.find('[data-id=user]');
            this.$pass = $view.find('[data-id=pass]');
            this.$msg = this.$view.find('[data-id=message]');
            $view.find('button[type=submit]:first').click(function (evt) {
                var btn = $(evt.currentTarget).prop('disabled', true);
                setTimeout(function () { btn.prop('disabled', false); }, 3000);
                evt.preventDefault();
                var user = _this.$user.val();
                var pass = _this.$pass.val();
                _this.send(MD5(user) + ',' + MD5(pass));
            });
            $view.find('[data-id=chkPass]:first').change(function (el) {
                if ($(el.currentTarget).prop('checked')) {
                    _this.$pass.prop('type', 'text');
                }
                else
                    _this.$pass.prop('type', 'password');
            });
        }
        Login.prototype.send = function (str) {
            var _this = this;
            var obj = { credetials: 'login,' + str };
            this.conn.post(obj, 'login').done(function (s) { return _this.onResult(s); });
        };
        Login.prototype.cleanFields = function () {
            this.$user.val('');
            this.$pass.val('');
        };
        Login.prototype.show = function () {
            this.$view.removeClass('hidden');
            this.$view.show('fast');
        };
        Login.prototype.hide = function () {
            this.$view.hide('fast');
        };
        Login.prototype.onResult = function (s) {
            console.log(s);
            try {
                var res = JSON.parse(s);
            }
            catch (e) {
                console.log(s);
                return;
            }
            if (res.success) {
                if (res.success == 'loggedin' && this.onComplete)
                    this.onComplete(res);
                else
                    this.message('Please check your Username and Password');
            }
            else
                this.message(res.result);
        };
        Login.prototype.message = function (msg) {
            var m = this.$msg;
            console.log(m);
            m.html(msg).removeClass('hidden').fadeIn();
            setTimeout(function () { m.fadeOut(); }, 5000);
        };
        return Login;
    })();
    uplight.Login = Login;
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
            this.conn.post(obj, 'login').done(function (s) { return _this.onCreated(s); });
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
    })(Login);
    uplight.NewSuper = NewSuper;
})(uplight || (uplight = {}));
//# sourceMappingURL=Login.js.map