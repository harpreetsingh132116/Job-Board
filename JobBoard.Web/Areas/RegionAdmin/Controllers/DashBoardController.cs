using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.RegionAdmin.Controllers
{
    public class DashBoardController : Controller
    {
        // GET: RegionAdmin/DashBoard
        public ActionResult Index()
        {
            return View();
        }
    }
}