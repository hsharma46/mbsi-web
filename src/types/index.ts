
export type TransactionType = "deposit" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  memberId?: string;
  activityName?: string;
  paymentMethod?: "cash" | "card" | "qrcode";
}

export interface PaymentRecord {
  month: string;
  paid: boolean;
  amount: number;
  date: string;
}

export interface CricketFundState {
  currentUser: User;
  members: Member[];
  transactions: Transaction[];
  monthlyDueAmount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  photoUrl?: string;
}

export type MemberStatus = 'active' | 'inactive';

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isPaid: boolean;
  status: MemberStatus;
  lastPaymentDate?: string;
  amountPaid?: number;
  paymentHistory: PaymentRecord[];
  totalDue?: number;
  monthsLate?: number;
  imageUrl?: string;
  birthday?: string;
}
