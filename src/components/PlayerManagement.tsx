
import { useState } from "react";
import { Member, MemberStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { formatCurrency } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MemberImageUpload } from "./MemberImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Plus, Activity, AlertCircle } from "lucide-react";

interface PlayerManagementProps {
  members: Member[];
  monthlyDueAmount: number;
  onAddMember: (member: Omit<Member, "id" | "isPaid" | "paymentHistory" | "status">) => void;
  onToggleStatus: (memberId: string) => void;
  onUpdateMemberImage?: (memberId: string, imageFile: File) => void;
}

export function PlayerManagement({ 
  members, 
  monthlyDueAmount, 
  onAddMember, 
  onToggleStatus,
  onUpdateMemberImage 
}: PlayerManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'inactive' | 'late'>('overview');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    name: string;
    email: string;
    phone: string;
  }>();
  
  const onSubmit = handleSubmit((data) => {
    onAddMember({
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
    reset();
    setShowAddForm(false);
    toast.success(`${data.name} added to the team`);
  });

  const handleImageUpload = (memberId: string, imageFile: File) => {
    if (onUpdateMemberImage) {
      onUpdateMemberImage(memberId, imageFile);
      toast.success("Profile photo updated");
    }
  };
  
  const activeMembersCount = members.filter(m => m.status === 'active').length;
  const inactiveMembersCount = members.filter(m => m.status === 'inactive').length;
  
  const lateMembers = members.filter(m => 
    m.status === 'active' && !m.isPaid && m.monthsLate && m.monthsLate > 0
  );
  
  const totalDue = members.reduce((sum, member) => 
    sum + (member.status === 'active' ? (member.totalDue || 0) : 0), 0);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stats-card stats-card-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-blue-700">{activeMembersCount}</div>
              <UserRound className="h-5 w-5 text-blue-500 mb-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="stats-card stats-card-red">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Inactive Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-red-700">{inactiveMembersCount}</div>
              <UserRound className="h-5 w-5 text-red-500 mb-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="stats-card stats-card-amber">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Late Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-amber-700">{lateMembers.length}</div>
              <AlertCircle className="h-5 w-5 text-amber-500 mb-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="stats-card stats-card-green">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Due Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold text-green-700">{formatCurrency(totalDue)}</div>
              <Activity className="h-5 w-5 text-green-500 mb-1" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showAddForm ? (
        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-100/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-blue-800">Add New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <MemberImageUpload 
                  name="New Member" 
                  onImageUpload={() => {}} // Will be used when submitting the form
                />
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-800">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Member Name" 
                        {...register("name", { required: "Name is required" })}
                        className="border-blue-200 focus:border-blue-400"
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-800">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Email Address" 
                        {...register("email")}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phone" className="text-blue-800">Phone Number (for WhatsApp)</Label>
                      <Input 
                        id="phone" 
                        placeholder="e.g. +1234567890" 
                        {...register("phone")}
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <p className="text-xs text-blue-500">
                        Required for WhatsApp payment notifications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="border-blue-200 text-blue-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Add Member
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Member
          </Button>
        </div>
      )}
      
      <Card className="bg-gradient-to-br from-white to-blue-50/40 border-blue-100/40 shadow-md">
        <CardHeader className="pb-2 border-b border-blue-100/50">
          <CardTitle className="text-blue-800">Players Management</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="overview" onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="bg-blue-100/60 p-1 mb-4 rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md"
              >
                All Members
              </TabsTrigger>
              <TabsTrigger 
                value="active"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md"
              >
                Active
              </TabsTrigger>
              <TabsTrigger 
                value="inactive"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md"
              >
                Inactive
              </TabsTrigger>
              <TabsTrigger 
                value="late"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md"
              >
                Late Payments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <MembersTable 
                members={members}
                monthlyDueAmount={monthlyDueAmount}
                onToggleStatus={onToggleStatus}
                onImageUpload={handleImageUpload}
              />
            </TabsContent>
            
            <TabsContent value="active">
              <MembersTable 
                members={members.filter(m => m.status === 'active')}
                monthlyDueAmount={monthlyDueAmount}
                onToggleStatus={onToggleStatus}
                onImageUpload={handleImageUpload}
              />
            </TabsContent>
            
            <TabsContent value="inactive">
              <MembersTable 
                members={members.filter(m => m.status === 'inactive')}
                monthlyDueAmount={monthlyDueAmount}
                onToggleStatus={onToggleStatus}
                onImageUpload={handleImageUpload}
              />
            </TabsContent>
            
            <TabsContent value="late">
              <MembersTable 
                members={lateMembers}
                monthlyDueAmount={monthlyDueAmount}
                onToggleStatus={onToggleStatus}
                onImageUpload={handleImageUpload}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="max-w-md w-full bg-white">
            <CardHeader>
              <CardTitle>Edit Member</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberImageUpload 
                name={selectedMember.name}
                currentImageUrl={selectedMember.imageUrl}
                onImageUpload={(file) => handleImageUpload(selectedMember.id, file)}
              />
              <div className="mt-4 space-y-2">
                <h3 className="font-medium text-lg">{selectedMember.name}</h3>
                <p className="text-sm text-gray-500">{selectedMember.email}</p>
                <p className="text-sm text-gray-500">{selectedMember.phone}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </Button>
                <Button 
                  variant={selectedMember.status === 'active' ? 'destructive' : 'default'}
                  onClick={() => {
                    onToggleStatus(selectedMember.id);
                    setSelectedMember(null);
                  }}
                >
                  {selectedMember.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface MembersTableProps {
  members: Member[];
  monthlyDueAmount: number;
  onToggleStatus: (memberId: string) => void;
  onImageUpload?: (memberId: string, imageFile: File) => void;
}

function MembersTable({ members, monthlyDueAmount, onToggleStatus, onImageUpload }: MembersTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="rounded-md border border-blue-100/50 overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm">
      <Table>
        <TableHeader className="bg-blue-50/80">
          <TableRow>
            <TableHead className="text-blue-800">Member</TableHead>
            <TableHead className="text-blue-800">Status</TableHead>
            <TableHead className="text-blue-800">Months Late</TableHead>
            <TableHead className="text-blue-800">Amount Due</TableHead>
            <TableHead className="text-blue-800 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No members found in this category
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => {
              const monthsLate = member.monthsLate || 0;
              const amountDue = member.totalDue || (monthsLate * monthlyDueAmount);
              
              return (
                <TableRow key={member.id} className={member.status === 'inactive' ? "bg-gray-50/80" : ""}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border border-blue-100">
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.status === 'active' ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-medium">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 font-medium">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {monthsLate > 0 ? (
                      <Badge variant="outline" className={`font-medium
                        ${monthsLate >= 3 ? 'bg-red-100 text-red-800 border-red-200' : 
                         monthsLate >= 1 ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                         'bg-green-100 text-green-800 border-green-200'}
                      `}>
                        {monthsLate} {monthsLate === 1 ? 'month' : 'months'}
                      </Badge>
                    ) : (
                      member.isPaid ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-medium">
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
                          Current
                        </Badge>
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${amountDue > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      {formatCurrency(amountDue)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onToggleStatus(member.id)}
                      className={member.status === 'active' 
                        ? 'border-red-200 text-red-700 hover:bg-red-50' 
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                      }
                    >
                      {member.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
