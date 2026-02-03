"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Wallet, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Částka musí být kladné číslo",
    }),
    source: z.string().min(2, {
        message: "Zdroj musí mít alespoň 2 znaky (např. Výplata)",
    }),
    description: z.string().optional(),
})

export function AddIncomeSheet() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            source: "Výplata",
            amount: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            const res = await fetch("/api/transactions/income", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: Number(values.amount),
                    source: values.source,
                    description: values.description,
                    date: new Date().toISOString(),
                }),
            })

            if (!res.ok) {
                throw new Error("Failed to add income")
            }

            reset()
            setOpen(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            // Ideally show toast here
            alert("Nepodařilo se přidat příjem.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                    <Wallet className="h-5 w-5" />
                    Přidat Příjem / Výplatu
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Přidat nový příjem</SheetTitle>
                    <SheetDescription>
                        Zadejte částku a zdroj příjmu (např. Výplata, Bonus).
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Částka (Kč)</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0"
                            {...register("amount")}
                        />
                        {errors.amount && (
                            <p className="text-sm text-destructive">{errors.amount.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="source">Zdroj / Název</Label>
                        <Input
                            id="source"
                            placeholder="Např. Výplata Leden"
                            {...register("source")}
                        />
                        {errors.source && (
                            <p className="text-sm text-destructive">{errors.source.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Poznámka (volitelné)</Label>
                        <Input
                            id="description"
                            placeholder="Další detaily..."
                            {...register("description")}
                        />
                    </div>

                    <SheetFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Ukládám...
                                </>
                            ) : (
                                "Uložit Příjem"
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
