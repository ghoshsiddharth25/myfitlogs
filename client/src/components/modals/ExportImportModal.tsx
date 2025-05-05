import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportAllData, importData } from '@/lib/csvHandler';
import { useHealthData } from '@/contexts/HealthDataContext';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportImportModal({ isOpen, onClose }: ExportImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { refreshData } = useHealthData();
  
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const handleExport = () => {
    try {
      exportAllData();
      toast({
        title: "Export successful",
        description: "Your data has been exported to CSV files",
        variant: "default",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: `An error occurred: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };
  
  const handleTriggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    setImportStatus(null);
    
    try {
      const result = await importData(file);
      setImportStatus(result);
      
      if (result.success) {
        refreshData();
        toast({
          title: "Import successful",
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Import failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus({
        success: false,
        message: `An error occurred: ${(error as Error).message}`,
      });
      
      toast({
        title: "Import failed",
        description: `An error occurred: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md mx-4 rounded-lg">
        <DialogHeader className="flex justify-between items-center px-0">
          <DialogTitle className="text-lg font-medium">Export / Import Data</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Export Data</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Download all your data in CSV format for backup or analysis.
            </p>
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-primary text-white flex items-center justify-center" 
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-1" />
                Export All Data
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-3">Import Data</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Import data from a CSV file. This will replace your current data.
            </p>
            
            {importStatus && (
              <Alert className={`mb-4 ${importStatus.success ? 'bg-success/20' : 'bg-destructive/20'}`}>
                <div className="flex items-start">
                  {importStatus.success ? (
                    <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5" />
                  )}
                  <AlertDescription className="text-sm">
                    {importStatus.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop a CSV file here, or
              </p>
              <Button 
                variant="outline" 
                className="mt-2 border-primary text-primary" 
                onClick={handleTriggerFileUpload}
                disabled={importing}
              >
                {importing ? 'Importing...' : 'Browse files'}
              </Button>
              <input 
                type="file" 
                className="hidden" 
                id="fileUpload" 
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileChange}
                disabled={importing}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
