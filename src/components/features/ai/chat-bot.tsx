"use client"

import { useChat, type UIMessage } from '@ai-sdk/react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"
import { useState, ChangeEvent } from "react";

export function AiChatBot() {
    const { messages, sendMessage, status } = useChat();
    const isLoading = status === 'submitted';
    const [input, setInput] = useState('');

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
                        {messages.map((m: UIMessage) => (
                            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {m.role !== 'user' && (
                                    <Avatar className="h-8 w-8 bg-primary/10">
                                        <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${m.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}>
                                    {m.display}
                                </div>
                                {m.role === 'user' && (
                                    <Avatar className="h-8 w-8 bg-muted">
                                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
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
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!input) return;
                    sendMessage({ role: 'user', content: input });
                    setInput('');
                }} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
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