import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfCountry = req.headers.get("cf-ipcountry");
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  const vercelCity = req.headers.get("x-vercel-ip-city");
  const vercelRegion = req.headers.get("x-vercel-ip-country-region");

  if (cfCountry || vercelCountry) {
    return NextResponse.json({
      country: cfCountry || vercelCountry || "US",
      city: vercelCity || null,
      region: vercelRegion || null,
      source: cfCountry ? "cloudflare" : "vercel",
    });
  }

  const ip = forwarded?.split(",")[0]?.trim() || realIp || "8.8.8.8";

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName,timezone`, {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        return NextResponse.json({
          country: data.countryCode,
          city: data.city,
          region: data.regionName,
          timezone: data.timezone,
          source: "ip-api",
        });
      }
    }
  } catch {}

  return NextResponse.json({
    country: "US",
    city: null,
    region: null,
    source: "fallback",
  });
}
