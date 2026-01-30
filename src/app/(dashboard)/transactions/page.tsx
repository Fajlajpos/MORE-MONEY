import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { TransactionForm } from "@/components/features/transactions/transaction-form"

// In a real app, we would fetch data server-side here or use a client component for the list
// For now, this is a placeholder structure
export default function TransactionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transakce</h2>
                    <p className="text-muted-foreground">Spravujte své příjmy a výdaje na jednom místě.</p>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Přidat transakci
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Nová transakce</SheetTitle>
                            <SheetDescription>
                                Zadejte detaily o příjmu nebo výdaji.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                            <TransactionForm />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historie</CardTitle>
                    <CardDescription>Poslední pohyby na účtu</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
                        Zatím žádné transakce. Přidejte první tlačítkem vpravo nahoře!
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
