using JobPortal.BAL.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.RegionAdmin.Controllers
{
    [Web.UserLogin]
    [Web.RoleAuthorization]
    public class TrainingsController : Controller
    {
        // GET: RegionAdmin/Trainings


        private readonly BAL.Abstraction.IBALTrainings _balTrainings;

        public TrainingsController(BAL.Abstraction.IBALTrainings balTrainings)
        {
            _balTrainings = balTrainings;
        }


        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllTrainings()
        {
            var academyTeams = _balTrainings.GetAllTrainings();
            var gridModel = new DataSourceResult { Data = academyTeams, Total = academyTeams.Count };
            var jsonResult = Json(gridModel, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult GetTrainingsById(int Id)
        {
            var regionDetails = _balTrainings.GetTrainingsById(Id);

            var jsonResult = Json(regionDetails, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        public JsonResult InsertUpdateTrainings(Core.Entity.TrainingEntity model)
        {
            model.CreatedBy = 1;
            model.LastUpdatedBy = 1;

            int regionId = _balTrainings.InsertUpdate(model);
            var jsonResult = Json(regionId, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult DeleteTraining(int trainingId)
        {
            int result = _balTrainings.DeleteTraining(trainingId);
            var jsonResult = Json(result, JsonRequestBehavior.AllowGet);
            return jsonResult;
        }

    }
}