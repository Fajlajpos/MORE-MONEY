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
        const { amount, source, description, date } = body

        if (!amount || !source) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const income = await prisma.income.create({
            data: {
                userId: user.id,
                amount: parseFloat(amount),
                source,
                description,
                date: date ? new Date(date) : new Date(),
            },
        })

        // Award Points
        const { awardPoints, ACTION_POINTS } = await import("@/lib/gamification")
        await awardPoints(user.id, ACTION_POINTS.ADD_TRANSACTION)

        return NextResponse.json(income)
    } catch (error) {
        console.log("[INCOME_POST]", error)
        return new NextResponse("Internal Revenue Error", { status: 500 })
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

        const incomes = await prisma.income.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                date: 'desc'
            }
        })

        return NextResponse.json(incomes)
    } catch (error) {
        console.log("[INCOME_GET]", error)
        return new NextResponse("Internal Revenue Error", { status: 500 })
    }
}
