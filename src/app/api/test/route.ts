import { NextResponse } from "next/server";
import { startGmailWatch } from "@/lib/gmail/watch";

export async function GET() {
//   await startGmailWatch("68ebb67a228cfebbc17cdf81");

  return NextResponse.json({ message: "Hello, world!" });
}
