using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.GlobalAdmin.Controllers
{
    [Web.UserLogin]
    [Web.RoleAuthorization]
    public class DashBoardController : Controller
    {
        // GET: GlobalAdmin/DashBoard
        public ActionResult Index()
        {
            return View();
        }
    }
}