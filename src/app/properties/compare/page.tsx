"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Property comparison feature disabled for MVP
// Redirect to properties page
export default function ComparePropertiesPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to properties page
    router.replace("/properties");
  }, [router]);
  
  return null;

}
