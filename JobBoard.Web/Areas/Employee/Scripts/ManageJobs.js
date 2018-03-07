

$(document).ready(function () {
    BindRegions();
    BindTrainings();
    BindJobsList();
    $("#myModal").dialog({
        //bgiframe: true,
        autoOpen: false,
        height: 800,
        width: 500,
        modal: true,
        open: function () {
            jQuery('.ui-widget-overlay').bind('click', function () {
                jQuery('#myModal').dialog('close');
            })
        }
    });

    $('[id$=btnAddNew]').on('click', function () {
        $("#myModal").dialog('open');
    });
});

//bind Regions Dropdownlist
function BindRegions() {
    $.ajax({
        url: "/Employee/RegionsMaster/GetAllRegions",
        type: 'get',
        success: function (result) {
            if (result != false) {
                $.each(result.Data, function (data, value) {
                    $("#drpRegion").append($("<option></option>").val(value.Id).html(value.RegionName));
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
                $('#checkboxContainer').empty();
                var content = '';
               
                $.each(result.Data, function (data1, value1) {
                    content += '<input type="checkbox" name="' + value1.Training + '" id="' + value1.ID + '">' + value1.Training +'</input>'
                })
                $('#checkboxContainer').html(content);
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


    //var urlSource = '/SuperAdmin/ManageJobs/GetAllRegions';
    //$.ajax({
    //    url: urlSource,
    //    method: "GET",
    //    success: function (result) {
    //        debugger    
    //        $('#checkboxContainer').empty();
    //        var content;
    //        $.each(result, function (index, value) {
    //            content += '<input type="checkbox" name="' + value.RegionName + '" id="' + value.Id + '"/>'
    //        });
    //        $('#checkboxContainer').html(content);
    //    }
    //});
}


//Bind Academy Teams Grid
function BindJobsList() {
    var url = "/Employee/ManageJobs/GetAllJobs";

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
                field: "JobTitle",
                title: "JobTitle"
            },
            {
                field: "IsActive",
                title: "Is Active"
            },
            {
                field: "JobNumber",
                title: "Job Number"
            }
        ],
        pageable: {
            pageSizes: [15, 50, 75, 100]
        }
    });
}


function EditAcademyTeamById(Id) {
    $.ajax({
        url: "/Employee/ManageJobs/GetJobsById?Id=" + Id,
        type: 'get',
        success: function (result) {
            if (result != false) {
                $('[id$=hdnTrainingId]').val(result.ID);

                $('[id$=txtTraining]').val(result.Training);

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
    var trainings = [];
    $('#dvtraining input:checked').each(function () {
        trainings.push(this.id);
    });
    
   
    var model = {
        ID: $("#hdnTrainingId").val()
        , JobTitle: $('#txtJobTitle').val()
        , JobDescription: $('#txtJobDescription').val()
        , RegionId: $('#drpRegion').val()
        , Status: $('#drpStatus').val()
        , IsActive: $("#chkIsActive").attr("checked") ? 1 : 0
        , multipleTrainings: trainings
    };
    var json = JSON.stringify(model);
    alert(json);
    $.ajax({
        url: "/Employee/ManageJobs/InsertUpdateJobs",
        type: 'POST',
        data: json,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result > 0) {
                BindJobsList();
                swal('Good Job...!!!');

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