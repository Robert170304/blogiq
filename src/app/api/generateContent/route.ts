import { NextResponse } from 'next/server';
import OpenAI from "openai";
// import { HfInference } from "@huggingface/inference";

export async function POST(req) {
  const { prompt } = await req.json();
  console.log("🚀 ~ POST ~ process.env.OPENAI_API_KEY:", process.env.OPENAI_API_KEY)

  try {

    const client = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env["GITHUB_TOKEN"]
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "" },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    });

    console.log("response.choices[0].message.content", response.choices[0].message.content);
    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: 'Something went wrong with OpenAI API' }, { status: 500 });
  }
}

// const hf = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN);

// export async function POST(req: Request) {

//   try {
//     const { prompt } = await req.json();

//     if (!prompt || typeof prompt !== "string") {
//       return NextResponse.json({ error: "Invalid prompt." }, { status: 400 })
//     }

//     const response = await hf.textGeneration({
//       model: "EleutherAI/gpt-neo-2.7B", // Or "distilgpt2" for a smaller, faster model
//       inputs: prompt,
//       parameters: { max_length: 50, temperature: 0.5, top_k: 20 }
//     });

//     const generatedText = response.generated_text || "No content generated.";
//     return NextResponse.json({ text: generatedText });
//   } catch (error) {
//     console.log("🚀 ~ POST ~ error:", error)
//     return NextResponse.json(
//       { error: 'Failed to generate content.' },
//       { status: 500 }
//     );
//   }
// }
