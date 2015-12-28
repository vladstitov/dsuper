/**
 * Created by VladHome on 12/27/2015.
 */
///<reference path='typing/jquery.d.ts' />
///<reference path='typing/underscore.d.ts' />
///<reference path='Utils.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var uplight;
(function (uplight) {
    var RestorePassowrd = (function (_super) {
        __extends(RestorePassowrd, _super);
        function RestorePassowrd($view, service, name) {
            _super.call(this, $view, service, name);
            this.init();
        }
        RestorePassowrd.prototype.onResult = function (res) {
            console.log(res);
        };
        return RestorePassowrd;
    })(uplight.SimpleForm);
    uplight.RestorePassowrd = RestorePassowrd;
})(uplight || (uplight = {}));
//# sourceMappingURL=RestorePassowrd.js.map