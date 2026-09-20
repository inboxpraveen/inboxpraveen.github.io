"""Regenerate sitemap.xml, feed.xml and llms.txt from the pages themselves. Run after adding a post or a
project; nothing else on the site needs a build step.

  python tools/site_meta.py
"""
import glob, html, json, os, re, subprocess
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://inboxpraveen.github.io/'


def read(rel):
    return open(os.path.join(ROOT, rel), encoding='utf-8').read()


def write(rel, text):
    open(os.path.join(ROOT, rel), 'w', encoding='utf-8', newline='\n').write(text)
    print('wrote', rel)


def meta(s, name, prop=False):
    m = re.search(r'<meta %s="%s" content="([^"]*)"' % ('property' if prop else 'name', re.escape(name)), s)
    return html.unescape(m.group(1)) if m else ''


def lastmod(rel):
    out = subprocess.run(['git', '-C', ROOT, 'log', '-1', '--format=%cI', '--', rel], capture_output=True, text=True).stdout.strip()
    return out[:10] if out else datetime.now(timezone.utc).date().isoformat()


def strip(x):
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', x))).strip()


def cards(rel):
    """(href, title, one-line description) for every card on a listing page, in page order"""
    out = []
    for c in re.findall(r'<article class="project-card"[^>]*>(.*?)</article>', read(rel), re.S):
        h = re.search(r'<h3[^>]*>\s*<a href="([^"]+)"[^>]*>(.*?)</a>', c, re.S)
        d = re.search(r'<p class="project-desc">(.*?)</p>', c, re.S)
        if h:
            out.append((h.group(1), strip(h.group(2)), strip(d.group(1)) if d else ''))
    return out


posts = cards('all-blogs.html')
projects = cards('all-projects.html')
post_info = []
for href, title, desc in posts:
    s = read(href)
    ld = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    date = ''
    if ld:
        for node in json.loads(ld.group(1)).get('@graph', []):
            if node.get('@type') == 'BlogPosting':
                date = node.get('datePublished', '')[:10]
    post_info.append({'href': href, 'title': title, 'summary': meta(s, 'description'), 'card': desc, 'date': date or lastmod(href),
                      'updated': lastmod(href), 'image': meta(s, 'og:image', prop=True)})

# ---------------------------------------------------------------- sitemap
pages = ['index.html', 'about.html', 'all-projects.html', 'all-blogs.html'] + [p['href'] for p in post_info] + [h for h, _, _ in projects]
prio = lambda p: '1.0' if p == 'index.html' else '0.9' if p.startswith('blogs/') else '0.8' if p in ('about.html', 'all-projects.html', 'all-blogs.html') else '0.7'
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p in pages:
    loc = BASE if p == 'index.html' else BASE + p
    sm.append(f'  <url><loc>{loc}</loc><lastmod>{lastmod(p)}</lastmod><priority>{prio(p)}</priority></url>')
sm.append('</urlset>')
write('sitemap.xml', '\n'.join(sm) + '\n')

# ---------------------------------------------------------------- atom feed
now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
fe = ['<?xml version="1.0" encoding="utf-8"?>', '<feed xmlns="http://www.w3.org/2005/Atom">',
      '  <title>Praveen Kumar: notes from the workbench</title>',
      '  <subtitle>Long-form, measured, reproducible notes on speech AI, LLM inference and training, every number from real hardware.</subtitle>',
      f'  <link href="{BASE}feed.xml" rel="self"/>', f'  <link href="{BASE}all-blogs.html"/>', f'  <id>{BASE}</id>', f'  <updated>{now}</updated>',
      '  <author><name>Praveen Kumar</name><uri>https://inboxpraveen.github.io/</uri></author>']
for p in sorted(post_info, key=lambda x: x['date'], reverse=True):
    url = BASE + p['href']
    fe += ['  <entry>', f'    <title>{html.escape(p["title"])}</title>', f'    <link href="{url}"/>', f'    <id>{url}</id>',
           f'    <published>{p["date"]}T00:00:00Z</published>', f'    <updated>{p["updated"]}T00:00:00Z</updated>',
           f'    <summary>{html.escape(p["summary"])}</summary>',
           f'    <content type="html">{html.escape("<p>" + html.escape(p["card"]) + "</p><p><a href=" + chr(34) + url + chr(34) + ">Read the post</a></p>")}</content>',
           '  </entry>']
fe.append('</feed>')
write('feed.xml', '\n'.join(fe) + '\n')

# ---------------------------------------------------------------- llms.txt
lt = ['# Praveen Kumar', '',
      '> Principal AI Engineer in Bengaluru, India. Six years building speech intelligence, LLM and document AI systems for enterprise teams. '
      'This site holds fifteen open-source projects with full write-ups and a blog of long-form, reproducible notes where every number is measured on real hardware or traced to a dated source.',
      '',
      'Contact: inboxpraveen.17@gmail.com. GitHub: https://github.com/inboxpraveen. LinkedIn: https://www.linkedin.com/in/praveen-kumar-inbox/. X: https://x.com/InboxPraveen.',
      'Every page is static HTML with Open Graph tags, JSON-LD (Person, BlogPosting, SoftwareSourceCode) and a canonical URL. The scripts and raw results behind each post are in the linked repositories.',
      '', '## Pages', '',
      f'- [Home]({BASE}): selected projects, the latest posts, a short bio and contact',
      f'- [About]({BASE}about.html): background, experience, how I work, the toolkit',
      f'- [All projects]({BASE}all-projects.html): fifteen projects across LLM and RAG, document AI, speech and audio, computer vision, classic ML, learning resources and tools',
      f'- [All blog posts]({BASE}all-blogs.html): the blog index, searchable',
      f'- [Atom feed]({BASE}feed.xml)', f'- [Sitemap]({BASE}sitemap.xml)',
      '', '## Blog posts', '']
for p in sorted(post_info, key=lambda x: x['date'], reverse=True):
    lt.append(f'- [{p["title"]}]({BASE}{p["href"]}) ({p["date"]}): {p["summary"]}')
lt += ['', '## Projects', '']
for href, title, desc in projects:
    lt.append(f'- [{title}]({BASE}{href}): {desc}')
lt += ['', '## Optional', '', f'- [Resume (PDF)]({BASE}assests/Resume.pdf)', f'- [Source of this site]({"https://github.com/inboxpraveen/inboxpraveen.github.io"})', '']
write('llms.txt', '\n'.join(lt))
