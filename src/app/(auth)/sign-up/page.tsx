"use client";

import { SignUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type FormData = z.infer<typeof SignUpSchema>;

function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedcallback = useDebounceCallback(setUsername, 500);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      try {
        if (username) {
          setIsCheckingUsername(true);
          setUsernameMessage("");
          const res = await axios.get(
            `/api/check-unique-username?username=${username}`
          );

          console.log(res);

          setUsernameMessage(res?.data.message);
        }else{
            setUsernameMessage("");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error Checking Username"
        );
        console.log(error)
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsernameUnique();
  }, [username]);

  const register = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = register;

  const onSubmit = async (data: FormData) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/sign-up", data);


      console.log(res.data.message);
      toast.success(res.data.message);

      router.push(`/verify/${data.username}`);
    } catch (error) {
      console.error("error in signup of user:\n", error);
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-fuchsia-500 via-pink-500 to-orange-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center flex flex-col">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">
            Join Us
          </h1>
               
          <div  className="width-auto rounded-4xl self-center" >
              <Image
                src="/nglzoom.svg"
                alt="logo"
                loading="eager"
                width={140}
                height={140}
                className="object-"
              />
          </div>
          <p className="mt-3 text-pink-600 text-xl font-medium my-6">Signup to receive unwanted opinions</p>
        </div>
        <Form {...register}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <FormField
              name="username"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                    className="focus:shadow-sm focus:ring-2 focus:ring-pink-400"
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedcallback(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
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
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
