
import { useState } from "react";
import { usePDFs } from "@/contexts/PDFsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "@/hooks/use-toast";
import { FileUp, X, File } from "lucide-react";

interface TemplateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateUploadModal({ isOpen, onClose }: TemplateUploadModalProps) {
  const { uploadTemplate, templates, loading } = usePDFs();
  const [templateAFile, setTemplateAFile] = useState<File | null>(null);
  const [templateBFile, setTemplateBFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Check if templates exist
  const templateAExists = templates.some(template => template.type === "A");
  const templateBExists = templates.some(template => template.type === "B");

  const resetForm = () => {
    setTemplateAFile(null);
    setTemplateBFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "A" | "B") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Invalid File",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        return;
      }

      if (type === "A") {
        setTemplateAFile(file);
      } else {
        setTemplateBFile(file);
      }
    }
  };

  const removeFile = (type: "A" | "B") => {
    if (type === "A") {
      setTemplateAFile(null);
    } else {
      setTemplateBFile(null);
    }
  };

  const handleSubmitTemplateA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateAFile) return;
    
    setIsUploading(true);
    try {
      const success = await uploadTemplate(templateAFile, "A");
      if (success) {
        setTemplateAFile(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitTemplateB = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateBFile) return;
    
    setIsUploading(true);
    try {
      const success = await uploadTemplate(templateBFile, "B");
      if (success) {
        setTemplateBFile(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Upload Templates</DialogTitle>
          <DialogDescription>
            Upload template files for PDF processing. Both templates are required for processing PDFs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Template A Upload */}
          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Template A</h3>
              {templateAExists && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Already Uploaded
                </span>
              )}
            </div>
            
            {templateAFile ? (
              <div className="flex items-center justify-between p-2 bg-muted rounded animate-fade-in">
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {templateAFile.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile("A")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="template-a-file" className="sr-only">Upload Template A</Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById("template-a-file")?.click()}
                >
                  <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium text-center">Click to upload Template A</p>
                  <p className="text-xs text-muted-foreground mt-1 text-center">or drag and drop</p>
                  <Input
                    id="template-a-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, "A")}
                    className="hidden"
                  />
                </div>
              </div>
            )}
            
            <Button 
              className="w-full" 
              disabled={!templateAFile || isUploading} 
              onClick={handleSubmitTemplateA}
            >
              {templateAExists ? "Replace Template A" : "Upload Template A"}
            </Button>
          </div>

          {/* Template B Upload */}
          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Template B</h3>
              {templateBExists && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Already Uploaded
                </span>
              )}
            </div>
            
            {templateBFile ? (
              <div className="flex items-center justify-between p-2 bg-muted rounded animate-fade-in">
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {templateBFile.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile("B")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="template-b-file" className="sr-only">Upload Template B</Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById("template-b-file")?.click()}
                >
                  <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium text-center">Click to upload Template B</p>
                  <p className="text-xs text-muted-foreground mt-1 text-center">or drag and drop</p>
                  <Input
                    id="template-b-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, "B")}
                    className="hidden"
                  />
                </div>
              </div>
            )}
            
            <Button 
              className="w-full" 
              disabled={!templateBFile || isUploading} 
              onClick={handleSubmitTemplateB}
            >
              {templateBExists ? "Replace Template B" : "Upload Template B"}
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
