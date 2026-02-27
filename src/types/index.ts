export type Gender = 'Male' | 'Female' | 'Other';
export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';

export interface UserProfile {
    id: string;
    fullName: string;
    age: number;
    gender: Gender;
    height: string;
    caste?: string;
    motherTongue: string;
    location: {
        city: string;
        state: string;
        country: string;
    };
    profession: string;
    education: string;
    income?: string;
    photos: string[];
    bio: string;
    interests: string[];
    familyDetails: {
        fatherStatus: string;
        motherStatus: string;
        siblings: string;
        familyValues: 'Traditional' | 'Moderate' | 'Liberal';
    };
    subscriptionTier: 'Free' | 'Silver' | 'Gold' | 'Diamond';
    isVerified: boolean;
    lastActive?: string;
}

export interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    token: string | null;
}
