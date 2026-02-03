"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Target, Loader2, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Název cíle musí mít alespoň 2 znaky.",
    }),
    targetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Cílová částka musí být kladné číslo",
    }),
    currentAmount: z.string().optional(),
    deadline: z.date().optional(),
})

export function AddGoalSheet() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentAmount: "0",
        },
    })

    const date = watch("deadline")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            const res = await fetch("/api/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    targetAmount: values.targetAmount,
                    currentAmount: values.currentAmount || "0",
                    deadline: values.deadline ? values.deadline.toISOString() : null,
                }),
            })

            if (!res.ok) {
                throw new Error("Failed to add goal")
            }

            reset()
            setOpen(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Nepodařilo se přidat cíl.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md border-0">
                    <Target className="h-4 w-4" />
                    Nový cíl
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Vytvořit nový cíl</SheetTitle>
                    <SheetDescription>
                        Definujte svůj sen a sledujte cestu k jeho splnění.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Název cíle</Label>
                        <Input
                            id="name"
                            placeholder="Např. Nové auto, Dovolená..."
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetAmount">Cílová částka (Kč)</Label>
                        <Input
                            id="targetAmount"
                            type="number"
                            placeholder="0"
                            {...register("targetAmount")}
                        />
                        {errors.targetAmount && (
                            <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currentAmount">Již našetřeno (Kč)</Label>
                        <Input
                            id="currentAmount"
                            type="number"
                            placeholder="0"
                            {...register("currentAmount")}
                        />
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label>Termín splnění (volitelné)</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {date ? (
                                        format(date, "PPP", { locale: cs })
                                    ) : (
                                        <span>Vyberte datum</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => setValue("deadline", d)}
                                    disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <SheetFooter>
                        <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Ukládám...
                                </>
                            ) : (
                                "Vytvořit cíl"
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
