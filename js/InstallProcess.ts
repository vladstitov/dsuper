/**
 * Created by VladHome on 12/24/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="AddAccountSteps.ts"/>
module uplight{
    export class InstallProcess extends DisplayObject{
        constructor(public $view:JQuery,public name?:string){
            super($view,name);
            console.log(this.$view);
            $view.find('[data-id=btnClose]').click(()=>{
                if(confirm('You want to cancel installation process?')) this.onCancel();
                else this.resume();
            });
            this.$message = this.$view.find('[data-id=message]:first');
            this.conn = new Connector();
        }
        conn:Connector
        $message:JQuery;
        _message:string='';

        addWait(){
            this.$message.html(this._message+'<img src="css/wait.gif" />');
        }
        message(str:string):void{
            this._message+='<li>'+str+'</li>';
            this.$message.html(this._message);
        }
        resume():void{

        }


        isCancel:boolean;
        onCancel():void{
            this.isCancel = true;
            this.conn.get(this.service+'cancel_install').done((s)=>{
                console.log('cancel install '+s);
            });
            this.onClose()
        }
        onClose():void{

        }

        wait:boolean;
        step:number=0;


        private installCount=0;
        onInstall(s:string){
            console.log('onInstall isCancel '+this.isCancel+'  '+s);
            if(this.isCancel) return;
           if(s=='INSTALL_FINISHED'){
               this.message('Installation completed');
               this.ask('check_install');
               this.message('Checking installation');
           }
            else {
               this.message('Please wait..');
               this.addWait();
               setTimeout(()=>{
                   this.message('Checking installation');
                   this.ask('check_install');
               },30000)
           }

        }

        onRespond(s):void {
            console.log('onRespond isCancel '+this.isCancel+'  '+s);
            if(this.isCancel) return;

            var res:VOResult
            try {
                res = JSON.parse(s);
            } catch (e) {
                console.log('Server error with respond ' + s);
                this.conn.Log(s);
                return;
            }


            if (res.error) {
                this.onError(res);
                return;
            }
            this.nextStep(res);
        }
        private nextStep(res:VOResult){
            if(this.isCancel) return;
            this.onStep(res.success);
            switch (res.success){
                case 'ready':
                    this.step=1;
                    this.message('Server Ready');
                    this.conn.get(this.service+'install').done((s)=>this.onInstall(s));
                    this.message('Installing kiosk Application at '+res.result);
                    this.message('Please wait a minute ');
                    this.addWait();

                    break;
                case 'check_complete':
                    this.message('Creating administrators');
                    this.sendAdmins();
                    break;
                case 'admins_created':
                    this.message('Created accounts for '+res.result);
                    this.step = 5;
                    this.ask('register');
                    this.message('Registering Application on server');
                    break;

                case 'admins_created_email':
                    this.message('Created accounts for '+res.result);
                    this.step = 6;
                    this.ask('send_email_notification');
                    this.message('Sending email ');
                    this.ask('register');
                    this.message('Registering Application on server');
                    break;
                case 'registered':
                    this.step = 7;
                    this.message('Installation Complete');
                    setTimeout(()=>{
                        this.onComplete(res);
                    },1000);

                    break;
            }
        }
        onComplete(res:VOResult):void{

        }
        onError(res:VOResult):void{

        }
        onStep(res:string):void{

        }
        private service:string = 'account.';


        start():void{
            this.isCancel = false;
            this.installCount=0;
            this._message='';
            console.log('Install process start');
            this.message('Sending request to server');
            this.ask('start_create');
        }

        reset():InstallProcess{
            this.$message.html('');
            return this;
        }

        ask(str:string):void{
            this.conn.get(this.service+str).done((s)=>this.onRespond(s));
        }
        sendAdmins():void{
            this.conn.post(JSON.stringify(this.data.admins),this.service+'create_admins').done((s)=>this.onRespond(s));
        }

    }

}