
import { useState } from "react";
import { usePDFs } from "@/contexts/PDFsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "@/hooks/use-toast";
import { FileUp, X, File, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { uploadPDF, checkTemplatesExist } = usePDFs();
  const [companyFile, setCompanyFile] = useState<File | null>(null);
  const [proprietaryFile, setProprietaryFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Check if templates exist
  const templatesExist = checkTemplatesExist();
  const allTemplatesExist = templatesExist.A && templatesExist.B;

  const resetForm = () => {
    setCompanyFile(null);
    setProprietaryFile(null);
    setCompanyName("");
    setIsUploading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "company" | "proprietary") => {
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

      if (type === "company") {
        setCompanyFile(file);
        setProprietaryFile(null); // Clear the other file when one is selected
      } else {
        setProprietaryFile(file);
        setCompanyFile(null); // Clear the other file when one is selected
      }
    }
  };

  const removeFile = (type: "company" | "proprietary") => {
    if (type === "company") {
      setCompanyFile(null);
    } else {
      setProprietaryFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allTemplatesExist) {
      toast({
        title: "Templates Required",
        description: "Please upload both templates before uploading PDFs",
        variant: "destructive",
      });
      return;
    }
    
    if (!companyName) {
      toast({
        title: "Company Name Required",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    const fileToUpload = companyFile || proprietaryFile;
    const fileType = companyFile ? "company" : "proprietary";
    
    if (!fileToUpload) {
      toast({
        title: "File Required",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Automatically determine the template type based on the file type
      const templateType = fileType === "company" ? "A" : "B";
      const success = await uploadPDF(fileToUpload, fileType, companyName, templateType);
      if (success) {
        handleClose();
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
          <DialogDescription>
            Upload a company or proprietary PDF document
          </DialogDescription>
        </DialogHeader>

        {!allTemplatesExist && (
          <Alert variant="destructive" className="animate-fade-in mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please upload both templates before uploading PDFs.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              disabled={!allTemplatesExist}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company PDF Upload */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Company PDF</h3>
              {companyFile ? (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center">
                    <File className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {companyFile.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile("company")}
                    disabled={!allTemplatesExist}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${
                      (allTemplatesExist && !proprietaryFile) 
                        ? 'hover:border-primary/50 cursor-pointer' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (allTemplatesExist && !proprietaryFile) {
                        document.getElementById("company-file")?.click();
                      }
                    }}
                  >
                    <FileUp className="h-6 w-6 mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground">or drag and drop</p>
                    <Input
                      id="company-file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, "company")}
                      className="hidden"
                      disabled={!allTemplatesExist || !!proprietaryFile}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Proprietary PDF Upload */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Proprietary PDF</h3>
              {proprietaryFile ? (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center">
                    <File className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {proprietaryFile.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile("proprietary")}
                    disabled={!allTemplatesExist}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${
                      (allTemplatesExist && !companyFile) 
                        ? 'hover:border-primary/50 cursor-pointer' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (allTemplatesExist && !companyFile) {
                        document.getElementById("proprietary-file")?.click();
                      }
                    }}
                  >
                    <FileUp className="h-6 w-6 mb-1 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground">or drag and drop</p>
                    <Input
                      id="proprietary-file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, "proprietary")}
                      className="hidden"
                      disabled={!allTemplatesExist || !!companyFile}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                isUploading || 
                !companyName || 
                !(companyFile || proprietaryFile) ||
                !allTemplatesExist
              }
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}