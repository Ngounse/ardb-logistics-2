import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { username, password } = await request.json();

    // const res = await fetch(`${process.env.BASE_URL}/auth/login`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ username, password }),
    // });

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/notification?page=0&size=1`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Invalid notification" }, { status: 401 });
    }

    const data = await res.json();

    const response = NextResponse.json({ success: true });

    return response;
}
