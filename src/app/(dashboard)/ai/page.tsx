import { AiChatBot } from "@/components/features/ai/chat-bot"

export default function AiPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">AI Analýza & Asistent</h2>
                <p className="text-muted-foreground">
                    Váš osobní finanční poradce poháněný umělou inteligencí.
                    Analyzuje vaše výdaje a navrhuje způsob, jak ušetřit.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Chat takes main space */}
                <div className="md:col-span-2">
                    <AiChatBot />
                </div>

                {/* Sidebar suggestions */}
                <div className="space-y-4">
                    <div className="p-4 border rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
                        <h3 className="font-semibold mb-2">💡 Rychlé tipy</h3>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                            <li>• Zruš nevyužívaná předplatná</li>
                            <li>• Vař si doma místo restaurací</li>
                            <li>• Používej 30-denní pravidlo</li>
                        </ul>
                    </div>

                    {/* Future: Contextual analysis */}
                    <div className="p-4 border rounded-xl">
                        <h3 className="font-semibold mb-2">📊 Tvoje data</h3>
                        <p className="text-xs text-muted-foreground">
                            AI má přístup k tvým posledním výdajům pro lepší kontext.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
