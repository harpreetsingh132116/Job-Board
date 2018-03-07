using JobPortal.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.SuperAdmin.Controllers
{
    [UserLogin]
    [RoleAuthorization]
    public class DashboardController : Controller
    {
        // GET: SuperAdmin/Dashboard
        public ActionResult Index()
        {
            return View();
        }
    }
}