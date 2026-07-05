import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { PageSpinner } from "@/common/spinner";
import AdminLayout from "@/layouts/admin-layout";
import BusinessLayout from "@/layouts/business-layout";
import MainLayout from "@/layouts/main-layout";

const HomePage = lazy(() => import("@/modules/home/home-page"));
const DirectoryPage = lazy(() => import("@/modules/directory/directory-page"));
const BusinessDetailPage = lazy(() => import("@/modules/business/business-detail-page"));
const AddBusinessPage = lazy(() => import("@/modules/business/add-business-page"));
const BusinessLoginPage = lazy(() => import("@/modules/business/business-login-page"));
const JobsPage = lazy(() => import("@/modules/jobs/jobs-page"));
const JobDetailPage = lazy(() => import("@/modules/jobs/job-detail-page"));

const AdminLoginPage = lazy(() => import("@/modules/admin/admin-login-page"));
const AdminDashboardPage = lazy(() => import("@/modules/admin/admin-dashboard-page"));
const AdminBusinessesPage = lazy(() => import("@/modules/admin/admin-businesses-page"));
const AdminJobsPage = lazy(() => import("@/modules/admin/admin-jobs-page"));

const BusinessDashboardPage = lazy(() => import("@/modules/business-dashboard/dashboard-page"));
const BusinessDashboardJobsPage = lazy(
  () => import("@/modules/business-dashboard/dashboard-jobs-page")
);
const PostJobPage = lazy(() => import("@/modules/business-dashboard/post-job-page"));
const BusinessJobDetailPage = lazy(() => import("@/modules/business-dashboard/job-detail-page"));

const wrap = (el: JSX.Element) => <Suspense fallback={<PageSpinner />}>{el}</Suspense>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: wrap(<HomePage />) },
      { path: "directory", element: wrap(<DirectoryPage />) },
      { path: "directory/:id", element: wrap(<BusinessDetailPage />) },
      { path: "add-business", element: wrap(<AddBusinessPage />) },
      { path: "jobs", element: wrap(<JobsPage />) },
      { path: "jobs/:id", element: wrap(<JobDetailPage />) },
    ],
  },
  { path: "/business-login", element: wrap(<BusinessLoginPage />) },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "login", element: wrap(<AdminLoginPage />) },
      { path: "dashboard", element: wrap(<AdminDashboardPage />) },
      { path: "businesses", element: wrap(<AdminBusinessesPage />) },
      { path: "jobs", element: wrap(<AdminJobsPage />) },
    ],
  },
  {
    path: "/business-dashboard",
    element: <BusinessLayout />,
    children: [
      { index: true, element: wrap(<BusinessDashboardPage />) },
      { path: "jobs", element: wrap(<BusinessDashboardJobsPage />) },
      { path: "jobs/post", element: wrap(<PostJobPage />) },
      { path: "jobs/:id", element: wrap(<BusinessJobDetailPage />) },
    ],
  },
]);
