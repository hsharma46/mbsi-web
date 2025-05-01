import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

export interface PDFDocument {
  id: string;
  name: string;
  uploadDate: string;
  companyName: string;
  uploaderName: string;
  type: "company" | "proprietary";
  template?: "A" | "B";
  processed: boolean;
}

export interface Template {
  id: string;
  name: string;
  type: "A" | "B";
  uploadDate: string;
  uploaderName: string;
}

interface PDFsContextType {
  pdfs: PDFDocument[];
  templates: Template[];
  loading: boolean;
  fetchPDFs: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  uploadPDF: (file: File, type: "company" | "proprietary", companyName: string, template?: "A" | "B") => Promise<boolean>;
  uploadTemplate: (file: File, type: "A" | "B") => Promise<boolean>;
  processPDF: (id: string) => Promise<boolean>;
  selectedPDF: PDFDocument | null;
  setSelectedPDF: React.Dispatch<React.SetStateAction<PDFDocument | null>>;
  checkTemplatesExist: () => { A: boolean; B: boolean };
}

const PDFsContext = createContext<PDFsContextType>({
  pdfs: [],
  templates: [],
  loading: false,
  fetchPDFs: async () => {},
  fetchTemplates: async () => {},
  uploadPDF: async () => false,
  uploadTemplate: async () => false,
  processPDF: async () => false,
  selectedPDF: null,
  setSelectedPDF: () => {},
  checkTemplatesExist: () => ({ A: false, B: false }),
});

export const usePDFs = () => useContext(PDFsContext);

export const PDFsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pdfs, setPDFs] = useState<PDFDocument[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPDF, setSelectedPDF] = useState<PDFDocument | null>(null);
  const { token } = useAuth();

  const fetchPDFs = async () => {
    setLoading(true);
    try {
      // Mock API call
      console.log("Fetching PDFs with token:", token);

      // API call pseudocode:
      // const response = await fetch('/api/pdfs', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // if (!response.ok) throw new Error('Failed to fetch PDFs');
      // const data = await response.json();

      // Mock data with more examples
      const mockPDFs: PDFDocument[] = [
        {
          id: "1",
          name: "Financial Report Q4 2024.pdf",
          uploadDate: "2024-04-28",
          companyName: "Acme Corp",
          uploaderName: "John Doe",
          type: "company",
          template: "A",
          processed: true,
        },
        {
          id: "2",
          name: "Internal Audit 2024.pdf",
          uploadDate: "2024-04-25",
          companyName: "Acme Corp",
          uploaderName: "Jane Smith",
          type: "proprietary",
          template: "B",
          processed: false,
        },
        {
          id: "3",
          name: "Customer Analysis.pdf",
          uploadDate: "2024-04-20",
          companyName: "Globex Inc",
          uploaderName: "John Doe",
          type: "company",
          template: "A",
          processed: true,
        },
        {
          id: "4",
          name: "Annual Budget 2025.pdf",
          uploadDate: "2024-04-18",
          companyName: "TechCorp",
          uploaderName: "Alex Johnson",
          type: "proprietary",
          template: "A",
          processed: true,
        },
        {
          id: "5",
          name: "Quarterly Analysis Q1 2024.pdf",
          uploadDate: "2024-04-15",
          companyName: "Initech",
          uploaderName: "Michael Scott",
          type: "company",
          template: "B",
          processed: false,
        },
        {
          id: "6",
          name: "Strategic Plan 2025-2030.pdf",
          uploadDate: "2024-04-12",
          companyName: "Wayne Enterprises",
          uploaderName: "Bruce Wayne",
          type: "company",
          template: "A",
          processed: true,
        },
        {
          id: "7",
          name: "Employee Handbook 2024.pdf",
          uploadDate: "2024-04-10",
          companyName: "Stark Industries",
          uploaderName: "Tony Stark",
          type: "proprietary",
          template: "B",
          processed: false,
        },
      ];

      setTimeout(() => {
        setPDFs(mockPDFs);
        setLoading(false);
      }, 800); // Simulate network delay
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch PDFs",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      // Mock API call
      console.log("Fetching templates with token:", token);

      // Mock data
      const mockTemplates: Template[] = [
        {
          id: "1",
          name: "Financial Template.pdf",
          type: "A",
          uploadDate: "2024-04-10",
          uploaderName: "John Doe",
        },
        {
          id: "2",
          name: "Audit Template.pdf",
          type: "B",
          uploadDate: "2024-04-08",
          uploaderName: "Jane Smith",
        },
      ];

      setTimeout(() => {
        setTemplates(mockTemplates);
        setLoading(false);
      }, 600); // Simulate network delay
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const uploadPDF = async (
    file: File,
    type: "company" | "proprietary",
    companyName: string,
    template?: "A" | "B"
  ): Promise<boolean> => {
    // Check if required templates exist before uploading
    const templatesExist = checkTemplatesExist();
    if (!templatesExist.A || !templatesExist.B) {
      toast({
        title: "Template Required",
        description: "Please upload both templates before uploading PDFs",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      // Mock API call
      console.log(`Uploading ${type} PDF:`, file.name, "for company:", companyName);
      
      // Mock successful upload with new PDF
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPDF: PDFDocument = {
            id: `pdf-${Date.now()}`,
            name: file.name,
            uploadDate: new Date().toISOString().split("T")[0],
            companyName,
            uploaderName: "Current User", // In real app, get from auth context
            type,
            template,
            processed: false,
          };
          
          setPDFs((current) => [newPDF, ...current]);
          setLoading(false);
          
          toast({
            title: "Upload Successful",
            description: `${file.name} has been uploaded successfully.`,
          });
          
          resolve(true);
        }, 1500); // Simulate upload time
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an issue with your upload. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const uploadTemplate = async (
    file: File,
    type: "A" | "B"
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Mock API call
      console.log(`Uploading template ${type}:`, file.name);
      
      // Check if template of this type already exists
      const existingTemplateIndex = templates.findIndex(t => t.type === type);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newTemplate: Template = {
            id: `template-${Date.now()}`,
            name: file.name,
            type,
            uploadDate: new Date().toISOString().split("T")[0],
            uploaderName: "Current User", // In real app, get from auth context
          };
          
          // If template exists, replace it
          if (existingTemplateIndex >= 0) {
            setTemplates(current => 
              current.map((t, i) => i === existingTemplateIndex ? newTemplate : t)
            );
          } else {
            // Otherwise add it
            setTemplates(current => [...current, newTemplate]);
          }
          
          setLoading(false);
          
          toast({
            title: "Template Upload Successful",
            description: `${file.name} has been uploaded as Template ${type}.`,
          });
          
          resolve(true);
        }, 1500); // Simulate upload time
      });
    } catch (error) {
      console.error("Template upload error:", error);
      toast({
        title: "Template Upload Failed",
        description: "There was an issue with your template upload. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const processPDF = async (id: string): Promise<boolean> => {
    try {
      // Mock API call
      console.log("Processing PDF with ID:", id);
      
      // Mock successful processing
      return new Promise((resolve) => {
        setTimeout(() => {
          setPDFs((current) =>
            current.map((pdf) =>
              pdf.id === id ? { ...pdf, processed: true } : pdf
            )
          );
          
          toast({
            title: "Processing Complete",
            description: "The PDF has been processed successfully.",
          });
          
          resolve(true);
        }, 1500); // Simulate processing time
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing Failed",
        description: "There was an issue processing this PDF. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const checkTemplatesExist = () => {
    const hasTemplateA = templates.some(template => template.type === "A");
    const hasTemplateB = templates.some(template => template.type === "B");
    return { A: hasTemplateA, B: hasTemplateB };
  };

  // Initialize by fetching data
  React.useEffect(() => {
    if (token) {
      fetchPDFs();
      fetchTemplates();
    }
  }, [token]);

  const value = {
    pdfs,
    templates,
    loading,
    fetchPDFs,
    fetchTemplates,
    uploadPDF,
    uploadTemplate,
    processPDF,
    selectedPDF,
    setSelectedPDF,
    checkTemplatesExist,
  };

  return <PDFsContext.Provider value={value}>{children}</PDFsContext.Provider>;
};
