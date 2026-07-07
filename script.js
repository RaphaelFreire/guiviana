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
      hamburger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    // Fecha ao clicar num link do menu
    document.querySelectorAll("#mobileMenu a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Abrir menu");
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
        var q = el.querySelector(".faq-q");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!alreadyOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- WhatsApp: envia o plano escolhido ---------- */
  var WHATS_NUMBER = "5517992740959";

  function openWhats(message) {
    var url =
      "https://wa.me/" + WHATS_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }

  // Botões dos planos: mandam o plano e o preço escolhidos
  document.querySelectorAll(".btn-plan").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var plano = btn.getAttribute("data-plan") || "";
      var preco = btn.getAttribute("data-price") || "";
      var msg =
        "Olá, Gui! Tenho interesse no *Plano " +
        plano +
        "* (" +
        preco +
        "). Pode me passar os próximos passos pra começar?";
      openWhats(msg);
    });
  });

  // Botões genéricos de WhatsApp
  document.querySelectorAll(".btn-whatsapp").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openWhats(
        "Olá, Gui! Quero saber mais sobre a consultoria de treino online. Pode me ajudar?",
      );
    });
  });

  /* ---------- Revelação ao rolar ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll(".reveal"),
  );

  if (reduce) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
    return;
  }

  function show(el) {
    if (el.__shown) return;
    el.__shown = true;
    // A animação de entrada é definida no CSS via .reveal[data-animate].in
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

  // Usa IntersectionObserver (não força layout/reflow a cada scroll).
  var hasIO = "IntersectionObserver" in window;
  if (hasIO) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    // Fallback só para navegadores sem IntersectionObserver: aqui sim
    // precisamos medir a posição dos elementos a cada scroll/resize.
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    window.addEventListener("load", check);
  }

  // Rede de segurança: garante que nada fique invisível para sempre
  // (ex.: IO nunca disparou por algum motivo).
  setTimeout(function () {
    revealEls.forEach(show);
  }, 2000);
})();
