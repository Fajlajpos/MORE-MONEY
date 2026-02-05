"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

// Definice schématu formuláře
const formSchema = z.object({
    category: z.string().min(1, "Vyberte kategorii"),
    customCategoryName: z.string().optional(),
    amount: z.coerce.number().min(1, "Částka musí být větší než 0"),
    frequency: z.enum(["MONTHLY", "YEARLY", "WEEKLY"]),
    dueDate: z.coerce.number().min(1).max(31).optional(),
    autoPay: z.boolean().default(false),
    description: z.string().optional(),
})

type FixedExpenseFormValues = z.infer<typeof formSchema>

interface AddFixedExpenseProps {
    onSuccess?: () => void
}

const CATEGORIES = [
    { value: "rent", label: "Nájem / Hypotéka" },
    { value: "utilities", label: "Energie & Služby" },
    { value: "internet", label: "Internet & TV" },
    { value: "insurance", label: "Pojištění" },
    { value: "loan", label: "Splátky úvěrů" },
    { value: "subscription", label: "Předplatné (Netflix, Spotify...)" },
    { value: "phone", label: "Mobilní tarif" },
    { value: "other", label: "Jiné" },
]

export function AddFixedExpenseDialog({ onSuccess }: AddFixedExpenseProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const form = useForm<FixedExpenseFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            category: "",
            amount: 0,
            frequency: "MONTHLY",
            autoPay: false,
            description: "",
        },
    })

    const category = form.watch("category")

    async function onSubmit(data: FixedExpenseFormValues) {
        try {
            // Zde by bylo volání server action
            // await addFixedExpense(data)

            // Prozatím simulace
            console.log("Submitting:", data)

            // Revalidate via router refresh if needed once real backend is connected
            // router.refresh() 

            setOpen(false)
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                    + Nový fixní výdaj
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Přidat pravidelný výdaj</DialogTitle>
                    <DialogDescription>
                        Sledujte své fixní náklady jako nájem, energie nebo předplatné.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                            {CATEGORIES.map((cat) => (
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

                        {category === 'other' && (
                            <FormField
                                control={form.control}
                                name="customCategoryName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Název kategorie</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Např. Školné" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Částka (Kč)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="frequency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Účtování</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Frekvence" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MONTHLY">Měsíčně</SelectItem>
                                                <SelectItem value="YEARLY">Ročně</SelectItem>
                                                <SelectItem value="WEEKLY">Týdně</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Splatnost (den v měsíci)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} max={31} placeholder="Např. 15" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Kdy platba obvykle odchází (nepovinné).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="autoPay"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justification-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Automatická platba</FormLabel>
                                        <FormDescription className="text-xs">
                                            Máte nastavený trvalý příkaz?
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            Uložit výdaj
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
