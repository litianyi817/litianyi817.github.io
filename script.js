(function () {
  // ── Load components ──
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  if (headerEl) fetch("/components/header.html?v=7").then(r => r.text()).then(h => headerEl.innerHTML = h);
  if (footerEl) fetch("/components/footer.html?v=7").then(r => r.text()).then(function (h) {
    footerEl.innerHTML = h;
    observeStaggerItems();
  });

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

    // ── Settings panel ──
    const settingsToggle = document.getElementById("settingsToggle");
    const settingsPanel = document.getElementById("settingsPanel");
    if (settingsToggle && settingsPanel) {
      settingsToggle.addEventListener("click", e => {
        e.stopPropagation();
        settingsPanel.classList.toggle("open");
      });
      document.addEventListener("click", e => {
        if (!settingsPanel.contains(e.target) && e.target !== settingsToggle) {
          settingsPanel.classList.remove("open");
        }
      });
      settingsPanel.querySelectorAll(".settings-option").forEach(btn => {
        btn.addEventListener("click", function () {
          const group = this.parentElement;
          const key = group.dataset.key;
          const val = this.dataset.value;
          group.querySelectorAll(".settings-option").forEach(b => b.classList.remove("active"));
          this.classList.add("active");
          applySetting(key, val);
        });
      });
    }
  }

  // ── Settings engine ──

  function applySetting(key, val) {
    document.documentElement.setAttribute("data-" + key, val);
    try { localStorage.setItem("site_" + key, val); } catch (_) {}
  }

  (function restoreSettings() {
    ["theme", "font", "fsize", "width"].forEach(function (key) {
      var saved;
      try { saved = localStorage.getItem("site_" + key); } catch (_) {}
      if (saved) {
        document.documentElement.setAttribute("data-" + key, saved);
        var panel = document.getElementById("settingsPanel");
        if (panel) {
          var group = panel.querySelector('.settings-options[data-key="' + key + '"]');
          if (group) {
            group.querySelectorAll(".settings-option").forEach(function (b) {
              b.classList.toggle("active", b.dataset.value === saved);
            });
          }
        }
      }
    });
  })();

  // ── Time-based greeting ──

  (function setGreeting() {
    var el = document.getElementById("timeGreeting");
    if (!el) return;
    var h = new Date().getHours();
    var msg;
    if (h < 6)       msg = "夜深了，请注意休息  🌙";
    else if (h < 9)  msg = "早上好，新的一天  ☀️";
    else if (h < 12) msg = "上午好，精力充沛地开始吧";
    else if (h < 14) msg = "中午好，别忘了休息一下";
    else if (h < 18) msg = "下午好，喝杯茶继续前进  🍵";
    else if (h < 22) msg = "晚上好，放松一下，享受属于自己的时间  🌆";
    else             msg = "夜深了，请注意休息  🌙";
    el.textContent = msg;
  })();

  // ── About modal ──

  var aboutModal;
  (function createAboutModal() {
    aboutModal = document.createElement("div");
    aboutModal.className = "modal-overlay";
    aboutModal.id = "aboutModal";
    aboutModal.innerHTML =
      '<div class="modal">' +
        '<button class="modal-close" id="aboutModalClose">&times;</button>' +
        '<p class="section-label">About</p>' +
        '<h2 class="section-title">关于我</h2>' +
        '<div class="about-text">' +
          '<p>你好，我是 Litianyi。一名对计算机技术充满热情的开发者。</p>' +
          '<p>这里是我记录技术探索、项目实践和日常思考的空间。我相信写作是整理思绪最好的方式，也希望通过博客与更多志同道合的朋友交流。</p>' +
          '<ul class="contact-list">' +
            '<li><span class="contact-label">Phone</span>18688107446</li>' +
            '<li><span class="contact-label">QQ Mail</span>2375141447@qq.com</li>' +
            '<li><span class="contact-label">Gmail</span>lty2375141447@gmail.com</li>' +
          '</ul>' +
        '</div>' +
      '</div>';
    document.body.appendChild(aboutModal);

    function closeModal() { aboutModal.classList.remove("open"); }
    document.getElementById("aboutModalClose").addEventListener("click", closeModal);
    aboutModal.addEventListener("click", function (e) { if (e.target === aboutModal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    // Hook About nav links and hero button
    document.addEventListener("click", function (e) {
      var t = e.target.closest(".about-nav-link, #aboutTrigger");
      if (t) {
        e.preventDefault();
        aboutModal.classList.add("open");
      }
    });
  })();

  // ── Like & Favorite ──

  (function postActions() {
    var btns = document.querySelectorAll(".post-action");
    if (!btns.length) return;
    btns.forEach(function (btn) {
      var slug = btn.dataset.slug;
      var action = btn.dataset.action;
      var countEl = btn.querySelector(".post-action-count");

      // Restore state
      if (action === "like") {
        var liked;
        try { liked = localStorage.getItem("liked_" + slug); } catch (_) {}
        if (liked) btn.classList.add("liked");
        var count;
        try { count = parseInt(localStorage.getItem("likes_" + slug)) || 0; } catch (_) { count = 0; }
        if (countEl) countEl.textContent = count || "";
      }
      if (action === "fav") {
        var faved;
        try { faved = localStorage.getItem("faved_" + slug); } catch (_) {}
        if (faved) btn.classList.add("favorited");
      }

      btn.addEventListener("click", function () {
        if (action === "like") {
          var liked = btn.classList.toggle("liked");
          try { localStorage.setItem("liked_" + slug, liked ? "1" : ""); } catch (_) {}
          var count;
          try { count = (parseInt(localStorage.getItem("likes_" + slug)) || 0) + (liked ? 1 : -1); } catch (_) { count = 0; }
          if (count < 0) count = 0;
          try { localStorage.setItem("likes_" + slug, count); } catch (_) {}
          if (countEl) countEl.textContent = count || "";
        }
        if (action === "fav") {
          var faved = btn.classList.toggle("favorited");
          try { localStorage.setItem("faved_" + slug, faved ? "1" : ""); } catch (_) {}
        }
      });
    });
  })();

  // ── Hero mouse glow ──
  (function heroGlow() {
    var glow = document.getElementById("heroGlow");
    if (!glow) return;
    var hero = glow.parentElement;
    var ticking = false;
    hero.addEventListener("mousemove", function (e) {
      if (!ticking) {
        requestAnimationFrame(function () {
          var r = hero.getBoundingClientRect();
          glow.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100) + "%");
          glow.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100) + "%");
          ticking = false;
        });
        ticking = true;
      }
    });
    hero.addEventListener("mouseenter", function () { glow.classList.add("active"); });
    hero.addEventListener("mouseleave", function () { glow.classList.remove("active"); });
  })();

  // ── Fade-in + stagger animations ──
  var fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("visible"); });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );
  document.querySelectorAll(".fade-in").forEach(function (el) { fadeObserver.observe(el); });

  var staggerObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(function () { entry.target.classList.add("visible"); }, delay);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  function observeStaggerItems() {
    document.querySelectorAll(".stagger-item:not(.stagger-observed)").forEach(function (el) {
      el.classList.add("stagger-observed");
      staggerObserver.observe(el);
    });
  }
  observeStaggerItems();

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
          .map(function (p, i) { return `
            <a class="blog-card stagger-item" href="${p.url}" data-delay="${i * 120}">
              <div class="blog-card-date">${p.date + (p.time ? " " + p.time : "")}</div>
              <h3>${p.title}</h3>
              <p>${p.summary}</p>
            </a>`; })
          .join("");
        bindCardHover();
        observeStaggerItems();
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
        var idx = 0;
        blogListEl.innerHTML = Object.entries(groups)
          .sort(function (a, b) { return b[0] - a[0]; })
          .map(function (entry) {
            var year = entry[0], items = entry[1];
            return '<div class="blog-year stagger-item" data-delay="' + (idx++ * 60) + '">' + year + '</div>' +
              items.map(function (p) {
                return '<a class="blog-item stagger-item" data-delay="' + (idx++ * 60) + '" href="/blog/posts/' + p.slug + '.html">' +
                  '<time>' + p.date + (p.time ? " " + p.time : "") + '</time>' +
                  '<div class="blog-item-title">' + p.title + '</div>' +
                  '<div class="blog-item-excerpt">' + p.summary + '</div>' +
                '</a>';
              }).join("");
          })
          .join("");
        observeStaggerItems();
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
          .map(function (n, i) {
            return '<a class="note-item stagger-item" data-delay="' + (i * 80) + '" href="' + n.url + '">' +
              '<time>' + n.date + '</time>' +
              (n.tag ? '<span class="note-item-tag">' + n.tag + '</span>' : "") +
              '<div class="note-item-title">' + n.title + '</div>' +
            '</a>';
          })
          .join("");
        observeStaggerItems();
      })
      .catch(() => {
        notesListEl.innerHTML = '<p class="empty-state">加载失败，请稍后重试。</p>';
      });
  }
})();
