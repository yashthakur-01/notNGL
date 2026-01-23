"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  type VerifyForm = z.infer<typeof verifySchema>;
  const [isSubmitting, setIsSumbitting] = useState(false);

  const register = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = register;

  const onSubmit = async (data: VerifyForm) => {
    try {
      setIsSumbitting(true);
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        verifyCode: watch("code"),
      });

      console.log(response);

      toast.success(response?.data.message);

      router.push("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError?.response?.data.message);
    } finally {
      setIsSumbitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-fuchsia-500 via-pink-500 to-orange-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...register}>
          <form
            onSubmit={register.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col"
          >
            <FormField
              name="code"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Verify Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Verify-code" {...field} />
                  </FormControl>
                  {errors.code && <p className="text-red-500 text-sm"></p>}

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
                "Submit"
              )}
            </Button>
            <div className="text-center mt-2">
              <p>
                Didn't receive code,{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign up
                </Link>
                {" "} again.
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
