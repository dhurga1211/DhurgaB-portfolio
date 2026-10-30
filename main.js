/* =====================================================================
   main.js - menu, project cards, screenshot viewer and small animations
   You normally do NOT need to edit this file.
   ===================================================================== */

(function () {
  "use strict";

  /* ---------- Helper: build a list from an array of text ---------- */
  function listHTML(items) {
    return "<ul>" + items.map(function (t) { return "<li>" + escapeHTML(t) + "</li>"; }).join("") + "</ul>";
  }

  function escapeHTML(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /* ---------- 1. Build project cards from js/projects.js ---------- */
  var gallery = []; // every screenshot on the page, used by the viewer

  function renderProjects() {
    var holder = document.getElementById("projectsList");
    if (!holder || typeof projects === "undefined") return;

    projects.forEach(function (p, pIndex) {
      var card = document.createElement("article");
      card.className = "project-card reveal";

      // Screenshots
      var shots = (p.screenshots || []).map(function (s, sIndex) {
        gallery.push({ src: s.src, caption: s.caption || p.title });
        var galleryIndex = gallery.length - 1;
        return (
          '<button class="shot" type="button" data-index="' + galleryIndex + '" aria-label="Enlarge screenshot: ' + escapeHTML(s.caption || p.title) + '">' +
            '<img src="' + s.src + '" alt="' + escapeHTML(s.caption || p.title) + '" loading="lazy" />' +
            '<span class="shot-hint">Click to Enlarge</span>' +
          "</button>"
        );
      }).join("");

      // KPI numbers
      var kpis = (p.kpis || []).map(function (k) {
        return '<div class="kpi"><span class="kpi-value">' + escapeHTML(k.value) + '</span><span class="kpi-label">' + escapeHTML(k.label) + "</span></div>";
      }).join("");

      // Tools
      var tools = (p.tools || []).map(function (t) { return '<span class="chip">' + escapeHTML(t) + "</span>"; }).join("");

      // GitHub button - only shown when a link is provided
      var github = p.github
        ? '<a class="btn btn-outline btn-small" href="' + p.github + '" target="_blank" rel="noopener noreferrer">View on GitHub</a>'
        : "";

      card.innerHTML =
        '<div class="project-top">' +
          '<span class="project-number">Project ' + String(pIndex + 1).padStart(2, "0") + "</span>" +
          "<h3>" + escapeHTML(p.title) + "</h3>" +
          "<p>" + escapeHTML(p.description) + "</p>" +
          '<div class="chips">' + tools + "</div>" +
          (p.dataset ? '<p class="dataset"><strong>Dataset:</strong> ' + escapeHTML(p.dataset) + "</p>" : "") +
        "</div>" +

        (shots ? '<div class="shots">' + shots + "</div>" : "") +

        (kpis ? '<div class="kpis" aria-label="Dashboard KPI cards">' + kpis + "</div>" : "") +

        '<div class="project-details">' +
          '<div><h4>Project Objectives</h4>' + listHTML(p.objectives || []) + "</div>" +
          '<div><h4>Key Features</h4>' + listHTML(p.features || []) + "</div>" +
        "</div>" +

        (p.insights && p.insights.length
          ? '<div class="insights"><h4>Key Insights</h4>' + listHTML(p.insights) + "</div>"
          : "") +

        (github ? '<div class="project-links">' + github + "</div>" : "");

      holder.appendChild(card);
    });
  }

  /* ---------- 2. Mobile menu ---------- */
  function setupMenu() {
    var toggle = document.getElementById("menuToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    function close() {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- 3. Highlight the menu link of the section you are viewing ---------- */
  function setupActiveLinks() {
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".nav-links a");
    if (!("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- 4. Navbar shadow after scrolling ---------- */
  function setupNavbarShadow() {
    var nav = document.getElementById("navbar");
    function update() { nav.classList.toggle("scrolled", window.scrollY > 10); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- 5. Gentle fade-in when sections appear ---------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 6. Click-to-enlarge screenshot viewer ---------- */
  function setupLightbox() {
    var box = document.getElementById("lightbox");
    var img = document.getElementById("lbImg");
    var caption = document.getElementById("lbCaption");
    var closeBtn = document.getElementById("lbClose");
    var prev = document.getElementById("lbPrev");
    var next = document.getElementById("lbNext");
    var current = 0;
    var lastFocus = null;

    function show(i) {
      current = (i + gallery.length) % gallery.length;
      img.src = gallery[current].src;
      img.alt = gallery[current].caption;
      caption.textContent = gallery[current].caption;
      var many = gallery.length > 1;
      prev.style.display = many ? "" : "none";
      next.style.display = many ? "" : "none";
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      document.body.classList.add("no-scroll");
      closeBtn.focus();
    }

    function close() {
      box.hidden = true;
      document.body.classList.remove("no-scroll");
      if (lastFocus) lastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var shot = e.target.closest(".shot");
      if (shot) open(parseInt(shot.getAttribute("data-index"), 10));
    });

    closeBtn.addEventListener("click", close);
    prev.addEventListener("click", function () { show(current - 1); });
    next.addEventListener("click", function () { show(current + 1); });

    // click on the dark area (not the picture) closes the viewer
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lb-figure")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- Start everything ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderProjects();
    setupMenu();
    setupActiveLinks();
    setupNavbarShadow();
    setupReveal();
    setupLightbox();
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
