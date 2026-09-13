# Portfolio Website - Praveen Kumar

A hand-built, dark-themed developer portfolio. Static HTML, one stylesheet, one script. No framework, no bundler, no build step.

**Live:** [inboxpraveen.github.io](https://inboxpraveen.github.io)

## Overview

Personal portfolio for Praveen Kumar - Principal AI Engineer & Solution Architect working on speech AI, LLMs, OCR and document intelligence. The site is a showcase for open-source and professional work, and every project gets its own page covering the problem, the architecture, the code, and what broke along the way.

## Features

- **Cinematic hero** that scrolls into real work - three flagship projects, the latest blog post, a short bio, and contact
- **Filterable project grid** - seven domain filters plus free-text search (press <kbd>/</kbd>), with a live result count and URL hash sync
- **Two-tier tag taxonomy** - one coloured domain pill per project (LLM & RAG, Document AI, Speech & Audio, Computer Vision, Classic ML, Learning Resource, Apps & Tools) plus neutral stack tags, used identically on cards and project pages
- **Deep project pages** - overview, motivation, architecture, screenshots, code walkthroughs and challenges, with an auto-generated table of contents, a reading-progress bar, and click-to-zoom screenshots
- **Blog** - long-form technical write-ups that reuse the project page layout, with a searchable index, charts served as SVG, and the scripts and raw results linked from every post
- **Monochrome SVG icon set** injected from a single sprite, so nothing depends on how a given OS draws emoji
- **WebP screenshots** - the image set went from 70 MB to 2.5 MB; originals are kept alongside
- **Accessible by default** - skip link, `main` landmark, `aria-current` navigation, visible focus rings, keyboard-operable lightbox, and reveal animations that degrade gracefully when scripting is off
- **Respects `prefers-reduced-motion`** throughout
- **SEO-ready** - Open Graph, Twitter cards, canonical URLs and JSON-LD structured data
- **Zero dependencies** - no npm, no CDN, no webfonts; deployed straight to GitHub Pages

## Project structure

```
inboxpraveen.github.io/
├── index.html              # Landing: hero, selected work, short bio, contact
├── all-projects.html       # Filterable project grid
├── all-blogs.html          # Searchable blog index
├── about.html              # Background, how I work, toolkit, contact
├── under-dev.html          # Placeholder for write-ups still in progress
├── index.css               # The whole design system (tokens + components)
├── site.js                 # All shared behaviour, included on every page
├── assests/
│   ├── favicon.ico
│   ├── Original.png
│   └── Resume.pdf
├── projects/
│   ├── project-1.html      # One deep-dive page per project
│   ├── ...
│   └── resources/
│       └── project-N/      # Screenshots: .webp is served, .png kept as source
└── blogs/
    ├── blog-1.html         # One page per post, same template as a project page
    └── resources/
        └── blog-N/         # Header image (.webp served, .png source) and figures (.svg)
```

Note: `assests/` is misspelled and stays that way - the path is baked into published Open Graph URLs.

## Design system

Everything lives in `index.css`, driven by CSS custom properties:

| Layer | Notes |
|-------|-------|
| **Surfaces** | `--primary-bg` through `--surface-3`, a near-black base with layered translucency |
| **Accent** | `--accent-color` cyan, with a violet secondary used sparingly |
| **Domain hues** | `--d-llm`, `--d-speech`, `--d-docai`, `--d-vision`, `--d-ml`, `--d-learn`, `--d-apps` - each card sets `--domain` once and its pill, top rule and hover glow all follow |
| **Type** | System font stack, fluid `clamp()` scale from `--fs-xs` to `--fs-hero` |
| **Motion** | Shared easings (`--ease-out-expo`, `--ease-spring`), all disabled under `prefers-reduced-motion` |

## site.js

One file, thirteen self-contained modules, each a no-op when its markup is absent - so the same script is safe on every page: icon sprite, navigation, scroll reveal, code-copy buttons, copyright year, pointer-tracked card glow, project filtering and search, reading progress, back-to-top, count-up stats, the rotating hero line, the screenshot lightbox, and the auto-built table of contents.

## Adding a new project

1. Create `projects/project-N.html` from an existing page as the template
2. Drop screenshots into `projects/resources/project-N/` and generate `.webp` versions
3. Add a card to the `.projects-grid` in `all-projects.html`:
   - set `data-domain` to one of the seven domains and `--domain` to the matching hue variable
   - fill `data-search` with the title, domain, stack and a one-line hook so search finds it
4. If the domain is new, add a chip to `.filter-chips` and a hue token to `index.css`

No build step. Edit, commit, push.

## Adding a blog post

1. Create `blogs/blog-N.html` from an existing post as the template; it uses the same `page-header`, `toc`, `content-section`, `code-block`, `content-table` and `content-figure` pieces as a project page
2. Put the header image and figures in `blogs/resources/blog-N/`. Charts are plain SVG so they stay crisp and small; give each one a real `alt`
3. Add a card to the grid in `all-blogs.html` (the filter root uses `data-filter-noun="posts"`, everything else works exactly like the projects grid)
4. If it should be featured on the landing page, update the card in the `#writing` section of `index.html`

## Local development

Open `index.html` in any browser - it works straight off the filesystem, no server needed.

## Contact

- **Email:** inboxpraveen.17@gmail.com
- **LinkedIn:** [linkedin.com/in/praveen-kumar-inbox](https://www.linkedin.com/in/praveen-kumar-inbox/)
- **GitHub:** [github.com/inboxpraveen](https://github.com/inboxpraveen)
- **Twitter:** [x.com/InboxPraveen](https://x.com/InboxPraveen)

## License

© 2026 Praveen Kumar. All rights reserved.
