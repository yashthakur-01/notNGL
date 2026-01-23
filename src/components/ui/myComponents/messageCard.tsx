"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Alert from "./alert";
import { Message } from "@/app/dashboard/page";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow hover:border-b-2 max-w-sm my-4 mx-3">
      <CardHeader>
        <CardTitle className="wrap-break-word whitespace-normal">
          {message.content}
        </CardTitle>
        <CardDescription>{String(message.createdAt)}</CardDescription>
        <CardAction>
          <Alert id={message._id} onMessageDelete={onMessageDelete}></Alert>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

export default MessageCard;
