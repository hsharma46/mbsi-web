
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePDFs } from "@/contexts/PDFsContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, File } from "lucide-react";

interface PDFPage {
  id: string;
  number: number;
  title: string;
}

const PDFViewer = () => {
  const { id } = useParams();
  const { pdfs, selectedPDF, setSelectedPDF } = usePDFs();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Mock 5 pages
  const [pdfPages, setPdfPages] = useState<PDFPage[]>([]);

  useEffect(() => {
    // Find PDF if it wasn't selected from dashboard
    if (!selectedPDF && id) {
      const foundPdf = pdfs.find(pdf => pdf.id === id);
      if (foundPdf) {
        setSelectedPDF(foundPdf);
      }
    }

    // Generate mock PDF pages
    const mockPages: PDFPage[] = [];
    for (let i = 1; i <= 5; i++) {
      mockPages.push({
        id: `page-${i}`,
        number: i,
        title: `Page ${i} - ${i === 1 ? 'Cover' : i === 2 ? 'Summary' : i === 3 ? 'Data' : i === 4 ? 'Analysis' : 'Conclusion'}`
      });
    }
    setPdfPages(mockPages);
  }, [id, pdfs, selectedPDF, setSelectedPDF]);

  const handleDownloadExcel = () => {
    // Mock download Excel file
    console.log("Downloading Excel for PDF:", selectedPDF?.name);
    
    // API call pseudocode:
    // const response = await fetch(`/api/pdfs/${selectedPDF?.id}/excel`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // const blob = await response.blob();
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `${selectedPDF?.name.replace('.pdf', '')}-data.xlsx`;
    // document.body.appendChild(a);
    // a.click();
    // a.remove();
    
    // Mock download with alert
    alert(`Excel file for ${selectedPDF?.name} would be downloaded here`);
  };

  const navigateToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // In a real app, we would update the PDF viewer to show that page
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {selectedPDF?.name || "PDF Viewer"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedPDF?.companyName} - {selectedPDF?.uploadDate}
            </p>
          </div>
          <Button 
            onClick={handleDownloadExcel}
            className="hover-scale"
            disabled={!selectedPDF?.processed}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Excel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left sidebar with PDF navigation */}
          <Card className="md:col-span-3 animate-fade-in">
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-3">PDF Contents</h3>
              <div className="space-y-1">
                {pdfPages.map((page) => (
                  <Button
                    key={page.id}
                    variant={currentPage === page.number ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigateToPage(page.number)}
                  >
                    <File className="h-4 w-4 mr-2" />
                    {page.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right side with PDF viewer */}
          <Card className="md:col-span-9 animate-fade-in">
            <CardContent className="p-4">
              <Tabs defaultValue="view">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="view">View PDF</TabsTrigger>
                    <TabsTrigger value="info">Document Info</TabsTrigger>
                  </TabsList>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>

                <TabsContent value="view" className="mt-0">
                  <div className="bg-muted aspect-[4/3] rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                    {!selectedPDF ? (
                      <div className="text-center">
                        <p>No PDF selected</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h3 className="text-xl font-medium mb-4">
                          {selectedPDF.name} - Page {currentPage}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {currentPage === 1
                            ? "Cover Page"
                            : currentPage === 2
                            ? "Summary Content"
                            : currentPage === 3
                            ? "Data Tables and Figures"
                            : currentPage === 4
                            ? "Analysis and Results"
                            : "Conclusions and Next Steps"}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          (PDF Preview would be rendered here in a real application)
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigateToPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="info">
                  {selectedPDF && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">File Name</h3>
                          <p>{selectedPDF.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                          <p>{selectedPDF.companyName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Upload Date</h3>
                          <p>{selectedPDF.uploadDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Uploaded By</h3>
                          <p>{selectedPDF.uploaderName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                          <p className="capitalize">{selectedPDF.type}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Template</h3>
                          <p>{selectedPDF.template || "None"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              selectedPDF.processed
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {selectedPDF.processed ? "Processed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PDFViewer;
