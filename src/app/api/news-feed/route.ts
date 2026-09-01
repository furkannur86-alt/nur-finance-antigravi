import { NextRequest, NextResponse } from "next/server";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "stock market finance";
  const category = req.nextUrl.searchParams.get("category") || "";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "20"), 50);

  const apiKey = process.env.NEWSAPI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NewsAPI key not configured" }, { status: 500 });
  }

  try {
    let url: string;
    if (category) {
      url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=${limit}&apiKey=${apiKey}`;
    } else {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${apiKey}`;
    }

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.message || `NewsAPI ${res.status}` }, { status: 502 });
    }

    const data = await res.json();

    const articles: NewsArticle[] = (data.articles || [])
      .filter((a: Record<string, unknown>) => a.title && a.title !== "[Removed]")
      .map((a: Record<string, unknown>) => ({
        title: a.title || "",
        description: a.description || "",
        url: a.url || "",
        source: (a.source as Record<string, unknown>)?.name || "",
        publishedAt: a.publishedAt || "",
        urlToImage: a.urlToImage || null,
      }));

    return NextResponse.json({ articles, total: data.totalResults || articles.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
