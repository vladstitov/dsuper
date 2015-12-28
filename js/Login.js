var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path='typing/jquery.d.ts' />
///<reference path='Utils.ts' />
var uplight;
(function (uplight) {
    var LoginController = (function () {
        function LoginController($view) {
            var login = new uplight.Login($('#FirstLogin'));
            login.onComplete = function (res) {
                console.log(res);
                if (res.success === 'create_user') {
                    console.log('new user');
                    login.hide();
                    var newsup = new uplight.NewSuper($('#CreateUser'));
                    newsup.show();
                    newsup.onComplete = function (res) {
                        console.log(res);
                        if (res.success == 'usercreated') {
                            console.log(res);
                            newsup.showMessage('User created. Redirecting to Administrator page');
                            setTimeout(function () {
                                window.location.href = res.result;
                            }, 3000);
                        }
                    };
                }
            };
        }
        return LoginController;
    })();
    uplight.LoginController = LoginController;
    var Login = (function (_super) {
        __extends(Login, _super);
        function Login($view) {
            _super.call(this, $view, 'login', 'LoginForm');
            this.$view = $view;
            this.credentials = 'welcome';
            this.init();
            this.show();
            var pwd = $view.find('[name=password]');
            var chk = $view.find('[data-id=chkPass]').click(function () {
                if (chk.prop('checked'))
                    pwd.attr('type', 'text');
                else
                    pwd.attr('type', 'password');
            });
        }
        Login.prototype.onSubmit = function (obj) {
            var obj2 = { credentials: this.credentials + ',' + obj.username + ',' + obj.password };
            this.send(obj2);
        };
        return Login;
    })(uplight.SimpleForm);
    uplight.Login = Login;
    var NewSuper = (function (_super) {
        __extends(NewSuper, _super);
        function NewSuper($view) {
            _super.call(this, $view, 'login', 'NewSuper');
            this.$view = $view;
            this.init();
            this.show();
            var pwd = $view.find('[name=password]');
            var chk = $view.find('[data-id=chkPass]').click(function () {
                if (chk.prop('checked'))
                    pwd.attr('type', 'text');
                else
                    pwd.attr('type', 'password');
            });
        }
        NewSuper.prototype.onSubmit = function (obj) {
            var obj2 = { credentials: 'createuser,' + obj.username + ',' + obj.password + ',' + obj.email };
            this.send(obj2);
        };
        return NewSuper;
    })(uplight.SimpleForm);
    uplight.NewSuper = NewSuper;
})(uplight || (uplight = {}));
//# sourceMappingURL=Login.js.map