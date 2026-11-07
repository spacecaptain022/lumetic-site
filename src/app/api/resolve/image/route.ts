import { NextRequest, NextResponse } from "next/server";
import { cleanResolveName, parseResolveStyle, renderResolvedImage } from "@/lib/resolve-image";

/** The preview image on /resolve. Deterministic per name and style, so it caches well. */
export async function GET(req: NextRequest) {
  const name = cleanResolveName(req.nextUrl.searchParams.get("name"));
  if (!name) return NextResponse.json({ error: "Add a name." }, { status: 400 });
  const style = parseResolveStyle(req.nextUrl.searchParams.get("style"));

  return renderResolvedImage(name, style, {
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
  });
}
