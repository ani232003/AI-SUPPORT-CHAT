import { cookies } from "next/headers";

export async function isAuthorized() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session_user');

        if (!session?.value) return null;

        return JSON.parse(session.value);
    } catch (error) {
        return null;
    }
}