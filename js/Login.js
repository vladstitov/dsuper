///<reference path='typing/jquery.d.ts' />
///<reference path='Connector.ts' />
var uplight;
(function (uplight) {
    var Login = (function () {
        function Login($view, conn) {
            var _this = this;
            this.$view = $view;
            this.conn = conn;
            $view.find("form").submit(function (evt) { evt.preventDefault(); });
            this.$user = $view.find('[data-index=user]');
            this.$pass = $view.find('[data-index=pass]');
            this.$msg = this.$view.find('.Message');
            $view.find('button[type=submit]:first').click(function (evt) {
                var btn = $(evt.currentTarget).prop('disabled', true);
                setTimeout(function () { btn.prop('disabled', false); }, 3000);
                evt.preventDefault();
                var user = _this.$user.val();
                var pass = _this.$pass.val();
                _this.send(MD5(user) + ',' + MD5(pass));
            });
            $view.find('[data-index=chkPass]:first').change(function (el) {
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
            this.conn.post(obj).done(function (s) { return _this.onResult(s); });
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
            var res = JSON.parse(s);
            console.log(res);
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
            m.html(msg).removeClass('hidden').fadeIn();
            setTimeout(function () { m.fadeOut(); }, 5000);
        };
        return Login;
    })();
    uplight.Login = Login;
})(uplight || (uplight = {}));
//# sourceMappingURL=Login.js.map