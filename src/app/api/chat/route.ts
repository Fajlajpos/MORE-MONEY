import { OpenAI } from 'openai';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { auth } from "@/auth"

// Create an OpenAI API client
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
});

// IMPORTANT! Set the runtime to edge or node
export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Extract the `messages` from the body of the request
        const { messages } = await req.json();

        // Ask OpenAI for a streaming chat completion given the prompt
        const result = await streamText({
            model: openai('gpt-4'),
            messages,
            system: `Jsi finanční asistent aplikace MORE MONEY.
Zaměřuješ se na český trh, měnu CZK a lokální souvislosti.
Tvým cílem je pomáhat uživatelům šetřit peníze, analyzovat jejich výdaje a motivovat je.
Buď stručný, nápomocný a používej emoji.
Tykej uživateli (pokud si nevyžádá vykání).
Pokud jde o konkrétní rady, vždy upozorni, že nejsi certifikovaný finanční poradce.`
        });

        // Respond with the stream
        return result.toTextStreamResponse();
    } catch (error) {
        console.error('AI Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
