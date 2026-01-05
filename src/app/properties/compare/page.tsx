"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Comparison feature disabled for MVP — redirect to properties page
export default function ComparePropertiesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/properties");
  }, [router]);

  return null;
}
