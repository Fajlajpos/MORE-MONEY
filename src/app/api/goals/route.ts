import { auth } from "@/auth"
import { prisma } from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { name, targetAmount, currentAmount, deadline } = body

        if (!name || !targetAmount) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const goal = await prisma.goal.create({
            data: {
                userId: session.user.id,
                name,
                targetAmount: parseFloat(targetAmount),
                currentAmount: parseFloat(currentAmount),
                deadline: deadline ? new Date(deadline) : null,
            }
        })

        return NextResponse.json(goal)

    } catch (error) {
        console.error("[GOALS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
