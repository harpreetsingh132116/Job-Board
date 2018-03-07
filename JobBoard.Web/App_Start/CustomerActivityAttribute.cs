using System.Web;
using System.Web.Mvc;

namespace JobPortal.Web
{
    public class UserLogin : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext == null || filterContext.HttpContext == null || filterContext.HttpContext.Request == null)
                return;

            HttpContext ctx = HttpContext.Current;
            if (HttpContext.Current.Session["UserId"] == null)
            {
                filterContext.Result = new RedirectResult("/");
                return;
            }

            base.OnActionExecuting(filterContext);
        }
    }



    public class RoleAuthorization : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext == null || filterContext.HttpContext == null || filterContext.HttpContext.Request == null)
                return;

            HttpContext ctx = HttpContext.Current;
            if (HttpContext.Current.Session["UserRoles"] == null)
            {
                filterContext.Result = new RedirectResult("/");
                return;
            }
            else
            {
                //hit to DB to verify this user has access to the section he is trying to access


            }

            base.OnActionExecuting(filterContext);
        }
    }
}