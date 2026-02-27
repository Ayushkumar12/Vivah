import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';

interface User {
    _id: string;
    fullName: string;
    email: string;
    gender: string;
    age: number;
    photos: string[];
    subscriptionTier: string;
    shortlisted: string[];
    location?: { city: string };
    profession?: string;
    education?: string;
    bio?: string;
    isAdmin?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    toggleShortlistStore: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: async (credentials) => {
                try {
                    const data = await authService.login(credentials);
                    set({
                        user: data,
                        token: data.token,
                        isAuthenticated: true
                    });
                } catch (error: any) {
                    throw new Error(error.response?.data?.message || 'Login failed');
                }
            },
            register: async (userData) => {
                try {
                    const data = await authService.register(userData);
                    set({
                        user: data,
                        token: data.token,
                        isAuthenticated: true
                    });
                } catch (error: any) {
                    throw new Error(error.response?.data?.message || 'Registration failed');
                }
            },
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null
                })),
            toggleShortlistStore: (id) =>
                set((state) => ({
                    user: state.user ? {
                        ...state.user,
                        shortlisted: state.user.shortlisted?.includes(id)
                            ? state.user.shortlisted.filter(sid => sid !== id)
                            : [...(state.user.shortlisted || []), id]
                    } : null
                })),
        }),
        {
            name: 'auth-storage',
        }
    )
);
