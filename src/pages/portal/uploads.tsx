// src/pages/portal/uploads.tsx

import { useState } from 'react';
import Layout from '@/components/Layout';
import { UploadZone } from '@/components/Uploads/UploadZone';
import { FileList } from '@/components/Uploads/FileList';
import { ParsedTable } from '@/components/Uploads/ParsedTable';
import { ParsedTransaction, parseCSV } from '@/lib/tax';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function UploadsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleUpload = async (newFiles: File[]) => {
    setError(null);
    setIsParsing(true);
    setFiles(newFiles);

    const allParsed: ParsedTransaction[] = [];

    for (const file of newFiles) {
      if (file.name.endsWith('.csv')) {
        try {
          const parsed = await parseCSV(file);
          allParsed.push(...parsed);
        } catch (err) {
          setError(`Failed to parse ${file.name}`);
        }
      } else {
        console.log(`Stored file for future AI processing: ${file.name}`);
      }
    }

    setParsedData(allParsed);
    setIsParsing(false);
  };

  return (
    <Layout>
      <div className="space-y-6 px-6 py-8">
        <h1 className="text-2xl font-semibold">Upload Your Documents</h1>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
          Upload CSV files from your bank or accounting software. We’ll parse your transactions, auto-categorize them, and let you save them to your dashboard.
          <div className="mt-2 text-xs text-blue-700">
            Expected format: <code>date,amount,vendor,category</code><br />
            Example: <code>2025-08-01,12.99,Tesco,Groceries</code>
          </div>
        </div>

        <UploadZone onUpload={handleUpload}>
          <div className="flex flex-col items-center justify-center text-gray-500">
            <ArrowUpTrayIcon className="h-8 w-8 mb-2" />
            <p>Drag & drop files here</p>
          </div>
        </UploadZone>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {files.length === 0 && (
          <div className="text-sm text-muted italic">
            No files yet. Drag & drop your CSVs or PDFs to get started.
          </div>
        )}

        {files.length > 0 && <FileList files={files} isParsing={isParsing} />}
        {isParsing && (
          <div className="text-sm text-muted italic">Parsing transactions...</div>
        )}
        {parsedData.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
            {parsedData.length} transactions parsed. Review and accept below.
          </div>
        )}
        {parsedData.length > 0 && <ParsedTable data={parsedData} />}
      </div>
    </Layout>
  );
}

UploadsPage.requiresAuth = true;
