"use client";

import { AlertTriangle, Briefcase, Building2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api, { API_ENDPOINTS } from "@/lib/api";

interface Stats {
  totalBusinesses: number;
  pendingBusinesses: number;
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    pendingBusinesses: 0,
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pendingBizRes, approvedBizRes, jobStatsRes] = await Promise.all([
          api.get<unknown[]>(API_ENDPOINTS.ADMIN_PENDING),
          api.get<unknown[]>(API_ENDPOINTS.BUSINESS_LIST),
          api.get<{ total: number; active: number; closed: number }>(API_ENDPOINTS.JOB_STATS_SUMMARY),
        ]);

        const approvedArr = Array.isArray(approvedBizRes.data) ? approvedBizRes.data : [];
        const pendingArr = Array.isArray(pendingBizRes.data) ? pendingBizRes.data : [];
        const jobStats = jobStatsRes.data ?? { total: 0, active: 0, closed: 0 };

        setStats({
          totalBusinesses: approvedArr.length + pendingArr.length,
          pendingBusinesses: pendingArr.length,
          totalJobs: jobStats.total,
          activeJobs: jobStats.active,
          closedJobs: jobStats.closed,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Building2,
      desc: "Registered businesses",
    },
    {
      title: "Pending Businesses",
      value: stats.pendingBusinesses,
      icon: AlertTriangle,
      desc: "Requires approval",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      desc: "All job listings",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: TrendingUp,
      desc: "Accepting applications",
    },
    {
      title: "Closed Jobs",
      value: stats.closedJobs,
      icon: Briefcase,
      desc: "No longer active",
    },
  ];

  const gradients = [
    "from-primary to-primary/90",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-green-600",
    "from-violet-500 to-purple-600",
    "from-teal-500 to-cyan-600",
  ];
  const iconBgs = ["bg-primary/10", "bg-amber-100", "bg-emerald-100", "bg-purple-100", "bg-teal-100"];
  const iconColors = [
    "text-primary",
    "text-amber-600",
    "text-emerald-600",
    "text-purple-600",
    "text-teal-600",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Detailed statistics about platform activity.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat, i) => (
          <Card
            key={stat.title}
            className="shadow-md hover:shadow-lg transition-shadow rounded-xl border-0 overflow-hidden"
          >
            <div className={`h-1.5 bg-gradient-to-r ${gradients[i % gradients.length]}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2.5 rounded-lg ${iconBgs[i % iconBgs.length]}`}>
                <stat.icon className={`h-4 w-4 ${iconColors[i % iconColors.length]}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm border-2 border-dashed rounded-lg">
              Activity Log Coming Soon
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>API Status</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Database</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Email Service</span>
                <span className="text-green-600 font-medium">Resend</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
