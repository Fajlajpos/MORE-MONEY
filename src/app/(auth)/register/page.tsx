"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(2, { message: "Jméno musí mít alespoň 2 znaky" }),
    email: z.string().email({ message: "Neplatný email" }),
    password: z.string().min(8, { message: "Heslo musí mít alespoň 8 znaků" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Hesla se neshodují",
    path: ["confirmPassword"],
})

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                }),
            })

            if (!response.ok) {
                const error = await response.text()
                console.error(error) // Handle error visualization
                return
            }

            router.push("/login")
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-sm rounded-2xl shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Vytvořit účet</CardTitle>
                    <CardDescription className="text-center">
                        Finanční svoboda začíná zde
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none">
                                Jméno
                            </label>
                            <Input
                                id="name"
                                placeholder="Jan Novák"
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm font-medium text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
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
                            <label htmlFor="password" className="text-sm font-medium leading-none">
                                Heslo
                            </label>
                            <Input
                                id="password"
                                type="password"
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm font-medium text-destructive">{form.formState.errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                                Potvrzení hesla
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...form.register("confirmPassword")}
                            />
                            {form.formState.errors.confirmPassword && (
                                <p className="text-sm font-medium text-destructive">{form.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Vytváření účtu..." : "Zaregistrovat se"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    <div>Již máte účet?</div>
                    <Link href="/login" className="ml-1 text-primary underline-offset-4 hover:underline">
                        Přihlásit se
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
