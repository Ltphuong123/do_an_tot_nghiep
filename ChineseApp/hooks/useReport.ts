import { createAppeal, getAppeals, getviolations } from "@/services/report";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useViolations = () => {
  return useQuery({
    queryKey: ["violations"],
    queryFn: async () => {
      const res = await getviolations();
      return res.data;
    },
  });
};

export const useAppeals = () => {
  return useQuery({
    queryKey: ["appeals"],
    queryFn: async () => {
      const res = await getAppeals();
      return res.data;
    },
  });
};

export const useCreateAppeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      violationId,
      reason,
    }: {
      violationId: string;
      reason: string;
    }) => createAppeal(violationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
    },
  });
};
