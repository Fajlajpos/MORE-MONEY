"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const fixedExpenseSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Částka musí být kladné číslo",
    }),
    category: z.string().min(1, "Vyberte kategorii"),
    customCategoryName: z.string().optional(),
    frequency: z.string().min(1, "Vyberte frekvenci"),
    dueDate: z.string().optional(),
    autoPay: z.boolean().default(false),
})

type FixedExpenseFormValues = z.infer<typeof fixedExpenseSchema>

const FIXED_CATEGORIES = [
    { value: "housing", label: "Bydlení (Nájem/Hypotéka)" },
    { value: "utilities", label: "Energie a služby" },
    { value: "internet", label: "Internet a TV" },
    { value: "insurance", label: "Pojištění" },
    { value: "subscription", label: "Předplatné (Netflix, Spotify...)" },
    { value: "loans", label: "Splátky dluhů" },
    { value: "other", label: "Ostatní" },
]

export function FixedExpenseForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<FixedExpenseFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(fixedExpenseSchema) as any,
        defaultValues: {
            amount: "",
            category: "",
            customCategoryName: "",
            frequency: "monthly",
            dueDate: "",
            autoPay: false,
        },
    })

    async function onSubmit(data: FixedExpenseFormValues) {
        setLoading(true)
        try {
            const response = await fetch("/api/fixed-expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Failed to save fixed expense")

            form.reset()
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kategorie</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Vyberte kategorii" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {FIXED_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="customCategoryName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vlastní název</FormLabel>
                            <FormControl>
                                <Input placeholder="Např. Byt 2+kk, O2 Internet..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Upřesněte název pro lepší přehled.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Částka (Kč)</FormLabel>
                                <FormControl>
                                    <Input placeholder="0.00" {...field} type="number" className="text-lg font-bold" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Den splatnosti</FormLabel>
                                <FormControl>
                                    <Input placeholder="1-31" {...field} type="number" min="1" max="31" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Frekvence</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Vyberte frekvenci" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="monthly">Měsíčně</SelectItem>
                                    <SelectItem value="yearly">Ročně</SelectItem>
                                    <SelectItem value="quarterly">Čtvrtletně</SelectItem>
                                    <SelectItem value="weekly">Týdně</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="autoPay"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Automatická platba
                                </FormLabel>
                                <FormDescription>
                                    Máte nastavený trvalý příkaz?
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Uložit pravidelnou platbu
                </Button>
            </form>
        </Form>
    )
}
