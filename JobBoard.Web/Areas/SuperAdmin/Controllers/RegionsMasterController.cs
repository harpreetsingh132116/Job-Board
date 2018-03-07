using JobPortal.BAL.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.SuperAdmin.Controllers
{
    public class RegionsMasterController : Controller
    {
        private readonly BAL.Abstraction.IBALRegions _balRegions;

        public RegionsMasterController(BAL.Abstraction.IBALRegions balRegions)
        {
            _balRegions = balRegions;
        }

        // GET: SuperAdmin/RegionsMaster
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllRegions()
        {
            var academyTeams = _balRegions.GetAllRegions();
            var gridModel = new DataSourceResult { Data = academyTeams, Total = academyTeams.Count };
            var jsonResult = Json(gridModel, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult GetRegionById(int Id)
        {
            var regionDetails = _balRegions.GetRegionById(Id);

            var jsonResult = Json(regionDetails, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        public JsonResult InsertUpdateRegion(Core.Entity.RegionsEntity model)
        {
            int regionId = _balRegions.InsertUpdate(model);

            var jsonResult = Json(regionId, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }


     
        public JsonResult DeleteRegion(int RegionID)
        {
            int result = _balRegions.DeleteRegionId(RegionID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}