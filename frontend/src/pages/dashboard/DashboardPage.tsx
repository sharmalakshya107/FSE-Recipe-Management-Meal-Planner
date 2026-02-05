import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/store/authSlice";
import { useMealPlan } from "../../hooks/useMealPlan";
import { useInventory } from "../../hooks/useInventory";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../config/routes";

const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const { plan } = useMealPlan(
    startOfWeek.toISOString(),
    endOfWeek.toISOString(),
  );
  const { inventory } = useInventory();

  const todayStr = new Date().toISOString().split("T")[0];
  const todaysMeals =
    plan?.days.find((d) => d.date === todayStr)?.slots.length || 0;

  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  const expiredCount = inventory.filter(
    (i) => i.expiryDate && new Date(i.expiryDate) < now,
  ).length;
  const expiringSoonCount = inventory.filter((i) => {
    if (!i.expiryDate) return false;
    const d = new Date(i.expiryDate);
    return d >= now && d <= threeDaysFromNow;
  }).length;

  const stats = [
    {
      label: "Active Plan",
      value: plan ? "Active" : "None",
      color: "border-indigo-100",
      subtext: "Current Week",
    },
    {
      label: "Stock Items",
      value: inventory.length,
      color:
        expiredCount > 0
          ? "border-rose-200 bg-rose-50/30"
          : expiringSoonCount > 0
            ? "border-amber-200 bg-amber-50/30"
            : "border-emerald-100 bg-emerald-50/30",
      subtext:
        expiredCount > 0
          ? `${expiredCount} Items Expired!`
          : expiringSoonCount > 0
            ? `${expiringSoonCount} Expiring Soon`
            : "All Stock Fresh",
    },
    {
      label: "Today's Meals",
      value: todaysMeals,
      color: "border-indigo-50",
      subtext: "Planned Today",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back,{" "}
            <span className="text-indigo-600">{user?.firstName}</span>
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-500 font-medium">
              Overview of your recipes and meal plans.
            </p>
            {user?.household && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {user.household.name} Hub
                </span>
                <div className="w-1 h-1 bg-indigo-300 rounded-full" />
                <span className="text-[10px] font-bold">
                  {user.household.members?.length || 1} Members
                </span>
              </div>
            )}
          </div>
        </div>
        <Link to={ROUTES.DASHBOARD + "/meal-planner"}>
          <button className="btn-primary flex items-center gap-2">
            Plan Next Meal
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-6 bg-white rounded-2xl border ${stat.color} shadow-sm`}
          >
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
              {stat.label}
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {stat.value}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              {stat.subtext}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-gray-900">
              Upcoming Schedule
            </h2>
            <Link
              to="/meal-planner"
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              View Full Calendar
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm">
            {plan?.days.slice(0, 3).map((day) => (
              <div
                key={day.date}
                className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[40px]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      {day.dayOfWeek.slice(0, 3)}
                    </p>
                    <p className="text-lg font-bold text-gray-900 leading-none">
                      {day.date.split("-")[2]}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-gray-100" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {day.slots.length > 0
                        ? `${day.slots.length} Meals Planned`
                        : "No plans"}
                    </p>
                  </div>
                </div>
                <button className="text-gray-300">
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 px-1">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Browse Recipes",
                path: "/recipes",
              },
              {
                label: "Inventory Management",
                path: "/inventory",
              },
              {
                label: "View Nutrition",
                path: "/nutrition",
              },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="block w-full p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700 text-sm">
                    {action.label}
                  </span>
                  <ArrowRight size={16} className="text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
