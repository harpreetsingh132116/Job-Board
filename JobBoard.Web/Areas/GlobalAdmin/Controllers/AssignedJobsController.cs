using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.GlobalAdmin.Controllers
{
    [Web.UserLogin]
    public class AssignedJobsController : Controller
    {
        // GET: GlobalAdmin/AssignedJobs
        private readonly BAL.Abstraction.IBALJobTimeEmpMapping _iBALJobTimeEmpMapping;

        public AssignedJobsController(BAL.Abstraction.IBALJobTimeEmpMapping iBALJobTimeEmpMapping)
        {
            this._iBALJobTimeEmpMapping = iBALJobTimeEmpMapping;
        }

        // GET: Employee/AssignedJobs
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAssignedJobbyUserId()
        {
            if (Session["UserId"] != null)
            {
                var gridModel = _iBALJobTimeEmpMapping.GetAssignedJobByUserId(Convert.ToInt32(Session["UserId"]));
                var jsonResult = Json(gridModel, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            return null;
        }
    }
}