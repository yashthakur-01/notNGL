"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import WelcomeHeader from "@/components/ui/myComponents/welcomeHeader";
import { Separator } from "@/components/ui/separator";

type messageForm = z.infer<typeof messageSchema>;

function Profile() {
  const params = useParams();
  const username = params.username;

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [content, setContent] = useState<string[]>([]);
  const [isSuggestingMessages, setIsSuggestingMessages] = useState(false);

  const sendMessage = async (data: messageForm) => {
    try {
      setIsSendingMessage(true);
      const res = await axios.post("/api/send-message", {
        content: data.content,
        username,
      });

      // console.log(res);
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      // console.log("error occured: \n", error);
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSendingMessage(false);
      setValue("content", "");
    }
  };

  const askAI = async () => {
    setContent([]);
    try {
      setIsSuggestingMessages(true);
      const res = await fetch("/api/suggest-message", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const reader = res?.body!.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("||");

        buffer = parts.pop() ?? "";

        if (parts.length > 0) {
          setContent((prev) => [...prev, ...parts]);
        }
      }
      buffer += decoder.decode();
      if (buffer.trim()) {
        setContent((prev) => [...prev, buffer]);
      }
    } catch (error: any) {
      // console.log(error);
      setContent(error);
    } finally {
      setIsSuggestingMessages(false);
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<messageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
    mode:"onChange"
  });

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
      <div className="gap-y-5 min-h-[90vh] w-[90vw] mx-auto my-auto p-8 bg-white rounded-lg shadow-md ">
        <WelcomeHeader appName="NotNGL" subtitle="Say it! I won't tell them" ></WelcomeHeader>
        <Separator orientation="horizontal" className="my-4"></Separator>             
        <h1 className="text-2xl my-6 mb-4 font-bold text-gray-800">
          Send to <span className="text-pink-600">@{params.username}</span>
        </h1>
        <form onSubmit={handleSubmit(sendMessage)} className="space-y-2 mb-5">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  placeholder="Type your message..."
                  className={`text-base ${
                    errors.content
                      ? "border-destructive focus-visible:ring-destructive"
                      : "focus-visible:ring-pink-400"
                  }`}
                />

                {errors.content && (
                  <p className="text-sm text-destructive">
                    {errors.content.message}
                  </p>
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 w-full"
          >
            Send Message
          </Button>
        </form>

        <Separator orientation="horizontal" className="my-4"></Separator>             

        <div className="space-y-3">
          <div className="flex flex-col items-center justify-between">
            <p className="my-3.5 mt-0 font-semibold text-gray-700">Get AI suggestions</p>
            {content.length > 0 && (
              <div className="grid gap-3">
                      {" "}
                      {content[0] && (
                        <span
                          onClick={() => setValue("content", content[0])}
                          className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 hover:bg-pink-50 hover:border-pink-400 transition"
                        >
                          {" "}
                          {content[0]}{" "}
                        </span>
                      )}{" "}
                      {content[1] && (
                        <span
                          onClick={() => setValue("content", content[1])}
                          className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 hover:bg-pink-50 hover:border-pink-400 transition"
                        >
                          {" "}
                          {content[1]}{" "}
                        </span>
                      )}{" "}
                      {content[2] && (
                        <span
                          onClick={() => setValue("content", content[2])}
                          className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 hover:bg-pink-50 hover:border-pink-400 transition"
                        >
                          {" "}
                          {content[2]}{" "}
                        </span>
                      )}{" "}
                
              </div>
            )}

            <Button
              size="sm"
              onClick={askAI}
              disabled={isSuggestingMessages}
              className="bg-pink-500 mt-2 hover:bg-pink-600"
            >
              {isSuggestingMessages ? "Thinking..." : "Ask AI"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
