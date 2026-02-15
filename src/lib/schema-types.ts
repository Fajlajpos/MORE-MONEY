
export interface AiInsight {
    id: string;
    userId: string;
    type: 'savings_opportunity' | 'warning' | 'tip';
    category?: string | null;
    title: string;
    message: string;
    potentialSaving?: number | null;
    priority: number;
    isRead: boolean;
    isActedOn: boolean;
    createdAt: Date;
    expiresAt?: Date | null;
}

export interface GoalContribution {
    id: string;
    goalId: string;
    amount: number;
    date: Date;
    notes?: string | null;
}

export interface MonthlySavings {
    id: string;
    userId: string;
    month: number;
    year: number;
    targetAmount: number;
    actualAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Challenge {
    id: string;
    name: string;
    description: string;
    type: string;
    category?: string | null;
    pointsReward: number;
    startDate?: Date | null;
    endDate?: Date | null;
    isActive: boolean;
}

export interface UserChallenge {
    id: string;
    userId: string;
    challengeId: string;
    progress: number;
    isCompleted: boolean;
    completedAt?: Date | null;
    joinedAt: Date;
    challenge?: Challenge;
}

export interface Achievement {
    id: string;
    code: string;
    name: string;
    description: string;
    iconUrl?: string | null;
    points: number;
    category?: string | null;
}

export interface UserAchievement {
    id: string;
    userId: string;
    achievementId: string;
    unlockedAt: Date;
    achievement?: Achievement;
}

export interface UserPoints {
    id: string;
    userId: string;
    totalPoints: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate?: Date | null;
    updatedAt: Date;
}

export interface UserConsent {
    id: string;
    userId: string;
    type: string;
    isGranted: boolean;
    grantedAt?: Date | null;
    revokedAt?: Date | null;
    ipAddress?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface DataExportRequest {
    id: string;
    userId: string;
    status: string;
    fileUrl?: string | null;
    requestedAt: Date;
    completedAt?: Date | null;
    expiresAt?: Date | null;
}

export interface FixedExpense {
    id: string;
    userId: string;
    category: string;
    customCategoryName?: string | null;
    amount: number;
    frequency: string;
    dueDate?: number | null;
    autoPay: boolean;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Goal {
    id: string;
    userId: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date | null;
    category?: string | null;
    description?: string | null; // Added
    imageUrl?: string | null; // Changed to optional to match schema
    priority: number;
    isCompleted: boolean;
    completedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
