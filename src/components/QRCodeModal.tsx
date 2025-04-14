
import { Member } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

interface QRCodeModalProps {
  member: Member;
  amount: number;
  onClose: () => void;
}

export function QRCodeModal({ member, amount, onClose }: QRCodeModalProps) {
  const [loading, setLoading] = useState(false);

  // This would normally generate a real payment QR code
  // For this demo, we're just using a placeholder
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payment:cricket:${member.id}:${amount}`;
  
  const sendWhatsAppMessage = async () => {
    if (!member.phone) {
      toast.error("No phone number available for this member");
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would call your backend API to send WhatsApp messages
      // For this demo, we'll simulate it
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Payment link sent to ${member.phone}`);
      onClose();
    } catch (error) {
      toast.error("Failed to send WhatsApp message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment QR Code for {member.name}</DialogTitle>
          <DialogDescription>
            Share this QR code with {member.name} to collect {formatCurrency(amount)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          <div className="qr-container mb-4">
            <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48" />
          </div>
          
          <p className="text-sm text-center mb-4">
            Scan this QR code to pay {formatCurrency(amount)} for cricket team dues
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // In a real app, this would use the Web Share API if available
                toast.success("QR code copied to clipboard");
              }}
            >
              Share QR Code
            </Button>
            
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700" 
              onClick={sendWhatsAppMessage}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send via WhatsApp"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
