"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sign-up");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-fuchsia-500 via-pink-500 to-orange-500 p-3 sm:p-5">
      <div className="w-full max-w-md p-5 sm:p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold">No verification ID provided</h1>
        <p className="text-gray-600">Redirecting to sign up...</p>
      </div>
    </div>
  );
}
