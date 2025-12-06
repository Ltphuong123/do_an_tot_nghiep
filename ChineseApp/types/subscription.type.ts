export interface ISubscription {
  id: string;
  name: string;
  description: { html: string };
  duration_months: number | null;
  daily_quota_translate: number;
  daily_quota_ai_lesson: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ITransferInfo {
  id: string;
  subscription_id: string;
  user_id: string;
  amount: string; // "499000.00" dạng string
  currency: string; // "VND"
  payment_method: string; // "bank_transfer"
  payment_channel: string; // "manual"
  status: string; // "pending"
  gateway_response: string | null;
  gateway_transaction_id: string | null;
  manual_proof_url: string | null;
  notes: string | null;
  processed_by_admin: string | null;
  transaction_date: string; // ISO date string
}

export interface ISubscriptionPayment {
  transferInfo: ITransferInfo;
  subscriptionDetails: ISubscription;
}

export interface TransferInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  amount: string;
}

export interface SubscriptionDescription {
  html: string;
}

export interface SubscriptionDetails {
  id: string;
  name: string;
  description: SubscriptionDescription;
  daily_quota_ai_lesson: number;
  daily_quota_translate: number;
  price: string;
  duration_months: number;
  is_active: boolean;
  created_at: string; // hoặc Date nếu bạn parse
  updated_at: string; // hoặc Date nếu bạn parse
}

export interface PaymentData {
  transferInfo: TransferInfo;
  subscriptionDetails: SubscriptionDetails;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_id: string;
  start_date: string; // hoặc Date nếu muốn
  expiry_date: string; // hoặc Date
  is_active: boolean;
  auto_renew: boolean;
  last_payment_id: string;
  created_at: string; // hoặc Date
  updated_at: string; // hoặc Date
  subscriptionName: string;
}

export interface IHistoryRefundRequest {
  id: string;
  payment_id: string;
  user_id: string;
  processed_by_admin: string | null;
  refund_amount: string;
  refund_method: string | null;
  reason: string;
  status: string;
  created_at: string;
  processed_at: string | null;
}
