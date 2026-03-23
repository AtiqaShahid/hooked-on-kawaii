import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Palette, Gift, CreditCard,
  Star, Image, BookOpen, Sparkles, Settings, Layers, MessageSquare, BarChart3, Scissors, GraduationCap, Award, Vote
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Customers", url: "/admin/customers", icon: Users },
];

const specialOrders = [
  { title: "Custom Crochet", url: "/admin/custom-orders", icon: Scissors },
  { title: "Gift Orders", url: "/admin/gift-orders", icon: Gift },
  { title: "Subscriptions", url: "/admin/subscriptions", icon: CreditCard },
];

const contentNav = [
  { title: "Reviews", url: "/admin/reviews", icon: Star },
  { title: "Gallery", url: "/admin/gallery", icon: Image },
  { title: "Collections", url: "/admin/collections", icon: Layers },
  { title: "Craft Stories", url: "/admin/stories", icon: BookOpen },
  { title: "Community", url: "/admin/community", icon: MessageSquare },
  { title: "Learn Crochet", url: "/admin/learning", icon: GraduationCap },
  { title: "Design Votes", url: "/admin/design-votes", icon: Vote },
];

const toolsNav = [
  { title: "Loyalty", url: "/admin/loyalty", icon: Award },
  { title: "AI Insights", url: "/admin/ai-insights", icon: Sparkles },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const renderGroup = (label: string, items: typeof mainNav) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-primary/10"
                  activeClassName="bg-primary/20 text-primary-foreground font-semibold"
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarContent className="py-2">
        {renderGroup("Main", mainNav)}
        {renderGroup("Special Orders", specialOrders)}
        {renderGroup("Content", contentNav)}
        {renderGroup("Tools & Reports", toolsNav)}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
