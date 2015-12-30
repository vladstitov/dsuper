<section data-ctr="AccountEditCtr" class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <section data-id="edit-account">
                <div class="modal-header">
                    <button type="button" class="close" data-id="btnClose">&times;</button>
                    <h4 class="modal-title" data-id="title">Edit Account</h4>
                </div>
                <div class="modal-body">
                    <div class="form">
                        <div class="form-group">
                            <label>ID:</label> <!--<label class="btn"> <div class="fa fa-edit"> </div>Edit</label>-->
                            <input type="text" class="form-control" readonly  data-id="id" />
                        </div>
                        <div class="form-group">
                            <label>Name:</label>
                            <input  type="text"  placeholder="name is reqired"  class="form-control"  data-id="name" />
                        </div>

                        <div class="form-group" >
                            <label>Descriptopn:</label>
                            <input type="text" class="form-control" data-id="description" />
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-id="btnSave">Save</button>
                    <button type="button" class="btn btn-default" data-id="btnClose">Close</button>
                </div>
            </section>
        </div>
    </div>
</section>