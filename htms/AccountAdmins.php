
<form id="AdministratorsCtr" class="off" data-ctr="AdministratorsCtr" method="post">
    <div class="modal-header">
        <button type="button" class="close" data-id="btnClose">&times;</button>
        <h4 class="modal-title" data-id="title">Kiosk Administrator Accounts</h4>
    </div>
    <div class="modal-body">
        <div class="form">
            <h5>At list one administrator required to login into kiosk content management system (CMS) </h5>
            <div data-id="admin-item" class="admin-item">
                <button type="button" class="close" data-id="btnRemove">&times;</button>
                <hr/>
                <div class="form-group" data-id="email">
                    <label>Email</label>
                    <div class="pull-right">
                        <input  type="checkbox"   checked  data-id="sendemail"/><small> Send Email notification with username and password to owner</small>
                    </div>
                    <input type="email" class="form-control" maxlength="100" data-id="email"  />
                </div>
                <div class="form-group" data-id="adminname">
                    <label>Name:</label>
                    <input type="text" class="form-control"  data-id="name"  />
                </div>
                <div class="form-group" data-id="username">
                    <label>Username </label><small> Letters and numbers only </small>
                    <input type="text" class="form-control" placeholder="* Required" required  maxlength="50" pattern="[[a-zA-Z0-9-.]+" data-id="username" />
                </div>
                <div class="form-group" data-id="pass">
                    <label>Password </label> <small> Letters and numbers only </small>
                    <input type="text"  class="form-control" placeholder="* Required" required maxlength="50" pattern="[[a-zA-Z0-9-.]+"  data-id="password"/>
                </div>
            </div>
            <a class="btn" data-id="btnAddAdmin">
                <span class="fa fa-plus"></span><span> Add another administrator</span>
            </a>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-id="btnBack">Back</button>
        <button type="submit" class="btn btn-primary" data-id="btnSave">Next</button>
        <button type="button" class="btn btn-default" data-id="btnClose">Close</button>
    </div>
</form>