"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.string().email({ message: "Neplatný email" }),
    password: z.string().min(8, { message: "Heslo musí mít alespoň 8 znaků" }),
})

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError(null)
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            })

            if (result?.error) {
                setError("Neplatný email nebo heslo")
                console.error(result.error)
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-sm rounded-2xl shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Vítejte zpět</CardTitle>
                    <CardDescription className="text-center">
                        Zadejte svůj email pro přihlášení do MORE MONEY
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email
                            </label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm font-medium text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Heslo
                                </label>
                                <Link href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                                    Zapomněli jste heslo?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm font-medium text-destructive">{form.formState.errors.password.message}</p>
                            )}
                        </div>
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-x-2">
                                <p>{error}</p>
                            </div>
                        )}
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Přihlašování..." : "Přihlásit se"}
                        </Button>
                    </form>
                    <div className="relative mt-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Nebo pokračovat přes
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <Button variant="outline" disabled>Github</Button>
                        <Button variant="outline" disabled>Google</Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div>Nemáte ještě účet?</div>
                    <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                        Zaregistrovat se
                    </Link>
                </CardFooter>
            </Card>
        </div >
    )
}
