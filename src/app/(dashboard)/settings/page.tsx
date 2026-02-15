import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Palette, Moon } from "lucide-react"

export default async function SettingsPage() {
    const session = await auth()

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Nastavení</h2>
                <p className="text-muted-foreground">Správa vašeho účtu a prefenencí.</p>
            </div>

            <Tabs defaultValue="account" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="account" className="gap-2"><User className="h-4 w-4" /> Účet</TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" /> Vzhled</TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifikace</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil</CardTitle>
                            <CardDescription>
                                Upravte své osobní údaje. Změny se projeví okamžitě.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Jméno</Label>
                                <Input id="name" defaultValue={session?.user?.name || ""} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue={session?.user?.email || ""} disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="btn-gradient">Uložit změny</Button>
                        </CardFooter>
                    </Card>

                    <Card className="mt-6 border-destructive/20 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-destructive">Nebezpečná zóna</CardTitle>
                            <CardDescription>
                                Tyto akce jsou nevratné.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive">Smazat účet</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vzhled aplikace</CardTitle>
                            <CardDescription>
                                Přizpůsobte si vzhled aplikace podle svých preferencí.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        <Label className="text-base">Tmavý Režim</Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Přepnout mezi světlým a tmavým zobrazením.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4" />
                                        <Label className="text-base">Zjednodušený design</Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Skrýt dekorativní prvky pro lepší výkon.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifikace</CardTitle>
                            <CardDescription>
                                Vyberte, o čem chcete být informováni.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="budget-alerts" className="flex flex-col space-y-1">
                                    <span>Upozornění na rozpočet</span>
                                    <span className="font-normal text-xs text-muted-foreground">Dostávat upozornění při překročení 80% rozpočtu.</span>
                                </Label>
                                <Switch id="budget-alerts" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="goal-updates" className="flex flex-col space-y-1">
                                    <span>Aktualizace cílů</span>
                                    <span className="font-normal text-xs text-muted-foreground">Týdenní souhrn plnění vašich cílů.</span>
                                </Label>
                                <Switch id="goal-updates" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
