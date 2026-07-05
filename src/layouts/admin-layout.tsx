import { Briefcase, Building2, ChevronRight, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageSpinner } from "@/common/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/modules/auth/auth-context";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Businesses", path: "/admin/businesses", icon: Building2 },
  { name: "Jobs", path: "/admin/jobs", icon: Briefcase },
];

export default function AdminLayout() {
  const { admin, token, loading, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLoginPage) return;
    if (!token || !admin) navigate("/admin/login", { replace: true });
  }, [token, admin, loading, isLoginPage, navigate]);

  if (isLoginPage) return <Outlet />;
  if (loading) return <PageSpinner />;
  if (!token || !admin) return null;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      {/* ── Sidebar ── */}
      <aside
        className={`${
          isSidebarOpen ? "w-56 sm:w-64" : "w-16 sm:w-20"
        } h-dvh flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}
        style={{ background: "#111318" }}
      >
        {/* Logo + panel info — dark neutral header */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-center px-4 py-5 gap-2"
          style={{ background: "#0a0c10" }}
        >
          <img
            src="/images/home/SKLPS%20LOGO-04.svg"
            alt="SKLPS"
            style={{ height: isSidebarOpen ? 72 : 36, width: "auto" }}
            className="shrink-0 transition-all duration-300"
          />
          {isSidebarOpen && (
            <div className="text-center mt-0.5">
              <p className="font-extrabold text-[15px] tracking-tight text-white leading-tight">
                Admin Panel
              </p>
              <p className="text-[10px] tracking-[0.18em] uppercase mt-0.5" style={{ color: "#6b7280" }}>
                SKLPS Community
              </p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-5 px-2.5 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/admin/dashboard" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  !isSidebarOpen && "justify-center"
                }`}
                style={
                  isActive
                    ? {
                        background: "rgba(255,255,255,0.09)",
                        borderLeft: "3px solid rgba(255,255,255,0.5)",
                        paddingLeft: isSidebarOpen ? 9 : 9,
                      }
                    : { borderLeft: "3px solid transparent" }
                }
              >
                <item.icon
                  className="w-5 h-5 shrink-0"
                  style={{ color: isActive ? "#ffffff" : "#6b7280" }}
                />
                {isSidebarOpen && (
                  <>
                    <span
                      className="font-medium text-sm"
                      style={{ color: isActive ? "#ffffff" : "#9ca3af" }}
                    >
                      {item.name}
                    </span>
                    {isActive && (
                      <ChevronRight
                        className="w-3.5 h-3.5 ml-auto shrink-0"
                        style={{ color: "#9ca3af", opacity: 0.6 }}
                      />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div
          className="p-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "#08090c" }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start px-2 h-auto py-2 hover:bg-white/5 text-left"
              >
                <Avatar className="h-9 w-9 shrink-0 border-2 border-neutral-600">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      admin?.name || "Admin"
                    )}&background=1a1a2e&color=fff`}
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                {isSidebarOpen && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-semibold truncate text-white">
                      {admin?.name || "Admin"}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: "#6b7280" }}>
                      {admin?.email || "admin@sklps.com"}
                    </p>
                  </div>
                )}
                {isSidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto shrink-0" style={{ color: "#4b5563" }} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/")}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Visit Site</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden min-w-0">
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b bg-card px-4 shadow-sm sm:h-16 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="shrink-0 text-muted-foreground hover:bg-muted"
          >
            {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span className="truncate text-xs text-muted-foreground sm:text-sm">
              Welcome back,{" "}
              <span className="font-medium text-foreground">{admin?.name}</span>
            </span>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-auto bg-muted/30 p-4 sm:p-5 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
