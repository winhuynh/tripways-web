import { NextResponse } from "next/server";
import { readPageDataEnvironment } from "@/lib/server/page-data-environment";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const environment = readPageDataEnvironment();
    const response = await fetch(environment.affiliateHandoffUrl, { method: "POST", headers: { apikey: environment.supabaseAnonKey, authorization: `Bearer ${environment.supabaseAnonKey}`, "content-type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
    const payload: unknown = await response.json();
    const data = typeof payload === "object"&&payload!==null&&!Array.isArray(payload)?(payload as {data?:unknown}).data:null;
    if(!response.ok||typeof data!=="object"||data===null||Array.isArray(data))return NextResponse.json({error:"ERR_HANDOFF_UNAVAILABLE"},{status:404});
    const url=(data as {url?:unknown}).url;
    if(typeof url!=="string"||!url.startsWith("https://www.aviasales.com/"))return NextResponse.json({error:"ERR_HANDOFF_UNAVAILABLE"},{status:404});
    return NextResponse.json({url});
  } catch { return NextResponse.json({error:"ERR_HANDOFF_UNAVAILABLE"},{status:404}); }
}
