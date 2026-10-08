import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { username, password } = await request.json();

    // const res = await fetch(`${process.env.BASE_URL}/auth/login`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ username, password }),
    // });

    const res = await fetch(`http://localhost:5000/login`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Invalid login" }, { status: 401 });
    }

    const data = await res.json();

    const response = NextResponse.json({ success: true });
    console.log("data::", data);

    // save backend token to cookie
    response.cookies.set("token", data.token, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24,
    });

    return response;
}
