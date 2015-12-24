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
            switch(s){
                case 'INSTALL_FINISHED':
                    this.message('Checking installation');
                    this.checkInstall();
                    break;
                case 'INSTALL_SUCCESS':
                    this.message('Installation successful');
                    this.step = 4;
                    this.message('Creating accounts for administrators');
                    this.ask('create_admins');
                    break;
                default:
                    this.message('Please wait');
                    this.installCount++;
                    this.conn.Log('Error installing application '+s);
                    if(this.installCount>2){
                        this.conn.Email('Error installing application '+s);
                        alert('Error installation application. Email sent to application development team');
                    }else{
                        setTimeout(()=>{
                            this.checkInstall();
                        },30000)
                    }

                    break
            }

        }

        private checkInstall():void{
            this.conn.get(this.service+'check_install').done((s)=>this.onInstall(s));
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
                    this.sendData();
                    this.message('Sending data');
                    break;
                case 'saved':
                    this.step = 2;
                    this.message('Server Received data');
                    this.conn.get(this.service+'install').done((s)=>this.onInstall(s));
                    this.message('Installing kiosk Application at '+res.result);
                    break;
                case 'admins_created':
                    this.message('Created accounts for '+res.result);
                    this.step = 5;
                    this.ask('registr');
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
        sendData():void{
            this.conn.post(JSON.stringify(this.data),this.service+'save_data').done((s)=>this.onRespond(s));
        }

    }

}