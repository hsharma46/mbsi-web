
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePDFs } from "@/contexts/PDFsContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { UploadModal } from "@/components/UploadModal";
import { TemplateUploadModal } from "@/components/TemplateUploadModal";
import { FileUp, Search, Clock, FileText, Building, User, Download, Info, Calendar, AlertTriangle, Folder } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { pdfs, templates, loading, fetchPDFs, fetchTemplates, processPDF, setSelectedPDF, checkTemplatesExist } = usePDFs();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const navigate = useNavigate();

  // Check if templates exist
  const templatesStatus = checkTemplatesExist();
  const allTemplatesExist = templatesStatus.A && templatesStatus.B;

  useEffect(() => {
    console.log("Fetching PDFs and templates on dashboard mount");
    fetchPDFs();
    fetchTemplates();
  }, []);

  // Log PDFs for debugging
  useEffect(() => {
    console.log("Current PDFs in state:", pdfs);
  }, [pdfs]);

  const handleProcessTemplate = async (pdfId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await processPDF(pdfId);
  };

  const handleViewPDF = (pdf: any) => {
    setSelectedPDF(pdf);
    navigate(`/pdf-viewer/${pdf.id}`);
  };

  const filteredPDFs = pdfs.filter(
    (pdf) =>
      pdf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get tag color based on PDF type
  const getTypeTagColor = (type: string) => {
    return type === "company" 
      ? "bg-blue-100 text-blue-700" 
      : "bg-purple-100 text-purple-700";
  };

  // Get tag color based on template type
  const getTemplateTagColor = (template: string) => {
    return template === "A" 
      ? "bg-green-100 text-green-700" 
      : "bg-amber-100 text-amber-700";
  };

  const renderUploadButton = () => (
    <Button
      onClick={() => {
        if (!allTemplatesExist) {
          setIsTemplateModalOpen(true);
        } else {
          setIsUploadModalOpen(true);
        }
      }}
      className="hover-scale"
    >
      <FileUp className="mr-2 h-4 w-4" />
      Upload PDF
    </Button>
  );

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold animate-fade-in">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your PDF documents
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsTemplateModalOpen(true)}
              className="hover-scale"
            >
              <Folder className="mr-2 h-4 w-4" />
              Manage Templates
            </Button>
            {renderUploadButton()}
          </div>
        </div>

        {!allTemplatesExist && (
          <Alert className="animate-fade-in">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Templates Required</AlertTitle>
            <AlertDescription>
              You need to upload both templates before you can upload PDFs.
              <Button 
                variant="link" 
                className="p-0 h-auto ml-2" 
                onClick={() => setIsTemplateModalOpen(true)}
              >
                Upload Templates
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card className="animate-fade-in overflow-hidden border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search PDFs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {Array.isArray(filteredPDFs) && filteredPDFs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPDFs.map((pdf) => (
                      <Card 
                        key={pdf.id} 
                        className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border border-slate-200 overflow-hidden card-shadow"
                      >
                        <div className={`h-2 w-full ${pdf.processed ? "bg-brand-500" : "bg-slate-300"}`}></div>
                        <CardHeader className="p-4 pb-2 bg-slate-50">
                          <CardTitle className="flex items-start gap-3 text-lg group">
                            <div className="bg-brand-100 text-brand-700 p-2 rounded-md">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="truncate font-medium flex-1">
                              {pdf.name}
                            </div>
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeTagColor(pdf.type)}`}>
                              {pdf.type === "company" ? "Company" : "Proprietary"}
                            </span>
                            {pdf.template && (
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTemplateTagColor(pdf.template)}`}>
                                Template {pdf.template}
                              </span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pb-2 space-y-3">
                          <div className="flex flex-wrap justify-between gap-2">
                            <div className="flex items-center bg-slate-100 px-2 py-1 rounded-md">
                              <Building className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="text-xs font-medium">{pdf.companyName}</span>
                            </div>
                            <div className="flex items-center bg-slate-100 px-2 py-1 rounded-md">
                              <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="text-xs font-medium">{pdf.uploaderName}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center bg-slate-100 px-2 py-1 rounded-md">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="text-xs font-medium">{pdf.uploadDate}</span>
                            </div>
                            <Badge 
                              variant={pdf.processed ? "default" : "secondary"}
                              className={`${pdf.processed ? "bg-green-500 hover:bg-green-600" : ""}`}
                            >
                              {pdf.processed ? "Processed" : "Pending"}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-1 bg-slate-50 flex justify-between gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-slate-300"
                            onClick={() => handleViewPDF(pdf)}
                          >
                            <Info className="h-4 w-4 mr-1" />
                            Show Details
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className={`flex-1 ${pdf.processed ? "bg-brand-500 text-white hover:bg-brand-600" : ""}`}
                            disabled={!pdf.processed}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Excel
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg">No PDFs found</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your first PDF document to get started
                    </p>
                    {renderUploadButton()}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
      
      <TemplateUploadModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </Layout>
  );
};

export default Dashboard;
