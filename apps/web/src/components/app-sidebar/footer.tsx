import { useState } from "react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { signOut } from "supertokens-auth-react/recipe/session";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Root, Image, Fallback } from "@radix-ui/react-avatar";

export default function AppSidebarFooter() {
  const [signingOut, setSigningOut] = useState(false);
  const { data: user, isLoading: isLoadingProfile } = useUserProfile();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      window.location.href = "/auth";
    } catch (error) {
      console.error(error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={signingOut}>
              <SidebarMenuButton>
                {isLoadingProfile ? (
                  <User2 className="h-5 w-5" />
                ) : (
                  <Root className="flex h-5 w-5 items-center justify-center text-center">
                    <Image src={user?.profilePic} alt={user?.name} />
                    <Fallback className="bg-primary text-primary-foreground h-5 w-5 rounded-full">
                      {user?.name?.charAt(0)}
                    </Fallback>
                  </Root>
                )}
                <span className="ml-2">
                  {signingOut
                    ? "Signing out..."
                    : isLoadingProfile
                    ? "Loading..."
                    : user?.name || "User"}
                </span>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem onClick={handleSignOut} disabled={signingOut}>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
