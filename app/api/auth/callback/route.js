import { NextResponse } from "next/server";
import { scalekit } from "@/lib/scalekit";
import { db } from "@/DB/client.js";
import { users as userTable } from "@/DB/schema.js"; 
import { jwtDecode } from "jwt-decode";             
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(req) {

    
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");

    console.log("code:", code);
    console.log("error:", error);

    if (error)
        return NextResponse.json({ error: `Authentication failed: ${error_description || error}` }, { status: 400 });

    if (!code)
        return NextResponse.json({ error: "Authentication failed: No code provided" }, { status: 400 });

    try {
        const redirectUri = process.env.SCALEKIT_REDIRECT_URI;
        console.log("redirectUri:", redirectUri);
        
        const authResult = await scalekit.authenticateWithCode(code, redirectUri); 
        console.log("authResult:", JSON.stringify(authResult, null, 2));
        
        const { user: authUser, idToken } = authResult;
        console.log("authUser:", authUser);

        const claims = jwtDecode(idToken);
        console.log("claims:", claims);

        const organizationId = claims.organization_id || claims.org_id || claims.oid || null;
        console.log("organizationId:", organizationId);

        if (!organizationId) {
            return NextResponse.json(
                { error: "Organization ID not found in token claims" },
                { status: 400 } 
            );
        }

        // Save or update user in DB
        try {
            await db
                .insert(userTable)
                .values({
                    organization_id: organizationId,
                    name: authUser.name || authUser.username || "",
                    email: authUser.email,
                    image: authUser.picture || null,
                })
                .onConflictDoUpdate({
                    target: userTable.email,
                    set: {
                        name: authUser.name || authUser.username || "",
                        image: authUser.picture || null,
                        organization_id: organizationId,
                    },
                });
            console.log("=== USER SAVED TO DB ===");
        } catch (dbErr) {
            console.error("=== DB ERROR ===", dbErr.message);
        }

        (await cookies()).set("session_user", JSON.stringify({ 
            email: authUser.email, 
            organizationId 
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.redirect(new URL("/", req.url));

    } catch (err) {
        console.error("=== CALLBACK ERROR ===", err.message);
        console.error("Full error:", err);
        return NextResponse.json(
            { error: "Authentication callback failed", details: err.message },
            { status: 500 }
        );
    }
}