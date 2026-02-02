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
        const { amount, category, frequency, customCategoryName, dueDate, autoPay } = body

        if (!amount || !category || !frequency) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const fixedExpense = await prisma.fixedExpense.create({
            data: {
                userId: session.user.id,
                amount: Number(amount),
                category,
                frequency,
                customCategoryName: customCategoryName || null,
                dueDate: dueDate ? Number(dueDate) : null,
                autoPay: autoPay || false,
            },
        })

        return NextResponse.json(fixedExpense)
    } catch (error) {
        console.log("[FIXED_EXPENSE_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
