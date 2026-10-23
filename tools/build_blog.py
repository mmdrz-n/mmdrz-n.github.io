"""Build the blog from content/posts/*.html.

Each source file starts with a front-matter comment:

    <!--
    title: Post title
    title_de: German title for the /de/ listing (optional)
    category: network-security | python-automation | career-strategy | labs
    date: 2026-10-20
    featured: true            (optional, one post)
    lede: One-paragraph intro shown under the title and on cards.
    lede_de: German card summary (optional)
    -->

followed by the article body (h2/h3/p/ul/pre...). Text inside <pre><code> is
written raw and HTML-escaped here, so code can be pasted as-is.

Run from the repo root:  python tools/build_blog.py
It writes posts/*.html, feed.xml, sitemap.xml, js/posts-data.js and refreshes
the generated blocks in blog.html, de/blog.html, index.html and de/index.html.
"""

import html
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://mmdrz-n.github.io"
WPM = 220

CATEGORIES = {
    "network-security": {"en": "Network security", "de": "Netzwerksicherheit"},
    "python-automation": {"en": "Python automation", "de": "Python-Automatisierung"},
    "career-strategy": {"en": "Career strategy", "de": "Karrierestrategie"},
    "labs": {"en": "Labs", "de": "Labs"},
}
MONTHS_DE = ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."]

FRONT_RE = re.compile(r"^\s*<!--(.*?)-->", re.S)
CODE_RE = re.compile(r"(<pre[^>]*><code>)(.*?)(</code></pre>)", re.S)


def load_posts():
    posts = []
    for path in sorted((ROOT / "content" / "posts").glob("*.html")):
        src = path.read_text(encoding="utf-8")
        m = FRONT_RE.match(src)
        if not m:
            raise SystemExit(f"{path.name}: missing front-matter comment")
        meta = {}
        for line in m.group(1).strip().splitlines():
            key, sep, value = line.partition(":")
            if sep:
                meta[key.strip()] = value.strip()
        body = src[m.end():].strip()
        body = CODE_RE.sub(lambda c: c.group(1) + html.escape(c.group(2), quote=False) + c.group(3), body)
        text = re.sub(r"<[^>]+>", " ", body)
        meta.update(
            slug=path.stem,
            body=body,
            date=date.fromisoformat(meta["date"]),
            minutes=max(1, round(len(text.split()) / WPM)),
            featured=meta.get("featured", "").lower() == "true",
        )
        if meta["category"] not in CATEGORIES:
            raise SystemExit(f"{path.name}: unknown category {meta['category']}")
        posts.append(meta)
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts


def fmt_date(d, lang):
    if lang == "de":
        return f"{d.day}. {MONTHS_DE[d.month - 1]} {d.year}"
    return d.strftime("%b %d, %Y")


def meta_line(p, lang):
    mins = f"{p['minutes']} Min. Lesezeit" if lang == "de" else f"{p['minutes']} min read"
    return f"{fmt_date(p['date'], lang)} · {mins}"


def esc(s):
    return html.escape(s, quote=True)


# ── Article page ──
def render_post(p, prev_p, next_p):
    cat = CATEGORIES[p["category"]]["en"]
    url = f"{SITE}/posts/{p['slug']}.html"
    ld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": p["title"],
        "description": p["lede"],
        "datePublished": p["date"].isoformat(),
        "author": {"@type": "Person", "name": "Mohammadreza Nobahari", "url": f"{SITE}/"},
        "mainEntityOfPage": url,
    }
    nav_links = []
    if next_p:  # newer
        nav_links.append(f'<a class="prev" href="{next_p["slug"]}.html"><small>← Newer</small>{esc(next_p["title"])}</a>')
    if prev_p:  # older
        nav_links.append(f'<a class="next" href="{prev_p["slug"]}.html"><small>Older →</small>{esc(prev_p["title"])}</a>')
    share = (
        "https://www.linkedin.com/sharing/share-offsite/?url=" + html.escape(url)
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(p['title'])} · Mohammadreza Nobahari</title>
  <meta name="description" content="{esc(p['lede'])}">
  <meta name="author" content="Mohammadreza Nobahari">
  <link rel="canonical" href="{url}">
  <link rel="alternate" type="application/rss+xml" title="Mohammadreza Nobahari · Writing" href="../feed.xml">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230a1424'/%3E%3Crect x='2' y='2' width='60' height='60' rx='12' fill='none' stroke='%2338bdf8' stroke-width='3'/%3E%3Ctext x='32' y='41' font-family='Arial,sans-serif' font-size='26' font-weight='700' text-anchor='middle' fill='%2338bdf8'%3EMN%3C/text%3E%3C/svg%3E">
  <meta property="og:title" content="{esc(p['title'])}">
  <meta property="og:description" content="{esc(p['lede'])}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{url}">
  <meta property="article:published_time" content="{p['date'].isoformat()}">
  <meta name="twitter:card" content="summary">
  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/blog.css">
  <link rel="stylesheet" href="../css/post.css">
</head>
<body>

<div class="scroll-progress" aria-hidden="true"></div>
<a class="skip-link" href="#main">Skip to content</a>

<nav aria-label="Primary">
  <a href="../index.html" class="nav-logo" aria-label="Mohammadreza Nobahari, home"><span class="logo-mark" aria-hidden="true">MN</span><span class="logo-text">Mohammadreza Nobahari</span></a>
  <div class="nav-actions">
    <a class="nav-home" href="../index.html">Home</a>
    <a class="nav-home" href="../blog.html">Writing</a>
    <a class="btn btn-primary btn-sm" href="../index.html#contact">Contact</a>
  </div>
</nav>

<main id="main" class="post-main">
  <article>
    <div class="crumbs"><a href="../blog.html">Writing</a> / {cat}</div>
    <header class="article-head">
      <div class="post-cat">{cat}</div>
      <h1>{esc(p['title'])}</h1>
      <p class="article-lede">{esc(p['lede'])}</p>
      <div class="article-meta"><time datetime="{p['date'].isoformat()}">{fmt_date(p['date'], 'en')}</time><span>{p['minutes']} min read</span><span>by Mohammadreza Nobahari</span></div>
    </header>
    <div class="prose">
{p['body']}
    </div>
    <div class="article-foot">
      <div class="author-box">
        <span class="logo-mark" aria-hidden="true">MN</span>
        <p><strong>Mohammadreza Nobahari</strong>Network &amp; Security Engineer in Germany. I build secure networks, automate them with Python and teach how systems work. <a href="../index.html#contact">Get in touch</a>.</p>
      </div>
      <div class="post-nav" role="navigation" aria-label="More posts">{''.join(nav_links)}</div>
    </div>
  </article>
  <aside class="toc" aria-label="On this page">
    <div class="toc-title">On this page</div>
    <ol id="toc-list"></ol>
    <div class="toc-share">
      <button class="chip" type="button" id="copy-link">Copy link</button>
      <a class="chip" href="{share}" target="_blank" rel="noopener">Share on LinkedIn</a>
    </div>
  </aside>
</main>

<div class="footer-wrap">
  <footer>
    <p>© {date.today().year} Mohammadreza Nobahari · Network &amp; Security Engineer · Python Automation · Educator</p>
    <div class="footer-links">
      <a href="../feed.xml">RSS</a>
      <a href="https://www.linkedin.com/in/mohammadreza-nobahari-54370526a" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://github.com/mmdrz-n" target="_blank" rel="noopener">GitHub</a>
    </div>
  </footer>
</div>

<script src="../js/post.js"></script>
<script src="../js/posts-data.js"></script>
<script src="../js/fun.js"></script>
<script src="../js/bot.js"></script>
</body>
</html>
"""


# ── Listing cards ──
def card(p, lang, prefix, featured=False, heading="h3"):
    title = p.get("title_de") if lang == "de" and p.get("title_de") else p["title"]
    summary = p.get("lede_de") if lang == "de" and p.get("lede_de") else p["lede"]
    cat = CATEGORIES[p["category"]][lang]
    en_badge = ' <span class="post-lang">EN</span>' if lang == "de" else ""
    flag = ""
    if featured:
        flag = f'<div class="post-flag">{"Empfohlen" if lang == "de" else "Featured"}</div>\n      '
    cls = "post post-link post-featured" if featured else "post post-link"
    tag = "h2" if featured else heading
    return f"""    <a class="{cls}" href="{prefix}posts/{p['slug']}.html" data-category="{p['category']}"{' id="featured-post"' if featured else ''}>
      {flag}<div class="post-cat">{cat}{en_badge}</div>
      <{tag}>{esc(title)}</{tag}>
      <p>{esc(summary)}</p>
      <div class="post-meta">{meta_line(p, lang)}</div>
    </a>"""


def listing(posts, lang, prefix):
    featured = next((p for p in posts if p["featured"]), posts[0])
    rest = [p for p in posts if p is not featured]
    grid = "\n".join(card(p, lang, prefix) for p in rest)
    return f"""{card(featured, lang, prefix, featured=True)}

  <div class="blog-grid" id="blog-grid">
{grid}
  </div>"""


def latest(posts, lang, prefix):
    return "\n".join(card(p, lang, prefix) for p in posts[:3])


def replace_block(path, name, content):
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(rf"(<!-- {name}:START -->)(.*?)(\s*<!-- {name}:END -->)", re.S)
    if not pattern.search(text):
        raise SystemExit(f"{path.relative_to(ROOT)}: markers for {name} not found")
    text = pattern.sub(lambda m: m.group(1) + "\n" + content + m.group(3), text)
    path.write_text(text, encoding="utf-8")


def feed(posts):
    items = "\n".join(
        f"""  <item>
    <title>{esc(p['title'])}</title>
    <link>{SITE}/posts/{p['slug']}.html</link>
    <guid>{SITE}/posts/{p['slug']}.html</guid>
    <pubDate>{p['date'].strftime('%a, %d %b %Y')} 08:00:00 +0000</pubDate>
    <category>{CATEGORIES[p['category']]['en']}</category>
    <description>{esc(p['lede'])}</description>
  </item>"""
        for p in posts
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Mohammadreza Nobahari · Writing</title>
  <link>{SITE}/blog.html</link>
  <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml"/>
  <description>Notes on network security, Python automation and systems thinking.</description>
  <language>en</language>
{items}
</channel>
</rss>
"""


def sitemap(posts):
    pages = ["", "blog.html", "de/", "de/blog.html"] + [f"posts/{p['slug']}.html" for p in posts]
    newest = posts[0]["date"].isoformat()
    urls = "\n".join(f"  <url><loc>{SITE}/{u}</loc><lastmod>{newest}</lastmod></url>" for u in pages)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}
</urlset>
"""


def main():
    posts = load_posts()
    out = ROOT / "posts"
    out.mkdir(exist_ok=True)
    for i, p in enumerate(posts):
        newer = posts[i - 1] if i > 0 else None
        older = posts[i + 1] if i + 1 < len(posts) else None
        (out / f"{p['slug']}.html").write_text(render_post(p, older, newer), encoding="utf-8")

    replace_block(ROOT / "blog.html", "POSTS", listing(posts, "en", ""))
    replace_block(ROOT / "de" / "blog.html", "POSTS", listing(posts, "de", "../"))
    replace_block(ROOT / "index.html", "LATEST", latest(posts, "en", ""))
    replace_block(ROOT / "de" / "index.html", "LATEST", latest(posts, "de", "../"))

    (ROOT / "feed.xml").write_text(feed(posts), encoding="utf-8")
    (ROOT / "sitemap.xml").write_text(sitemap(posts), encoding="utf-8")

    data = [
        {
            "slug": p["slug"],
            "title": p["title"],
            "title_de": p.get("title_de") or p["title"],
            "category": p["category"],
            "date": p["date"].isoformat(),
            "minutes": p["minutes"],
        }
        for p in posts
    ]
    (ROOT / "js" / "posts-data.js").write_text(
        "/* generated by tools/build_blog.py — do not edit */\nwindow.POSTS = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"built {len(posts)} posts")


if __name__ == "__main__":
    main()
