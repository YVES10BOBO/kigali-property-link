import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

// This page relies on runtime URL search params; disable static generation
export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-light px-4 py-12">
          <div className="text-gray-600">Loading reset form...</div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}

