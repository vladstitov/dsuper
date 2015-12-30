/**
 * Created by VladHome on 12/13/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='Utils.ts' />
var uplight;
(function (uplight) {
    var Controller = (function () {
        function Controller() {
            var conn = new uplight.Connector();
            $('#btnLogout').click(function () {
                conn.post({ credentials: 'logout' }, 'login').done(function (s) {
                    var res = JSON.parse(s);
                    if (res.success)
                        window.location.reload();
                });
            });
            this.router();
        }
        Controller.prototype.router = function () {
            var hash = window.location.hash;
            var ar = hash.split('.');
            var page = ar[0];
            if (page == this.current)
                return;
            console.log('page  ' + page);
            switch (page) {
                case '#Login':
                    $('#Content').load(('htms/Login.html'));
                    break;
                default:
                    $('#Content').load(('htms/Accounts.php'), function () {
                    });
                    break;
            }
        };
        return Controller;
    })();
    uplight.Controller = Controller;
})(uplight || (uplight = {}));
//# sourceMappingURL=Main.js.map