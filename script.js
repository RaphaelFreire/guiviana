/* ============================================================
   Gui Viana — comportamentos do site
   Menu hambúrguer · FAQ sanfona · revelação ao rolar
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Menu mobile (hambúrguer) ---------- */
  var header = document.getElementById("header");
  var hamburger = document.getElementById("hamburger");

  if (hamburger && header) {
    hamburger.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Fecha ao clicar num link do menu
    document.querySelectorAll("#mobileMenu a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- FAQ sanfona ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var alreadyOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (el) {
        el.classList.remove("open");
      });
      if (!alreadyOpen) item.classList.add("open");
    });
  });

  /* ---------- Revelação ao rolar ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  function show(el) {
    if (el.__shown) return;
    el.__shown = true;
    el.classList.add("in");
  }

  function check() {
    var vh = window.innerHeight || 800;
    revealEls.forEach(function (el) {
      if (el.__shown) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) show(el);
    });
  }

  // Usa IntersectionObserver quando disponível, com fallback por scroll.
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Fallbacks que garantem que o conteúdo nunca fique invisível.
  check();
  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  window.addEventListener("load", check);
  setTimeout(check, 150);
  setTimeout(function () { revealEls.forEach(show); }, 2000);
})();
