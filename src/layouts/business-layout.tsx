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
      <aside
        className={`${
          isSidebarOpen ? "w-56 sm:w-64" : "w-16 sm:w-20"
        } h-dvh flex-shrink-0 bg-neutral-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 bg-neutral-950">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center w-full"}`}>
            <img src="/images/home/SKLPS%20LOGO-04.svg" alt="SKLPS" className="h-9 w-auto shrink-0" />
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-tight text-white">Business Portal</span>
            )}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/business-dashboard" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-neutral-800 text-white shadow-md"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                } ${!isSidebarOpen && "justify-center"}`}
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 bg-neutral-950">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-start px-2 hover:bg-neutral-900 h-auto py-2"
              >
                <Avatar className="h-9 w-9 border-2 border-neutral-700">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(business?.businessName || "B")}&background=171717&color=fff`}
                  />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                {isSidebarOpen && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium truncate text-white">
                      {business?.businessName || "Business"}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{business?.email || ""}</p>
                  </div>
                )}
                {isSidebarOpen && <ChevronRight className="w-4 h-4 text-neutral-500 ml-auto" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
              <DropdownMenuLabel>My Business</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/")}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Visit Site</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

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
              Welcome back, {business?.name || business?.businessName}
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
