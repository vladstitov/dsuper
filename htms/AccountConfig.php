<form  class="off" data-ctr="ConfigurationCtr">

    <div class="modal-header">
        <button type="button" class="close" data-id="btnClose">&times;</button>
        <h4 class="modal-title" data-id="title">Configuration included</h4>
    </div>

    <div class="modal-body">
        <div class="form-inline">
            <div data-id="message">
                &nbsp;
            </div>
            <div class="form-group" data-id="mobile">
                <input type="checkbox" class="form-control" disabled="disabled" checked data-id="KioskMobile" />
                <label>Mobile </label><small> Mobile website (Part of standard package)</small>
            </div>
            <br/>
            <div class="form-group" data-id="kiosk1080">
                <input  type="checkbox"   class="form-control" checked disabled="disabled" data-id="Kiosk1080"/>
                <label >Kiosks 1080x1920</label> <small> Kiosk portrait application (Part of standard package)</small>
            </div>
            <div class="form-group" data-id="kiosk1920">
                <input  type="checkbox"   class="form-control" disabled="disabled" checked data-id="Kiosk1920" />
                <label >Kiosks 1920x1080</label> <small> Kiosk landscape application (Part of standard package)</small>
            </div>
        </div>
    </div>
    <br/>
    <br/>
    <br/>
    <br/>
    <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-id="btnBack">Back</button>
        <button type="button" class="btn btn-primary" data-id="btnSave">Next</button>
        <button type="button" class="btn btn-default" data-id="btnClose">Close</button>
    </div>
</form>