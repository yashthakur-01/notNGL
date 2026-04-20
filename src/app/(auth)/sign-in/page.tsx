"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Login() {
  const router = useRouter();
  type SigninForm = z.infer<typeof SignInSchema>;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = useForm<SigninForm>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = register;

  const SIGNIN_ERROR_MESSAGES: Record<string, string> = {
    NO_USERNAME_OR_PASS: "Username or password is missing",
    NO_USER_WITH_EMAIL: "No user exists with this email",
    UNVERIFIED: "Please verify your account before login",
    INCORRECT_PASS: "Incorrect password",
    SERVER_ERROR: "Unexpected error occurred. Try later",
    CredentialsSignin: "Invalid email/password or unverified email ",
  };

  const onSubmit = async (data: SigninForm) => {
    const res = await signIn("credentials", {
      email: watch("email"),
      password: watch("password"),
      redirect: false,
    });
    // console.log(res);
    if (res?.error) {
      const error_message = SIGNIN_ERROR_MESSAGES[res.error];
      toast.error(String(error_message) ?? "Login Failed");
      return;
    }

    toast.success("Login successful");
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-fuchsia-500 via-pink-500 to-orange-500">
      <Button
        asChild
        variant="outline"
        className="fixed top-6 left-6 z-50 gap-2 bg-white/95 shadow-md backdrop-blur"
      >
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center flex flex-col">
          <h1 className="text-xl font-extrabold tracking-tight lg:text-2xl mb-3">
            Have an account, Login
          </h1>

          <div className="width-auto rounded-4xl self-center">
            <Image
              src="/nglzoom.svg"
              alt="logo"
              loading="eager"
              width={140}
              height={140}
              className="object-"
            />
          </div>
        </div>
        <Form {...register}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className=" bg-pink-500 p-5 self-center hover:bg-pink-600"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                </>
              ) : (
                "Signin"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
