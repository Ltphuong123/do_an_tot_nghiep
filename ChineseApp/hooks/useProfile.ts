import { changeLanguage, editProfile, getMe } from "@/services/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMe = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: Record<string, any>) => editProfile(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useChangeLanguage = () => {
  return useMutation({
    mutationFn: (langCode: string) => changeLanguage(langCode),
  });
};
