"use server"

import { registerSchema } from "@/lib/validations/auth"
import { redirect } from "next/navigation";
import { randomInt } from 'crypto';
import { cookies } from "next/headers";

export async function registerAction(formData: FormData) {
    const parsedResponse = registerSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        universityId: formData.get("universityId"),
    });

    if (!parsedResponse.success) {
        return { success: false, errors: parsedResponse.error.flatten().fieldErrors };
    }


    const user = await fetch(`http://localhost:3001/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedResponse.data),
        credentials: "include",
    });

    const data = await user.json(); // Parse JSON

    console.log("got user,", user)

    if (!user.ok) {
        const errorData = await user.json();
        console.log("in here", errorData)
        return { success: false, errors: { message: [errorData.message || "Registration failed"] } };
    }

    (await cookies()).set("session", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: data.maxAge / 1000, // maxAge is in seconds for cookies()
        path: "/",
        domain: "localhost",
    });

    redirect("/verify");
}
