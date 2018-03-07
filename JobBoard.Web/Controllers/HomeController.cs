using JobPortal.BAL.Abstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace JobPortal.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly IBALRegions _IBALRegions;
        #region Fields


        #endregion


        // private readonly IBALRegions _IBALRegions;
        private readonly IBALUsers _IBALUsers;


        public HomeController(IBALRegions IBALRegions, IBALUsers IBALUsers)
        {
            _IBALRegions = IBALRegions;
            _IBALUsers = IBALUsers;
        }


        public ActionResult Index()
        {
            //var result = _firstServices.GetRecords();
            var model = new JobPortal.Web.Models.LoginViewModel();
            BindRegions(model);
            return View(model);
        }

        private void BindRegions(JobPortal.Web.Models.LoginViewModel model)
        {
            var getRegions = _IBALRegions.GetAllRegions();
            model.RegionsList.Add(new SelectListItem { Text = "Select Region", Value = "0" });
            if (getRegions.Count > 0)
            {
                foreach (var academy in getRegions)
                {
                    model.RegionsList.Add(new SelectListItem { Text = academy.RegionName, Value = academy.Id.ToString() });
                }
            }
        }

        [HttpPost]
        public ActionResult Index(JobPortal.Web.Models.LoginViewModel model)
        {
            if (model.Region == "Select Region" || model.Region == "0")
            {
                ModelState.AddModelError("regionNotSelected", "Please Select the Region");
            }
            if (ModelState.IsValid)
            {
                var userEntity = new JobPortal.Core.Entity.UsersEntity()
                {
                    userName = model.UserName,
                    UserPassword = model.Password,
                    RegionId = Convert.ToInt32(model.Region)
                };

                var userdata = _IBALUsers.Login(userEntity);
                if (userdata != null)
                {
                    FormsAuthentication.SetAuthCookie(model.UserName, false);
                    Session["UserId"] = Convert.ToString(userdata.UserId);
                    Session["UserFullName"] = Convert.ToString(userdata.FirstName) + " " + Convert.ToString(userdata.lastName);
                    Session["UserRoles"] = userdata.MultipleRolesAssignedCommaSeperated;
                    Session["RegionId"] = model.Region;

                    //store the data somewhere
                    if (userdata.MultipleRolesAssignedCommaSeperated.Contains("2"))
                    {
                        return RedirectToAction("Index", "DashBoard", new { area = "GlobalAdmin" });
                    }
                    else if (userdata.MultipleRolesAssignedCommaSeperated.Contains("3"))
                    {
                        return RedirectToAction("Index", "DashBoard", new { area = "RegionAdmin" });
                    }
                    else if (userdata.MultipleRolesAssignedCommaSeperated.Contains("5"))
                    {
                        return RedirectToAction("Index", "DashBoard", new { area = "Employee" });
                    }
                    else if (userdata.MultipleRolesAssignedCommaSeperated.Contains("1"))
                    {
                        return RedirectToAction("Index", "DashBoard", new { area = "SuperAdmin" });
                    }
                    return RedirectToAction("Index", "DashBoard", new { area = "Employee" });

                }
                else
                {
                    BindRegions(model);
                    ModelState.AddModelError("loginfailed", "login Credentials not matched or wrong region selected.");
                    return View(model);
                }
            }
            else
            {
                BindRegions(model);
                return View(model);
            }
        }


        public ActionResult Logout()
        {
            if (Session["UserId"] != null)
            {
                FormsAuthentication.SignOut();
                Session.Abandon();
                return RedirectToAction("Index", "Home");
            }
            else
            {
                Session.Abandon();
                return RedirectToAction("Index", "Home");
            }
        }

        public ActionResult testing()
        {
            return View();
        }
    }
}