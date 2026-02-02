import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { amount, source, description, date } = body

        if (!amount || !source) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const income = await prisma.income.create({
            data: {
                userId: session.user.id,
                amount: Number(amount),
                source,
                description: description || null,
                date: date ? new Date(date) : new Date(),
            },
        })

        return NextResponse.json(income)
    } catch (error) {
        console.log("[INCOME_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
