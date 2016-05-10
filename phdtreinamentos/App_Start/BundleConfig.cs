using System.Web;
using System.Web.Optimization;

namespace phdtreinamentos.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles (BundleCollection bundle)
        {
            bundle.Add(new StyleBundle("~/css/bootstrap").Include("~/Content/bootstrap.css"));
            bundle.Add(new ScriptBundle("~/js/bootstrap").Include("~/Scripts/bootstrap.js"));
            bundle.Add(new ScriptBundle("~/js/jquery").Include("~/Scripts/jquery-1.9.1.js"));
            bundle.Add(new ScriptBundle("/js/knockoutjs").Include("~/Scripts/knockout-{vertion}.js", "~/Scripts/knockout.validation.min.js"));
        }
    }
}