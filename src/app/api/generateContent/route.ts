import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

// export async function POST(req) {
//   const { prompt } = await req.json();
//   console.log("🚀 ~ POST ~ process.env.OPENAI_API_KEY:", process.env.OPENAI_API_KEY)

//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo', // or 'gpt-3.5-turbo' if needed
//         "messages": [
//           {
//             "role": "system",
//             "content": "You are a helpful assistant."
//           },
//           {
//             "role": "user",
//             "content": "Hello!"
//           }
//         ],
//         max_tokens: 200,
//       }),
//     });

//     const data = await response.json();
//     console.log("🚀 ~ POST ~ data:", data)
//     return NextResponse.json({ text: data.choices[0].message.content });
//   } catch (error) {
//     console.log("🚀 ~ POST ~ error:", error)
//     return NextResponse.json({ error: 'Something went wrong with OpenAI API' }, { status: 500 });
//   }
// }

const hf = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN);

export async function POST(req: Request) {

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt." }, { status: 400 })
    }

    const response = await hf.textGeneration({
      model: "gpt2", // Or "distilgpt2" for a smaller, faster model
      inputs: prompt,
      parameters: { max_length: 100, temperature: 0.7, top_k: 50 }
    });

    const generatedText = response.generated_text || "No content generated.";
    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json(
      { error: 'Failed to generate content.' },
      { status: 500 }
    );
  }
}
