import { IMeta, IResponseSuccess } from "@/types/common.type";
import {
  IHistoryRefundRequest,
  ISubscription,
  ISubscriptionPayment,
  PaymentData,
  UserSubscription,
} from "@/types/subscription.type";
import axios from "./index";

export const getAllSubscriptions = async (): Promise<{
  success: boolean;
  data: ISubscription[];
  meta: IMeta;
}> => {
  const res = await axios.get("/monetization/subscriptions/list", {
    requireAuth: true,
  });
  return res.data;
};

export const buySubscription = async (
  subscription: ISubscription,
  manual_proof_url?: string
): Promise<IResponseSuccess<ISubscriptionPayment>> => {
  const res = await axios.post(
    "/monetization/payments",
    {
      subscription_id: subscription.id,
      payment_method: "bank_transfer",
      amount: subscription.price,
      manual_proof_url: manual_proof_url,
    },
    { requireAuth: true }
  );
  console.log("Buy subscription response:", res.data);
  return res.data;
};

export const getSubScriptionHistory = async (): Promise<{
  success: boolean;
  data: ISubscriptionPayment[];
  meta: IMeta;
}> => {
  const res = await axios.get("users/me/payment-history", {
    requireAuth: true,
  });
  return res.data;
};

export const payment = async (
  subscriptionId: string
): Promise<IResponseSuccess<PaymentData>> => {
  const res = await axios.post(
    "payments/request",
    {
      subscriptionId: subscriptionId,
      paymentMethod: "bank_transfer",
    },
    { requireAuth: true }
  );
  return res.data;
};

export const refunds = async (
  paymentId: string,
  reason: string
): Promise<IResponseSuccess<null>> => {
  console.log(
    "Requesting refund for paymentId:",
    paymentId,
    "with reason:",
    reason
  );
  const res = await axios.post(
    `/refunds`,
    {
      paymentId,
      reason,
    },
    { requireAuth: true }
  );
  return res.data;
};

export const toggleAutoRenew = async (
  userSubscriptionId: string,
  autoRenew: boolean
): Promise<IResponseSuccess<any>> => {
  const res = await axios.put(
    `/monetization/user-subscriptions/${userSubscriptionId}`,
    {
      action: "toggle_renew",
      auto_renew: autoRenew,
    },
    { requireAuth: true }
  );
  return res.data;
};

export const getUserSubscription = async (
  userID: string
): Promise<{
  success: boolean;
  data: UserSubscription[];
}> => {
  const res = await axios.get(
    `/monetization/user-subscriptions/history/${userID}`,
    {
      requireAuth: true,
    }
  );
  return res.data;
};

export const getRefundHistory = async (): Promise<
  IResponseSuccess<IHistoryRefundRequest[]>
> => {
  const res = await axios.get("/refunds", {
    requireAuth: true,
  });
  return res.data;
};
