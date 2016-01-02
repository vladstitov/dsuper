<form data-ctr="NamespaceCtr" class="off">
    <div class="modal-header">
        <button type="button" class="close" data-id="btnClose">&times;</button>
        <h4 class="modal-title" data-id="title">Create Account</h4>
    </div>
    <div class="modal-body">
        <div class="form">
            <div class="form-group" data-id="namespace">
                <small> Namespace (ID) used in URL to idetify acoount on server.<br/>
                    example : <b>address1</b><br/>
                    Kiosk URL: <span data-id="server"></span>/<span class="namespace">address1</span>/Kiosk1080<br/>
                    Admin URL: <span data-id="server-admin"></span>/<span class="namespace">address1</span>/Admin<br/>
                </small>
                <label>Namespace: </label><span><small> Letters and numbers only </small>
                                <div class="off" data-id="message"></div>
                            </span>
                <input  type="text"  placeholder="ID is reqired"  pattern="[[a-zA-Z0-9-]+" maxlength="30" required class="form-control" data-id="namespace" />
            </div>
            <div class="form-group" data-id="name">
                <label>Name:</label>
                <input type="text" class="form-control" maxlength="50" data-id="account_name" />
            </div>
            <div class="form-group" data-id="description">
                <label>Descriptopn:</label>
                <input type="text" class="form-control" maxlength="150" data-id="description"  />
            </div>

        </div>
    </div>
    <div class="modal-footer">
        <button type="submit" class="btn btn-primary" data-id="btnSave">Next</button>
        <button type="button" class="btn btn-default" data-id="btnClose">Close</button>
    </div>
</form>