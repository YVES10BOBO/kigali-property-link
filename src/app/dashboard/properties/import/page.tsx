"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BulkImportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setSuccess(null);
    setPreview([]);

    // Parse CSV or JSON
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let data: any[] = [];

        if (selectedFile.name.endsWith('.csv')) {
          // Parse CSV
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
            });
            data.push(obj);
          }
        } else if (selectedFile.name.endsWith('.json')) {
          // Parse JSON
          data = JSON.parse(text);
          if (!Array.isArray(data)) {
            data = [data];
          }
        } else {
          setError('Unsupported file format. Please use CSV or JSON.');
          return;
        }

        setPreview(data.slice(0, 5)); // Show first 5 rows
      } catch (err) {
        setError('Failed to parse file. Please check the format.');
        console.error(err);
      }
    };

    if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.json')) {
      reader.readAsText(selectedFile);
    } else {
      setError('Please select a CSV or JSON file.');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Read file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          let properties: any[] = [];

          if (file.name.endsWith('.csv')) {
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',').map(v => v.trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index] || '';
              });
              properties.push(obj);
            }
          } else if (file.name.endsWith('.json')) {
            properties = JSON.parse(text);
            if (!Array.isArray(properties)) {
              properties = [properties];
            }
          }

          // Send to API
          const response = await fetch('/api/properties/import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ properties, format: file.name.endsWith('.csv') ? 'csv' : 'json' }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            setSuccess(`Successfully imported ${result.imported} properties!`);
            setImportResults(result);
            setFile(null);
            setPreview([]);
            
            // Reset file input
            const fileInput = document.getElementById('file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          } else {
            setError(result.error || 'Failed to import properties');
            setImportResults(result);
          }
        } catch (err) {
          setError('Failed to process file');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      reader.readAsText(file);
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/properties"
            className="text-primary hover:text-primary-dark mb-4 inline-block"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Import Properties</h1>
          <p className="text-gray-600 mt-2">Import multiple properties from CSV or JSON file</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            <i className="fas fa-info-circle mr-2"></i>
            Import Instructions
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Required fields: <strong>title</strong>, <strong>price</strong>, <strong>location</strong></li>
            <li>Optional fields: description, bedrooms, bathrooms, area, price_type (rent/sale), furnished, parking, security, generator</li>
            <li>For amenities/images: Use comma-separated values</li>
            <li>All imported properties will be set to "Pending Approval" status</li>
            <li>Supported formats: CSV, JSON</li>
          </ul>
        </div>

        {/* CSV Example */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">CSV Format Example:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`title,price,location,bedrooms,bathrooms,area,price_type,description
Modern Apartment,500,Kigali,2,1,80,rent,Beautiful apartment in city center
House for Sale,150000,Kigali,3,2,120,sale,Spacious family home`}
          </pre>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File (CSV or JSON)
          </label>
          <input
            id="file-input"
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Preview (First 5 rows):</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(preview[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-2 text-left font-medium text-gray-700">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index} className="border-b">
                      {Object.values(row).map((value: any, i) => (
                        <td key={i} className="px-4 py-2 text-gray-600">
                          {String(value).substring(0, 50)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Import Results */}
        {importResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Import Results:</h3>
            <div className="space-y-2">
              <p><strong>Imported:</strong> {importResults.imported}</p>
              <p><strong>Total:</strong> {importResults.total}</p>
              {importResults.errors > 0 && (
                <p className="text-red-600"><strong>Errors:</strong> {importResults.errors}</p>
              )}
              {importResults.errorDetails && importResults.errorDetails.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-900 mb-2">Error Details:</p>
                  <div className="bg-red-50 p-4 rounded max-h-48 overflow-y-auto">
                    {importResults.errorDetails.map((err: any, index: number) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        Row {err.row}: {err.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/properties"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Importing...
              </>
            ) : (
              <>
                <i className="fas fa-upload mr-2"></i>
                Import Properties
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
