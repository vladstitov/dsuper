/**
 * Created by VladHome on 12/13/2015.
 */
    ///<reference path='typing/jquery.d.ts' />
    ///<reference path='Utils.ts' />

module uplight{
    export class Controller{
        private current:string;
        constructor(){
            var conn:Connector = new Connector()
            $('#btnLogout').click(()=>{
                conn.post({credentials:'logout'},'login').done((s:string)=>{
                    var res:VOResult = JSON.parse(s);
                    if(res.success)window.location.reload();
                });
            });
            this.router();
        }

        router(){
            var hash:string= window.location.hash;
            var ar:string[] = hash.split('.');
            var page:string = ar[0];
            if(page==this.current) return;
            console.log('page  '+page);
            switch (page){
                case '#Login':
                    $('#Content').load(('htms/Login.html'));
                    break;
                default:
                    $('#Content').load(('htms/Accounts.php'),()=> {

                    });

                    break
            }
        }


    }
}

