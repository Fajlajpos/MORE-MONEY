import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid';
import { AiInsight, GoalContribution, MonthlySavings, Challenge, UserChallenge, Achievement, UserAchievement, UserPoints, UserConsent, DataExportRequest } from './schema-types';

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Helper to extend Prisma with Raw SQL methods for new models
const extendedPrisma = {
    ...prisma,
    aiInsight: {
        create: async (args: { data: Omit<AiInsight, 'id' | 'createdAt' | 'isRead' | 'isActedOn'> }) => {
            const data = args.data;
            const id = uuidv4();
            const now = new Date();
            await prisma.$executeRaw`
        INSERT INTO "AiInsight" ("id", "userId", "type", "category", "title", "message", "potentialSaving", "priority", "isRead", "isActedOn", "createdAt", "expiresAt")
        VALUES (${id}, ${data.userId}, ${data.type}, ${data.category || null}, ${data.title}, ${data.message}, ${data.potentialSaving || null}, ${data.priority}, false, false, ${now}, ${data.expiresAt || null})
      `;
            return { ...data, id, createdAt: now, isRead: false, isActedOn: false } as AiInsight;
        },
        findMany: async (args: { where: { userId: string, isRead?: boolean } }) => {
            const { userId, isRead } = args.where;
            if (isRead !== undefined) {
                return await prisma.$queryRaw<AiInsight[]>`SELECT * FROM "AiInsight" WHERE "userId" = ${userId} AND "isRead" = ${isRead}`;
            }
            return await prisma.$queryRaw<AiInsight[]>`SELECT * FROM "AiInsight" WHERE "userId" = ${userId}`;
        },
        update: async (args: { where: { id: string }, data: Partial<AiInsight> }) => {
            const { id } = args.where;
            // Minimal update implementation for read status
            if (args.data.isRead !== undefined) {
                await prisma.$executeRaw`UPDATE "AiInsight" SET "isRead" = ${args.data.isRead} WHERE "id" = ${id}`;
            }
            // Return simplistic updated object
            return { id, ...args.data } as any;
        }
    },
    goal: {
        create: async (args: any) => {
            const data = args.data;
            const id = require('crypto').randomUUID();
            const now = new Date();
            await prisma.$executeRaw`
                INSERT INTO "Goal" ("id", "userId", "name", "targetAmount", "currentAmount", "deadline", "description", "imageUrl", "priority", "isCompleted", "createdAt", "updatedAt")
                VALUES (${id}, ${data.userId}, ${data.name}, ${data.targetAmount}, ${data.currentAmount}, ${data.deadline}, ${data.description}, ${data.imageUrl}, ${data.priority || 1}, ${data.isCompleted || false}, ${now}, ${now})
             `;
            return { id, ...data, createdAt: now, updatedAt: now };
        },
        findMany: async (args: any) => {
            const userId = args.where.userId;
            const orderBy = args.orderBy ? `ORDER BY "createdAt" DESC` : ''; // Default sort
            return await prisma.$queryRawUnsafe(`SELECT * FROM "Goal" WHERE "userId" = '${userId}' ${orderBy}`);
        },
        // We might need update for contributions later
        update: async (args: any) => {
            const { id } = args.where;
            // Minimal update
            //  await prisma.$executeRaw`UPDATE "Goal" ...`; 
            return args.data;
        }
    },
    goalContribution: {
        create: async (args: any) => {
            const data = args.data;
            const id = require('crypto').randomUUID();
            const now = new Date();
            await prisma.$executeRaw`
                INSERT INTO "GoalContribution" ("id", "goalId", "amount", "date", "notes")
                VALUES (${id}, ${data.goalId}, ${data.amount}, ${data.date}, ${data.notes})
            `;
            return { id, ...data };
        },
        findMany: async (args: any) => {
            return await prisma.$queryRaw`SELECT * FROM "GoalContribution" WHERE "goalId" = ${args.where.goalId}`;
        }
    },
    fixedExpense: {
        create: async (args: any) => {
            const data = args.data;
            const id = require('crypto').randomUUID();
            const now = new Date();
            await prisma.$executeRaw`
                INSERT INTO "FixedExpense" ("id", "userId", "category", "customCategoryName", "amount", "frequency", "dueDate", "autoPay", "description", "createdAt", "updatedAt")
                VALUES (${id}, ${data.userId}, ${data.category}, ${data.customCategoryName}, ${data.amount}, ${data.frequency}, ${data.dueDate}, ${data.autoPay}, ${data.description}, ${now}, ${now})
             `;
            return { id, ...data, createdAt: now, updatedAt: now };
        },
        findMany: async (args: any) => {
            const userId = args.where.userId;
            const limit = args.take ? `LIMIT ${args.take}` : '';
            const orderBy = args.orderBy ? `ORDER BY amount DESC` : ''; // Simplified sorting
            return await prisma.$queryRawUnsafe(`SELECT * FROM "FixedExpense" WHERE "userId" = '${userId}' ${orderBy} ${limit}`);
        },
        update: async (args: any) => {
            // Placeholder
            return args.data;
        },
        delete: async (args: any) => {
            await prisma.$executeRaw`DELETE FROM "FixedExpense" WHERE "id" = ${args.where.id}`;
            return args.where;
        }
    },
    userPoints: {
        findUnique: async (args: any) => {
            const result = await prisma.$queryRaw`SELECT * FROM "UserPoints" WHERE "userId" = ${args.where.userId} LIMIT 1`;
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        },
        upsert: async (args: any) => {
            const userId = args.where.userId;
            const createData = args.create;
            const updateData = args.update;
            const now = new Date();

            // Check if user points record exists
            const existing = await prisma.$queryRaw<any[]>`SELECT * FROM "UserPoints" WHERE "userId" = ${userId} LIMIT 1`;

            if (existing && existing.length > 0) {
                // Update
                // Logic to increment points if 'increment' is passed in updateData (Prisma syntax: { totalPoints: { increment: 10 } })
                let newPoints = existing[0].totalPoints;
                let newLevel = existing[0].level;

                if (updateData.totalPoints && updateData.totalPoints.increment) {
                    newPoints += updateData.totalPoints.increment;
                }

                // Simple level calculation: 1 level per 1000 points
                newLevel = Math.floor(newPoints / 1000) + 1;

                await prisma.$executeRaw`
                    UPDATE "UserPoints" 
                    SET "totalPoints" = ${newPoints}, "level" = ${newLevel}, "updatedAt" = ${now}
                    WHERE "userId" = ${userId}
                 `;
                return { ...existing[0], totalPoints: newPoints, level: newLevel, updatedAt: now };
            } else {
                // Create
                const id = require('crypto').randomUUID();
                await prisma.$executeRaw`
                    INSERT INTO "UserPoints" ("id", "userId", "totalPoints", "level", "currentStreak", "longestStreak", "updatedAt")
                    VALUES (${id}, ${userId}, ${createData.totalPoints || 0}, ${createData.level || 1}, ${createData.currentStreak || 0}, ${createData.longestStreak || 0}, ${now})
                 `;
                return { id, userId, totalPoints: createData.totalPoints || 0, level: createData.level || 1, updatedAt: now };
            }
        },
        findLeaderboard: async (limit = 10) => {
            return await prisma.$queryRawUnsafe(`
                SELECT u."name", u."avatarUrl", up."totalPoints", up."level" 
                FROM "UserPoints" up
                JOIN "User" u ON up."userId" = u."id"
                ORDER BY up."totalPoints" DESC
                LIMIT ${limit}
             `);
        }
    },
    variableExpense: {
        create: async (args: any) => {
            const data = args.data;
            const id = require('crypto').randomUUID();
            const now = new Date();
            // Note: tags is an array, we need to format it for postgres array literal or let prisma raw handle if possible.
            // Using simple string casting for safety or empty array.
            // Postgres array syntax: '{tag1, tag2}'
            const tagsSql = data.tags && data.tags.length > 0 ? `{${data.tags.join(',')}}` : '{}';

            await prisma.$executeRaw`
                INSERT INTO "VariableExpense" ("id", "userId", "category", "subcategory", "amount", "date", "description", "isImpulse", "merchant", "paymentMethod", "tags")
                VALUES (${id}, ${data.userId}, ${data.category}, ${data.subcategory}, ${data.amount}, ${data.date}, ${data.description}, ${data.isImpulse}, ${data.merchant}, ${data.paymentMethod || null}, ${tagsSql}::text[])
             `;
            return { id, ...data };
        },
        findMany: async (args: any) => {
            const userId = args.where.userId;
            const limit = args.take ? `LIMIT ${args.take}` : '';
            const orderBy = args.orderBy ? `ORDER BY date DESC` : '';
            return await prisma.$queryRawUnsafe(`SELECT * FROM "VariableExpense" WHERE "userId" = '${userId}' ${orderBy} ${limit}`);
        },
        aggregate: async (args: any) => {
            // Simplified aggregation for dashboard total
            if (args._sum && args._sum.amount) {
                const userId = args.where.userId;
                const result: any[] = await prisma.$queryRawUnsafe(`SELECT SUM(amount) as sum FROM "VariableExpense" WHERE "userId" = '${userId}'`);
                return { _sum: { amount: result[0]?.sum || 0 } };
            }
            return { _sum: { amount: 0 } };
        }
    },
    income: {
        create: async (args: any) => {
            const data = args.data;
            const id = require('crypto').randomUUID();
            const now = new Date();
            await prisma.$executeRaw`
                INSERT INTO "Income" ("id", "userId", "amount", "source", "description", "date")
                VALUES (${id}, ${data.userId}, ${data.amount}, ${data.source}, ${data.description}, ${data.date})
             `;
            return { id, ...data };
        }
    }
};

export { extendedPrisma as prisma }
// Casting to any to avoid TypeScript errors when Prisma Client types are not generated
// export const prisma = extendedPrisma as any;