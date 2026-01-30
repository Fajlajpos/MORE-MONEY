import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { amount, category, description, date, isImpulse, merchant } = body

        if (!amount || !category) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const expense = await prisma.variableExpense.create({
            data: {
                userId: user.id,
                amount: parseFloat(amount),
                category,
                description,
                isImpulse: isImpulse || false,
                merchant,
                date: date ? new Date(date) : new Date(),
            },
        })

        // Award Points
        const { awardPoints, ACTION_POINTS } = await import("@/lib/gamification")
        await awardPoints(user.id, ACTION_POINTS.ADD_TRANSACTION)

        return NextResponse.json(expense)
    } catch (error) {
        console.log("[EXPENSE_POST]", error)
        return new NextResponse("Internal Expense Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const expenses = await prisma.variableExpense.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                date: 'desc'
            }
        })

        return NextResponse.json(expenses)
    } catch (error) {
        console.log("[EXPENSE_GET]", error)
        return new NextResponse("Internal Expense Error", { status: 500 })
    }
}
