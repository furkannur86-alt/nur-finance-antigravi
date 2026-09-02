import { NextRequest, NextResponse } from "next/server";

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

const RSS_FEEDS: Record<string, { url: string; category: string }> = {
  reuters_markets: { url: "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best", category: "Markets" },
  yahoo_finance: { url: "https://finance.yahoo.com/news/rssindex", category: "Markets" },
  cnbc_world: { url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100727362", category: "World" },
  ft_markets: { url: "https://www.ft.com/markets?format=rss", category: "Markets" },
  coindesk: { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", category: "Crypto" },
  investopedia: { url: "https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_headline", category: "Education" },
  seeking_alpha: { url: "https://seekingalpha.com/market_currents.xml", category: "Analysis" },
  marketwatch: { url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", category: "Markets" },
};

async function fetchRSSFeed(name: string, config: { url: string; category: string }): Promise<RSSItem[]> {
  try {
    const res = await fetch(config.url, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "NurFinance/2.1 RSS Reader" },
    });
    if (!res.ok) return [];

    const text = await res.text();
    const items: RSSItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null && items.length < 10) {
      const itemXml = match[1];
      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const pubDate = extractTag(itemXml, "pubDate");

      if (title) {
        items.push({
          title: cleanCDATA(title),
          link: link || "",
          pubDate: pubDate || new Date().toISOString(),
          source: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          category: config.category,
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function cleanCDATA(text: string): string {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sources = searchParams.get("sources")?.split(",") || Object.keys(RSS_FEEDS);
  const category = searchParams.get("category");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const validSources = sources.filter((s) => RSS_FEEDS[s]);
  if (validSources.length === 0) {
    return NextResponse.json({
      feeds: Object.keys(RSS_FEEDS),
      error: "No valid sources specified. Use ?sources=reuters_markets,coindesk",
    }, { status: 400 });
  }

  const results = await Promise.allSettled(
    validSources.map((name) => fetchRSSFeed(name, RSS_FEEDS[name]))
  );

  let items: RSSItem[] = [];
  const errors: string[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    } else {
      errors.push(`${validSources[i]}: ${result.reason}`);
    }
  });

  if (category) {
    items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  items = items.slice(0, limit);

  return NextResponse.json({
    count: items.length,
    sources: validSources,
    items,
    ...(errors.length > 0 ? { errors } : {}),
    availableFeeds: Object.keys(RSS_FEEDS),
  });
}
