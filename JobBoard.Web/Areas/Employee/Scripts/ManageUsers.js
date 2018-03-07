
$(document).ready(function () {

    BindUsersList();
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
        $('[id$=spCaption]').html('');
        $('[id$=spCaption]').html('Insert User');
        $('[id$=hdnuserId]').val(0);
        $("#myModal").dialog("option", "title", "Insert User").dialog('open');
    });

    BindRegions();
    BindTrainings();
    BindRolls();
});

//Bind Academy Teams Grid
function BindUsersList() {
    var url = "/Employee/ManageUsers/GetAllUsers";

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
                field: "userName",
                title: "UserName"
            },
            {
                field: "isactive",
                title: "Is Active"
            },
            {
                title: "Edit",
                template: "<a onclick='EditAcademyTeamById(#=UserId#)' href='javascript:void(0);'>Edit</a>"
            }
        ],
        pageable: {
            pageSizes: [15, 50, 75, 100]
        }
    });
}


function EditAcademyTeamById(Id) {
    $('[id$=spCaption]').html('');
    $('[id$=spCaption]').html('Update User');
    $.ajax({
        url: "/Employee/ManageUsers/GetUserById?Id=" + Id,
        type: 'get',
        success: function (result) {
            if (result != false) {
                $('[id$=hdnuserId]').val(result.UserId);
                $('[id$=txtuser]').val(result.userName);
                $('[id$=txtfirst]').val(result.FirstName);
                $('[id$=txtlastName]').val(result.lastName);
                $('[id$=txtEmailAddress]').val(result.EmailAddress);
                $('[id$=txtPhonenumber]').val(result.PhoneNumber);
                $('[id$=txtuserpassword]').val(result.UserPassword);

                if (result.isactive)
                {
                    $('[id$=ChkIsActive]').prop('checked', true);
                }

                $("#drpRegion").val(result.RegionId);
                $("#checkboxtraning").val(result.ID);
                $("#checkboxBindRolls").val(result.ID);
               
                $("#myModal").dialog("option", "title", "Update User").dialog('open');
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
 
    let isactive = $("#ChkIsActive").is(":checked");
    
    let userid = $("#hdnuserId").val();
    var trainings = [];
    $('#checkboxtraning input:checked').each(function () {
        trainings.push(this.id);
    });


    var roles = [];
    $('#checkboxrolls input:checked').each(function () {
        roles.push(this.id);
    });

    alert(roles);
    var model = {
        UserId: userid,
        isactive: $("#ChkIsActive").is(":checked"),
        FirstName: $("#txtfirst").val(),        
        lastName: $("#txtlastName").val(),
        EmailAddress: $("#txtEmailAddress").val(),
        PhoneNumber: $("#txtPhonenumber").val(),
        userName: $("#txtuser").val(),
        UserPassword: $("#txtuserpassword").val(),
        RegionId: $("#drpRegion").val(),
        multipleRoles : roles,
        multipleTrainings : trainings
    };

    var json = JSON.stringify(model);

    $.ajax({
        url: "/Employee/ManageUsers/InsertUpdateUser",
        type: 'POST',
        data: json,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result > 0) {
                swal('Good Job...!!!');
                BindUsersList();
                $("#myModal").dialog('close');
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


function BindRegions() {
    $.ajax({
        url: "/Employee/RegionsMaster/GetAllRegions",
        type: 'get',
        success: function (result) {
            if (result.Data != null) {

                $.each(result.Data, function (index, item) {
                    $("#drpRegion").append($("<option></option>").val(item.Id).html(item.RegionName));
                })
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



function BindTrainings() {
    $.ajax({
        url: "/Employee/Trainings/GetAllTrainings",
        type: 'get',
        success: function (result) {
            if (result != false) {
                $('#checkboxtraning').empty();
                var content = '';
                $.each(result.Data, function (data1, value1) {
                    content += '<input type="checkbox" name="' + value1.Training + '" ID="' + value1.ID + '">' + value1.Training + '</input>'
                })
                $('#checkboxtraning').html(content);
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

function BindRolls() {
    $.ajax({
        url: "/Employee/UserRoles/GetAllUserRoles",
        type: 'get',
        success: function (result) {
            if (result != false) {
                $('#checkboxrolls').empty();
                var content = '';
                debugger
                $.each(result.Data, function (data1, item) {
                    content += '<input type="checkbox" name="' + item.RoleName + '" ID="' + item.ID + '">' + item.RoleName + '</input>'
                })
                $('#checkboxrolls').html(content);
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


