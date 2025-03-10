import { streamObject } from "ai";
import { groq } from "@ai-sdk/groq";

import { SummarySchema } from "@/schemas/summary";

const modelName = "llama-3.3-70b-versatile";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamObject({
    model: groq(modelName),
    schema: SummarySchema,
    prompt: `write a summary for the generated caption from STT model:${prompt}
    be concise and provide a list of topics related to the summary, don't say things like the speaker said or talked about... just summrize the speach.
    `,
  });

  return result.toTextStreamResponse();
}
