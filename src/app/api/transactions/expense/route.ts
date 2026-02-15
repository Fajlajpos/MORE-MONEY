import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const expenses = await prisma.variableExpense.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                date: 'desc',
            },
        })

        return NextResponse.json(expenses)
    } catch (error) {
        console.log("[EXPENSE_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { amount, category, description, date, isImpulse, merchant } = body

        if (!amount || !category) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const expense = await prisma.variableExpense.create({
            data: {
                userId: session.user.id,
                amount: Number(amount),
                category,
                description: description || null,
                date: date ? new Date(date) : new Date(),
                isImpulse: isImpulse || false,
                merchant: merchant || null,
            },
        })

        return NextResponse.json(expense)
    } catch (error) {
        console.log("[EXPENSE_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
