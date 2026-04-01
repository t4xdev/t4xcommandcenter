import { useNavigate } from "react-router-dom";
import t4xLogo from "@/assets/t4x_logo.png";
import {
  LayoutDashboard, FileText, BarChart3, ShoppingCart, Wrench, Users, Ship, Settings, Shield,
  ChevronDown, Bell, User,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  breadcrumb?: string;
  rightContent?: React.ReactNode;
}

export default function TopNav({ breadcrumb = "User / Dashboard", rightContent }: TopNavProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Documents", icon: FileText,
      items: [
        { label: "Documents & Compliance", action: () => navigate("/") },
        { label: "Certificate Alerts", action: () => navigate("/") },
      ],
    },
    {
      label: "Reports", icon: BarChart3,
      items: [
        { label: "MIS Dashboard", action: () => navigate("/") },
        { label: "QHSE & Incidents", action: () => navigate("/") },
        { label: "Operations", action: () => navigate("/") },
      ],
    },
    {
      label: "Procurement", icon: ShoppingCart,
      items: [
        { label: "Procurement Overview", action: () => navigate("/") },
        { label: "Vendor Performance", action: () => navigate("/") },
      ],
    },
    {
      label: "PMS", icon: Wrench,
      items: [
        { label: "Maintenance & PMS", action: () => navigate("/") },
        { label: "Dry Dock", action: () => navigate("/") },
        { label: "Survey Planner", action: () => navigate("/") },
      ],
    },
    {
      label: "Crewing", icon: Users,
      items: [
        { label: "Payroll Management", action: () => navigate("/payroll") },
        { label: "Crew Dashboard", action: () => navigate("/payroll") },
      ],
    },
    {
      label: "Vessel", icon: Ship,
      items: [
        { label: "Fleet Overview", action: () => navigate("/") },
        { label: "IoT Sensors", action: () => navigate("/iot") },
        { label: "Emissions Tracker", action: () => navigate("/emissions") },
      ],
    },
    {
      label: "Admin", icon: Settings,
      items: [
        { label: "User Management", action: () => {} },
        { label: "Settings", action: () => {} },
      ],
    },
    {
      label: "SA", icon: Shield,
      items: [
        { label: "Users", action: () => navigate("/super-admin?tab=users") },
        { label: "Roles", action: () => navigate("/super-admin?tab=roles") },
        { label: "Vessels", action: () => navigate("/super-admin?tab=vessels") },
        { label: "Company", action: () => navigate("/super-admin?tab=company") },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center h-12 px-4">
        <div className="flex items-center mr-6 shrink-0 cursor-pointer" onClick={() => navigate("/")}>
          <img src={t4xLogo} alt="Twenty4X Logo" className="h-8 w-auto object-contain" />
        </div>

        <nav className="flex items-center gap-0.5 flex-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent rounded-md transition-colors outline-none"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          {menuItems.map((menu) => (
            <DropdownMenu key={menu.label}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent rounded-md transition-colors outline-none">
                  <menu.icon className="w-3.5 h-3.5" />
                  {menu.label}
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={4}>
                {menu.items.map((item) => (
                  <DropdownMenuItem key={item.label} onClick={item.action} className="text-xs cursor-pointer">
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {rightContent}
          <button className="relative p-1.5 rounded-md hover:bg-accent text-muted-foreground">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        </div>
      </div>

      <div className="px-4 py-1.5 border-t border-border bg-muted/30">
        <span className="text-[11px] text-muted-foreground">{breadcrumb}</span>
      </div>
    </header>
  );
}
