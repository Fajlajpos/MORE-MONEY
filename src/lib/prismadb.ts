import {
    User,
    Income,
    VariableExpense,
    FixedExpense,
    Goal,
    UserAchievement,
    UserPoints,
    AiConversation,
    Notification,
    UserSettings,
    PrismaClient,
} from '@prisma/client';

type InMemoryStore = {
    user: User[];
    income: Income[];
    variableExpense: VariableExpense[];
    fixedExpense: FixedExpense[];
    goal: Goal[];
    userAchievement: UserAchievement[];
    userPoints: UserPoints[];
    aiConversation: AiConversation[];
    notification: Notification[];
    userSettings: UserSettings[];
};

const globalForPrisma = global as unknown as { prismaMockStore: InMemoryStore };

const inMemoryStore: InMemoryStore = globalForPrisma.prismaMockStore || {
    user: [
        {
            id: "admin_user",
            email: "filipmayer7@gmail.com",
            passwordHash: "$2b$10$SnrvnRMi3ffSB8nEptR.EjzYFCgO11dhtPZ.QkysB54IbA.",
            name: "Admin",
            avatarUrl: null,
            phone: null,
            dateOfBirth: null,
            gender: null,
            location: null,
            currency: 'CZK',
            language: 'cs',
            theme: 'system',
            isActive: true,
            emailVerified: null,
            role: "ADMIN",
            tier: "PREMIUM_PLUS",
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: null
        }
    ],
    income: [],
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

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaMockStore = inMemoryStore;
}

export const prisma = {
    user: {
        findUnique: async ({ where }: { where: { email: string } }): Promise<User | null> => {
            const user = inMemoryStore.user.find((u) => u.email === where.email);
            return user || null;
        },
        create: async ({ data }: { data: Omit<User, 'id'> }): Promise<User> => {
            const newUser: User = { ...data, id: "user_" + Math.random().toString(), createdAt: new Date(), updatedAt: new Date(), isActive: true, emailVerified: null, role: 'USER', tier: 'FREE', currency: 'CZK', language: 'cs', theme: 'system', avatarUrl: null, phone: null, dateOfBirth: null, gender: null, location: null, lastLoginAt: null, passwordHash: data.passwordHash || null, name: data.name || null };
            inMemoryStore.user.push(newUser);
            return newUser;
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<User> }): Promise<User> => {
            const userIndex = inMemoryStore.user.findIndex(u => u.id === where.id);
            if (userIndex === -1) throw new Error("User not found");
            const updatedUser = { ...inMemoryStore.user[userIndex], ...data };
            inMemoryStore.user[userIndex] = updatedUser as User;
            return updatedUser as User;
        },
        upsert: async ({ where, create, update }: { where: { email: string }, create: Omit<User, 'id'>, update: Partial<User> }): Promise<User> => {
            const existingUser = inMemoryStore.user.find((u) => u.email === where.email);
            if (existingUser) {
                const updatedUser = { ...existingUser, ...update };
                const userIndex = inMemoryStore.user.findIndex(u => u.email === where.email);
                inMemoryStore.user[userIndex] = updatedUser as User;
                return updatedUser as User;
            }
            const newUser: User = { ...create, id: "user_" + Math.random().toString(), createdAt: new Date(), updatedAt: new Date(), isActive: true, emailVerified: null, role: 'USER', tier: 'FREE', currency: 'CZK', language: 'cs', theme: 'system', avatarUrl: null, phone: null, dateOfBirth: null, gender: null, location: null, lastLoginAt: null, passwordHash: create.passwordHash || null, name: create.name || null };
            inMemoryStore.user.push(newUser);
            return newUser;
        },
        findFirst: async (): Promise<User | null> => inMemoryStore.user[0] || null,
    },
    income: {
        findMany: async (): Promise<Income[]> => [],
        create: async ({ data }: { data: Omit<Income, 'id'> }): Promise<Income> => ({ ...data, id: "income_" + Math.random().toString(), date: new Date() }),
        aggregate: async (): Promise<{ _sum: { amount: number } }> => ({ _sum: { amount: 0 } }),
    },
    variableExpense: {
        findMany: async (): Promise<VariableExpense[]> => [],
        create: async ({ data }: { data: Omit<VariableExpense, 'id'> }): Promise<VariableExpense> => ({ ...data, id: "vexpense_" + Math.random().toString(), date: new Date(), tags: [] }),
        aggregate: async (): Promise<{ _sum: { amount: number } }> => ({ _sum: { amount: 0 } }),
    },
    fixedExpense: {
        findMany: async (): Promise<FixedExpense[]> => [],
        create: async ({ data }: { data: Omit<FixedExpense, 'id'> }): Promise<FixedExpense> => ({ ...data, id: "fexpense_" + Math.random().toString() }),
        aggregate: async (): Promise<{ _sum: { amount: number } }> => ({ _sum: { amount: 0 } }),
    },
    goal: {
        findMany: async (): Promise<Goal[]> => inMemoryStore.goal,
        create: async ({ data }: { data: Omit<Goal, 'id'> }): Promise<Goal> => {
            const newGoal: Goal = { ...data, id: "goal_" + Math.random().toString(), createdAt: new Date(), isCompleted: false, currentAmount: 0 };
            inMemoryStore.goal.push(newGoal);
            return newGoal;
        },
    },
    userAchievement: {
        findMany: async (): Promise<UserAchievement[]> => [],
        create: async ({ data }: { data: Omit<UserAchievement, 'id'> }): Promise<UserAchievement> => ({ ...data, id: "uachievement_" + Math.random().toString(), unlockedAt: new Date() }),
    },
    userPoints: {
        findUnique: async (): Promise<UserPoints | null> => ({ id: "upoints_1", userId: "admin_user", totalPoints: 100, level: 1, currentStreak: 0 }),
        upsert: async (): Promise<UserPoints> => ({ id: "upoints_1", userId: "admin_user", totalPoints: 100, level: 1, currentStreak: 0 }),
    },
    aiConversation: {
        create: async ({ data }: { data: Omit<AiConversation, 'id'> }): Promise<AiConversation> => ({ ...data, id: "aiconvo_" + Math.random().toString(), createdAt: new Date() }),
        findMany: async (): Promise<AiConversation[]> => [],
    },
    notification: {
        findMany: async (): Promise<Notification[]> => [],
        create: async ({ data }: { data: Omit<Notification, 'id'> }): Promise<Notification> => ({ ...data, id: "noti_" + Math.random().toString(), createdAt: new Date(), isRead: false }),
    },
    userSettings: {
        findUnique: async (): Promise<UserSettings | null> => null,
        upsert: async (): Promise<UserSettings> => ({ id: "usettings_1", userId: "admin_user", budgetLimit: null, savingGoal: null }),
    },
    $connect: async () => { },
    $disconnect: async () => { },
} as unknown as PrismaClient;