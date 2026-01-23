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
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 ">
        <Link href="#" className="flex items-center gap-2">
          <Image src="/ngl.svg" alt="logo" width={100} height={100}></Image>
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-xl font-medium text-gray-700">
                Welcome, {user.username || user.email}
              </span>

              <Button
                onClick={() => {
                  toast.message("Logging out");
                  signOut();
                }}
                className="rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 transition"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                asChild
                className="rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 transition"
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
