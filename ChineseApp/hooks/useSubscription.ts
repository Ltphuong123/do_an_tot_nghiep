import {
  buySubscription,
  getAllSubscriptions,
  getRefundHistory,
  getSubScriptionHistory,
  getUserSubscription,
  payment,
  refunds,
  toggleAutoRenew,
} from "@/services/subscription";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all, "list"] as const,
  list: () => [...subscriptionKeys.lists()] as const,
  history: () => [...subscriptionKeys.all, "history"] as const,
  refundHistory: () => [...subscriptionKeys.all, "refundHistory"] as const,
};

// ========== FETCH SUBSCRIPTIONS LIST ==========
export function useSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: async () => {
      const response = await getAllSubscriptions();
      return response;
    },
  });
}

// ========== BUY SUBSCRIPTION MUTATION ==========
export function useBuySubscription() {
  return useMutation({
    mutationFn: async ({
      subscription,
      manual_proof_url,
    }: {
      subscription: any;
      manual_proof_url: string;
    }) => {
      const response = await buySubscription(subscription, manual_proof_url);
      return response;
    },
  });
}

// ========== REQUEST PAYMENT MUTATION ==========
export function useRequestPayment() {
  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await payment(subscriptionId);
      return response;
    },
  });
}

// ========== FETCH SUBSCRIPTION HISTORY ==========
export function useSubscriptionHistory() {
  return useQuery({
    queryKey: subscriptionKeys.history(),
    queryFn: async () => {
      const response = await getSubScriptionHistory();
      return response;
    },
  });
}

// ========== FETCH USER SUBSCRIPTION ==========
export function useUserSubscription(userId: string) {
  return useQuery({
    queryKey: ["userSubscription", userId],
    queryFn: async () => {
      const response = await getUserSubscription(userId);
      return response;
    },
    enabled: !!userId,
  });
}

// ========== FETCH REFUND HISTORY ==========
export function useRefundHistory() {
  return useQuery({
    queryKey: subscriptionKeys.refundHistory(),
    queryFn: async () => {
      const response = await getRefundHistory();
      return response;
    },
  });
}

// ========== REFUND MUTATION ==========
export function useRefundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      paymentId,
      reason,
    }: {
      paymentId: string;
      reason: string;
    }) => {
      const response = await refunds(paymentId, reason);
      return response;
    },
    onSuccess: () => {
      // Invalidate refund history to refetch
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.refundHistory(),
      });
    },
  });
}

// ========== TOGGLE AUTO RENEW MUTATION ==========
export function useToggleAutoRenew() {
  return useMutation({
    mutationFn: async ({
      userSubscriptionId,
      autoRenew,
    }: {
      userSubscriptionId: string;
      autoRenew: boolean;
    }) => {
      const response = await toggleAutoRenew(userSubscriptionId, autoRenew);
      return response;
    },
  });
}
