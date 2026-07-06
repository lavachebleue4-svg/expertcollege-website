/* ExpertCollege — shared site behaviour */
(function () {
  "use strict";

  /* ---------- Language toggle (NL / EN) ---------- */
  var saved = null;
  try { saved = localStorage.getItem("ec-lang"); } catch (e) { /* private mode */ }
  var lang = saved === "en" ? "en" : "nl";

  function applyLang(next) {
    lang = next;
    document.documentElement.setAttribute("lang", next);
    try { localStorage.setItem("ec-lang", next); } catch (e) { /* ignore */ }

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("on", btn.getAttribute("data-lang") === next);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === next ? "true" : "false");
    });

    // Swap placeholders and titles that carry both languages
    document.querySelectorAll("[data-ph-nl]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute(next === "nl" ? "data-ph-nl" : "data-ph-en"));
    });
    document.querySelectorAll("option[data-nl]").forEach(function (el) {
      el.textContent = el.getAttribute(next === "nl" ? "data-nl" : "data-en");
    });
    document.title = document.body.getAttribute(next === "nl" ? "data-title-nl" : "data-title-en") || document.title;
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(lang);

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-lang")); });
    });

    /* ---------- Mobile navigation ---------- */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
      });
    }

    /* ---------- Reveal on scroll ---------- */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
    }

    /* ---------- Product search & category filter ---------- */
    var search = document.getElementById("prod-search");
    var catSel = document.getElementById("prod-cat");
    var cards = document.querySelectorAll(".prod-card");
    var empty = document.querySelector(".no-results");

    function filterProducts() {
      var q = (search ? search.value : "").toLowerCase().trim();
      var cat = catSel ? catSel.value : "all";
      var shown = 0;
      cards.forEach(function (card) {
        var hay = (card.getAttribute("data-name") + " " + card.textContent).toLowerCase();
        var okQ = !q || hay.indexOf(q) !== -1;
        var okC = cat === "all" || card.getAttribute("data-cat") === cat;
        var show = okQ && okC;
        card.style.display = show ? "" : "none";
        if (show) shown++;
      });
      if (empty) empty.style.display = shown === 0 ? "block" : "none";
    }
    if (search) search.addEventListener("input", filterProducts);
    if (catSel) catSel.addEventListener("change", filterProducts);

    /* ---------- Demo forms (front-end only) ---------- */
    document.querySelectorAll("form[data-demo]").forEach(function (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var msg = document.documentElement.getAttribute("lang") === "en"
          ? "Thank you! We will get back to you as soon as possible."
          : "Bedankt! Wij nemen zo snel mogelijk contact met je op.";
        var note = form.querySelector(".form-note");
        if (note) { note.textContent = msg; note.style.color = "#168bda"; note.style.fontWeight = "700"; }
        else { alert(msg); }
        form.reset();
      });
    });
  });
})();
