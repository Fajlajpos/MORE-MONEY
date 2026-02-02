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
        const { name, targetAmount, deadline, currentAmount } = body

        if (!name || !targetAmount) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const goal = await prisma.goal.create({
            data: {
                userId: user.id,
                name,
                targetAmount: parseFloat(targetAmount),
                currentAmount: parseFloat(currentAmount || 0),
                deadline: deadline ? new Date(deadline) : null,
            },
        })

        return NextResponse.json(goal)
    } catch (error) {
        console.log("[GOALS_POST]", error)
        return new NextResponse("Internal Goal Error", { status: 500 })
    }
}

export async function GET() {
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

        const goals = await prisma.goal.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(goals)
    } catch (error) {
        console.log("[GOALS_GET]", error)
        return new NextResponse("Internal Goal Error", { status: 500 })
    }
}
