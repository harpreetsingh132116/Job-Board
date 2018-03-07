using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JobPortal.Areas.Employee.Controllers
{
    [Web.UserLogin]
    public class DashBoardController : Controller
    {
        // GET: Employee/DashBoard
        public ActionResult Index()
        {
            return View();
        }
    }
}