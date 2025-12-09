import { useState, useEffect } from "react";
import { getErrorMessage } from "@/shared/utils/ErrorMessage";
import { userProfile } from "../services/user.api";

interface User {
    name: string;
    role?: string;
    image?: string;
    bio?: string;
    title?: string;
    techStack?: string[];
    profileImage?: string;
}

interface UseCurrentUserReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await userProfile();
            setUser(res.data);
        } catch (err) {
            getErrorMessage(err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, loading, error, refetch: fetchUser };
};