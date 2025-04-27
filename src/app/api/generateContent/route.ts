import { NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(req) {
  const { prompt } = await req.json();

  try {

    const client = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env["GITHUB_TOKEN"]
    });

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system", content: "You are an AI writing assistant specialized in generating professional blog content. Your tasks include writing blog post drafts, summarizing articles, and suggesting further reading based on the user's input. Keep your responses professional, structured, and between 300 to 500 words unless otherwise requested. Avoid casual conversation."
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 900,
      top_p: 1
    });

    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: 'Something went wrong with OpenAI API' }, { status: 500 });
  }
}