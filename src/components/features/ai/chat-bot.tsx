"use client"

import { useChat } from '@ai-sdk/react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"


// Define Message type to avoid import issues


export function AiChatBot() {

    // @ts-expect-error - useChat types are mismatched in this environment
    const { messages, input, handleInputChange, handleSubmit, status } = useChat({
        onError: (error) => {
            console.error("Chat error:", error);
        }
    });

    const isLoading = status === 'submitted' || status === 'streaming';

    return (
        <Card className="flex flex-col h-[600px] shadow-xl border-primary/20">
            <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    Finanční Asistent
                </CardTitle>
                <CardDescription>
                    Zeptej se na cokoliv o financích nebo tvých výdajích.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground mt-10">
                                <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Ahoj! Jsem tvůj AI asistent.</p>
                                <p className="text-sm">Zeptej se třeba: &quot;Jak ušetřit na jídle?&quot;</p>
                            </div>
                        )}
                        {messages.map((m) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const msg = m as any;
                            return (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role !== 'user' && (
                                        <Avatar className="h-8 w-8 bg-primary/10">
                                            <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    {msg.role === 'user' && (
                                        <Avatar className="h-8 w-8 bg-muted">
                                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )
                        })}
                        {isLoading && (
                            <div className="flex gap-3 justify-start">
                                <Avatar className="h-8 w-8 bg-primary/10">
                                    <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg px-4 py-2 text-sm flex items-center">
                                    <span className="animate-pulse">Přemýšlím...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 bg-muted/20">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Napiš zprávu..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}