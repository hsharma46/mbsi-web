
import { Transaction, Member } from "@/types";
import { formatCurrency, formatDate, getMemberById } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { IndianRupee, ArrowUp, ArrowDown } from "lucide-react";

interface TransactionHistoryProps {
  transactions: Transaction[];
  members: Member[];
  limit?: number;
}

export function TransactionHistory({ transactions, members, limit }: TransactionHistoryProps) {
  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <div className="modern-table-wrapper">
      <div className="modern-table-header">
        <h2 className="text-lg font-bold">
          {limit ? "Recent Transactions" : "Transaction History"}
        </h2>
      </div>
      
      {sortedTransactions.length === 0 ? (
        <div className="text-center py-10 bg-white/50 rounded-b-lg">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <div className="rounded-b-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-blue-50/90 p-3 text-sm font-medium text-blue-800">
            <div className="col-span-4 sm:col-span-3">Date</div>
            <div className="col-span-4 sm:col-span-3">Type</div>
            <div className="hidden sm:col-span-3 sm:block">Member/Activity</div>
            <div className="col-span-4 sm:col-span-3 text-right">Amount</div>
          </div>
          <div className="divide-y divide-blue-100">
            {sortedTransactions.map((transaction) => {
              const member = transaction.memberId
                ? getMemberById(members, transaction.memberId)
                : undefined;

              return (
                <div key={transaction.id} className="grid grid-cols-12 items-center p-3 text-sm bg-white hover:bg-blue-50/30 transition-colors">
                  <div className="col-span-4 text-sm text-blue-700 sm:col-span-3 font-medium">
                    {formatDate(transaction.date)}
                  </div>
                  <div className="col-span-4 sm:col-span-3">
                    <span
                      className={cn(
                        "cricket-badge flex items-center justify-center",
                        transaction.type === "deposit"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      )}
                    >
                      {transaction.type === "deposit" ? (
                        <ArrowUp className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3" />
                      )}
                      {transaction.type === "deposit" ? "Deposit" : "Expense"}
                    </span>
                  </div>
                  <div className="hidden font-medium sm:col-span-3 sm:block text-gray-700">
                    {transaction.type === "deposit"
                      ? member?.name || "Unknown"
                      : transaction.activityName || "General"}
                  </div>
                  <div className="col-span-4 text-right sm:col-span-3">
                    <span
                      className={cn(
                        "font-bold flex items-center justify-end",
                        transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {transaction.type === "deposit" ? "+" : "-"}
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {formatCurrency(transaction.amount).replace('$', '')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {limit && transactions.length > limit && (
        <div className="mt-4 text-right px-4 py-2 bg-white rounded-b-lg">
          <Link to="/transactions" className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
            View all transactions →
          </Link>
        </div>
      )}
    </div>
  );
}
