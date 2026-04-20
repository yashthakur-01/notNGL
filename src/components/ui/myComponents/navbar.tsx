"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../button";
import { toast } from "sonner";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;

  // console.log("user \n", user);
  return (
    <div className="w-full border-b bg-white shadow-md bg-linear-to-r from-pink-50 to-orange-50 border border-pink-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-0 gap-2">
        <Link href="#" className="flex items-center gap-2">
          <Image src="/ngl.svg" alt="logo" width={78} height={78} className="sm:w-[100px] sm:h-[100px]"></Image>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {session ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-xl font-medium text-gray-700 max-w-[110px] sm:max-w-none truncate">
                Welcome, {user.username || user.email}
              </span>

              <Button
                onClick={() => {
                  toast.message("Logging out");
                  signOut();
                }}
                className="rounded-md bg-pink-500 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white hover:bg-pink-600 transition"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                asChild
                className="rounded-md bg-pink-500 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white hover:bg-pink-600 transition"
              >
                <span>Signin</span>
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
