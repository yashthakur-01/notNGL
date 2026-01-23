import { connectToDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";


export async function GET() {
  await connectToDB();

  await UserModel.updateOne(
  { username: "yashthakur" },
  {
    $push: {
      messages: {
        $each: [
          {
            content: "Welcome to the platform 🎉",
            createdAt: new Date()
          },
          {
            content: "Your account has been successfully verified.",
            createdAt: new Date()
          },
          {
            content: "You have a new notification waiting for you.",
            createdAt: new Date()
          },
          {
            content: "This is a test message to check text wrapping inside the card component.",
            createdAt: new Date()
          },
          {
            content: "Your password was changed recently.",
            createdAt: new Date()
          },
          {
            content: "A new login was detected from a different device.",
            createdAt: new Date()
          },
          {
            content: "Your profile information has been updated.",
            createdAt: new Date()
          },
          {
            content: "Reminder: Complete your pending tasks.",
            createdAt: new Date()
          },
          {
            content: "System maintenance is scheduled for tonight at 11 PM.",
            createdAt: new Date()
          },
          {
            content: "Thank you for using our application 😊",
            createdAt: new Date()
          }
        ]
      }
    }
  }
);


  return Response.json({ success: true });
}