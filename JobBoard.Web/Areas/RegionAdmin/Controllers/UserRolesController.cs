using JobPortal.BAL.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.RegionAdmin.Controllers
{
    public class UserRolesController : Controller
    {
        // GET: RegionAdmin/UserRoles
        private readonly BAL.Abstraction.IBALUserRoles _bALUserRoles;

        public UserRolesController(BAL.Abstraction.IBALUserRoles bALUserRoles)
        {


            _bALUserRoles = bALUserRoles;
        }

        // GET: SuperAdmin/UserRoles
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllUserRoles()
        {
            var academyTeams = _bALUserRoles.GetAllUserRoles().Where(i => i.ID > 3).ToList();
            var gridModel = new DataSourceResult { Data = academyTeams, Total = academyTeams.Count };
            var jsonResult = Json(gridModel, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult GetUserRoleById(int Id)
        {
            var userRoleDetails = _bALUserRoles.GetUserRoleById(Id);

            var jsonResult = Json(userRoleDetails, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        [HttpPost]
        public JsonResult InsertUpdateUserRole(Core.Entity.UserRolesEntity model)
        {
            int userRoleId = _bALUserRoles.InsertUpdateUserRoles(model);

            var jsonResult = Json(userRoleId, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
    }
}