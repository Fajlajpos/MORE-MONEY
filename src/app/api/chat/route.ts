
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { auth } from "@/auth"

// Create an OpenAI API client
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
});

// IMPORTANT! Set the runtime to edge or node
export const runtime = 'nodejs';

function createMockStream() {
    const encoder = new TextEncoder();
    const mockResponses = [
        "To je zajímavá otázka! 🤔 Obecně doporučuji pravidlo 50/30/20. 50% na nutné výdaje, 30% pro radost a 20% spořit.",
        "Vidím, že se snažíš šetřit. 💸 Zkus se podívat na své pravidelné platby v sekci Rozpočet, často tam najdeš předplatné, které už nepoužíváš.",
        "Investování je běh na dlouhou trať. 🏃‍♂️ Začni s málem, třeba odkládáním 500 Kč měsíčně do ETF.",
        "Sleduj si své 'impulzivní nákupy'. 🛍️ Často utrácíme za věci, které nepotřebujeme, jen kvůli emocím."
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const text = `[MOCK AI] ${randomResponse}`;

    const stream = new ReadableStream({
        async start(controller) {
            const tokens = text.split(" ");
            for (const token of tokens) {
                controller.enqueue(encoder.encode(token + " "));
                await new Promise(r => setTimeout(r, 100)); // Simulate typing delay
            }
            controller.close();
        }
    });

    return stream;
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Extract the `messages` from the body of the request
        const { messages } = await req.json();

        // CHECK IF API KEY IS SET
        const apiKey = process.env.OPENAI_API_KEY;
        const isMock = !apiKey || apiKey === 'sk-placeholder' || apiKey.startsWith('sk-placeholder');

        if (isMock) {
            // Return mock stream
            const stream = createMockStream();
            return new Response(stream, {
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        }

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
