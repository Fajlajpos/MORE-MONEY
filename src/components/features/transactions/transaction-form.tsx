"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { useRouter } from "next/navigation"

const transactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Částka musí být kladné číslo",
    }),
    category: z.string().min(1, "Vyberte kategorii"),
    date: z.date(),
    description: z.string().optional(),
    isImpulse: z.boolean().default(false),
    merchant: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

const INCOME_CATEGORIES = [
    { value: "salary", label: "Výplata" },
    { value: "bonus", label: "Bonus / Prémie" },
    { value: "freelance", label: "Podnikání / Freelance" },
    { value: "gift", label: "Dar" },
    { value: "other", label: "Ostatní" },
]

const EXPENSE_CATEGORIES = [
    { value: "food", label: "Jídlo a nákupy" },
    { value: "transport", label: "Doprava / Auto" },
    { value: "housing", label: "Bydlení" },
    { value: "utilities", label: "Energie a služby" },
    { value: "entertainment", label: "Zábava" },
    { value: "health", label: "Zdraví" },
    { value: "subscriptions", label: "Předplatné" },
    { value: "shopping", label: "Oblečení a radost" },
]

interface TransactionFormProps {
    onSuccess?: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<TransactionFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(transactionSchema) as any,
        defaultValues: {
            type: "expense",
            amount: "",
            category: "",
            date: new Date(),
            description: "",
            isImpulse: false,
            merchant: "",
        },
    })

    const type = form.watch("type")

    async function onSubmit(data: TransactionFormValues) {
        setLoading(true)
        try {
            const endpoint = data.type === "income"
                ? "/api/transactions/income"
                : "/api/transactions/expense"

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    source: data.type === "income" ? data.category : undefined, // Map category to source for income
                }),
            })

            if (!response.ok) throw new Error("Failed to save transaction")

            form.reset()
            router.refresh()
            if (onSuccess) onSuccess()
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
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Typ transakce</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="expense" />
                                        </FormControl>
                                        <FormLabel className="font-normal text-destructive font-semibold">
                                            Výdaj
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="income" />
                                        </FormControl>
                                        <FormLabel className="font-normal text-success font-semibold">
                                            Příjem
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
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
                                    <Input placeholder="0.00" {...field} type="number" step="0.01" className="text-lg font-bold" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Datum</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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
                                    {(type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
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

                {type === "expense" && (
                    <FormField
                        control={form.control}
                        name="merchant"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Obchodník / Místo (Volitelné)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Např. Tesco, Benzina..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Poznámka (Volitelné)</FormLabel>
                            <FormControl>
                                <Input placeholder="Detail transakce..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {type === "expense" && (
                    <FormField
                        control={form.control}
                        name="isImpulse"
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
                                        Impulzivní nákup?
                                    </FormLabel>
                                    <FormDescription>
                                        Označte, pokud jste tento nákup neplánovali. AI vám pomůže toto chování analyzovat.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Uložit transakci
                </Button>
            </form>
        </Form>
    )
}
