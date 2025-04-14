
import { Member } from "@/types";
import { formatCurrency, formatDate } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";
import { useState } from "react";
import { QRCodeModal } from "./QRCodeModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MembersListProps {
  members: Member[];
  monthlyDueAmount: number;
  onToggleStatus?: (memberId: string) => void;
}

export function MembersList({ members, monthlyDueAmount, onToggleStatus }: MembersListProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Sort members: active first, then by payment status (paid first, then unpaid)
  const sortedMembers = [...members].sort((a, b) => {
    if (a.status === 'active' && b.status === 'inactive') return -1;
    if (a.status === 'inactive' && b.status === 'active') return 1;
    if (a.isPaid && !b.isPaid) return -1;
    if (!a.isPaid && b.isPaid) return 1;
    return 0;
  });

  const getPaymentStatus = (member: Member): 'paid' | 'pending' | 'late' => {
    if (member.isPaid) return 'paid';
    
    // Check if payment is late (more than 1 month)
    if (member.monthsLate && member.monthsLate > 1) return 'late';
    
    return 'pending';
  };
  
  const handleShowQR = (member: Member) => {
    setSelectedMember(member);
    setShowQRModal(true);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="modern-table-wrapper">
      <div className="modern-table-header">
        <h2 className="text-lg font-bold">Team Members</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-50/90">
            <TableRow>
              <TableHead className="text-blue-800">Name</TableHead>
              <TableHead className="text-blue-800">Status</TableHead>
              <TableHead className="text-blue-800">Last Payment</TableHead>
              <TableHead className="text-blue-800">Amount Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member) => {
              const paymentStatus = getPaymentStatus(member);
              const monthsLate = member.monthsLate || 0;
              const amountDue = member.totalDue || (monthsLate * monthlyDueAmount);
              
              return (
                <TableRow key={member.id} className={`modern-table-row ${member.status === 'inactive' ? "bg-gray-50" : ""}`}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 border border-blue-100 shadow-sm">
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {paymentStatus === 'paid' && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-medium">
                        Paid
                      </Badge>
                    )}
                    {paymentStatus === 'pending' && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 font-medium">
                        Pending
                      </Badge>
                    )}
                    {paymentStatus === 'late' && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 font-medium">
                        Late ({monthsLate} months)
                      </Badge>
                    )}
                    {member.status === 'inactive' && (
                      <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-800 border-gray-200 font-medium">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {member.lastPaymentDate ? (
                      <span className="text-gray-700">{formatDate(member.lastPaymentDate)}</span>
                    ) : (
                      <span className="text-gray-500">No payment</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium flex items-center ${amountDue > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      <IndianRupee className="h-3.5 w-3.5 mr-1" />
                      {formatCurrency(amountDue).replace('$', '')}
                    </span>
                  </TableCell>
                  </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {showQRModal && selectedMember && (
        <QRCodeModal 
          member={selectedMember} 
          amount={selectedMember.totalDue || monthlyDueAmount} 
          onClose={() => setShowQRModal(false)} 
        />
      )}
    </div>
  );
}
