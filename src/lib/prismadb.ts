// MOCK PRISMA CLIENT FOR DEMO MODE
// The real Prisma binary is blocked on this system.
// This allows the app to run in-memory.

const inMemoryStore: any = {
    user: [
        {
            id: "admin_user",
            email: "filipmayer7@gmail.com",
            passwordHash: "$2b$10$SnrvnRMi3ffSB8nEptR.EjzYFCgO11dhtPZ.QkysB54IbA.",
            name: "Admin",
            role: "ADMIN",
            tier: "PREMIUM_PLUS"
        }
    ],
    income: [],
    expense: [],
    variableExpense: [],
    fixedExpense: [],
    goal: [],
    account: [],
    userAchievement: [],
    userPoints: [],
    aiConversation: [],
    notification: [],
    userSettings: []
};

export const prisma = {
    user: {
        findUnique: async ({ where }: any) => {
            const user = inMemoryStore.user.find((u: any) => u.email === where.email);
            return user || null;
        },
        create: async ({ data }: any) => {
            const newUser = { ...data, id: "user_" + Math.random() };
            inMemoryStore.user.push(newUser);
            return newUser;
        },
        update: async ({ where, data }: any) => {
            return { ...where, ...data };
        },
        upsert: async ({ where, create, update }: any) => {
            const existing = inMemoryStore.user.find((u: any) => u.email === where.email);
            if (existing) return { ...existing, ...update };
            const newUser = { ...create, id: "user_" + Math.random() };
            inMemoryStore.user.push(newUser);
            return newUser;
        },
        findFirst: async () => inMemoryStore.user[0], // fallback
    },
    income: {
        findMany: async () => [],
        create: async ({ data }: any) => data,
        aggregate: async () => ({ _sum: { amount: 0 } }),
    },
    variableExpense: {
        findMany: async () => [],
        create: async ({ data }: any) => data,
        aggregate: async () => ({ _sum: { amount: 0 } }),
    },
    fixedExpense: {
        findMany: async () => [],
        create: async ({ data }: any) => data,
        aggregate: async () => ({ _sum: { amount: 0 } }),
    },
    goal: {
        findMany: async () => [],
        create: async ({ data }: any) => data,
    },
    userAchievement: {
        findMany: async () => [],
        create: async ({ data }: any) => data,
    },
    userPoints: {
        findUnique: async () => ({ totalPoints: 100, level: 1 }),
        upsert: async () => ({ totalPoints: 100, level: 1 }),
    },
    aiConversation: {
        create: async ({ data }: any) => data,
        findMany: async () => [],
    },
    notification: {
        findMany: async () => [],
        create: async ({ data }: any) => data,
    },
    userSettings: {
        findUnique: async () => null,
        upsert: async () => ({}),
    },
    $connect: async () => { },
    $disconnect: async () => { },
} as any;
