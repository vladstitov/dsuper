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
        /* onResult(res:VOResult){
             console.log(res)
 
         }*/
        RestorePassowrd.prototype.onComplete = function (res) {
            this.$view.find('[data-id=message]').text(res.message).show();
            this.$view.find('form').hide();
        };
        return RestorePassowrd;
    })(uplight.SimpleForm);
    uplight.RestorePassowrd = RestorePassowrd;
})(uplight || (uplight = {}));
//# sourceMappingURL=RestorePassowrd.js.map