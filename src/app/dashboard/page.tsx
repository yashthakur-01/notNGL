"use client";

import MessageCard from "@/components/ui/myComponents/messageCard";
import Navbar from "@/components/ui/myComponents/navbar";
import { Switch } from "@/components/ui/switch";
import { acceptMessageSchema } from "@/schemas/acceptMesssageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


type acceptMessageForm = z.infer<typeof acceptMessageSchema>;

export type Message = {
  _id: string;
  content: string;
  createdAt: Date;
};

function Dashboard() {
  const { data: session, status } = useSession();
  const hasfetched = useRef(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [fetchingIsAccepting, setFetchingIsAccepting] = useState(false);
  const [url, setUrl] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<acceptMessageForm>({
    resolver: zodResolver(acceptMessageSchema),
  });
  const acceptMessage = watch("acceptMessages");

  const onToggle = async () => {
    try {
      setFetchingIsAccepting(true);
      setValue("acceptMessages", !acceptMessage, { shouldDirty: true });

      const res = await axios.post("/api/accept-messages", {
        acceptMessage: !acceptMessage,
      });
    } catch (error) {
      setValue("acceptMessages", acceptMessage, { shouldDirty: true });

      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.log("error occured:\n", error);
    } finally {
      setFetchingIsAccepting(false);
    }
  };
  const fetchAcceptMessage = useCallback(async () => {
    try {
      setFetchingIsAccepting(true);
      const res = await axios.get("/api/accept-messages");

      setValue("acceptMessages", res.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("the error has occured: \n", axiosError);
      toast.error(
        axiosError.response?.data.message || "Unable to fetch the data"
      );
    } finally {
      setFetchingIsAccepting(false);
    }
  }, []);

  const messageGetter = useCallback(async () => {
    try {
      setIsLoadingMessages(true);
      const res = await axios.get("/api/get-messages");
      console.log(res);
      setMessages(res?.data.messages);
      console.log(messages);
    } catch (error: any) {
      console.log(error.response?.data.message);
      toast.error("Error loading messages");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const urlGetter = () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    setUrl(`${protocol}//${host}/profile/${session?.user.username}`);
  };

  useEffect(() => {
    if (!hasfetched.current && session?.user) {
      hasfetched.current = true;
      fetchAcceptMessage();
      messageGetter();
      urlGetter();
    }
  }, [session, fetchAcceptMessage, messageGetter]);

  const onMessageDelete = async (messageId: string) => {
    try {
      const res = await axios.post("/api/delete-message", { messageId });
      console.log(res);
      setMessages(res?.data.messages);
    } catch (error) {
      console.log(error);
      toast.error("error deleting message");
    }
  };

  const copyToClipboard = async()=>{
    await navigator.clipboard.writeText(url);
    toast.success("Coppied to Clipboard");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-fuchsia-500 via-pink-500 to-orange-500">
      <div className="min-h-[90vh] w-[90vw] mx-auto my-auto p-8 bg-white rounded-lg shadow-md ">
        <Navbar></Navbar>
        <Separator className="my-6" orientation="horizontal" />

        <div className="gap-5 p-4 mt-3">
          <div className="p-2 text-2xl font-bold">
            <span className="mr-2">Copy profle link to share others</span>
          </div>
          <div className="flex gap-2 p-3 my-6 mt-1">
            <Input className="p-3" value={url} onChange={()=>undefined} contentEditable="false"></Input>
            <Button className="p-3 bg-pink-500 hover:bg-pink-600" onClick={copyToClipboard}>Copy</Button>
          </div>
          <Switch
            className="mr-2"
            {...register("acceptMessages")}
            checked={acceptMessage}
            onCheckedChange={onToggle}
            disabled={fetchingIsAccepting}
          />
          <span className="text-lg font-semibold">
            Accepting Messages: {acceptMessage ? "Yes" : "No"}
          </span>
          <Separator className="my-6" orientation="horizontal" />
        </div>

        {isLoadingMessages ? (
          <div className="min-w-full flex justify-center align-center">
            <span>Loading Messages</span>
            <Loader2 className="animate-spin"></Loader2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {messages.map((msg) => (
              <MessageCard
                key={msg._id}
                onMessageDelete={onMessageDelete}
                message={msg}
              ></MessageCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
