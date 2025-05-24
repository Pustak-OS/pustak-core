import { Link } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupAction,
} from "../ui/sidebar";
import { PlugIcon, Plus } from "lucide-react";

export function PluginsSidebar() {
  const pluginsList = [
    {
      title: "Plugins",
      url: "/plugins",
      icon: PlugIcon,
    },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plugins</SidebarGroupLabel>
      <SidebarGroupAction
        className="cursor-pointer"
        onClick={() => {
          console.log("clicked");
        }}
      >
        <Plus />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {pluginsList.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
