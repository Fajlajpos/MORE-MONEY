import { prisma } from "@/lib/prismadb"

export const POINTS_PER_LEVEL = 1000

export const ACTION_POINTS = {
    ADD_TRANSACTION: 10,
    WEEKLY_GOAL_MET: 50,
    MONTHLY_GOAL_MET: 200,
    STREAK_BONUS: 5, // per day
}

export async function awardPoints(userId: string, points: number) {
    try {
        const userPoints = await prisma.userPoints.upsert({
            where: { userId },
            create: { userId, totalPoints: points, level: 1 },
            update: { totalPoints: { increment: points } },
        })

        // Check for level up
        const newLevel = Math.floor(userPoints.totalPoints / POINTS_PER_LEVEL) + 1

        if (newLevel > userPoints.level) {
            await prisma.userPoints.update({
                where: { userId },
                data: { level: newLevel },
            })
            // In a real app, we would trigger a notification here
            return { levelUp: true, newLevel }
        }

        return { levelUp: false, totalPoints: userPoints.totalPoints }
    } catch (error) {
        console.error("[GAMIFICATION_ERROR]", error)
        return null
    }
}

export async function checkAchievements() {
    // Placeholder for achievement checking logic
    // e.g. check if user has 100 transactions, award badge
}
