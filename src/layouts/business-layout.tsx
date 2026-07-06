import { Briefcase, Building2, ChevronRight, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageSpinner } from "@/common/spinner";
import { Logo } from "@/components/logo";
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
import { useBusinessAuth } from "@/modules/auth/business-auth-context";

const navItems = [
  { name: "Dashboard", path: "/business-dashboard", icon: LayoutDashboard },
  { name: "Jobs", path: "/business-dashboard/jobs", icon: Briefcase },
];

export default function BusinessLayout() {
  const { business, loading, logout } = useBusinessAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!business) navigate("/business-login", { replace: true });
  }, [business, loading, navigate]);

  if (loading) return <PageSpinner />;
  if (!business) return null;

  const handleLogout = () => {
    logout();
    navigate("/business-login");
  };

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      {/* ── Sidebar ── */}
      <aside
        className={`${
          isSidebarOpen ? "w-56 sm:w-64" : "w-16 sm:w-20"
        } h-dvh flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}
        style={{ background: "#0f1117" }}
      >
        {/* Logo + portal info — coral/red brand gradient header */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-center px-4 py-5 gap-2"
          style={{ background: "linear-gradient(150deg, #FF385C 0%, #FC642D 100%)" }}
        >
          <Logo
            variant="dark"
            layout="column"
            iconSize={isSidebarOpen ? 72 : 36}
            showTagline={false}
            linkTo={false}
            className="drop-shadow-md transition-all duration-300"
          />
          {isSidebarOpen && (
            <div className="text-center mt-0.5">
              <p className="font-extrabold text-[15px] tracking-tight text-white leading-tight">
                Business Portal
              </p>
              <p className="text-[10px] text-white/65 tracking-[0.18em] uppercase mt-0.5">
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
              (item.path !== "/business-dashboard" && pathname.startsWith(item.path));
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
                        background: "rgba(255,56,92,0.15)",
                        borderLeft: "3px solid #FF385C",
                        paddingLeft: isSidebarOpen ? 9 : 9,
                      }
                    : { borderLeft: "3px solid transparent" }
                }
              >
                <item.icon
                  className="w-5 h-5 shrink-0"
                  style={{ color: isActive ? "#FF385C" : "#6b7280" }}
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
                        style={{ color: "#FF385C", opacity: 0.6 }}
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
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "#080b10" }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start px-2 h-auto py-2 hover:bg-white/5 text-left"
              >
                <Avatar className="h-9 w-9 shrink-0 border-2" style={{ borderColor: "#FF385C" }}>
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      business?.businessName || "B"
                    )}&background=FF385C&color=fff`}
                  />
                  <AvatarFallback style={{ background: "#FF385C", color: "#fff" }}>
                    B
                  </AvatarFallback>
                </Avatar>
                {isSidebarOpen && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-semibold truncate text-white">
                      {business?.businessName || "Business"}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: "#6b7280" }}>
                      {business?.email || ""}
                    </p>
                  </div>
                )}
                {isSidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto shrink-0" style={{ color: "#4b5563" }} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
              <DropdownMenuLabel>My Business</DropdownMenuLabel>
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
              <span className="font-medium text-foreground">
                {business?.name || business?.businessName}
              </span>
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
