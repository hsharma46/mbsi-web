
import { CricketFundState, Member, Transaction, User, MemberStatus } from "../types";

export const members: Member[] = [
  {
    id: "1",
    name: "John Smith",
    isPaid: true,
    lastPaymentDate: "2025-03-15",
    amountPaid: 50,
    email: "john@example.com",
    status: "active" as MemberStatus,
    paymentHistory: [
      {
        month: "2025-03",
        paid: true,
        amount: 50,
        date: "2025-03-15"
      }
    ],
    birthday: "1990-04-25"
  },
  {
    id: "2",
    name: "Michael Johnson",
    isPaid: true,
    lastPaymentDate: "2025-03-14",
    amountPaid: 50,
    email: "michael@example.com",
    status: "active" as MemberStatus,
    paymentHistory: [
      {
        month: "2025-03",
        paid: true,
        amount: 50,
        date: "2025-03-14"
      }
    ],
    birthday: "1988-05-18"
  },
  {
    id: "3",
    name: "David Williams",
    isPaid: false,
    email: "david@example.com",
    status: "active" as MemberStatus,
    paymentHistory: [],
    birthday: "1993-04-12"
  },
  {
    id: "4",
    name: "Robert Brown",
    isPaid: true,
    lastPaymentDate: "2025-03-10",
    amountPaid: 50,
    email: "robert@example.com",
    status: "active" as MemberStatus,
    paymentHistory: [
      {
        month: "2025-03",
        paid: true,
        amount: 50,
        date: "2025-03-10"
      }
    ],
    birthday: "1991-06-30"
  },
  {
    id: "5",
    name: "James Jones",
    isPaid: false,
    email: "james@example.com",
    status: "active" as MemberStatus,
    paymentHistory: [],
    birthday: "1992-08-14"
  },
  {
    id: "6",
    name: "William Davis",
    isPaid: true,
    lastPaymentDate: "2025-03-05",
    amountPaid: 50,
    email: "william@example.com",
    status: "active" as MemberStatus,
    paymentHistory: [
      {
        month: "2025-03",
        paid: true,
        amount: 50,
        date: "2025-03-05"
      }
    ],
    birthday: "1987-04-20"
  },
  {
    id: "7",
    name: "Richard Miller",
    isPaid: false,
    email: "richard@example.com",
    status: "active" as MemberStatus,
    paymentHistory: [],
    birthday: "1989-07-05"
  },
  {
    id: "8",
    name: "Joseph Wilson",
    isPaid: true,
    lastPaymentDate: "2025-03-02",
    amountPaid: 50,
    email: "joseph@example.com",
    status: "active" as MemberStatus,
    paymentHistory: [
      {
        month: "2025-03",
        paid: true,
        amount: 50,
        date: "2025-03-02"
      }
    ],
    birthday: "1990-05-12"
  },
];

export const transactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: 50,
    description: "Monthly fee payment",
    date: "2025-03-15",
    memberId: "1"
  },
  {
    id: "2",
    type: "deposit",
    amount: 50,
    description: "Monthly fee payment",
    date: "2025-03-14",
    memberId: "2"
  },
  {
    id: "3",
    type: "expense",
    amount: 120,
    description: "Ground booking for practice",
    date: "2025-03-13",
    activityName: "Practice Session"
  },
  {
    id: "4",
    type: "deposit",
    amount: 50,
    description: "Monthly fee payment",
    date: "2025-03-10",
    memberId: "4"
  },
  {
    id: "5",
    type: "expense",
    amount: 85,
    description: "New cricket balls",
    date: "2025-03-08",
    activityName: "Equipment Purchase"
  },
  {
    id: "6",
    type: "deposit",
    amount: 50,
    description: "Monthly fee payment",
    date: "2025-03-05",
    memberId: "6"
  },
  {
    id: "7",
    type: "expense",
    amount: 45,
    description: "Refreshments for match day",
    date: "2025-03-03",
    activityName: "Match Day Expenses"
  },
  {
    id: "8",
    type: "deposit",
    amount: 50,
    description: "Monthly fee payment",
    date: "2025-03-02",
    memberId: "8"
  }
];

export const currentUser: User = {
  id: "1",
  username: "Admin User",
  email: "admin@cricket.com",
  isAdmin: true
};

export const initialState: CricketFundState = {
  members,
  transactions,
  currentUser,
  monthlyDueAmount: 50
};

// Helper functions to calculate totals
export const calculateTotalFunds = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === 'deposit') {
      return total + transaction.amount;
    } else {
      return total - transaction.amount;
    }
  }, 0);
};

export const calculateTotalDeposits = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'deposit')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const getMemberById = (members: Member[], id: string): Member | undefined => {
  return members.find(member => member.id === id);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// New helper function to format birthday
export const formatBirthday = (birthday: string): string => {
  return new Date(birthday).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
};

// New helper function to get upcoming birthdays
export const getUpcomingBirthdays = (members: Member[], limit: number = 5): Member[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  // Create a modified copy of members with calculated "days until birthday"
  const membersWithDays = members
    .filter(member => member.status === 'active' && member.birthday)
    .map(member => {
      const birthday = new Date(member.birthday || '');
      const birthdayMonth = birthday.getMonth();
      const birthdayDay = birthday.getDate();
      
      // Calculate days until next birthday
      let daysUntil = 0;
      
      if (birthdayMonth > currentMonth || (birthdayMonth === currentMonth && birthdayDay >= currentDay)) {
        // Birthday is later this year
        const nextBirthday = new Date(today.getFullYear(), birthdayMonth, birthdayDay);
        daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24));
      } else {
        // Birthday is next year
        const nextBirthday = new Date(today.getFullYear() + 1, birthdayMonth, birthdayDay);
        daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24));
      }
      
      return { ...member, daysUntil };
    });
  
  // Sort by days until birthday (ascending) and take the first 'limit' entries
  return membersWithDays
    .sort((a, b) => (a.daysUntil || 0) - (b.daysUntil || 0))
    .slice(0, limit);
};
