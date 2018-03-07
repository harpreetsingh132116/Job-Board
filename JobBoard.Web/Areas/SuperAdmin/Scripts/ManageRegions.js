

$(document).ready(function () {

    BindRegionsList();
    $("#myModal").dialog({
        bgiframe: true,
        autoOpen: false,
        height: 500,
        width: 500,
        modal: true,
        open: function () {
            jQuery('.ui-widget-overlay').bind('click', function () {
                jQuery('#myModal').dialog('close');
            })
        }
    });

    $('[id$=btnAddNew]').on('click', function () {
        clearControls();
        $('[id$=txtRegionShortName]').attr('readonly', false);
        $("#myModal").dialog('open');
    });
});

//Bind Academy Teams Grid
function BindRegionsList() {
    var url = "/SuperAdmin/RegionsMaster/GetAllRegions";

    $("#dvToAcademyTeams").kendoGrid({
        dataSource: {
            autoBind: false,
            transport: {
                read: url
            },
            schema: {
                data: "Data",
                total: "Total",
                errors: "Errors",
                model: {
                    fields: {
                        OrgRule: { type: "string" }
                    }
                }
            },
            pageSize: 15,
            serverPaging: false,
        },
        pageable: {
            pageSize: 15,
            info: true,
            refresh: false
        },
        columnMenu: true,
        onetouch: true,
        sortable: true,
        scrollable: true,
        filterable: {
            extra: false
        },
        columns: [
            {
                field: "RegionName",
                title: "Region Name"
            }, {
                field: "RegionShortName",
                title: "Region Short Name"
            },
            {
                field: "IsActive",
                title: "Is Active"
            },
            {
                title: "Edit",
                template: "<a onclick='EditAcademyTeamById(#=Id#)' href='javascript:void(0);'>Edit</a>"
            },
            {
                title: "Delete",
                template: "<a onclick='DeleteRegions(#=Id#)' href='javascript:void(0);'>Delete</a>"
            }
        ],
        pageable: {
            pageSizes: [15, 50, 75, 100]
        }
    });
}


function DeleteRegions(id) {
    $.ajax({
        url: "/SuperAdmin/RegionsMaster/DeleteRegion?RegionID=" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result > 0) {
                if (result == 2) {
                    swal('Region cannot delete, please delete the Job/user assigned to region.');
                } else if (result == 1) {
                    swal('Region Deleted...!!!');
                    clearControls();
                    BindRegionsList();
                    $("#myModal").dialog('close');
                }
            }
            else {
                alert("Some error occured. Please try again.");
            }
        },
        failure: function (result) {
            swal(result.responseText);
        },
        error: function (result) {
            swal(result.responseText);
        }
    });
}

function EditAcademyTeamById(Id) {
    clearControls();
    $('[id$=txtRegionShortName]').attr('readonly', true);

    $.ajax({
        url: "/SuperAdmin/RegionsMaster/GetRegionById?Id=" + Id,
        type: 'get',
        success: function (result) {
            if (result != false) {
                $('[id$=hdnRegionId]').val(result.Id);

                $('[id$=txtRegion]').val(result.RegionName);

                $('[id$=txtRegionShortName]').val(result.RegionShortName);

                $("#myModal").dialog('open');
            }
            else {
                alert("Some error occured. Please try again.");
            }
        },
        failure: function (result) {
            swal(result.responseText);
        },
        error: function (result) {
            swal(result.responseText);
        }

    });

}


function UpdateAcademyTeamById() {
    if (validate()) {

        var model = { Id: $("#hdnRegionId").val(), RegionName: $('#txtRegion').val(), RegionShortName: $('[id$=txtRegionShortName]').val() };
        var json = JSON.stringify(model);

        $.ajax({
            url: "/SuperAdmin/RegionsMaster/InsertUpdateRegion",
            type: 'POST',
            data: json,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result > 0) {
                    if (result == 09090) {
                        swal('Region Short name already taken, choose another!!!');
                    } else {
                        swal('Good Job...!!!');
                        clearControls();
                        BindRegionsList();
                        $("#myModal").dialog('close');
                    }
                }
                else {
                    alert("Some error occured. Please try again.");
                }
            },
            failure: function (result) {
                swal(result.responseText);
            },
            error: function (result) {
                swal(result.responseText);
            }
        });
    }
}

function validate() {
    var result = true;

    if ($('[id$=txtRegion]').val().trim() == '') {
        $('[id$=sptxtRegion]').css('display', 'block');
        result = false;
    } else {
        $('[id$=sptxtRegion]').css('display', 'none');
    }
    if ($('[id$=txtRegionShortName]').val().trim() == '') {
        $('[id$=sptxtRegionShortName]').css('display', 'block');
        result = false;
    } else {
        $('[id$=sptxtRegionShortName]').css('display', 'none');
    }


    return result;
}

function clearControls() {
    $('[id$=txtRegionShortName]').val('');
    $('[id$=txtRegion]').val('');
    $('[id$=hdnRegionId]').val('0');

    $('[id$=sptxtRegionShortName]').css('display', 'none');
    $('[id$=sptxtRegion]').css('display', 'none');
}