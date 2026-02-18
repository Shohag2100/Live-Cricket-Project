export type Feature = {
    id: number;
    title: string;
    description: string;
};

export interface User {
    id: number;
    username: string;
    email: string;
    isAuthenticated: boolean;
}

export interface AuthContextType {
    user: User | null;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}