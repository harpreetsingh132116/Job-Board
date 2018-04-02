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
    public class RegionsMasterController : Controller
    {

        private readonly BAL.Abstraction.IBALRegions _balRegions;

        public RegionsMasterController(BAL.Abstraction.IBALRegions balRegions)
        {
            _balRegions = balRegions;
        }

        public JsonResult GetAllRegions()
        {
            if (Session["RegionId"] != null)
            {
                int regionId = Convert.ToInt32(Session["RegionId"]);
                var academyTeams = _balRegions.GetAllRegions().Where(r => r.Id == regionId);
                var gridModel = academyTeams;
                var jsonResult = Json(gridModel, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            else
            {
                var academyTeams = _balRegions.GetAllRegions();
                var gridModel = new DataSourceResult { Data = academyTeams, Total = academyTeams.Count };
                var jsonResult = Json(gridModel, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
        }


        // GET: RegionAdmin/RegionsMaster
        public ActionResult Index()
        {
            return View();
        }
    }
}