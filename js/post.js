/* Article pages: table of contents, scroll-spy, reading progress, copy buttons, share */
(function () {
  const prose = document.querySelector(".prose");
  if (!prose) return;

  // ── Table of contents from h2 headings ──
  const toc = document.getElementById("toc-list");
  const headings = Array.from(prose.querySelectorAll("h2"));
  headings.forEach((h, i) => {
    if (!h.id) h.id = `s-${i + 1}-${h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  });
  if (toc) {
    headings.forEach((h) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      li.appendChild(a);
      toc.appendChild(li);
    });
  }
  const tocLinks = toc ? Array.from(toc.querySelectorAll("a")) : [];

  // ── Reading progress + active heading ──
  const progressEl = document.querySelector(".scroll-progress");
  const navEl = document.querySelector("nav");
  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY;
    if (navEl) navEl.classList.toggle("scrolled", y > 24);
    if (progressEl) {
      const start = prose.offsetTop;
      const end = prose.offsetTop + prose.offsetHeight - window.innerHeight;
      const p = end > start ? Math.min(1, Math.max(0, (y - start) / (end - start))) : 1;
      progressEl.style.setProperty("--progress", p.toFixed(4));
    }
    let current = null;
    headings.forEach((h) => {
      if (h.getBoundingClientRect().top < 140) current = h.id;
    });
    tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();

  // ── Copy buttons on code blocks ──
  prose.querySelectorAll("pre").forEach((pre) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-code";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", () => {
      const code = pre.querySelector("code") || pre;
      navigator.clipboard?.writeText(code.innerText).then(() => {
        btn.textContent = "Copied ✓";
        btn.classList.add("done");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("done");
        }, 1500);
      });
    });
    pre.appendChild(btn);
  });

  // ── Copy-link share button ──
  const shareBtn = document.getElementById("copy-link");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      navigator.clipboard?.writeText(location.href.split("#")[0]).then(() => {
        const original = shareBtn.textContent;
        shareBtn.textContent = "Link copied ✓";
        setTimeout(() => (shareBtn.textContent = original), 1500);
      });
    });
  }
})();
