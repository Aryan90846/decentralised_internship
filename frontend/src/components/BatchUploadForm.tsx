'use client';

import { useState } from 'react';
import { Upload, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function BatchUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast.error('Please upload a CSV file');
        return;
      }
      setFile(selectedFile);
      toast.success('File selected: ' + selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/batch-mint', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Batch minting failed');
      }

      const result = await response.json();
      toast.success(`Successfully minted ${result.count} certificates!`);
      setFile(null);
    } catch (err: any) {
      console.error('Error batch minting:', err);
      toast.error(err.message || 'Failed to batch mint certificates');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'recipient_address,recipient_name,program,issue_date\n0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1,John Doe,Full Stack Web3 Internship,2024-01-15\n0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199,Jane Smith,Smart Contract Development Internship,2024-01-20';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Template downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-3">
          Upload a CSV file with columns: recipient_address, recipient_name, program, issue_date
        </p>
        <button
          type="button"
          onClick={downloadTemplate}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download CSV Template
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload CSV File
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-brand-400 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              {file ? (
                <p className="text-slate-700 font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-slate-700 font-medium mb-1">
                    Click to upload CSV
                  </p>
                  <p className="text-sm text-slate-500">
                    or drag and drop
                  </p>
                </>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || isProcessing}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Batch...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Mint Batch
            </>
          )}
        </button>
      </form>

      <div className="text-xs text-slate-500 space-y-1">
        <p>• Maximum 50 certificates per batch</p>
        <p>• All wallet addresses must be valid Ethereum addresses</p>
        <p>• Dates should be in YYYY-MM-DD format</p>
      </div>
    </div>
  );
}
