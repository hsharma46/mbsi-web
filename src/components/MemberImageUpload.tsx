
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface MemberImageUploadProps {
  name: string;
  currentImageUrl?: string;
  onImageUpload: (imageData: File) => void;
}

export function MemberImageUpload({ name, currentImageUrl, onImageUpload }: MemberImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Send to parent component
    onImageUpload(file);
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
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24 border-2 border-blue-200">
        <AvatarImage src={previewUrl} alt={name} />
        <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-center">
        <Label 
          htmlFor="profile-image" 
          className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center space-x-1"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Photo</span>
        </Label>
        <input
          id="profile-image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
      </div>
    </div>
  );
}
