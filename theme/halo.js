// mariowOS "Black Halo" theme — shared behaviour for the subpages:
// drifting background dust and fade-in on scroll.
(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Background dust ---------- */
    const canvas = document.querySelector('.bg-dust');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, dust = [];

        const init = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            dust = Array.from({ length: W < 900 ? 60 : 120 }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                s: Math.random() * 1.2 + 0.3,
                vx: (Math.random() - 0.5) * 0.06,
                vy: (Math.random() - 0.5) * 0.06,
                a: Math.random() * 0.35 + 0.1
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            for (const d of dust) {
                if (!reduceMotion) {
                    d.x = (d.x + d.vx + W) % W;
                    d.y = (d.y + d.vy + H) % H;
                }
                ctx.fillStyle = `rgba(255,255,255,${d.a})`;
                ctx.fillRect(d.x, d.y, d.s, d.s);
            }
            if (!reduceMotion) requestAnimationFrame(draw);
        };

        let lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            // ignore mobile URL-bar height jitter
            if (window.innerWidth === lastWidth && dust.length) return;
            lastWidth = window.innerWidth;
            init();
            if (reduceMotion) draw();
        });
        init();
        draw();
    }

    /* ---------- Fade-in on scroll ---------- */
    const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.fade-element').forEach(el => fadeObserver.observe(el));
})();
