/* =========================================================================
   site.js — shared behaviour for every page on inboxpraveen.github.io
   No dependencies. Every module no-ops when its markup isn't on the page,
   so this single file is safe to include everywhere.
   ========================================================================= */

(function () {
    'use strict';

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reduceMotion = motionQuery.matches;
    motionQuery.addEventListener('change', function (e) { reduceMotion = e.matches; });

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    };

    /* ---------------------------------------------------------------------
       1. Icon sprite
       Injected once, referenced as <svg class="icon"><use href="#i-name"/></svg>.
       Monochrome, currentColor, 24x24 grid. Replaces the emoji that used to
       render differently on every operating system.
       --------------------------------------------------------------------- */

    var ICONS = {
        'github': '<path d="M12 2A10 10 0 0 0 8.84 21.5c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>',
        'linkedin': '<path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.91 1.96 1.96 0 0 0 0-3.91ZM20.44 21h-3.38v-6.08c0-1.45-.03-3.31-2.02-3.31s-2.33 1.58-2.33 3.21V21H9.34V8.5h3.24v1.71h.05a3.55 3.55 0 0 1 3.2-1.76c3.42 0 4.06 2.25 4.06 5.19V21Z"/>',
        'x': '<path d="M17.53 3h3.02l-6.6 7.54L21.75 21h-6.06l-4.75-6.2L5.5 21H2.47l7.06-8.07L2.25 3h6.22l4.29 5.67L17.53 3Zm-1.06 16.18h1.67L7.6 4.73H5.81l10.66 14.45Z"/>',
        'mail': '<path d="M3 5.5h18a1 1 0 0 1 1 1V18a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18V6.5a1 1 0 0 1 1-1Zm1.2 2L12 12.9l7.8-5.4H4.2ZM20 9.35l-7.43 5.14a1 1 0 0 1-1.14 0L4 9.35v8.15h16V9.35Z"/>',
        'file': '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Zm-.5 2.2L17.3 8H14a.5.5 0 0 1-.5-.5V4.2ZM8.5 12.5h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5Zm0 3.5h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5Z"/>',
        'calendar': '<path d="M7 2.75a.75.75 0 0 1 .75.75V5h8.5V3.5a.75.75 0 0 1 1.5 0V5H19a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.25V3.5A.75.75 0 0 1 7 2.75ZM4.5 10v9a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5v-9h-15Z"/>',
        'pulse': '<path d="M2.75 12.5h4.06l2.1-5.6a.9.9 0 0 1 1.7.05l2.86 9.4 1.93-4.4a.9.9 0 0 1 .82-.54h5.03a.75.75 0 0 1 0 1.5h-4.54l-2.62 5.98a.9.9 0 0 1-1.68-.1L9.57 9.5l-1.5 4a.9.9 0 0 1-.84.5H2.75a.75.75 0 0 1 0-1.5Z"/>',
        'user': '<path d="M12 3a4.25 4.25 0 1 1 0 8.5A4.25 4.25 0 0 1 12 3Zm0 1.5a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5ZM4.5 19.4c0-3.2 3.4-5.4 7.5-5.4s7.5 2.2 7.5 5.4V21H4.5v-1.6Zm1.55-.1H17.95c-.28-2.06-2.8-3.8-5.95-3.8s-5.67 1.74-5.95 3.8Z"/>',
        'tag': '<path d="M11.06 2.5H20a1.5 1.5 0 0 1 1.5 1.5v8.94a2 2 0 0 1-.59 1.42l-6.56 6.56a2 2 0 0 1-2.83 0l-8-8a2 2 0 0 1 0-2.83l6.12-6.12a2 2 0 0 1 1.42-.47Zm.35 1.5L4.58 10.8a.5.5 0 0 0 0 .7l8 8a.5.5 0 0 0 .7 0L20 12.8V4h-8.59ZM16.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>',
        'building': '<path d="M4 2.75A.75.75 0 0 1 4.75 2h10.5a.75.75 0 0 1 .75.75V9h3.25a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75H4.75a.75.75 0 0 1-.75-.75V2.75ZM5.5 3.5v17h9v-17h-9Zm10.5 7v10h3v-10h-3ZM7.5 6h4.5v1.5H7.5V6Zm0 3.5h4.5V11H7.5V9.5Zm0 3.5h4.5v1.5H7.5V13Zm0 3.5h4.5V18H7.5v-1.5Z"/>',
        'target': '<path d="M12 2.75a.75.75 0 0 1 .75.75v1.29a7.22 7.22 0 0 1 6.46 6.46h1.29a.75.75 0 0 1 0 1.5h-1.29a7.22 7.22 0 0 1-6.46 6.46v1.29a.75.75 0 0 1-1.5 0v-1.29a7.22 7.22 0 0 1-6.46-6.46H3.5a.75.75 0 0 1 0-1.5h1.29a7.22 7.22 0 0 1 6.46-6.46V3.5a.75.75 0 0 1 .75-.75Zm0 3.5a5.75 5.75 0 1 0 0 11.5 5.75 5.75 0 0 0 0-11.5Zm0 3a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Z"/>',
        'arrow-right': '<path d="M13.3 5.22a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06-1.06l4.72-4.72H4a.75.75 0 0 1 0-1.5h14.02L13.3 6.28a.75.75 0 0 1 0-1.06Z"/>',
        'arrow-left': '<path d="M10.7 5.22a.75.75 0 0 0-1.06 0l-6 6a.75.75 0 0 0 0 1.06l6 6a.75.75 0 0 0 1.06-1.06L5.98 12.5H20a.75.75 0 0 0 0-1.5H5.98l4.72-4.72a.75.75 0 0 0 0-1.06Z"/>',
        'arrow-up': '<path d="M11.47 4.22a.75.75 0 0 1 1.06 0l6 6a.75.75 0 1 1-1.06 1.06l-4.72-4.72V20a.75.75 0 0 1-1.5 0V6.56l-4.72 4.72a.75.75 0 0 1-1.06-1.06l6-6Z"/>',
        'external': '<path d="M14 3.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V5.56l-8.22 8.22a.75.75 0 1 1-1.06-1.06L18.44 4.5h-3.69a.75.75 0 0 1-.75-.75ZM5 6h5a.75.75 0 0 1 0 1.5H5.5v11h11V14a.75.75 0 0 1 1.5 0v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"/>',
        'search': '<path d="M10.75 3a7.75 7.75 0 1 1-4.72 13.9l-3.5 3.5a.75.75 0 0 1-1.06-1.06l3.5-3.5A7.75 7.75 0 0 1 10.75 3Zm0 1.5a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z"/>',
        'code': '<path d="M9.3 4.55a.75.75 0 0 1 .65.84l-1.8 13.3a.75.75 0 1 1-1.49-.2l1.8-13.3a.75.75 0 0 1 .84-.64Zm7.24.65a.75.75 0 0 1 .84.64l1.8 13.3a.75.75 0 1 1-1.49.2l-1.8-13.3a.75.75 0 0 1 .65-.84ZM5.03 8.47a.75.75 0 0 1 0 1.06L2.56 12l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Zm14 0a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06L21.44 12l-2.47-2.47a.75.75 0 0 1 0-1.06Z"/>',
        'sparkle': '<path d="M12 2.5a.75.75 0 0 1 .72.54l1.16 3.94 3.94 1.16a.75.75 0 0 1 0 1.44l-3.94 1.16-1.16 3.94a.75.75 0 0 1-1.44 0l-1.16-3.94-3.94-1.16a.75.75 0 0 1 0-1.44l3.94-1.16.99-3.36a.75.75 0 0 1 .89-1.12Zm0 3.42-.66 2.26a.75.75 0 0 1-.51.5l-2.26.68 2.26.66c.25.08.44.26.51.51l.66 2.26.66-2.26a.75.75 0 0 1 .51-.51l2.26-.66-2.26-.67a.75.75 0 0 1-.51-.51L12 5.92ZM18.5 14a.6.6 0 0 1 .58.43l.5 1.7 1.7.5a.6.6 0 0 1 0 1.16l-1.7.5-.5 1.7a.6.6 0 0 1-1.16 0l-.5-1.7-1.7-.5a.6.6 0 0 1 0-1.16l1.7-.5.5-1.7a.6.6 0 0 1 .58-.43ZM6 15.5a.6.6 0 0 1 .58.43l.36 1.23 1.23.36a.6.6 0 0 1 0 1.16l-1.23.36-.36 1.23a.6.6 0 0 1-1.16 0l-.36-1.23-1.23-.36a.6.6 0 0 1 0-1.16l1.23-.36.36-1.23A.6.6 0 0 1 6 15.5Z"/>'
    };

    function injectSprite() {
        var parts = '';
        for (var key in ICONS) {
            if (Object.prototype.hasOwnProperty.call(ICONS, key)) {
                parts += '<symbol id="i-' + key + '" viewBox="0 0 24 24">' + ICONS[key] + '</symbol>';
            }
        }
        var wrap = document.createElement('div');
        wrap.setAttribute('aria-hidden', 'true');
        wrap.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
        wrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + parts + '</svg>';
        document.body.insertBefore(wrap, document.body.firstChild);
    }

    /* ---------------------------------------------------------------------
       2. Navigation — mobile drawer + scroll state
       --------------------------------------------------------------------- */

    function initNav() {
        var nav = $('nav.site-nav') || $('nav');
        if (!nav) return;

        var toggle = $('#mobileMenu', nav);
        var links = $('#navLinks', nav);

        if (toggle && links) {
            var setOpen = function (open) {
                links.classList.toggle('active', open);
                toggle.classList.toggle('is-open', open);
                toggle.setAttribute('aria-expanded', String(open));
                document.body.classList.toggle('nav-open', open);
            };

            toggle.addEventListener('click', function (e) {
                e.stopPropagation();
                setOpen(!links.classList.contains('active'));
            });

            document.addEventListener('click', function (e) {
                if (!links.classList.contains('active')) return;
                if (!links.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && links.classList.contains('active')) {
                    setOpen(false);
                    toggle.focus();
                }
            });

            $$('a', links).forEach(function (a) {
                a.addEventListener('click', function () { setOpen(false); });
            });

            window.addEventListener('resize', function () {
                if (window.innerWidth > 768) setOpen(false);
            });
        }

        var onScroll = function () {
            nav.classList.toggle('scrolled', window.scrollY > 16);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------------------------------------------------------------------
       3. Scroll reveal
       Elements marked [data-reveal] (or the legacy .fade-in) animate in once.
       Children of [data-reveal-group] get a staggered delay via --i.
       --------------------------------------------------------------------- */

    function initReveal() {
        var targets = $$('[data-reveal], .fade-in');

        // Group children are already hidden by CSS; here we only stagger them
        // and add them to the observer list.
        $$('[data-reveal-group]').forEach(function (group) {
            $$(':scope > *', group).forEach(function (kid, i) {
                kid.style.setProperty('--i', String(i));
                if (targets.indexOf(kid) === -1) targets.push(kid);
            });
        });

        if (!targets.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) { io.observe(el); });
    }

    /* ---------------------------------------------------------------------
       4. Code block copy buttons
       --------------------------------------------------------------------- */

    function initCopy() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest && e.target.closest('.copy-button');
            if (!btn) return;

            var block = btn.closest('.code-block');
            var pre = block && block.querySelector('pre');
            if (!pre) return;

            var done = function (ok) {
                btn.textContent = ok ? 'Copied' : 'Press Ctrl+C';
                btn.classList.toggle('copied', ok);
                setTimeout(function () {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 1800);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(pre.textContent).then(function () { done(true); }, function () { done(false); });
            } else {
                done(false);
            }
        });
    }

    /* ---------------------------------------------------------------------
       5. Copyright year
       --------------------------------------------------------------------- */

    function initYear() {
        $$('[data-year], #copyright-year').forEach(function (el) {
            el.textContent = String(new Date().getFullYear());
        });
    }

    /* ---------------------------------------------------------------------
       6. Pointer-tracked glow on cards
       --------------------------------------------------------------------- */

    function initGlow() {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        $$('[data-glow], .project-card, .featured-card').forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--glow-x', ((e.clientX - r.left) / r.width) * 100 + '%');
                card.style.setProperty('--glow-y', ((e.clientY - r.top) / r.height) * 100 + '%');
            });
        });
    }

    /* ---------------------------------------------------------------------
       7. Project filtering — domain chips + free-text search
       --------------------------------------------------------------------- */

    function initFilter() {
        var root = $('[data-filter-root]');
        if (!root) return;

        var chips = $$('[data-filter]', root);
        var search = $('#projectSearch');
        var cards = $$('[data-domain]', root);
        var countEl = $('[data-filter-count]');
        var emptyEl = $('[data-filter-empty]');

        var active = 'all';

        var slug = function (s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };

        var apply = function () {
            var q = (search && search.value || '').trim().toLowerCase();
            var shown = 0;

            cards.forEach(function (card) {
                var domainOk = active === 'all' || slug(card.getAttribute('data-domain')) === active;
                var haystack = (card.getAttribute('data-search') || card.textContent).toLowerCase();
                var textOk = !q || haystack.indexOf(q) !== -1;
                var ok = domainOk && textOk;

                card.classList.toggle('is-filtered-out', !ok);
                card.setAttribute('aria-hidden', String(!ok));
                if (ok) { card.style.setProperty('--i', String(shown)); shown++; }
            });

            if (countEl) {
                countEl.textContent = shown === cards.length
                    ? cards.length + ' projects'
                    : shown + ' of ' + cards.length + ' projects';
            }
            if (emptyEl) emptyEl.hidden = shown !== 0;
        };

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                active = chip.getAttribute('data-filter');
                chips.forEach(function (c) {
                    var on = c === chip;
                    c.classList.toggle('is-active', on);
                    c.setAttribute('aria-pressed', String(on));
                });
                apply();
                // file:// origins reject replaceState, and the site is meant to
                // open straight off disk - so this must never break filtering.
                try {
                    history.replaceState(null, '', active === 'all' ? location.pathname : '#' + active);
                } catch (err) { /* no-op */ }
            });
        });

        if (search) {
            search.addEventListener('input', apply);
            search.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') { search.value = ''; apply(); search.blur(); }
            });

            document.addEventListener('keydown', function (e) {
                if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
                var tag = document.activeElement && document.activeElement.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;
                e.preventDefault();
                search.focus();
                search.select();
            });
        }

        var hash = (location.hash || '').replace('#', '');
        if (hash) {
            var match = chips.filter(function (c) { return c.getAttribute('data-filter') === hash; })[0];
            if (match) match.click();
        }
        apply();
    }

    /* ---------------------------------------------------------------------
       8. Reading progress bar (project detail pages)
       --------------------------------------------------------------------- */

    function initProgress() {
        var bar = $('[data-progress]');
        if (!bar) return;

        var update = function () {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
            bar.style.transform = 'scaleX(' + pct + ')';
        };
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        update();
    }

    /* ---------------------------------------------------------------------
       9. Back to top
       --------------------------------------------------------------------- */

    function initBackToTop() {
        var btn = $('[data-back-to-top]');
        if (!btn) return;

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });

        var onScroll = function () {
            btn.classList.toggle('is-visible', window.scrollY > 600);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------------------------------------------------------------------
       10. Count-up numbers
       --------------------------------------------------------------------- */

    function initCounters() {
        var nodes = $$('[data-count-to]');
        if (!nodes.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            nodes.forEach(function (n) { n.textContent = n.getAttribute('data-count-to'); });
            return;
        }

        var run = function (el) {
            var target = parseFloat(el.getAttribute('data-count-to'));
            var suffix = el.getAttribute('data-count-suffix') || '';
            var start = null;
            var dur = 900;
            el.textContent = '0' + suffix;

            var done = false;
            var finish = function () {
                if (done) return;
                done = true;
                el.textContent = target + suffix;
            };

            var step = function (ts) {
                if (done) return;
                if (start === null) start = ts;
                var p = Math.min(1, (ts - start) / dur);
                if (p >= 1) { finish(); return; }
                el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
                requestAnimationFrame(step);
            };

            // Safety net: if rAF is throttled or never runs, the real number
            // still lands rather than leaving a zero on screen.
            setTimeout(finish, dur + 500);
            requestAnimationFrame(step);
        };

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                run(entry.target);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        // The real number stays in the markup until the animation actually
        // starts, so a missed observer never leaves a zero on screen.
        nodes.forEach(function (n) { io.observe(n); });
    }

    /* ---------------------------------------------------------------------
       11. Rotating word list (landing hero)
       --------------------------------------------------------------------- */

    function initRotator() {
        var el = $('[data-rotate]');
        if (!el) return;

        var words;
        try { words = JSON.parse(el.getAttribute('data-rotate')); }
        catch (err) { return; }
        if (!words || !words.length) return;

        el.textContent = words[0];
        if (reduceMotion || words.length < 2) return;

        var i = 0;
        setInterval(function () {
            el.classList.add('is-swapping');
            setTimeout(function () {
                i = (i + 1) % words.length;
                el.textContent = words[i];
                el.classList.remove('is-swapping');
            }, 280);
        }, 2600);
    }

    /* ---------------------------------------------------------------------
       12. Screenshot lightbox (project detail pages)
       --------------------------------------------------------------------- */

    function initLightbox() {
        var images = $$('.content-image img, .content-figure img');
        if (!images.length) return;

        var box, boxImg, boxCap, lastFocus;

        var build = function () {
            box = document.createElement('div');
            box.className = 'lightbox';
            box.setAttribute('role', 'dialog');
            box.setAttribute('aria-modal', 'true');
            box.setAttribute('aria-label', 'Expanded screenshot');
            box.innerHTML =
                '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>' +
                '<img alt="">' +
                '<p class="lightbox-caption"></p>';
            document.body.appendChild(box);
            boxImg = $('img', box);
            boxCap = $('.lightbox-caption', box);

            box.addEventListener('click', function (e) {
                if (e.target === box || e.target.classList.contains('lightbox-close')) close();
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && box.classList.contains('is-open')) close();
            });
        };

        var open = function (img) {
            if (!box) build();
            lastFocus = document.activeElement;
            boxImg.src = img.currentSrc || img.src;
            boxImg.alt = img.alt || '';
            boxCap.textContent = img.alt || '';
            box.classList.add('is-open');
            document.body.classList.add('lightbox-open');
            $('.lightbox-close', box).focus();
        };

        var close = function () {
            box.classList.remove('is-open');
            document.body.classList.remove('lightbox-open');
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        };

        images.forEach(function (img) {
            var host = img.closest('.content-image, .content-figure');
            if (!host) return;
            host.classList.add('is-zoomable');
            host.setAttribute('tabindex', '0');
            host.setAttribute('role', 'button');
            host.setAttribute('aria-label', 'Expand screenshot' + (img.alt ? ': ' + img.alt : ''));
            host.addEventListener('click', function () { open(img); });
            host.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
            });
        });
    }

    /* ---------------------------------------------------------------------
       13. Table of contents (project detail pages)
       Auto-built from the h2s so long write-ups stay navigable.
       --------------------------------------------------------------------- */

    function initToc() {
        var toc = $('[data-toc]');
        if (!toc) return;

        var heads = $$('.content-section h2');
        if (heads.length < 3) { toc.remove(); return; }

        var list = document.createElement('ul');
        list.className = 'toc-list';

        heads.forEach(function (h, i) {
            if (!h.id) {
                h.id = 'section-' + (h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || i);
            }
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent.trim();
            li.appendChild(a);
            list.appendChild(li);
        });

        toc.appendChild(list);

        if (!('IntersectionObserver' in window)) return;
        var linksById = {};
        $$('a', list).forEach(function (a) { linksById[a.getAttribute('href').slice(1)] = a; });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var a = linksById[entry.target.id];
                if (a && entry.isIntersecting) {
                    $$('a', list).forEach(function (x) { x.classList.remove('is-current'); });
                    a.classList.add('is-current');
                }
            });
        }, { rootMargin: '-90px 0px -70% 0px' });

        heads.forEach(function (h) { io.observe(h); });
    }

    /* ---------------------------------------------------------------------
       Boot
       --------------------------------------------------------------------- */

    function boot() {
        injectSprite();
        initNav();
        initReveal();
        initCopy();
        initYear();
        initGlow();
        initFilter();
        initProgress();
        initBackToTop();
        initCounters();
        initRotator();
        initLightbox();
        initToc();
        document.documentElement.classList.add('js-ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
