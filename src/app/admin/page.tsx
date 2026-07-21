"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}
