
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Member, Transaction, TransactionType } from "@/types";
import { toast } from "sonner";

interface TransactionFormProps {
  members: Member[];
  onTransactionSubmit: (transaction: Omit<Transaction, "id" | "date">) => void;
}

export function TransactionForm({ members, onTransactionSubmit }: TransactionFormProps) {
  const [activeTab, setActiveTab] = useState<TransactionType>("deposit");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [memberId, setMemberId] = useState<string>("");
  const [activityName, setActivityName] = useState<string>("");

  // Reset form when tab changes
  useEffect(() => {
    setAmount("");
    setDescription("");
    setMemberId("");
    setActivityName("");
  }, [activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (activeTab === "deposit" && !memberId) {
      toast.error("Please select a member");
      return;
    }

    if (activeTab === "expense" && !activityName.trim()) {
      toast.error("Please enter an activity name");
      return;
    }

    const newTransaction = {
      type: activeTab,
      amount: parseFloat(amount),
      description,
      memberId: activeTab === "deposit" ? memberId : undefined,
      activityName: activeTab === "expense" ? activityName : undefined,
    };

    onTransactionSubmit(newTransaction);
    toast.success(`${activeTab === "deposit" ? "Deposit" : "Expense"} recorded successfully`);
    
    // Reset form
    setAmount("");
    setDescription("");
    setMemberId("");
    setActivityName("");
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="pb-2 border-b border-blue-100">
        <CardTitle className="text-blue-800 font-semibold">Record Transaction</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as TransactionType)}>
          <TabsList className="grid w-full grid-cols-2 bg-blue-100 p-1">
            <TabsTrigger 
              value="deposit" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
            >
              Deposit
            </TabsTrigger>
            <TabsTrigger 
              value="expense"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
            >
              Expense
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="deposit" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount" className="text-blue-800">Amount</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="50.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit-member" className="text-blue-800">Member</Label>
                <Select value={memberId} onValueChange={setMemberId} required>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit-description" className="text-blue-800">Description</Label>
                <Input
                  id="deposit-description"
                  placeholder="Monthly fee payment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="expense" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="expense-amount" className="text-blue-800">Amount</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-activity" className="text-blue-800">Activity Name</Label>
                <Input
                  id="expense-activity"
                  placeholder="Ground Booking"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-description" className="text-blue-800">Description</Label>
                <Input
                  id="expense-description"
                  placeholder="Booking ground for practice session"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>
            </TabsContent>
            
            <div className="mt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Record {activeTab === "deposit" ? "Deposit" : "Expense"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
