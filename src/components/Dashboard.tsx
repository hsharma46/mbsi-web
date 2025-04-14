
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CricketFundState, Member, Transaction, MemberStatus } from "@/types";
import { 
  calculateTotalFunds, 
  calculateTotalDeposits, 
  calculateTotalExpenses, 
  formatCurrency 
} from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Header } from "./Header";
import { MembersList } from "./MembersList";
import { TransactionForm } from "./TransactionForm";
import { TransactionHistory } from "./TransactionHistory";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { PlayerManagement } from "./PlayerManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Wallet, CreditCard, TrendingDown, Users, Activity, Gift, LogIn, IndianRupee } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UpcomingBirthdays } from "./UpcomingBirthdays";
import { MobileNavigation } from "./MobileNavigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardProps {
  initialState: CricketFundState;
}

export function Dashboard({ initialState }: DashboardProps) {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<CricketFundState>({
    ...initialState,
    currentUser: currentUser || initialState.currentUser,
  });
  
  const isMobile = useIsMobile();
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "members" ? "members" : "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const showTransactionFormParam = searchParams.get("showTransactionForm");
  const [showTransactionForm, setShowTransactionForm] = useState(showTransactionFormParam === "true");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    searchParams.set("tab", value);
    setSearchParams(searchParams);
  };
  
  useEffect(() => {
    if (tabParam === "members") {
      setActiveTab("members");
    } else if (tabParam !== "members" && activeTab === "members") {
      setActiveTab("overview");
    }
    
    setShowTransactionForm(showTransactionFormParam === "true");
  }, [tabParam, showTransactionFormParam]);
  
  const handleTransactionSubmit = (newTransaction: Omit<Transaction, "id" | "date">) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: String(state.transactions.length + 1),
      date: new Date().toISOString().split('T')[0],
    };
    
    let updatedMembers = [...state.members];
    if (transaction.type === "deposit" && transaction.memberId) {
      updatedMembers = updatedMembers.map(member => {
        if (member.id === transaction.memberId) {
          const now = new Date();
          const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
          
          const updatedPaymentHistory = [...(member.paymentHistory || [])];
          updatedPaymentHistory.push({
            month,
            paid: true,
            amount: transaction.amount,
            date: transaction.date
          });
          
          return {
            ...member,
            isPaid: true,
            lastPaymentDate: transaction.date,
            amountPaid: transaction.amount,
            paymentHistory: updatedPaymentHistory,
            totalDue: Math.max(0, (member.totalDue || 0) - transaction.amount),
            monthsLate: 0
          };
        }
        return member;
      });
      
      if (transaction.paymentMethod === "qrcode") {
        const member = updatedMembers.find(m => m.id === transaction.memberId);
        if (member && member.phone) {
          toast.success(`WhatsApp notification sent to ${member.name} for payment confirmation`);
        }
      }
    }
    
    setState(prevState => ({
      ...prevState,
      transactions: [transaction, ...prevState.transactions],
      members: updatedMembers,
    }));
    
    if (showTransactionForm) {
      searchParams.delete("showTransactionForm");
      setSearchParams(searchParams);
      setShowTransactionForm(false);
    }
  };
  
  const handleToggleMemberStatus = (memberId: string) => {
    const updatedMembers = state.members.map(member => {
      if (member.id === memberId) {
        const newStatus = member.status === 'active' ? 'inactive' as MemberStatus : 'active' as MemberStatus;
        return { ...member, status: newStatus };
      }
      return member;
    });
    
    setState(prevState => ({
      ...prevState,
      members: updatedMembers,
    }));
    
    toast.success(`Member status updated successfully`);
  };
  
  const handleAddMember = (newMember: Omit<Member, "id" | "isPaid" | "paymentHistory" | "status">) => {
    const member: Member = {
      ...newMember,
      id: String(state.members.length + 1),
      isPaid: false,
      status: 'active' as MemberStatus,
      paymentHistory: [],
      totalDue: state.monthlyDueAmount,
      monthsLate: 0
    };
    
    setState(prevState => ({
      ...prevState,
      members: [...prevState.members, member],
    }));
    
    toast.success(`${newMember.name} added to the team`);
  };
  
  const handleUpdateMemberImage = (memberId: string, imageFile: File) => {
    const imageUrl = URL.createObjectURL(imageFile);
    
    const updatedMembers = state.members.map(member => {
      if (member.id === memberId) {
        return { ...member, imageUrl };
      }
      return member;
    });
    
    setState(prevState => ({
      ...prevState,
      members: updatedMembers,
    }));
  };
  
  const totalFunds = calculateTotalFunds(state.transactions);
  const totalDeposits = calculateTotalDeposits(state.transactions);
  const totalExpenses = calculateTotalExpenses(state.transactions);
  const paidMembers = state.members.filter(m => m.isPaid && m.status === 'active').length;
  const activeMembers = state.members.filter(m => m.status === 'active').length;
  
  const fundUsagePercentage = totalFunds > 0 
    ? Math.min(100, Math.round((totalExpenses / (totalDeposits)) * 100)) 
    : 0;
  
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#201f3d] to-[#10112b]">
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="absolute inset-0 z-0">
            <img 
              src="/lovable-uploads/53e167b5-ed6f-4499-9ed1-181e1f4b5f66.png" 
              alt="Cricket Player" 
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          
          <div className="z-10 text-center mb-8">
            <div className="h-24 w-24 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-[#9b87f5] to-[#0FA0CE] text-white shadow-lg mb-4">
              <h1 className="text-2xl font-bold text-white">AW</h1>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Amazing Warrior</h1>
            <p className="mt-2 text-lg text-white">Cricket Team Fund Manager</p>
          </div>
          
          <div className="z-10 text-center max-w-md text-white/80 mb-8">
            <p>Manage your cricket team's finances, track player payments, and keep records of all expenses in one place.</p>
          </div>
          
          <Button 
            asChild
            size="lg"
            className="z-10 bg-gradient-to-r from-[#9b87f5] to-[#0FA0CE] hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 text-lg"
          >
            <Link to="/login">
              <LogIn className="mr-2 h-5 w-5" />
              Sign In to Continue
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  if (showTransactionForm && currentUser?.isAdmin) {
    return (
      <div className="dashboard-background">
        <Header user={currentUser || state.currentUser} />
        <main className="container mx-auto flex-1 py-6 px-4 pb-20">
          <Button 
            variant="outline" 
            onClick={() => {
              searchParams.delete("showTransactionForm");
              setSearchParams(searchParams);
              setShowTransactionForm(false);
            }}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <div className="section-card">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Record Transaction</h2>
            <TransactionForm 
              members={state.members.filter(m => m.status === 'active')} 
              onTransactionSubmit={handleTransactionSubmit} 
            />
          </div>
        </main>
        <MobileNavigation />
      </div>
    );
  }
  
  return (
    <div className="dashboard-background">
      <Header user={currentUser || state.currentUser} />
      <main className="container mx-auto flex-1 py-6 px-4 pb-20">
        <div className="relative overflow-hidden mb-8 rounded-xl shadow-xl">
          <div className="absolute inset-0 z-0">
            <img 
              src="/lovable-uploads/53e167b5-ed6f-4499-9ed1-181e1f4b5f66.png" 
              alt="Cricket Player" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80"></div>
          </div>
          
          <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Cricket Team Fund Manager
              </h1>
              <p className="text-blue-100 max-w-lg">
                Manage your team's finances, track payments, and keep everyone updated.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-blue-100/70 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md rounded-md"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className={`data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md rounded-md ${!currentUser?.isAdmin ? "hidden" : ""}`}
              >
                Player Management
              </TabsTrigger>
            </TabsList>
        
            <TabsContent value="overview" className="pt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="stats-card stats-card-blue">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800 flex items-center">
                      <Wallet className="h-4 w-4 mr-2 text-blue-600" />
                      Available Funds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-700 flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {formatCurrency(totalFunds).replace('$', '')}
                    </div>
                    <Progress 
                      value={fundUsagePercentage} 
                      className="h-2 mt-2 bg-blue-100" 
                      indicatorClassName="bg-blue-600" 
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      {fundUsagePercentage}% of deposits spent
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="stats-card stats-card-green">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-800 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-green-600" />
                      Total Collected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-700 flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {formatCurrency(totalDeposits).replace('$', '')}
                    </div>
                    <div className="flex items-center mt-2">
                      <Users className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-xs text-green-600">
                        From {paidMembers} contributing members
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="stats-card stats-card-red">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-800 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
                      Total Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-700 flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {formatCurrency(totalExpenses).replace('$', '')}
                    </div>
                    <div className="flex items-center mt-2">
                      <Activity className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-xs text-red-600">
                        {state.transactions.filter(t => t.type === "expense").length} expense transactions
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="stats-card stats-card-purple">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-purple-600" />
                      Members Paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-700">{paidMembers} / {activeMembers}</div>
                    <div className="mt-2 h-3 w-full rounded-full bg-purple-100 overflow-hidden">
                      <div 
                        className="h-3 rounded-full bg-purple-500 transition-all duration-500 ease-out" 
                        style={{ width: `${activeMembers > 0 ? (paidMembers / activeMembers) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-purple-600">
                      {activeMembers > 0 ? ((paidMembers / activeMembers) * 100).toFixed(0) : 0}% of active members paid
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Grid layout for members list and transactions side by side */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Members list */}
                {!isMobile && (
                  <div>
                    <MembersList 
                      members={state.members} 
                      monthlyDueAmount={state.monthlyDueAmount}
                      onToggleStatus={currentUser?.isAdmin ? handleToggleMemberStatus : undefined}
                    />
                  </div>
                )}
                
                {isMobile && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4 shadow-md">
                        <Users className="mr-2 h-4 w-4" />
                        View Team Members
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-auto p-0">
                      <div className="p-4">
                        <MembersList 
                          members={state.members} 
                          monthlyDueAmount={state.monthlyDueAmount}
                          onToggleStatus={currentUser?.isAdmin ? handleToggleMemberStatus : undefined}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                {/* Transaction history */}
                <div>
                  <TransactionHistory 
                    transactions={state.transactions} 
                    members={state.members} 
                    limit={5} 
                  />
                </div>
              </div>
              
              {/* Admin transaction form */}
              {currentUser?.isAdmin && (
                <div className="mt-6">
                  <section className="section-card">
                    <TransactionForm 
                      members={state.members.filter(m => m.status === 'active')} 
                      onTransactionSubmit={handleTransactionSubmit} 
                    />
                  </section>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="members" className="pt-4">
              {currentUser?.isAdmin && (
                <section className="section-card">
                  <PlayerManagement
                    members={state.members}
                    monthlyDueAmount={state.monthlyDueAmount}
                    onAddMember={handleAddMember}
                    onToggleStatus={handleToggleMemberStatus}
                    onUpdateMemberImage={handleUpdateMemberImage}
                  />
                </section>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <MobileNavigation />
    </div>
  );
}
