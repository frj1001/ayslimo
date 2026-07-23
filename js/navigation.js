/**
 * navigation.js
 * ---------------------------------------------------------------------
 * Header behaviour: scroll-aware styling, desktop dropdowns (hover) /
 * mobile dropdowns (tap-to-expand), hamburger menu, smooth-scrolling
 * anchor links, scrollspy active-link highlighting, and the
 * back-to-top floating button.
 * ---------------------------------------------------------------------
 */

const NavigationModule = (() => {
  const header = () => document.getElementById("siteHeader");
  const navMenu = () => document.getElementById("navMenu");
  const hamburger = () => document.getElementById("hamburgerBtn");

  function handleScrollState() {
    const scrolled = window.scrollY > 40;
    header()?.classList.toggle("is-scrolled", scrolled);

    const backTop = document.getElementById("backToTopBtn");
    backTop?.classList.toggle("is-visible", window.scrollY > 600);
  }

  function toggleMobileMenu(forceClose = false) {
    const menu = navMenu();
    const btn = hamburger();
    if (!menu || !btn) return;

    const willOpen = forceClose ? false : !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", willOpen);
    btn.classList.toggle("is-active", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));
    document.body.classList.toggle("no-scroll", willOpen);
  }

  function initMobileDropdowns() {
    // On mobile, tapping a dropdown-parent link expands its submenu
    // instead of navigating, since these are top-level category links.
    document.querySelectorAll(".nav-item.has-dropdown > .nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (window.innerWidth > 992) return; // desktop uses hover
        e.preventDefault();
        const item = link.closest(".nav-item");
        const isOpen = item.classList.contains("is-open");

        document.querySelectorAll(".nav-item.has-dropdown").forEach((i) => i.classList.remove("is-open"));
        if (!isOpen) item.classList.add("is-open");
      });
    });
  }

  function initSmoothScrollAndClose() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      // On mobile, dropdown-parent links (Cars, Services, Brands) are
      // handled exclusively by initMobileDropdowns() — they toggle the
      // submenu open/closed instead of navigating. Let that handler own
      // the interaction so this listener doesn't immediately close it.
      const isDropdownParent = link.classList.contains("nav-link") && link.closest(".nav-item.has-dropdown");
      if (isDropdownParent && window.innerWidth <= 992) return;

      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = (header()?.offsetHeight || 88) - 1;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });

      toggleMobileMenu(true);
      document.querySelectorAll(".nav-item.has-dropdown").forEach((i) => i.classList.remove("is-open"));
    });
  });
}

  function initScrollspy() {
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".nav-menu .nav-link[href^='#']"));
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  function initBackToTop() {
    document.getElementById("backToTopBtn")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initOutsideClicks() {
    document.addEventListener("click", (e) => {
      const menu = navMenu();
      const btn = hamburger();
      if (!menu?.classList.contains("is-open")) return;
      if (menu.contains(e.target) || btn.contains(e.target)) return;
      toggleMobileMenu(true);
    });
  }

  function init() {
    handleScrollState();
    window.addEventListener("scroll", handleScrollState, { passive: true });

    hamburger()?.addEventListener("click", () => toggleMobileMenu());
    initMobileDropdowns();
    initSmoothScrollAndClose();
    initScrollspy();
    initBackToTop();
    initOutsideClicks();

    // Reset mobile-only states if the viewport is resized to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        toggleMobileMenu(true);
        document.querySelectorAll(".nav-item.has-dropdown").forEach((i) => i.classList.remove("is-open"));
      }
    });
  }

  return { init };
})();
