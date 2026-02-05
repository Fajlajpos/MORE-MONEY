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
        const { amount, category, description, date, isImpulse, merchant, subcategory, liters, pricePerLiter, cigaretteCount } = body

        if (!amount || !category) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // AI Analysis
        let aiTip = null;
        if (category === 'fuel' || category === 'smoking') {
            // Import dynamically to avoid circular deps if any, though likely fine static
            const { analyzeExpense } = await import("@/lib/ai");
            aiTip = await analyzeExpense({
                category,
                amount: Number(amount),
                description,
                liters: liters ? Number(liters) : undefined,
                pricePerLiter: pricePerLiter ? Number(pricePerLiter) : undefined,
                cigaretteCount: cigaretteCount ? Number(cigaretteCount) : undefined
            });
        }

        // Save AI Insight if generated
        if (aiTip) {
            await prisma.aiInsight.create({
                data: {
                    userId: session.user.id,
                    type: 'tip',
                    category,
                    title: category === 'fuel' ? 'Úspora paliva' : 'Kouření',
                    message: aiTip,
                    priority: 1,
                    potentialSaving: null, // Could parse from AI response ideally
                }
            })
        }

        // Construct enriched description
        let finalDescription = description || "";
        if (liters && pricePerLiter) {
            finalDescription += ` | ${liters}L @ ${pricePerLiter}Kč/L`;
        }
        if (cigaretteCount) {
            finalDescription += ` | ${cigaretteCount} cigaret`;
        }

        const expense = await prisma.variableExpense.create({
            data: {
                userId: session.user.id,
                amount: Number(amount),
                category,
                description: finalDescription.trim(),
                date: date ? new Date(date) : new Date(),
                isImpulse: isImpulse || false,
                merchant: merchant || null,
                subcategory: subcategory || null,
                tags: [] // Default empty for now
            },
        })

        // Award Points (Gamification)
        try {
            await prisma.userPoints.upsert({
                where: { userId: session.user.id },
                create: { userId: session.user.id, totalPoints: 10, level: 1 },
                update: { totalPoints: { increment: 10 } }
            })
        } catch (e) {
            console.error("Failed to award points", e)
        }

        return NextResponse.json({ expense, aiTip })
    } catch (error) {
        console.log("[EXPENSE_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
