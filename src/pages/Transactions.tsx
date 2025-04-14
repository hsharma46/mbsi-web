
import { TransactionHistory } from "@/components/TransactionHistory";
import { initialState } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileNavigation } from "@/components/MobileNavigation";

const Transactions = () => {
  const { currentUser } = useAuth();

  // Ensure we have a user context
  const updatedState = {
    ...initialState,
    currentUser: currentUser || initialState.currentUser
  };

  return (
    <div className="dashboard-background">
      <div className="container mx-auto py-8 px-4 pb-20 relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="outline" size="sm" asChild className="mr-4 shadow-sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>
        </div>

        {/* Transaction History */}
        <div className="fade-in">
          <TransactionHistory 
            transactions={initialState.transactions} 
            members={initialState.members} 
          />
        </div>
      </div>
      <MobileNavigation />
    </div>
  );
};

export default Transactions;
