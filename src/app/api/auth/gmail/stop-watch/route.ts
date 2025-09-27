import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import { stopGmailWatch } from "@/lib/gmail/watch";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await stopGmailWatch(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Gmail stop watch error:", error);
    return NextResponse.json(
      { error: "Failed to stop Gmail watch" },
      { status: 500 }
    );
  }
}
