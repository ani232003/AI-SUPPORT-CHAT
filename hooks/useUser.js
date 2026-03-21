"use client";
import { isAuthorized } from "@/lib/auth.js";
import { useEffect, useState } from "react";
import { email } from "zod";

export const useUser = () => {
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);   

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await isAuthorized();
                setEmail(userData?.email || null);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setEmail(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return { email, loading };
}