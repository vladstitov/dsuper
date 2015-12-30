<section id="Accounts">
    <style>
        #Accounts .form-inline input{
            min-width: 25px;
        }
        #Accounts .off{
            display: none;
        }

         #Accounts .namespace{
             color:crimson;
         }

    </style>
    <section data-id="list_view" class="container">
        <div class="row">
            <h3>Accounts <small> You are currently have <span data-id="num_records"></span> accounts</small></h3>
        </div>
        <div class="row">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <a  data-id="btnAdd" class="btn" title="Add new Account" ><div class="fa fa-plus"></div> Add </a>
                    <a  data-id="btnEdit" class="btn" title="Edit selected account" > <div class="fa fa-bolt"></div> Edit</a>
                    <a  data-id="btnDelete" class="btn" title="Delete selected Account" > <div class="fa fa-minus"></div> Delete</a>
                </div>
                <div class="panel-body">
                    <div>
                        <p>You have  accounts</p>
                    </div>
                        <table class="table">
                            <thead data-id="list-header">
                            </thead>
                            <tbody data-id="list">

                            </tbody>
                        </table>

                </div>
            </div>
        </div>
    </section>

    <!-- /////////////////////////////////////////////////////////-->

    <? include('AccountEdit.php'); ?>
    <!-- /////////////////////////////////////////////////////////-->
    <? include('AccountInfo.php'); ?>
    <!-- /////////////////////////////////////////////////////////-->

    <section data-ctr="AddAccount" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <!--//////////////////////////////////////////////////////////-->
                <? include('NameSpaceCreate.php'); ?>
                <!--//////////////////////////////////////////////////////////-->
                <? include('AccountConfig.php'); ?>
                <!--//////////////////////////////////////////////////////////-->
                <? include('AccountAdmins.php'); ?>
                <!--//////////////////////////////////////////////////////////-->
                <? include('FinalResult.php'); ?>
                <!--//////////////////////////////////////////////////////////-->
                <? include('InstallProcess.php'); ?>
                <!--//////////////////////////////////////////////////////////-->
            </div>
        </div>
    </section>


    <section data-id="delete-view" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-id="btnClose">&times;</button>
                    <h4 class="modal-title" data-id="edit_header">Delete</h4>
                </div>
                <div class="modal-body">
                        <p data-id="message">You want to delete selected record?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-id="btnSave">Delete</button>
                    <button type="button" class="btn btn-default" data-id="btnClose">Cancel</button>
                </div>
            </div>
        </div>
    </section>
    <script>
      require(['ListEditor'],function(){
         require(['AccountEditCtr','FinalResultCtr','InstallProcess','AccountInfo','Accounts','AddAccountCtr','AddAccountSteps'],function(){
           var acc= new uplight.Accounts($('#Accounts'),{service_id:'account'});
            });
        })

    </script>

</section>