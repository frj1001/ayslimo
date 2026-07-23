/**
 * app.js
 * ---------------------------------------------------------------------
 * Boots every module on DOMContentLoaded and owns the pieces that don't
 * warrant their own file: scroll-reveal / lazy-image observers,
 * testimonial slider, FAQ accordion, contact form, and current year.
 * ---------------------------------------------------------------------
 */

const TESTIMONIALS = [
  {
    quote: "Booked a BMW 7 Series for our anniversary weekend and the car was immaculate. The chauffeur was on time to the minute and the whole process from WhatsApp booking to pickup took minutes.",
    name: "Sarah Mitchell",
    role: "Repeat Customer, Los Angeles",
    rating: 5,
    avatar: "images/testimonials/sarah.svg",
  },
  {
    quote: "Used their airport transfer for a red-eye landing at 4am. Driver was already waiting with a sign, car was spotless, and pricing was exactly what was quoted on WhatsApp. No surprises.",
    name: "James Whitfield",
    role: "Corporate Client",
    rating: 5,
    avatar: "images/testimonials/james.svg",
    initials: "JW",
  },
  {
    quote: "Rented the Mercedes S-Class for our wedding and it made every photo look like it belonged in a magazine. Prestige Motors decorated the car exactly how we asked. Worth every penny.",
    name: "Amara Okafor",
    role: "Wedding Client",
    rating: 5,
    avatar: "images/testimonials/amara.svg",
  },
  {
    quote: "Needed a self-drive economy car for two weeks while my own was in the shop. Transparent pricing, no hidden fees at return, and the Yaris was fuel efficient exactly as advertised.",
    name: "Daniel Kim",
    role: "Self-Drive Rental",
    rating: 4,
    avatar: "images/testimonials/daniel.svg",
  },
  {
    quote: "Our company now runs all executive airport pickups through Prestige Motors. Monthly invoicing is simple, drivers are professional, and the fleet is always late-model.",
    name: "Lena Fischer",
    role: "Operations Manager, Fischer & Co.",
    rating: 5,
    avatar: "images/testimonials/lena.svg",
  },
  {
    quote: "Land Cruiser was perfect for a family road trip up the coast. Roomy, comfortable, and the team even adjusted our return time when our flight changed, no extra charge.",
    name: "Omar Al-Sayed",
    role: "Monthly Rental Client",
    rating: 5,
    avatar: "images/testimonials/omar.svg",
  },
];

const FAQS = [
  {
    q: "What documents do I need to rent a car?",
    a: "You'll need a valid government-issued driving license (held for the minimum period listed on each vehicle), a government ID or passport, and a credit or debit card for the security deposit. International renters should bring an International Driving Permit alongside their home license.",
  },
  {
    q: "Is a security deposit required?",
    a: "Yes, a refundable security deposit is authorized on your card at pickup and released after the vehicle is returned in its original condition with a full tank. The exact amount depends on the vehicle category and is confirmed before you book.",
  },
  {
    q: "Can I rent a car with a driver instead of self-drive?",
    a: "Absolutely. Every vehicle in our fleet is available either self-drive or with a professional chauffeur. Simply select 'Driver Required' when booking, or let us know in the notes field and we'll confirm availability on WhatsApp.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Economy and sedan bookings can be cancelled free of charge up to 24–48 hours before pickup. Luxury vehicle bookings require 72 hours notice. Cancellations made after these windows may be subject to a one-day rental charge.",
  },
  {
    q: "Do you offer airport pickup and drop-off?",
    a: "Yes, airport transfers run 24/7 across all terminals. Your driver will track your flight and wait in the arrivals area with a name sign, so there's no need to worry about delays.",
  },
  {
    q: "How do I confirm or modify a booking?",
    a: "All bookings are confirmed directly over WhatsApp once you submit the booking form. To modify dates, locations, or vehicle choice, simply message us on the same WhatsApp thread and our team will update your reservation.",
  },
];

const AppModule = (() => {
  /* --------------------------- Reveal on scroll -------------------------- */

  let revealObserver;

  function getRevealObserver() {
    if (revealObserver) return revealObserver;
    revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    return revealObserver;
  }

  function observeReveals(root = document) {
    const items = root.querySelectorAll("[data-reveal]:not(.is-visible)");
    const observer = getRevealObserver();
    items.forEach((el, i) => {
      if (!el.style.getPropertyValue("--delay")) {
        el.style.setProperty("--delay", `${Math.min(i % 6, 5) * 70}ms`);
      }
      observer.observe(el);
    });
  }

  /* ------------------------------ Stat counters ------------------------------ */

/** Animates a stat's number from 0 up to its printed value (e.g. "8,500+",
 * "4.9/5", "12+"), preserving decimals, commas, and any suffix. */
function animateStatValue(el) {
  const raw = el.textContent.trim();
  const match = raw.match(/^([\d,.]+)(.*)$/);
  if (!match) return;

  const numStr = match[1];
  const suffix = match[2];
  const hasDecimal = numStr.includes(".");
  const hasComma = numStr.includes(",");
  const target = parseFloat(numStr.replace(/,/g, ""));
  const duration = 2500; // slow and deliberate, so the count is easy to follow
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out — fast start, gentle settle
    const current = target * eased;

    let display = hasDecimal ? current.toFixed(1) : Math.round(current).toString();
    if (hasComma) display = Number(display).toLocaleString();

    el.textContent = display + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/** Triggers each stat's count-up once, the first time it scrolls into view. */
function initStatCounters() {
  const els = document.querySelectorAll(".hero__stat-value, .about__stat-value");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStatValue(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  els.forEach((el) => observer.observe(el));
}

  /* ---------------------------- Lazy image fade --------------------------- */

  let imgObserver;

  function getImgObserver() {
    if (imgObserver) return imgObserver;
    imgObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          const img = entry.target;
          if (!entry.isIntersecting) return;
          if (img.complete) {
            img.classList.add("is-loaded");
          } else {
            img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
          }
          obs.unobserve(img);
        });
      },
      { rootMargin: "200px 0px" }
    );
    return imgObserver;
  }

  function observeLazyImages(root = document) {
    const imgs = root.querySelectorAll('img[loading="lazy"]:not(.is-loaded)');
    const observer = getImgObserver();
    imgs.forEach((img) => observer.observe(img));
  }

  /* ------------------------------ Testimonials ----------------------------- */

  function initTestimonials() {
    const track = document.getElementById("testimonialTrack");
    const dotsWrap = document.getElementById("testimonialDots");
    if (!track || !dotsWrap) return;

    track.innerHTML = TESTIMONIALS.map(
      (t) => `
      <div class="testimonial-slide">
        <div class="testimonial-card glass-panel on-dark">
          <p class="testimonial-card__quote">&ldquo;${t.quote}&rdquo;</p>
          <div class="rating testimonial-card__rating">
            <span class="rating__stars">${Array.from({ length: 5 }).map((_, i) => `<span style="opacity:${i < t.rating ? 1 : 0.25}">${ICONS.star}</span>`).join("")}</span>
          </div>
          <div class="testimonial-card__person">
            <span class="testimonial-card__avatar"><img src="${t.avatar}" alt="${t.name}" loading="lazy" /></span>
            <span style="text-align:left;">
              <span class="testimonial-card__name" style="display:block;">${t.name}</span>
              <span class="testimonial-card__role">${t.role}</span>
            </span>
          </div>
        </div>
      </div>`
    ).join("");

    dotsWrap.innerHTML = TESTIMONIALS.map(
      (_, i) => `<button type="button" class="testimonial-dot ${i === 0 ? "is-active" : ""}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>`
    ).join("");

    let current = 0;
    let autoplayTimer = null;

    function goTo(index) {
      current = (index + TESTIMONIALS.length) % TESTIMONIALS.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll(".testimonial-dot").forEach((d, i) => d.classList.toggle("is-active", i === current));
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(current + 1), 6000);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    document.getElementById("testimonialPrev")?.addEventListener("click", () => { goTo(current - 1); startAutoplay(); });
    document.getElementById("testimonialNext")?.addEventListener("click", () => { goTo(current + 1); startAutoplay(); });
    dotsWrap.addEventListener("click", (e) => {
      const dot = e.target.closest(".testimonial-dot");
      if (!dot) return;
      goTo(Number(dot.dataset.index));
      startAutoplay();
    });

    const slider = document.querySelector(".testimonial-slider");
    slider?.addEventListener("mouseenter", stopAutoplay);
    slider?.addEventListener("mouseleave", startAutoplay);

    observeLazyImages(track);
    startAutoplay();
  }

  /* --------------------------------- FAQ ----------------------------------- */

  function initFaq() {
    const wrap = document.getElementById("faqAccordion");
    if (!wrap) return;

    wrap.innerHTML = FAQS.map(
      (item, i) => `
      <div class="accordion-item" id="faq-${i}">
        <button type="button" class="accordion-trigger" aria-expanded="false" aria-controls="faq-panel-${i}">
          <span>${item.q}</span>
          <span class="accordion-icon" aria-hidden="true"></span>
        </button>
        <div class="accordion-panel" id="faq-panel-${i}" role="region">
          <div class="accordion-panel__inner">${item.a}</div>
        </div>
      </div>`
    ).join("");

    wrap.addEventListener("click", (e) => {
      const trigger = e.target.closest(".accordion-trigger");
      if (!trigger) return;
      const item = trigger.closest(".accordion-item");
      const panel = item.querySelector(".accordion-panel");
      const isOpen = item.classList.contains("is-open");

      // Single-open accordion: close any other open item first
      wrap.querySelectorAll(".accordion-item.is-open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
          openItem.querySelector(".accordion-panel").style.maxHeight = null;
        }
      });

      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = !isOpen ? `${panel.scrollHeight}px` : null;
    });
  }

  /* ------------------------------ Contact form ------------------------------ */

  function initContactForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("contactFormStatus");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add("is-invalid");
        } else {
          field.classList.remove("is-invalid");
        }
      });

      if (!valid) {
        status.textContent = "Please fill in all required fields.";
        status.className = "form-status is-visible is-error";
        return;
      }

      const name = form.contactName.value.trim();
      const email = form.contactEmail.value.trim();
      const message = form.contactMessage.value.trim();

      const text = [
        `New contact form enquiry from ${SITE_CONFIG.businessName} website`,
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Message: ${message}`,
      ].join("\n");

      window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");

      status.textContent = "Thanks! We've opened WhatsApp so you can send your message directly to our team.";
      status.className = "form-status is-visible is-success";
      form.reset();
    });

    form.addEventListener("input", (e) => {
      if (e.target.classList.contains("is-invalid") && e.target.value.trim()) {
        e.target.classList.remove("is-invalid");
      }
    });
  }

  /* --------------------------------- Misc ----------------------------------- */

  function initFooterYear() {
    const el = document.getElementById("currentYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  function initNewsletterForm() {
    const form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (!input.value.trim()) return;
      const btn = form.querySelector("button");
      const original = btn.textContent;
      btn.textContent = "Subscribed ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
  }

  function init() {
    initTestimonials();
    initFaq();
    initContactForm();
    initFooterYear();
    initNewsletterForm();
    initStatCounters();
    observeReveals();
    observeLazyImages();
  }

  return { init, observeReveals, observeLazyImages };
})();

document.addEventListener("DOMContentLoaded", () => {
  NavigationModule.init();
  CarsModule.init();
  ModalModule.init();
  BookingModule.init();
  AppModule.init();
});
