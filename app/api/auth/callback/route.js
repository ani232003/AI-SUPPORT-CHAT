import { NextResponse } from "next/server";
import { scalekit } from "@/lib/scalekit";
import { db } from "@/DB/client.js";
import { users as userTable } from "@/DB/schema.js"; 
import { jwtDecode } from "jwt-decode";             
import { eq } from "drizzle-orm";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");

    if (error)
        return NextResponse.json({ error: `Authentication failed: ${error_description || error}` }, { status: 400 });

    if (!code)
        return NextResponse.json({ error: "Authentication failed: No code provided" }, { status: 400 });

    try {
        const redirectUri = process.env.SCALEKIT_REDIRECT_URI;
        const authResult = await scalekit.authenticateWithCode(code, redirectUri); 
        const { user: authUser, idToken } = authResult;
        const claims = jwtDecode(idToken);
        const organizationId = claims.organization_id || claims.org_id || claims.oid || null;

        if (!organizationId) {
            return NextResponse.json({ error: "Organization ID not found" }, { status: 400 });
        }

        try {
            await db.insert(userTable).values({
                organization_id: organizationId,
                name: authUser.name || "",
                email: authUser.email,
                image: authUser.picture || null,
            }).onConflictDoUpdate({
                target: userTable.email,
                set: {
                    name: authUser.name || "",
                    image: authUser.picture || null,
                    organization_id: organizationId,
                },
            });
        } catch (dbErr) {
            console.error("DB ERROR:", dbErr.message);
        }

        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.set("session_user", JSON.stringify({ 
            email: authUser.email, 
            organizationId 
        }), {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
        return response;

    } catch (err) {
        console.error("CALLBACK ERROR:", err.message);
        return NextResponse.json({ error: "Authentication callback failed", details: err.message }, { status: 500 });
    }
}