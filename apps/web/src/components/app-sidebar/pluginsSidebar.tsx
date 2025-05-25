import { Link } from "react-router-dom";
import { useUserEnabledPlugins } from "../../hooks/usePlugins";
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
  const { data: plugins, isLoading } = useUserEnabledPlugins();

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
          {isLoading ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <span>Loading...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : plugins?.length ? (
            plugins.map((plugin) => (
              <SidebarMenuItem key={plugin.id}>
                <SidebarMenuButton asChild>
                  <Link to={`/plugins/${plugin.id}`}>
                    <PlugIcon />
                    <span>{plugin.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <span>No plugins enabled</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
