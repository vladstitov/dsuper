/**
 * Created by VladHome on 12/17/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='typing/underscore.d.ts' />
    ///<reference path="ListEditor.ts"/>
    ///<reference path="Utils.ts"/>
    ///<reference path="AddAccountSteps.ts"/>
    ///<reference path="InstallProcess.ts"/>
    ///<reference path="FinalResultCtr.ts"/>

module uplight{
    export class AddAccountCtr extends DisplayObject{

        constructor(public $view:JQuery){
            super($view,'AddAccount');
            this.init();
            console.log('Add Account');
        }

        private final:FinalResultCtr
        private steps:EditorForm[];
        private installProcess:InstallProcess;
        private admins:AdministratorsCtr;
        init():void{
            var ar:EditorForm[]=[];
            var ed:EditorForm =  new NamespaceCtr(this.$view.find('[data-ctr=NamespaceCtr]'),'NS','NamespaceCtr');
            ar.push(ed);
            ed.onBack =()=>{

            }
            ed.onComplete = ()=>{
                console.log('first step compolete');
                this.steps[0].hide();
                this.steps[1].show();
            }
            ed =  new ConfigurationCtr(this.$view.find('[data-ctr=ConfigurationCtr]'),'config','ConfigurationCtr');
            ed.onComplete = ()=>{
                console.log('second step compolete');
                this.steps[1].hide();
               this.admins.show();
            }
            ed.onBack =()=>{
                this.steps[0].show();
                this.steps[1].hide();
            }
            ar.push(ed);

            var admins:AdministratorsCtr =  new AdministratorsCtr(this.$view.find('[data-ctr=AdministratorsCtr]'),'admins','AdministratorsCtr');
            admins.onComplete = ()=>{
                console.log('third step compolete');

                this.admins.hide();
                if(!this.final)this.initFinal();
                this.final.show();
                var ar = this.steps;
                var out:UItem[]=[];

                for(var i=0,n=ar.length;i<n;i++){
                    out = out.concat(ar[i].getData());
                }

                var final:UFinal = new UFinal()
                final.admins = admins.getAdmins();;
                final.config = out;
                this.final.setData1(final);


            }
            admins.onBack =()=>{
                this.steps[1].show();
                this.admins.hide();
            }
           // ar.push(ed);
            this.admins = admins;
            this.steps = ar;
            for(var i=0,n=ar.length;i<n;i++){
                ar[i].onClose = ()=>{
                    this.onClose();
                };
            }

            //  this.steps[2].show();
            // this.$view.show();

        }
        initFinal():void{
            this.final =  new FinalResultCtr(this.$view.find('[data-ctr=FinalResultCtr]'),'FinalResultCtr');

            this.final.onClose = ()=>{
                this.onClose();
            }
            this.final.onBack =()=>{
               this.admins.show();
                this.final.hide();
            }

            this.final.onSave =()=>{
                var data:UFinal = this.final.getData();
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


                // console.log(JSON.stringify(data));
                this.installProcess.setData(data);
                this.final.hide();
                this.installProcess.show();
                this.installProcess.start();

            }
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
        goto(num:number):any{
            if(num == this.steps.length){
                if(!this.final)this.initFinal();
                this.final.show();
                return this.final;
            }else this.steps[num].show();
        }

        reset():AddAccountCtr{
            var ar = this.steps;
            for(var i=0,n=ar.length;i<n;i++){ ar[i].reset().hide(); }
            if(this.final)this.final.reset().hide();
            if(this.installProcess)this.installProcess.reset().hide();
            if(this.admins)this.admins.reset().hide();
            return this;
        }

    }


}