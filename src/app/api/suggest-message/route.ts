import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {

    try {
        const llm = new ChatGoogleGenerativeAI({
            model: "models/gemini-2.5-flash-lite",
            streaming: true,
            temperature:1.5,
            apiKey:process.env.GOOGLE_API_KEY
        });

        const prompt = new PromptTemplate({
            template: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Donot repeat the example and generate some intresting questions. they can also be wierd.",
            inputVariables: []
        });

        const chain = prompt.pipe(llm);

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of await chain.stream({})) {
                    if (chunk.content) {
                        controller.enqueue(chunk.content);
                    }
                }
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (error: any) {
        console.log("error occured: \n")
        console.log(error)
        return NextResponse.json({
            success:false,
            message:error.message
        },{status:500})
    }
}
