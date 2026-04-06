import { useNavigate, useLocation } from "react-router-dom";
import t4xLogo from "@/assets/t4x_logo.png";
import {
  LayoutDashboard, FileText, BarChart3, ShoppingCart, Wrench, Users, Ship, Settings, Shield,
  ChevronDown, User, LogOut, UserCog, Anchor, ChevronUp, Radio,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useFleet } from "@/contexts/FleetContext";
import { fleets } from "@/data/maritimeData";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { selectedFleet, setSelectedFleet } = useFleet();

  const menuGroups = [
    {
      label: "Documents", icon: FileText,
      items: [
        { label: "Documents & Compliance", path: "/" },
        { label: "Certificate Alerts", path: "/" },
      ],
    },
    {
      label: "Reports", icon: BarChart3,
      items: [
        { label: "MIS Dashboard", path: "/" },
        { label: "QHSE & Incidents", path: "/" },
        { label: "Operations", path: "/" },
      ],
    },
    {
      label: "Procurement", icon: ShoppingCart,
      items: [
        { label: "Procurement Overview", path: "/" },
        { label: "Vendor Performance", path: "/" },
      ],
    },
    {
      label: "PMS", icon: Wrench,
      items: [
        { label: "Maintenance & PMS", path: "/" },
        { label: "Dry Dock", path: "/" },
        { label: "Survey Planner", path: "/" },
      ],
    },
    {
      label: "Crewing", icon: Users,
      items: [
        { label: "Payroll Management", path: "/payroll" },
        { label: "Crew Dashboard", path: "/payroll" },
      ],
    },
    {
      label: "Vessel", icon: Ship,
      items: [
        { label: "Fleet Overview", path: "/" },
        { label: "IoT Sensors", path: "/iot" },
        { label: "Emissions Tracker", path: "/emissions" },
      ],
    },
    {
      label: "Admin", icon: Settings,
      items: [
        { label: "User Management", path: "/" },
        { label: "Settings", path: "/" },
      ],
    },
    {
      label: "Super Admin", icon: Shield,
      items: [
        { label: "Company", path: "/super-admin/company" },
        { label: "Vessels", path: "/super-admin/vessels" },
        { label: "Roles", path: "/super-admin/roles" },
        { label: "Users", path: "/super-admin/users" },
      ],
    },
  ];

  const isActiveGroup = (items: { path: string }[]) =>
    items.some((item) => location.pathname.startsWith(item.path) && item.path !== "/") ||
    (location.pathname === "/" && items.some((item) => item.path === "/"));

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border group/sidebar-wrapper"
      onMouseEnter={() => { if (state === "collapsed") toggleSidebar(); }}
      onMouseLeave={() => { if (state === "expanded") toggleSidebar(); }}
    >
      <SidebarHeader className="p-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={t4xLogo} alt="Twenty4X" className="h-8 w-8 object-contain shrink-0" />
          {!collapsed && (
            <span className="text-sm font-semibold text-foreground truncate">Twenty4X</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        {/* Dashboard - standalone item */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/")}
              isActive={location.pathname === "/"}
              tooltip="Dashboard"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/command-center")}
              isActive={location.pathname === "/command-center"}
              tooltip="Command Center"
            >
              <Radio className="h-4 w-4 shrink-0" />
              <span>Command Center</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="my-1" />

        {/* Menu groups */}
        {menuGroups.map((group) => (
          collapsed ? (
            <SidebarMenu key={group.label}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={group.label}
                  isActive={isActiveGroup(group.items)}
                  onClick={() => navigate(group.items[0].path)}
                >
                  <group.icon className="h-4 w-4 shrink-0" />
                  <span>{group.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : (
            <Collapsible
              key={group.label}
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarGroup className="p-0">
                <SidebarGroupLabel asChild className="px-2 py-1.5">
                  <CollapsibleTrigger className="flex w-full items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <group.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton
                            onClick={() => navigate(item.path)}
                            isActive={isActivePath(item.path)}
                            size="sm"
                            className="pl-8 text-xs"
                          >
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent transition-colors outline-none">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-medium text-foreground truncate">Admin User</p>
                    <p className="text-[10px] text-muted-foreground truncate">{selectedFleet}</p>
                  </div>
                  <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel className="text-xs font-normal">
              <div>
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@twenty4x.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs cursor-pointer gap-2">
              <UserCog className="h-3.5 w-3.5" />
              Update Profile
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs cursor-pointer gap-2">
                <Anchor className="h-3.5 w-3.5" />
                Fleet: {selectedFleet}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={selectedFleet} onValueChange={(v) => setSelectedFleet(v as any)}>
                  {fleets.map((f) => (
                    <DropdownMenuRadioItem key={f} value={f} className="text-xs cursor-pointer">
                      {f}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem className="text-xs cursor-pointer gap-2">
              <Ship className="h-3.5 w-3.5" />
              Manage Fleet
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs cursor-pointer gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
