import { NextResponse } from "next/server";

// Minimal placeholder handlers so this file is a proper module for Next.js
export async function GET(request: Request) {
	return NextResponse.json({ message: "Not implemented" }, { status: 404 });
}

export async function POST(request: Request) {
	return NextResponse.json({ message: "Not implemented" }, { status: 404 });
}

export const runtime = "edge";

