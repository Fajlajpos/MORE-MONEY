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
        findUnique: async ({ where }: { where: { email?: string; id?: string } }): Promise<User | null> => {
            if (where.id) {
                return inMemoryStore.user.find((u) => u.id === where.id) || null;
            }
            if (where.email) {
                return inMemoryStore.user.find((u) => u.email === where.email) || null;
            }
            return null;
        },
        create: async ({ data }: { data: Omit<User, 'id'> }): Promise<User> => {
            const newUser: User = {
                ...data,
                id: "user_" + Math.random().toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                emailVerified: null,
                role: 'USER',
                tier: 'FREE',
                currency: 'CZK',
                language: 'cs',
                theme: 'system',
                avatarUrl: null,
                phone: null,
                dateOfBirth: null,
                gender: null,
                location: null,
                lastLoginAt: null,
                passwordHash: data.passwordHash || null,
                name: data.name || null
            };
            inMemoryStore.user.push(newUser);
            return newUser;
        },
        update: async ({ where, data }: { where: { id?: string; email?: string }, data: Partial<User> }): Promise<User> => {
            let userIndex = -1;
            if (where.id) userIndex = inMemoryStore.user.findIndex(u => u.id === where.id);
            else if (where.email) userIndex = inMemoryStore.user.findIndex(u => u.email === where.email);

            if (userIndex === -1) throw new Error("User not found");
            const updatedUser = { ...inMemoryStore.user[userIndex], ...data, updatedAt: new Date() };
            inMemoryStore.user[userIndex] = updatedUser as User;
            return updatedUser as User;
        },
        upsert: async ({ where, create, update }: { where: { email: string }, create: Omit<User, 'id'>, update: Partial<User> }): Promise<User> => {
            const existingUser = inMemoryStore.user.find((u) => u.email === where.email);
            if (existingUser) {
                const updatedUser = { ...existingUser, ...update, updatedAt: new Date() };
                const userIndex = inMemoryStore.user.findIndex(u => u.email === where.email);
                inMemoryStore.user[userIndex] = updatedUser as User;
                return updatedUser as User;
            }
            const newUser: User = {
                ...create,
                id: "user_" + Math.random().toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                emailVerified: null,
                role: 'USER',
                tier: 'FREE',
                currency: 'CZK',
                language: 'cs',
                theme: 'system',
                avatarUrl: null,
                phone: null,
                dateOfBirth: null,
                gender: null,
                location: null,
                lastLoginAt: null,
                passwordHash: create.passwordHash || null,
                name: create.name || null
            };
            inMemoryStore.user.push(newUser);
            return newUser;
        },
        findFirst: async (): Promise<User | null> => inMemoryStore.user[0] || null,
    },
    income: {
        findMany: async ({ where, orderBy }: { where?: { userId?: string }, orderBy?: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }): Promise<Income[]> => {
            let result = inMemoryStore.income;
            if (where?.userId) {
                result = result.filter(i => i.userId === where.userId);
            }
            if (orderBy?.date === 'desc') {
                result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            }
            return result;
        },
        create: async ({ data }: { data: Omit<Income, 'id'> }): Promise<Income> => {
            const newIncome = { ...data, id: "income_" + Math.random().toString(), date: data.date || new Date() };
            inMemoryStore.income.push(newIncome);
            return newIncome;
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<Income> }): Promise<Income> => {
            const index = inMemoryStore.income.findIndex(i => i.id === where.id);
            if (index === -1) throw new Error("Income not found");
            const updated = { ...inMemoryStore.income[index], ...data };
            inMemoryStore.income[index] = updated;
            return updated;
        },
        delete: async ({ where }: { where: { id: string } }): Promise<Income> => {
            const index = inMemoryStore.income.findIndex(i => i.id === where.id);
            if (index === -1) throw new Error("Income not found");
            const deleted = inMemoryStore.income[index];
            inMemoryStore.income.splice(index, 1);
            return deleted;
        },
        aggregate: async ({ where }: { where?: { userId: string } }): Promise<{ _sum: { amount: number } }> => {
            const items = where?.userId ? inMemoryStore.income.filter(i => i.userId === where.userId) : inMemoryStore.income;
            const sum = items.reduce((acc, curr) => acc + curr.amount, 0);
            return { _sum: { amount: sum } };
        },
    },
    variableExpense: {
        findMany: async ({ where, orderBy }: { where?: { userId?: string }, orderBy?: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }): Promise<VariableExpense[]> => {
            let result = inMemoryStore.variableExpense;
            if (where?.userId) {
                result = result.filter(i => i.userId === where.userId);
            }
            if (orderBy?.date === 'desc') {
                result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            }
            return result;
        },
        create: async ({ data }: { data: Omit<VariableExpense, 'id'> }): Promise<VariableExpense> => {
            const newExpense = {
                ...data,
                id: "vexpense_" + Math.random().toString(),
                date: data.date || new Date(),
                isImpulse: data.isImpulse ?? false,
                merchant: data.merchant || null,
                tags: data.tags || null,
                description: data.description || null,
                subcategory: data.subcategory || null
            };
            inMemoryStore.variableExpense.push(newExpense);
            return newExpense;
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<VariableExpense> }): Promise<VariableExpense> => {
            const index = inMemoryStore.variableExpense.findIndex(i => i.id === where.id);
            if (index === -1) throw new Error("VariableExpense not found");
            const updated = { ...inMemoryStore.variableExpense[index], ...data };
            inMemoryStore.variableExpense[index] = updated;
            return updated;
        },
        delete: async ({ where }: { where: { id: string } }): Promise<VariableExpense> => {
            const index = inMemoryStore.variableExpense.findIndex(i => i.id === where.id);
            if (index === -1) throw new Error("VariableExpense not found");
            const deleted = inMemoryStore.variableExpense[index];
            inMemoryStore.variableExpense.splice(index, 1);
            return deleted;
        },
        aggregate: async ({ where }: { where?: { userId: string } }): Promise<{ _sum: { amount: number } }> => {
            const items = where?.userId ? inMemoryStore.variableExpense.filter(i => i.userId === where.userId) : inMemoryStore.variableExpense;
            const sum = items.reduce((acc, curr) => acc + curr.amount, 0);
            return { _sum: { amount: sum } };
        },
    },
    fixedExpense: {
        findMany: async ({ where }: { where?: { userId?: string } }): Promise<FixedExpense[]> => {
            let result = inMemoryStore.fixedExpense;
            if (where?.userId) {
                result = result.filter(i => i.userId === where.userId);
            }
            return result;
        },
        create: async ({ data }: { data: Omit<FixedExpense, 'id'> }): Promise<FixedExpense> => {
            const newExpense = {
                ...data,
                id: "fexpense_" + Math.random().toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                autoPay: data.autoPay ?? false,
                dueDate: data.dueDate ?? null,
                customCategoryName: data.customCategoryName ?? null
            };
            inMemoryStore.fixedExpense.push(newExpense);
            return newExpense;
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<FixedExpense> }): Promise<FixedExpense> => {
            const index = inMemoryStore.fixedExpense.findIndex(i => i.id === where.id);
            if (index === -1) throw new Error("FixedExpense not found");
            const updated = { ...inMemoryStore.fixedExpense[index], ...data, updatedAt: new Date() };
            inMemoryStore.fixedExpense[index] = updated;
            return updated;
        },
        delete: async ({ where }: { where: { id: string } }): Promise<FixedExpense> => {
            const index = inMemoryStore.fixedExpense.findIndex(i => i.id === where.id);
            if (index === -1) throw new Error("FixedExpense not found");
            const deleted = inMemoryStore.fixedExpense[index];
            inMemoryStore.fixedExpense.splice(index, 1);
            return deleted;
        },
        aggregate: async ({ where }: { where?: { userId: string } }): Promise<{ _sum: { amount: number } }> => {
            const items = where?.userId ? inMemoryStore.fixedExpense.filter(i => i.userId === where.userId) : inMemoryStore.fixedExpense;
            const sum = items.reduce((acc, curr) => acc + curr.amount, 0);
            return { _sum: { amount: sum } };
        },
    },
    goal: {
        findMany: async ({ where }: { where?: { userId?: string } }): Promise<Goal[]> => {
            let result = inMemoryStore.goal;
            if (where?.userId) {
                result = result.filter(i => i.userId === where.userId);
            }
            return result;
        },
        create: async ({ data }: { data: Omit<Goal, 'id'> }): Promise<Goal> => {
            const newGoal: Goal = {
                ...data,
                id: "goal_" + Math.random().toString(),
                createdAt: new Date(),
                isCompleted: false,
                currentAmount: data.currentAmount || 0,
                deadline: data.deadline || null,
                category: data.category || null,
                imageUrl: data.imageUrl || null
            };
            inMemoryStore.goal.push(newGoal);
            return newGoal;
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<Goal> }): Promise<Goal> => {
            const index = inMemoryStore.goal.findIndex(i => i.id === where.id);
            if (index === -1) throw new Error("Goal not found");
            const updated = { ...inMemoryStore.goal[index], ...data };
            inMemoryStore.goal[index] = updated;
            return updated;
        },
        delete: async ({ where }: { where: { id: string } }): Promise<Goal> => {
            const index = inMemoryStore.goal.findIndex(i => i.id === where.id);
            if (index === -1) throw new Error("Goal not found");
            const deleted = inMemoryStore.goal[index];
            inMemoryStore.goal.splice(index, 1);
            return deleted;
        },
    },
    userAchievement: {
        findMany: async ({ where }: { where?: { userId?: string } }): Promise<UserAchievement[]> => {
            let result = inMemoryStore.userAchievement;
            if (where?.userId) {
                result = result.filter(i => i.userId === where.userId);
            }
            return result;
        },
        create: async ({ data }: { data: Omit<UserAchievement, 'id'> }): Promise<UserAchievement> => {
            const newAch = { ...data, id: "uachievement_" + Math.random().toString(), unlockedAt: new Date() };
            inMemoryStore.userAchievement.push(newAch);
            return newAch;
        }
    },
    userPoints: {
        findUnique: async ({ where }: { where: { userId: string } }): Promise<UserPoints | null> => {
            return inMemoryStore.userPoints.find(p => p.userId === where.userId) || null;
        },
        upsert: async ({ where, create, update }: { where: { userId: string }, create: Omit<UserPoints, 'id'>, update: Partial<UserPoints> }): Promise<UserPoints> => {
            const index = inMemoryStore.userPoints.findIndex(p => p.userId === where.userId);
            if (index > -1) {
                const updated = { ...inMemoryStore.userPoints[index], ...update };
                inMemoryStore.userPoints[index] = updated as UserPoints;
                return updated as UserPoints;
            }
            const newPoints = {
                ...create,
                id: "upoints_" + Math.random().toString(),
                totalPoints: create.totalPoints ?? 0,
                level: create.level ?? 1,
                currentStreak: create.currentStreak ?? 0
            };
            inMemoryStore.userPoints.push(newPoints);
            return newPoints;
        },
        update: async ({ where, data }: { where: { userId: string }, data: Partial<UserPoints> }): Promise<UserPoints> => {
            const index = inMemoryStore.userPoints.findIndex(p => p.userId === where.userId);
            if (index === -1) throw new Error("UserPoints not found");
            const updated = { ...inMemoryStore.userPoints[index], ...data };
            inMemoryStore.userPoints[index] = updated as UserPoints;
            return updated as UserPoints;
        }
    },
    aiConversation: {
        create: async ({ data }: { data: Omit<AiConversation, 'id'> }): Promise<AiConversation> => {
            const newConvo = { ...data, id: "aiconvo_" + Math.random().toString(), createdAt: new Date() };
            inMemoryStore.aiConversation.push(newConvo);
            return newConvo;
        },
        findMany: async ({ where, orderBy }: { where?: { userId?: string }, orderBy?: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }): Promise<AiConversation[]> => {
            let result = inMemoryStore.aiConversation;
            if (where?.userId) {
                result = result.filter(i => i.userId === where.userId);
            }
            if (orderBy?.createdAt === 'asc') {
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            }
            return result;
        },
    },
    notification: {
        findMany: async ({ where, orderBy }: { where?: { userId?: string }, orderBy?: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }): Promise<Notification[]> => {
            let result = inMemoryStore.notification;
            if (where?.userId) {
                result = result.filter(i => i.userId === where.userId);
            }
            if (orderBy?.createdAt === 'desc') {
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            return result;
        },
        create: async ({ data }: { data: Omit<Notification, 'id'> }): Promise<Notification> => {
            const newNoti = {
                ...data,
                id: "noti_" + Math.random().toString(),
                createdAt: new Date(),
                isRead: false
            };
            inMemoryStore.notification.push(newNoti);
            return newNoti;
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<Notification> }): Promise<Notification> => {
            const index = inMemoryStore.notification.findIndex(n => n.id === where.id);
            if (index === -1) throw new Error("Notification not found");
            const updated = { ...inMemoryStore.notification[index], ...data };
            inMemoryStore.notification[index] = updated;
            return updated;
        }
    },
    userSettings: {
        findUnique: async ({ where }: { where: { userId: string } }): Promise<UserSettings | null> => {
            return inMemoryStore.userSettings.find(s => s.userId === where.userId) || null;
        },
        upsert: async ({ where, create, update }: { where: { userId: string }, create: Omit<UserSettings, 'id'>, update: Partial<UserSettings> }): Promise<UserSettings> => {
            const index = inMemoryStore.userSettings.findIndex(s => s.userId === where.userId);
            if (index > -1) {
                const updated = { ...inMemoryStore.userSettings[index], ...update };
                inMemoryStore.userSettings[index] = updated as UserSettings;
                return updated as UserSettings;
            }
            const newSettings = {
                ...create,
                id: "usettings_" + Math.random().toString(),
                budgetLimit: create.budgetLimit ?? null,
                savingGoal: create.savingGoal ?? null
            };
            inMemoryStore.userSettings.push(newSettings);
            return newSettings;
        },
        update: async ({ where, data }: { where: { userId: string }, data: Partial<UserSettings> }): Promise<UserSettings> => {
            const index = inMemoryStore.userSettings.findIndex(s => s.userId === where.userId);
            if (index === -1) throw new Error("UserSettings not found");
            const updated = { ...inMemoryStore.userSettings[index], ...data };
            inMemoryStore.userSettings[index] = updated as UserSettings;
            return updated as UserSettings;
        }
    },
    $connect: async () => { },
    $disconnect: async () => { },
} as unknown as PrismaClient;