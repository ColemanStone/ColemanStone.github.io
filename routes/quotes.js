// Using Node's built-in fetch (Node 18+); no imports required

// tiny timeout helper (since fetch has no built-in timeout option)
const fetchWithTimeout = async (url, ms = 5000, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
};

// simple in-memory cache
let last = null;
let lastAt = 0;
const TTL_MS = Number(process.env.QUOTE_TTL_MS ?? 0); // default: no cache; set QUOTE_TTL_MS to enable (e.g., 60000)

// fetches quote from an online API
export async function getOnlineQuote() {
    try {
        // primary source: Quotable API
        const r = await fetchWithTimeout("https://api.quotable.io/random", 5000);
        if (r.ok) {
            const j = await r.json();
            return { text: j.content, author: j.author };
        }
    } catch { }

    // fallback: ZenQuotes
    try {
        const r = await fetchWithTimeout("https://zenquotes.io/api/random", 5000);
        if (r.ok) {
            const j = await r.json();
            const first = Array.isArray(j) ? j[0] : null;
            if (first?.q) return { text: first.q, author: first.a || "Unknown" };
        }
    } catch { }

    // backup if both fail
    return {
        text: "You can’t use up creativity. The more you use, the more you have.",
        author: "Maya Angelou",
    };
}

// Express route handler
export async function randomQuoteHandler(req, res) {
    const now = Date.now();
    const bypass = (TTL_MS <= 0) || (req.query && req.query.nocache === '1');

    if (!bypass && last && now - lastAt < TTL_MS) {
        res.set('Cache-Control', 'no-store');
        return res.json(last);
    }

    const q = await getOnlineQuote();
    if (!bypass) { last = q; lastAt = now; }
    res.set('Cache-Control', 'no-store');
    res.json(q);
}