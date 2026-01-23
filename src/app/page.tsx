"use client";

import WelcomeHeader from "@/components/ui/myComponents/welcomeHeader";
import { ApiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


export default function Home() {
const router = useRouter();
const [username,setUsername]=useState("");
const [checkingUsername,setCheckingUsername] = useState(false);

const handleEnter = async ()=>{

  try {
    setCheckingUsername(true);
    const res = await axios.post("/api/check-username",{username})
    router.push(`/profile/${username}`)
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast.error(axiosError.response?.data.message);
  }finally{
    setCheckingUsername(false);
  }
}

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-fuchsia-500 via-pink-500 to-orange-500">
      <div className="min-h-[90vh] w-[90vw] mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
        <WelcomeHeader appName="NotNGL" subtitle="Say it. I won’t tell them" />

        <div className="flex gap-4 flex-col justify-center items-center space-y-4 text-gray-700">
          <p className="text-2xl font-medium">
            Ever wanted to say something but didn’t want your name attached?
          </p>

          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-pink-600">NotNGL</span> lets you
            send completely anonymous messages to anyone. No accounts to expose,
            no awkward follow-ups, and no fear of being judged.
          </p>

          <div className="my-4 grid grid-cols-2 justify-center gap-8 max-w-[85%]">
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
                Paste the profile Username below and send an anonymous message — no
                sign-up required.
              </p>
              <input
                type="text"
                placeholder="Paste Username here"
                onChange={(e)=>(setUsername(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEnter();
                  }
                }}
                contentEditable={checkingUsername}
              />
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
