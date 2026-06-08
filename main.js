/* ============================================================
   PEGASUS GROUP AB — interaction layer
   No dependencies. Everything degrades gracefully without JS:
   the page is fully readable, only the motion + language swap
   are progressive enhancements.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- */
  /* 1. Hero entrance                                            */
  /* ---------------------------------------------------------- */
  function playEntrance() {
    // requestAnimationFrame ensures the "from" state is painted first.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.add("is-ready");
      });
    });
    // Drop will-change once the hero has settled.
    window.setTimeout(function () {
      var els = document.querySelectorAll(".hero-anim, .wordmark-rule");
      for (var i = 0; i < els.length; i++) els[i].style.willChange = "auto";
    }, 1600);
  }

  if (prefersReduced) {
    root.classList.add("is-ready"); // no transition will run; just the end state
  } else {
    playEntrance();
  }

  /* ---------------------------------------------------------- */
  /* 2. Scroll-reveal (one-shot, IntersectionObserver)           */
  /* ---------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    for (var r = 0; r < revealEls.length; r++) revealEls[r].classList.add("is-in");
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target); // fire exactly once
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

    for (var k = 0; k < revealEls.length; k++) revealObserver.observe(revealEls[k]);
  }

  /* ---------------------------------------------------------- */
  /* 3. Header hairline appears once the page is scrolled         */
  /* ---------------------------------------------------------- */
  var header = document.getElementById("site-header");
  var sentinel = document.querySelector(".scroll-sentinel");

  if (header && sentinel && "IntersectionObserver" in window) {
    var headerObserver = new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }, { threshold: 0 });
    headerObserver.observe(sentinel);
  }

  /* ---------------------------------------------------------- */
  /* 4. Language toggle (EN / SV)                                */
  /* ---------------------------------------------------------- */
  var STORAGE_KEY = "pegasus-lang";
  var langButtons = document.querySelectorAll(".lang-opt");
  var tick = document.querySelector(".lang-tick");
  var i18nNodes = document.querySelectorAll("[data-en][data-sv]");

  var META = {
    en: {
      title: "Pegasus Group AB",
      description: "Pegasus Group AB. An independent software company that builds, owns and operates its own digital products."
    },
    sv: {
      title: "Pegasus Group AB",
      description: "Pegasus Group AB. Ett oberoende mjukvarubolag som bygger, äger och driver sina egna digitala produkter."
    }
  };

  function positionTick(activeBtn) {
    if (!tick || !activeBtn) return;
    tick.style.width = activeBtn.offsetWidth + "px";
    tick.style.transform = "translateX(" + activeBtn.offsetLeft + "px)";
  }

  function applyLang(lang, persist) {
    if (lang !== "en" && lang !== "sv") lang = "en";

    // Swap visible strings
    for (var n = 0; n < i18nNodes.length; n++) {
      var node = i18nNodes[n];
      var value = node.getAttribute("data-" + lang);
      if (value !== null) node.textContent = value;
    }

    // Document language + metadata
    root.setAttribute("lang", lang);
    if (META[lang]) {
      document.title = META[lang].title;
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", META[lang].description);
    }

    // Button + tick state
    var active = null;
    for (var b = 0; b < langButtons.length; b++) {
      var btn = langButtons[b];
      var on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) active = btn;
    }
    positionTick(active);

    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    }
  }

  for (var c = 0; c < langButtons.length; c++) {
    langButtons[c].addEventListener("click", function () {
      applyLang(this.getAttribute("data-lang"), true);
    });
  }

  // Initial language: stored preference → browser language → EN.
  var initialLang = "en";
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "sv") {
      initialLang = stored;
    } else if ((navigator.language || "").toLowerCase().indexOf("sv") === 0) {
      initialLang = "sv";
    }
  } catch (e) {}

  applyLang(initialLang, false);

  // Keep the tick aligned after font swap / resize.
  window.addEventListener("resize", function () {
    var active = document.querySelector(".lang-opt.is-active");
    positionTick(active);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      positionTick(document.querySelector(".lang-opt.is-active"));
    });
  }
})();
