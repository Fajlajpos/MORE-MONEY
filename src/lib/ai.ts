
import { OpenAI } from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeExpense(context: {
    category: string;
    amount: number;
    description?: string;
    liters?: number;
    pricePerLiter?: number;
    cigaretteCount?: number;
}) {
    try {
        const prompt = `
      Jsi finanční asistent. Analyzuj tento výdaj a poskytni krátký, úderný tip na úsporu nebo postřeh.
      Odpověz v češtině. Buď stručný (max 1 věta, do 150 znaků).
      
      Údaje:
      Kategorie: ${context.category}
      Částka: ${context.amount}
      ${context.liters ? `Litry: ${context.liters} L` : ''}
      ${context.pricePerLiter ? `Cena za litr: ${context.pricePerLiter} Kč/L` : ''}
      ${context.cigaretteCount ? `Počet cigaret: ${context.cigaretteCount}` : ''}
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 60,
        });

        return response.choices[0]?.message?.content || null;
    } catch (error) {
        console.error("AI Analysis failed:", error);
        return null;
    }
}
