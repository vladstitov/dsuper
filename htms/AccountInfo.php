<section data-ctr="AccountInfo" class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-id="btnClose">&times;</button>
                <h4 class="modal-title" data-id="title">Account Info</h4>
            </div>
            <div class="modal-body">
                <div class="form">
                    <div class="form-group">
                        <label>Name:</label>
                        <div type="text" class="form-control" data-id="name" ></div>
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <div type="text" class="form-control" data-id="description" ></div>
                    </div>
                    <div class="form-group">
                        <label>Mobile URL:</label>
                        <a type="text" target="_blank"  class="form-control" data-id="mobile" ></a>
                    </div>
                    <div class="form-group">
                        <label>Kiosks:</label>
                        <div data-id="kiosks" class="list-group" >

                        </div>

                    </div>
                    <div data-id="admin">
                        <div class="form-group" >
                            <label>Administrator URL:</label>
                            <a class="form-control"  target="_blank" data-id="admin-url" ></a>
                        </div>
                        <div class="form-group">
                            <label>Administrator(s)</label>
                            <table class="table" data-id="admins" >

                            </table>
                        </div>
                    </div>

                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-id="btnClose">Close</button>
            </div>

        </div>
    </div>
</section>