import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Bell } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumb?: string;
  rightContent?: React.ReactNode;
}

export default function AppLayout({ children, breadcrumb, rightContent }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar with trigger + breadcrumb + actions */}
          <header className="sticky top-0 z-40 h-11 flex items-center justify-between border-b border-border bg-card px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-7 w-7" />
              {breadcrumb && (
                <span className="text-[11px] text-muted-foreground">{breadcrumb}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {rightContent}
              <button className="relative p-1.5 rounded-md hover:bg-accent text-muted-foreground">
                <Bell className="w-4 h-4" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-destructive rounded-full" />
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
