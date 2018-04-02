using JobPortal.BAL.Abstraction;
using JobPortal.BAL.Common;
using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.RegionAdmin.Controllers
{
    [Web.UserLogin]
    [Web.RoleAuthorization]
    public class ManageUsersController : Controller
    {
        private readonly BAL.Abstraction.IBALUsers _bALUsers;
        private readonly BAL.Abstraction.IBALTrainings _bALTraining;
        private readonly BAL.Abstraction.IBALRegions _bALRegions;

        public ManageUsersController(BAL.Abstraction.IBALUsers bALUsers, IBALTrainings ibALTraining, IBALRegions IBALRegions)
        {   
            _bALUsers = bALUsers;
            _bALTraining = ibALTraining;
            _bALRegions = IBALRegions;
        }

        // GET: RegionAdmin/ManageUsers
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAllUsersByRegionID()
        {
            if (Session["RegionId"] != null)
            {
                int regionId = Convert.ToInt32(Session["RegionId"]);
                var academyTeams = _bALUsers.GetALLUsersWithALLDataByRegionId(regionId);
                var gridModel = new DataSourceResult { Data = academyTeams, Total = academyTeams.Count };
                var jsonResult = Json(gridModel, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            else
            {
                return null;
            }
        }
        public JsonResult GetAllUsers()
        {
            var academyTeams = _bALUsers.GetAllUsersBelowRoleId(3);
            var gridModel = new DataSourceResult { Data = academyTeams, Total = academyTeams.Count };
            var jsonResult = Json(gridModel, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        public JsonResult InsertUpdateUser(Core.Entity.UsersEntity model)
        {

            string multipleTraining = string.Empty;
            foreach (var item in model.multipleTrainings)
            {
                multipleTraining += item + ",";
            }
            model.MultipleTrainingAssignedCommaSeperated = multipleTraining;

            string multipleRoles = string.Empty;
            foreach (var item in model.multipleRoles)
            {
                multipleRoles += item + ",";
            }
            model.MultipleRolesAssignedCommaSeperated = multipleRoles;

            int regionId = _bALUsers.InsertUpdate(model);
            var jsonResult = Json(regionId, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult GetUserById(int Id)
        {
            var userDetails = _bALUsers.GetUserById(Id);

            var jsonResult = Json(userDetails, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult DeleteUser(int userid)
        {
            int result = _bALUsers.DeleteUser(userid);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult UploadExcel(HttpPostedFileBase FileUpload)
        {
            List<string> data = new List<string>();
            if (FileUpload != null)
            {
                // tdata.ExecuteCommand("truncate table OtherCompanyAssets");  
                //if (FileUpload.ContentType == "application/vnd.ms-excel" || FileUpload.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                //{


                string filename = FileUpload.FileName;
                if (!Directory.Exists(Server.MapPath("~/Doc/")))
                {
                    // Try to create the directory.
                    DirectoryInfo di = Directory.CreateDirectory(Server.MapPath("~/Doc/"));
                }
                string targetpath = Server.MapPath("~/Doc/");
                FileUpload.SaveAs(targetpath + filename);
                string pathToExcelFile = targetpath + filename;
                // var connectionString = "";
                //if (filename.EndsWith(".xls"))
                //{
                //    connectionString = string.Format("Provider=Microsoft.Jet.OLEDB.4.0; data source={0}; Extended Properties=Excel 8.0;", pathToExcelFile);
                //}
                //else if (filename.EndsWith(".xlsx"))
                //{
                //    connectionString = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0 Xml;HDR=YES;IMEX=1\";", pathToExcelFile);
                //}

                //var adapter = new OleDbDataAdapter("SELECT * FROM [Sheet1$]", connectionString);
                //var ds = new DataSet();

                //adapter.Fill(ds, "ExcelTable");

                //DataTable dtable = ds.Tables["ExcelTable"];

                DataTable dtable = GetDataTabletFromCSVFile(pathToExcelFile);

                //  string sheetName = "Sheet1";

                //var excelFile = new ExcelQueryFactory(pathToExcelFile);
                //var artistAlbums = from a in excelFile.Worksheet<JobPortal.Core.Entity.JobEntity>(sheetName) select a;

                foreach (DataRow dr in dtable.Rows)
                {
                    JobPortal.Core.Entity.UsersEntity userEntity = new Core.Entity.UsersEntity();

                    string region = Convert.ToString(dr["Region Name"]);
                    if (!string.IsNullOrEmpty(region))
                    {
                        var regiondetail = _bALRegions.GetRegionByName(region);
                        if (regiondetail != null)
                        {
                            userEntity.RegionId = regiondetail.Id;
                        }
                    }

                    string training = Convert.ToString(dr["TrainingName"]);
                    string multipletrainings = string.Empty;
                    foreach (string item in training.Split(','))
                    {
                        if (!string.IsNullOrEmpty(item))
                        {
                            var trainingdetail = _bALTraining.GetTrainingsByName(item);
                            if (trainingdetail != null)
                            {
                                multipletrainings += trainingdetail.ID + ",";
                            }
                        }
                    }




                    userEntity.MultipleTrainingAssignedCommaSeperated = multipletrainings.TrimEnd(',');
                    userEntity.FirstName = dr["FirstName"].ToString();
                    userEntity.lastName = dr["lastName"].ToString();

                    userEntity.EmailAddress = dr["EmailAddress"].ToString();
                    userEntity.PhoneNumber = dr["PhoneNumber"].ToString();
                    userEntity.userName = dr["userName"].ToString();
                    userEntity.UserPassword = dr["UserPassword"].ToString();
                    userEntity.userPosition = dr["userPosition"].ToString();

                    userEntity.MultipleRolesAssignedCommaSeperated = "5";

                    _bALUsers.InsertUpdate(userEntity);
                }
                //deleting excel file from folder  
                if ((System.IO.File.Exists(pathToExcelFile)))
                {
                    System.IO.File.Delete(pathToExcelFile);
                }
                return RedirectToAction("index");
            }
            else
            {
                //alert message for invalid file format  
                data.Add("<ul>");
                data.Add("<li>Only Excel file format is allowed</li>");
                data.Add("</ul>");
                data.ToArray();
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            //}
            //else
            //{
            //    data.Add("<ul>");
            //    if (FileUpload == null) data.Add("<li>Please choose Excel file</li>");
            //    data.Add("</ul>");
            //    data.ToArray();
            //    return Json(data, JsonRequestBehavior.AllowGet);
            //}

        }

        private static DataTable GetDataTabletFromCSVFile(string csv_file_path)
        {
            DataTable csvData = new DataTable();
            try
            {
                using (TextFieldParser csvReader = new TextFieldParser(csv_file_path))
                {
                    csvReader.SetDelimiters(new string[] { "," });
                    csvReader.HasFieldsEnclosedInQuotes = true;
                    string[] colFields = csvReader.ReadFields();
                    foreach (string column in colFields)
                    {
                        DataColumn datecolumn = new DataColumn(column);
                        datecolumn.AllowDBNull = true;
                        csvData.Columns.Add(datecolumn);
                    }
                    while (!csvReader.EndOfData)
                    {
                        string[] fieldData = csvReader.ReadFields();
                        //Making empty value as null
                        for (int i = 0; i < fieldData.Length; i++)
                        {
                            if (fieldData[i] == "")
                            {
                                fieldData[i] = null;
                            }
                        }
                        csvData.Rows.Add(fieldData);
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            return csvData;
        }
    }
}