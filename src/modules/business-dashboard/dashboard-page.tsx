import { Briefcase, Eye, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusinessAuth } from "@/modules/auth/business-auth-context";
import { businessDashboardService, type DashboardStats } from "./business-dashboard.service";

const DEFAULT_STATS: DashboardStats = { totalJobs: 0, activeJobs: 0, totalApplications: 0 };

export default function BusinessDashboardPage() {
  const { business } = useBusinessAuth();
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    businessDashboardService
      .getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: "Total Jobs Posted", value: stats.totalJobs, icon: Briefcase, color: "text-primary" },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: Eye,
      color: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {business?.businessName}!</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {statCards.map((card) => (
            <Card key={card.title} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
