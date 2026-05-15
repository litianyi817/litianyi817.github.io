(function () {
  // ── Load components ──
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  if (headerEl) fetch("/components/header.html").then(r => r.text()).then(h => headerEl.innerHTML = h);
  if (footerEl) fetch("/components/footer.html").then(r => r.text()).then(h => footerEl.innerHTML = h);

  // ── Navigation scroll effect ──
  let navEl;
  const obs = new MutationObserver(() => {
    navEl = document.querySelector(".site-nav");
    if (navEl) {
      obs.disconnect();
      initNav();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });

  function initNav() {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navEl.classList.toggle("scrolled", window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    });

    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (toggle && links) {
      toggle.addEventListener("click", () => links.classList.toggle("open"));
      document.addEventListener("click", e => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) links.classList.remove("open");
      });
    }
  }

  // ── Fade-in animations ──
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );
  document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));

  // ── Blog card hover effect ──
  function bindCardHover() {
    document.querySelectorAll(".blog-card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }
  bindCardHover();

  // ── Blog preview on home page ──
  const previewEl = document.getElementById("blogPreview");
  if (previewEl) {
    fetch("/blog/posts.json?v=" + Date.now())
      .then(r => r.json())
      .then(posts => {
        const recent = posts.slice(0, 3);
        previewEl.innerHTML = recent
          .map(p => `
            <a class="blog-card" href="${p.url}">
              <div class="blog-card-date">${p.date}</div>
              <h3>${p.title}</h3>
              <p>${p.summary}</p>
            </a>`)
          .join("");
        bindCardHover();
      })
      .catch(() => {
        previewEl.innerHTML = '<p class="empty-state">还没有文章，敬请期待。</p>';
      });
  }

  // ── Blog list page ──
  const blogListEl = document.getElementById("blogList");
  if (blogListEl) {
    fetch("/blog/posts.json?v=" + Date.now())
      .then(r => r.json())
      .then(posts => {
        if (!posts.length) {
          blogListEl.innerHTML = '<p class="empty-state">还没有文章，敬请期待。</p>';
          return;
        }
        const groups = {};
        posts.forEach(p => {
          const y = p.date.slice(0, 4);
          if (!groups[y]) groups[y] = [];
          groups[y].push(p);
        });
        blogListEl.innerHTML = Object.entries(groups)
          .sort(([a], [b]) => b - a)
          .map(([year, items]) => `
            <div class="blog-year">${year}</div>
            ${items.map(p => `
              <a class="blog-item" href="/blog/posts/${p.slug}.html">
                <time>${p.date}</time>
                <div class="blog-item-title">${p.title}</div>
                <div class="blog-item-excerpt">${p.summary}</div>
              </a>`).join("")}`)
          .join("");
      })
      .catch(() => {
        blogListEl.innerHTML = '<p class="empty-state">加载失败，请稍后重试。</p>';
      });
  }

  // ── Notes list page ──
  const notesListEl = document.getElementById("notesList");
  if (notesListEl) {
    fetch("/notes/notes.json?v=" + Date.now())
      .then(r => r.json())
      .then(notes => {
        if (!notes.length) {
          notesListEl.innerHTML = '<p class="empty-state">还没有笔记，敬请期待。</p>';
          return;
        }
        notesListEl.innerHTML = notes
          .map(n => `
            <a class="note-item" href="${n.url}">
              <time>${n.date}</time>
              ${n.tag ? `<span class="note-item-tag">${n.tag}</span>` : ""}
              <div class="note-item-title">${n.title}</div>
            </a>`)
          .join("");
      })
      .catch(() => {
        notesListEl.innerHTML = '<p class="empty-state">加载失败，请稍后重试。</p>';
      });
  }
})();
