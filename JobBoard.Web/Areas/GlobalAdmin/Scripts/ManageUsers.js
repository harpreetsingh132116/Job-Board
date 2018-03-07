
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
        clearControls();
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
    var url = "/GlobalAdmin/ManageUsers/GetAllUsers";

    $("#dvToAcademyTeams").kendoGrid({
        toolbar: ["excel", "pdf"],
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
        excelExport: function (e) {
            e.workbook.fileName = "records.xlsx";
        }, pdf: {
            allPages: true
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
            },
            {
                title: "Delete",
                template: "<a onclick='DeleteUser(#=UserId#)' href='javascript:void(0);'>Delete</a>"
            }
        ],
        pageable: {
            pageSizes: [15, 50, 75, 100]
        }
    });
}


function DeleteUser(id) {
    $.ajax({
        url: "/GlobalAdmin/ManageUsers/DeleteUser?userid=" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result > 0) {
                if (result == 2) {
                    swal('User cannot delete, please delete the Job assigned to user.');
                } else if (result == 1) {
                    swal('User Deleted...!!!');
                    // clearControls();
                    BindUsersList();
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
    $('[id$=spCaption]').html('');
    $('[id$=spCaption]').html('Update User');
    $('input[name=chk_training]').each(function () {
        $(this).prop('checked', false);
    });

    $('input[name=chk_Roles]').each(function () {
        $(this).prop('checked', false);
    });

    $.ajax({
        url: "/GlobalAdmin/ManageUsers/GetUserById?Id=" + Id,
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



                $("#drpuserPosition").val(result.userPosition);
                if (result.isactive) {
                    $('[id$=ChkIsActive]').prop('checked', true);
                }

                $("#drpRegion").val(result.RegionId);
                //$("#checkboxtraning").val(result.ID);
                //$("#checkboxBindRolls").val(result.ID);


                result.MultipleTrainingAssignedCommaSeperated = result.MultipleTrainingAssignedCommaSeperated + ',';
                var trainings = result.MultipleTrainingAssignedCommaSeperated.split(',');

                $('input[name=chk_training]').each(function () {
                    if (jQuery.inArray($(this).attr('id'), trainings) !== -1) {
                        $(this).prop('checked', true);
                    }
                });


                result.MultipleRolesAssignedCommaSeperated = result.MultipleRolesAssignedCommaSeperated + ',';
                var roles = result.MultipleRolesAssignedCommaSeperated.split(',');

                $('input[name=chk_Roles]').each(function () {
                    if (jQuery.inArray($(this).attr('id'), roles) !== -1) {
                        $(this).prop('checked', true);
                    }
                });


                //.prop('checked', true);

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
    if (validateForm() == true) {
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


        if ($('input[name=chk_Roles]:checked').length > 0) {

        } else {
            alert('must select role');
            return;
        }

        if ($('input[name=chk_training]:checked').length > 0) {

        } else {
            alert('must select training');
            return;
        }

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
            multipleRoles: roles,
            multipleTrainings: trainings,
            userPosition: $("#drpuserPosition").val()
        };

        var json = JSON.stringify(model);

        $.ajax({
            url: "/GlobalAdmin/ManageUsers/InsertUpdateUser",
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
}


function BindRegions() {
    $.ajax({
        url: "/GlobalAdmin/RegionsMaster/GetAllRegions",
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
        url: "/GlobalAdmin/Trainings/GetAllTrainings",
        type: 'get',
        success: function (result) {
            if (result != false) {
                $('#checkboxtraning').empty();
                var content = '';
                $.each(result.Data, function (data1, value1) {
                    content += '<input type="checkbox" name="chk_training" ID="' + value1.ID + '">' + value1.Training + '</input>'
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
        url: "/SuperAdmin/UserRoles/GetAllUserRoles",
        type: 'get',
        success: function (result) {
            if (result != false) {
                $('#checkboxrolls').empty();
                var content = '';
                debugger
                $.each(result.Data, function (data1, item) {
                    content += '<input type="checkbox" name="chk_Roles" ID="' + item.ID + '">' + item.RoleName + '</input>'
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


function validateForm() {
    var result = true;

    if ($('[id$=drpRegion]').val().trim() == '0') {
        $('[id$=spdrpRegion]').css('display', 'block');
        result = false;
    } else {
        $('[id$=spdrpRegion]').css('display', 'none');
    }

    if ($('[id$=txtuser]').val().trim() == '') {
        $('[id$=sptxtuser]').css('display', 'block');
        result = false;
    } else {
        $('[id$=sptxtuser]').css('display', 'none');
    }

    if ($('[id$=txtfirst]').val().trim() == '') {
        $('[id$=sptxtfirst]').css('display', 'block');
        result = false;
    } else {
        $('[id$=sptxtfirst]').css('display', 'none');
    }

    if ($('[id$=txtlastName]').val().trim() == '') {
        $('[id$=sptxtlastName]').css('display', 'block');
        result = false;
    } else {
        $('[id$=sptxtlastName]').css('display', 'none');
    }

    if ($('[id$=txtEmailAddress]').val().trim() == '') {
        $('[id$=sptxtEmailAddress]').css('display', 'block');
        result = false;
    } else {
        $('[id$=sptxtEmailAddress]').css('display', 'none');
    }

    if ($('[id$=txtuserpassword]').val().trim() == '') {
        $('[id$=sptxtuserpassword]').css('display', 'block');
        result = false;
    } else {
        $('[id$=sptxtuserpassword]').css('display', 'none');
    }

    if ($('[id$=txtPhonenumber]').val().trim() == '') {
        $('[id$=sptxtPhonenumber]').css('display', 'block');
        result = false;
    } else {
        $('[id$=sptxtPhonenumber]').css('display', 'none');
    }


    if ($('input[name=chk_Roles]:checked').length > 0) {
        $('[id$=spcheckboxrolls]').css('display', 'none');
    } else {
        $('[id$=spcheckboxrolls]').css('display', 'block');
        result = false;
    }

    if ($('input[name=chk_training]:checked').length > 0) {
        $('[id$=spcheckboxtraning]').css('display', 'none');
    } else {
        $('[id$=spcheckboxtraning]').css('display', 'block');
        result = false;
    }


    if ($('[id$=drpuserPosition]').val() == '0') {
        $('[id$=spdrpuserPosition]').css('display', 'block');
        result = false;
    } else {
        $('[id$=spdrpuserPosition]').css('display', 'none');
    }

    return result;
}

function clearControls() {
    $('[id$=drpRegion]').val(0);
    $('[id$=txtuser]').val('');
    $('[id$=txtfirst]').val('');
    $('[id$=txtlastName]').val('');
    $('[id$=txtEmailAddress]').val('');
    $('[id$=txtuserpassword]').val('');
    $('[id$=txtPhonenumber]').val('');
    $('#checkboxtraning').find('input[type=checkbox]:checked').removeAttr('checked');
    $('#checkboxrolls').find('input[type=checkbox]:checked').removeAttr('checked');
    $('[id$=drpuserPosition]').val(0);

    $('[id$=spcheckboxtraning]').css('display', 'none');
    $('[id$=spcheckboxrolls]').css('display', 'none');
    $('[id$=sptxtPhonenumber]').css('display', 'none');
    $('[id$=sptxtuserpassword]').css('display', 'none');
    $('[id$=sptxtEmailAddress]').css('display', 'none');
    $('[id$=sptxtlastName]').css('display', 'none');
    $('[id$=sptxtfirst]').css('display', 'none');
    $('[id$=sptxtuser]').css('display', 'none');
    $('[id$=spdrpRegion]').css('display', 'none');
    $('[id$=spdrpuserPosition]').css('display', 'none');
}