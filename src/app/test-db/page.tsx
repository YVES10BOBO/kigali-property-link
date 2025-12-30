"use client";

import { useState } from "react";

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-dark mb-6">Test Database Connection</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Click the button below to test if your Supabase database is connected correctly.
          </p>
          
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Testing..." : "Test Connection"}
          </button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg ${
            result.success 
              ? "bg-green-50 border-2 border-green-200" 
              : "bg-red-50 border-2 border-red-200"
          }`}>
            {result.success ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-check-circle text-green-600 text-2xl"></i>
                  <h2 className="text-xl font-bold text-green-800">Connection Successful!</h2>
                </div>
                <p className="text-green-700 mb-2">{result.message}</p>
                <p className="text-sm text-green-600">
                  Your database is connected and ready to use!
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-times-circle text-red-600 text-2xl"></i>
                  <h2 className="text-xl font-bold text-red-800">Connection Failed</h2>
                </div>
                <p className="text-red-700 mb-2 font-semibold">Error: {result.error}</p>
                {result.details && (
                  <div className="mt-4">
                    <p className="text-sm text-red-600 font-semibold mb-1">Details:</p>
                    <pre className="bg-red-100 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
                <div className="mt-4 text-sm text-red-600">
                  <p className="font-semibold mb-2">Check these:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your .env.local file has correct values</li>
                    <li>NEXT_PUBLIC_SUPABASE_URL is correct</li>
                    <li>NEXT_PUBLIC_SUPABASE_ANON_KEY is correct</li>
                    <li>Your Supabase project is active</li>
                    <li>You've run the database migration</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Make sure you've:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1">
            <li>Created .env.local file with your credentials</li>
            <li>Restarted your dev server after adding .env.local</li>
            <li>Run the SQL migration in Supabase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


