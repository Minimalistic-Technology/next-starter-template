import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { targetUrl?: string; method?: string; requestBody?: string };
        const { targetUrl, method, requestBody } = body;

        if (!targetUrl) {
            return NextResponse.json({ error: "targetUrl is required" }, { status: 400 });
        }

        const options: RequestInit = {
            method: method || "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (method !== "GET" && method !== "HEAD" && requestBody) {
            options.body = typeof requestBody === "string" ? requestBody : JSON.stringify(requestBody);
        }

        const startTime = Date.now();
        const response = await fetch(targetUrl, options);
        const endTime = Date.now();

        const text = await response.text();

        let parsedBody;
        try {
            parsedBody = JSON.parse(text);
        } catch {
            parsedBody = text;
        }

        return NextResponse.json({
            status: response.status,
            statusText: response.statusText,
            responseTime: endTime - startTime,
            body: parsedBody,
            headers: Object.fromEntries(response.headers.entries()),
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || "Failed to reach the backend server",
                details: "The backend server may be sleeping (Render free tier) or the URL is incorrect.",
            },
            { status: 502 }
        );
    }
}
