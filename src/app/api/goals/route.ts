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

        const goals = await prisma.goal.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(goals)
    } catch (error) {
        console.log("[GOALS_GET]", error)
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
        const { name, targetAmount, currentAmount, deadline, description, imageUrl } = body

        if (!name || !targetAmount) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const goal = await prisma.goal.create({
            data: {
                userId: session.user.id,
                name,
                targetAmount: Number(targetAmount),
                currentAmount: Number(currentAmount) || 0,
                deadline: deadline ? new Date(deadline) : null,
                description: description || null,
                imageUrl: imageUrl || null,
            },
        })

        // Award Points for Goal Creation
        try {
            await prisma.userPoints.upsert({
                where: { userId: session.user.id },
                create: { userId: session.user.id, totalPoints: 50, level: 1 },
                update: { totalPoints: { increment: 50 } }
            })
        } catch (e) {
            console.error("Failed to award points", e)
        }

        return NextResponse.json(goal)
    } catch (error) {
        console.log("[GOALS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
