"use client";

import WelcomeHeader from "@/components/ui/myComponents/welcomeHeader";
import { ApiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  const handleEnter = async () => {
    const cleanedUsername = username.trim();

    if (!cleanedUsername) {
      toast.error("enter username");
      return;
    }

    try {
      setCheckingUsername(true);
      await axios.post("/api/check-username", { username: cleanedUsername });
      router.push(`/profile/${encodeURIComponent(cleanedUsername)}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "invalid username");
    } finally {
      setCheckingUsername(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-fuchsia-500 via-pink-500 to-orange-500 p-3 sm:p-5">
      <div className="min-h-[90vh] w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-lg space-y-6 sm:space-y-8">
        <WelcomeHeader appName="NotNGL" subtitle="Say it. I won’t tell them" />

        <div className="flex gap-4 flex-col justify-center items-center text-gray-700">
          <p className="text-lg sm:text-2xl font-medium text-center sm:text-left">
            Ever wanted to say something but didn’t want your name attached?
          </p>

          <p className="text-sm leading-relaxed text-center sm:text-left max-w-3xl">
            <span className="font-semibold text-pink-600">NotNGL</span> lets you
            send completely anonymous messages to anyone. No accounts to expose,
            no awkward follow-ups, and no fear of being judged.
          </p>

          <div className="my-2 sm:my-4 grid grid-cols-1 lg:grid-cols-2 justify-center gap-4 sm:gap-6 w-full max-w-6xl">
            <div className="rounded-lg border border-pink-200 bg-pink-50 p-5 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Want to receive anonymous messages?
              </h2>
              <p className="text-sm text-gray-600">
                Create your own profile link and let people send you mystery
                messages. Share it anywhere — Instagram, WhatsApp, or with
                friends.
              </p>
              <a
                href="/sign-up"
                className="inline-block rounded-md bg-pink-600 my-3 px-5 py-2 text-sm font-medium text-white hover:bg-pink-700 transition"
              >
                Join NotNGL
              </a>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Already have a NotNGL Username?
              </h2>
              <p className="text-sm text-gray-600">
                Paste the profile Username below and send an anonymous message —
                no sign-up required.
              </p>
              <input
                type="text"
                placeholder="Paste Username here"
                onChange={(e) => setUsername(e.target.value)}
                disabled={checkingUsername}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEnter();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleEnter}
                disabled={checkingUsername}
                className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition"
              >
                Continue
              </button>
              <p className="text-xs text-gray-500">
                Don’t worry — your identity is never revealed.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          No tracking. No names. Just messages.
        </p>
      </div>
    </div>
  );
}
