import { useQuery } from "@tanstack/react-query";
import { userProfileService } from "../api/services/userProfile";
import type { UserProfile } from "../api/types/user.types";

export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ["user"],
    queryFn: () => userProfileService.get(),
  });
}
