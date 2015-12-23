/**
 * Created by VladHome on 12/17/2015.
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
            if(this.isCancel) return;
            console.log(s);
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
            if(this.isCancel) return;
            console.log(s);
            // if(this.wait){
            //  this.setData(s);
            //return;
            //  }
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
            this._message='';
            this.message('Sending requast to server');
            this.ask('start_create');
        }

        reset():void{
            this.$message.html('');
        }

        ask(str:string):void{
            this.conn.get(this.service+str).done((s)=>this.onRespond(s));
        }
        sendData():void{
            this.conn.post(JSON.stringify(this.data),this.service+'save_data').done((s)=>this.onRespond(s));
        }

    }




    export class FinalResultCtr extends DisplayObject{
        constructor($view:JQuery,name?:string){
            super($view,name);
            this.conn = new Connector();
            this.initButtons()
        }
        initButtons():void{
            this.$view.find('[data-id=btnClose]').click(()=>this.onClose());
            this.$view.find('[data-id=btnSave]').click(()=>this.onSave());
            this.$view.find('[data-id=btnBack]').click(()=>{this.onBack()});

            //this.$message = this.$view.find('[data-id=message]');
        }

        conn:Connector;

        onSave():void{

        }
        onClose():void{  console.log('onClose '+this.id); }
        onBack():void{  console.log('onBack '+this.id);  }
        onComplete():void{  console.log('onComplete '+this.id); }


        data:UItem[];
        server:VOResult;
        isVisuble:boolean;

        private onServer(s:string):void{
            var res:VOResult = JSON.parse(s);
            if(res.success) this.server = res;
            else alert('Server Communication error.');
            this.render();
        }
        setData(data:UItem[]):FinalResultCtr{
            this.data = data;
           this.conn.get('account.server_url').done((s)=>this.onServer(s));
            return this;
        }
        getData():UItem[]{
            return this.data;
        }

        render():void{
            var server:string = this.server.success;
            var adminurl = this.server.result;
            var v:JQuery = this.$view;
            var admins:string[] =[];
            var ar = this.data
                console.log(ar);
            var namespace:string
            var url:string;
            for(var i=0,n=ar.length;i<n;i++){
                var item:UItem  = ar[i];
                switch (item.index){
                    case 'admin-name':
                        admins.push(item.value);
                        break;
                    case 'namespace':
                        namespace = item.value;
                        url = 'http://'+server+'/<span class="namespace">'+namespace+'</span>/';
                        v.find('[data-id=namespace]').children().last().text(namespace);
                        break;
                    case 'mobile':
                        if(item.value)v.find('[data-id=mobile]').show().children().last().html(url+'KioskMobile.php');;
                        break;
                    case 'kiosk1080':
                        if(item.value) v.find('[data-id=kiosk1080]').show().children().last().html(url+'Kiosk1080.php');
                        break;
                    case 'kiosk1920':
                        if(item.value)v.find('[data-id=kiosk1920]').show().children().last().html(url+'Kiosk1920.php');
                        break;

                    default:
                        v.find('[data-id='+ar[i].index+']').children().last().text(item.value);
                        break
                }
            }


            v.find('[data-id=admin-url]').children().last().html('<small>'+adminurl+'/<span class="namespace">'+namespace+'</span>/'+'Admin.php'+'</small>');
            v.find('[data-id=admins]').children().last().text(admins.join(' , '));


        }


    }
    export class AddAccount extends DisplayObject{

        constructor(public $view:JQuery){
            super($view,'AddAccount');
            this.init();
            console.log('Add Account');
        }

        private final:FinalResultCtr
        private steps:EditorForm[];
        private installProcess:InstallProcess;
        init():void{
            var ar:EditorForm[]=[];
            var ed:EditorForm =  new NamespaceCtr(this.$view.find('[data-ctr=NamespaceCtr]'),{});
            ar.push(ed);
            ed.onBack =()=>{

            }
            ed.onComplete = ()=>{
                console.log('first step compolete');
                this.steps[0].hide();
                this.steps[1].show();
            }
            ed =  new ConfigurationCtr(this.$view.find('[data-ctr=ConfigurationCtr]'),{});
            ed.onComplete = ()=>{
                console.log('second step compolete');
                this.steps[1].hide();
                this.steps[2].show();
            }
            ed.onBack =()=>{
                this.steps[0].show();
                this.steps[1].hide();
            }
            ar.push(ed);
            ed =  new AdministratorsCtr(this.$view.find('[data-ctr=AdministratorsCtr]'),{});
            ed.onComplete = ()=>{
                console.log('third step compolete');
                this.steps[2].hide();
                this.final.show();
                var ar = this.steps;

                var out:UItem[]=[];
                for(var i=0,n=ar.length;i<n;i++){
                    out = out.concat(ar[i].getData());
                }
                this.final.setData(out);

            }
            ed.onBack =()=>{
                this.steps[1].show();
                this.steps[2].hide();
            }
            ar.push(ed);

            this.final =  new FinalResultCtr(this.$view.find('[data-ctr=FinalResultCtr]'));

            this.final.onClose = ()=>{
                this.onClose();
            }
            this.final.onBack =()=>{
                this.steps[2].show();
                this.final.hide();
            }

            this.final.onSave =()=>{
                if(!this.installProcess){
                    this.installProcess =  new InstallProcess(this.$view.find('[data-ctr=InstallProcess]:first'),'Installprocess');
                    this.installProcess.onComplete = (res)=>{
                        console.log('InstallProcess complete');
                        this.onComplete();

                    };
                    this.installProcess.onClose = ()=>{
                        this.onClose();
                    }
                }

                var data:UItem[] = this.final.getData();
               // console.log(JSON.stringify(data));
                this.installProcess.setData(data);
                this.final.hide();
                this.installProcess.show();
                this.installProcess.start();

            }


            this.steps = ar;
            for(var i=0,n=ar.length;i<n;i++){
                ar[i].onClose = ()=>{
                    this.onClose();
                };
            }

            //  this.steps[2].show();
            // this.$view.show();

        }


        onClose():void{
            console.log(' on close ',this);
        }

        onBack(editor):void{
            var i:number = this.steps.indexOf(editor);
            console.log(i);
        }

        onComplete():void{

        }

        onDataReady():void{
            console.log('data ready');
        }
        start():void{
            this.steps[0].show();
        }
        goto(num:number):void{
            if(num == this.steps.length){
                this.final.setData(this.getData());
                this.final.show();
            }else this.steps[num].show();
        }

        reset():AddAccount{
            var ar = this.steps;
            for(var i=0,n=ar.length;i<n;i++){ ar[i].reset().hide(); }
            this.final.hide();
            if(this.installProcess)this.installProcess.hide();
            return this;
        }

    }


}