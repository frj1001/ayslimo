/**
 * cars.js
 * ---------------------------------------------------------------------
 * Fleet data + rendering for the "Cars" section.
 * - CARS holds every vehicle as plain data (edit/add cars here only).
 * - ICONS holds small inline-SVG icons reused across cards + modals.
 * - CarsModule renders the grid, wires up category filters, and exposes
 *   getCarById() for modal.js / booking.js to consume.
 * ---------------------------------------------------------------------
 */

const ICONS = {
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2z"/></svg>`,
  transmission: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  fuel: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15"/><path d="M4 11h8"/><path d="M16 9l2.5 2.5V17a1.5 1.5 0 0 0 3 0v-5.5L18 8"/><path d="M2 21h14"/></svg>`,
  seat: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 11V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"/><path d="M6 11h6a2 2 0 0 1 2 2v3H8a2 2 0 0 1-2-2v-3z"/><path d="M16 13h2a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-1"/><path d="M6 16v4a1 1 0 0 0 1 1h1"/></svg>`,
  ac: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  calendar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>`,
  pin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z"/></svg>`,
  mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>`,
  clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
};

/** Renders a 5-star row, filling based on a decimal rating (e.g. 4.8) */
function starRow(rating) {
  const full = Math.round(rating);
  return Array.from({ length: 5 })
    .map((_, i) => `<span style="opacity:${i < full ? 1 : 0.25}">${ICONS.star}</span>`)
    .join("");
}

/* ---------------------------------------------------------------------- */
/* Fleet data — add/edit cars here                                        */
/* ---------------------------------------------------------------------- */

const CARS = [
  // ---- Economy ----
  {
    id: "suzuki-alto",
    name: "Suzuki Alto",
    brand: "Suzuki",
    category: "economy",
    price: 6000,
    transmission: "Manual",
    fuel: "Petrol",
    seats: 4,
    ac: true,
    rating: 4.7,
    reviews: 26,
    images: [
      "images/cars/Suzuki Alto.jpg",
      "images/cars/Alto Interior.jpg",
    ],
    features: ["AC", "Power Steering", "USB Charging", "Central Locking", "Fuel Efficient", "Easy City Parking"],
    policy: "Minimum age 21 with a valid driving license held for 1+ year. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 24 hours before pickup.",
  },
  {
    id: "suzuki-wagonr",
    name: "Suzuki Wagon R",
    brand: "Suzuki",
    category: "economy",
    price: 7000,
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.7,
    reviews: 30,
    images: [
      "images/cars/Suzuki WagonR.jpeg",
      "images/cars/WagonR Interior.jpg",
    ],
    features: ["AC", "Tall-Boy Cabin Space", "Power Steering", "USB Charging", "Central Locking", "Fuel Efficient"],
    policy: "Minimum age 21 with a valid driving license held for 1+ year. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 24 hours before pickup.",
  },
  {
    id: "karvaan-van",
    name: "Karvaan Van",
    brand: "FAW",
    category: "economy",
    price: 9000,
    transmission: "Manual",
    fuel: "Petrol",
    seats: 7,
    ac: true,
    rating: 4.6,
    reviews: 19,
    images: [
      "images/cars/Changan Karvaan.jpeg",
      "images/cars/Karvaan Interior.jpeg",
    ],
    features: ["7-Seater", "AC", "Ideal for Groups", "Extra Luggage Space", "Power Steering", "Central Locking"],
    policy: "Minimum age 23 with a valid driving license held for 1+ year. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 24 hours before pickup.",
  },
  {
    id: "toyota-coaster",
    name: "Toyota Coaster",
    brand: "Toyota",
    category: "economy",
    price: 22000,
    transmission: "Manual",
    fuel: "Diesel",
    seats: 25,
    ac: true,
    rating: 4.7,
    reviews: 18,
    images: ["images/cars/Toyota Coaster.jpg", "images/cars/Coaster Interior.jpg"],
    features: ["25-Seater", "Ideal for Large Groups", "AC Throughout", "Reclining Seats", "PA System", "Extra Luggage Space"],
    policy: "Minimum age 25 with a valid driving license held for 3+ years. Professional driver required for this vehicle. A refundable security deposit is required at pickup. Free cancellation up to 72 hours before pickup.",
  },
  {
    id: "hiace-van",
    name: "Toyota Hiace",
    brand: "Toyota",
    category: "economy",
    price: 13000,
    transmission: "Manual",
    fuel: "Diesel",
    seats: 13,
    ac: true,
    rating: 4.7,
    reviews: 20,
    images: ["images/cars/Toyota Hiace.jpg", "images/cars/Hiace Interior.jpg"],
    features: ["13-Seater", "Ideal for Groups & Tours", "AC Throughout", "Extra Luggage Space", "Reclining Seats", "Power Steering"],
    policy: "Minimum age 23 with a valid driving license held for 2+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },

  // ---- Sedans ----
  {
    id: "toyota-yaris",
    name: "Toyota Yaris",
    brand: "Toyota",
    category: "sedan",
    price: 6000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.7,
    reviews: 24,
    images: ["images/cars/Toyota Yaris.jpg", "images/cars/Yaris Interior.jpg"],
    features: ["Touchscreen Infotainment", "Reverse Camera", "Cruise Control", "Alloy Wheels", "Power Windows", "ABS + Airbags"],
    policy: "Minimum age 21 with a valid driving license held for 1+ year. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 24 hours before pickup.",
  },
  {
    id: "toyota-corolla",
    name: "Toyota Corolla GLI",
    brand: "Toyota",
    category: "sedan",
    price: 6000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.8,
    reviews: 38,
    images: [
      "images/cars/Toyota Corolla.jpg",
      "images/cars/Corolla Interior.jpg",
    ],
    features: ["Cruise Control", "Reverse Camera", "Touchscreen Infotainment", "Alloy Wheels", "Power Windows", "ABS + Airbags"],
    policy: "Minimum age 23 with a valid driving license held for 2+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },
  {
    id: "honda-civic",
    name: "Honda Civic",
    brand: "Honda",
    category: "sedan",
    price: 7000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.9,
    reviews: 34,
    images: [
      "images/cars/Honda Civic.jpg",
      "images/cars/Civic Interior.jpg",
    ],
    features: ["Sunroof", "Cruise Control", "Wireless CarPlay", "Reverse Camera", "Alloy Wheels", "Premium Sound System"],
    policy: "Minimum age 23 with a valid driving license held for 2+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },
  {
    id: "honda-city",
    name: "Honda City",
    brand: "Honda",
    category: "sedan",
    price: 11000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.7,
    reviews: 29,
    images: [
      "images/cars/Honda City.jpeg",
      "images/cars/City Interior.jpg",
    ],
    features: ["Touchscreen Infotainment", "Reverse Camera", "USB Charging", "Keyless Entry", "Power Windows", "ABS + Airbags"],
    policy: "Minimum age 21 with a valid driving license held for 1+ year. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 24 hours before pickup.",
  },

  // ---- SUVs ----
  {
    id: "haval-jolion",
    name: "Haval Jolion",
    brand: "Haval",
    category: "suv",
    price: 18000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.6,
    reviews: 15,
    images: ["images/cars/Havel Jolion.jpg", "images/cars/Jolion Interior.jpg"],
    features: ["Panoramic Sunroof", "Touchscreen Infotainment", "Reverse Camera", "Cruise Control", "Alloy Wheels", "Leather Seats"],
    policy: "Minimum age 23 with a valid driving license held for 2+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },
  {
    id: "toyota-revo",
    name: "Toyota Revo",
    brand: "Toyota",
    category: "suv",
    price: 15000,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 5,
    ac: true,
    rating: 4.8,
    reviews: 21,
    images: ["images/cars/Toyota Revo.jpg", "images/cars/Revo Interior.jpg"],
    features: ["4WD", "Off-Road Capable", "Tow Package", "Cruise Control", "Reverse Camera", "Alloy Wheels"],
    policy: "Minimum age 25 with a valid driving license held for 3+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner",
    brand: "Toyota",
    category: "suv",
    price: 16000,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 7,
    ac: true,
    rating: 4.9,
    reviews: 41,
    images: [
      "images/cars/Toyota Fortuner.jpeg",
      "images/cars/Fortuner Interior.jpg",
    ],
    features: ["4WD", "Third Row Seating", "Leather Interior", "Cruise Control", "Premium Sound System", "Rear Parking Sensors"],
    policy: "Minimum age 25 with a valid driving license held for 3+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },
  {
  id: "toyota-prado",
  name: "Toyota Prado",
  brand: "Toyota",
  category: "suv",
  price: 18000,
  transmission: "Automatic",
  fuel: "Diesel",
  seats: 7,
  ac: true,
  rating: 4.9,
  reviews: 30,
  images: ["images/cars/Toyota Prado.jpg", "images/cars/Prado Interior.jpg"],
  features: ["4WD", "Leather Interior", "Third Row Seating", "Cruise Control", "Premium Sound System", "Rear Parking Sensors"],
  policy: "Minimum age 25 with a valid driving license held for 3+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
},
  {
    id: "toyota-landcruiser",
    name: "Toyota Land Cruiser",
    brand: "Toyota",
    category: "suv",
    price: 26000,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 7,
    ac: true,
    rating: 4.9,
    reviews: 45,
    images: [
      "images/cars/Toyota LandCruiser.jpeg",
      "images/cars/LandCruiser Interior.jpeg",
    ],
    features: ["4WD", "Leather Interior", "Third Row Seating", "Roof Rails", "Premium Sound System", "Rear Entertainment"],
    policy: "Minimum age 25 with a valid driving license held for 3+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },
  {
    id: "honda-brv",
    name: "Honda BR-V",
    brand: "Honda",
    category: "suv",
    price: 7500,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 7,
    ac: true,
    rating: 4.7,
    reviews: 22,
    images: [
      "images/cars/Honda BR-V.jpeg",
      "images/cars/BR-V Interior.jpeg",
      
    ],
    features: ["7-Seater", "Touchscreen Infotainment", "Reverse Camera", "Cruise Control", "Alloy Wheels", "Power Windows"],
    policy: "Minimum age 23 with a valid driving license held for 2+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },
  {
    id: "kia-sportage",
    name: "KIA Sportage",
    brand: "KIA",
    category: "suv",
    price: 12000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.8,
    reviews: 27,
    images: [
      "images/cars/Kia Sportage.jpeg",
      "images/cars/Sportage Interior.jpeg",
    ],
    features: ["Panoramic Sunroof", "Touchscreen Infotainment", "Reverse Camera", "Cruise Control", "Alloy Wheels", "Premium Sound System"],
    policy: "Minimum age 23 with a valid driving license held for 2+ years. A refundable security deposit is required at pickup. Full tank to full tank fuel policy. Free cancellation up to 48 hours before pickup.",
  },
  {
    id: "mercedes-sclass",
    name: "Mercedes S-Class",
    brand: "Mercedes",
    category: "luxury",
    price: 120000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 5.0,
    reviews: 52,
    images: ["images/cars/sclass-1.svg", "images/cars/sclass-2.svg", "images/cars/sclass-3.svg"],
    features: ["Massage Seats", "Ambient Lighting", "Chauffeur Available", "Panoramic Sunroof", "Burmester Sound", "Privacy Glass"],
    policy: "Minimum age 28 with a valid driving license held for 5+ years. A refundable security deposit is required at pickup. Chauffeur service available on request. Free cancellation up to 72 hours before pickup.",
  },
  {
    id: "bmw-7series",
    name: "BMW 7 Series",
    brand: "BMW",
    category: "luxury",
    price: 110000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.9,
    reviews: 33,
    images: ["images/cars/series7-1.svg", "images/cars/series7-2.svg", "images/cars/series7-3.svg"],
    features: ["Massage Seats", "Ambient Lighting", "Chauffeur Available", "Panoramic Sunroof", "Bowers & Wilkins Sound", "Privacy Glass"],
    policy: "Minimum age 28 with a valid driving license held for 5+ years. A refundable security deposit is required at pickup. Chauffeur service available on request. Free cancellation up to 72 hours before pickup.",
  },
  {
    id: "audi-a8",
    name: "Audi A8",
    brand: "Audi",
    category: "luxury",
    price: 100000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    ac: true,
    rating: 4.8,
    reviews: 29,
    images: ["images/cars/a8-1.svg", "images/cars/a8-2.svg", "images/cars/a8-3.svg"],
    features: ["Massage Seats", "Matrix LED Lighting", "Chauffeur Available", "Panoramic Sunroof", "Bang & Olufsen Sound", "Privacy Glass"],
    policy: "Minimum age 28 with a valid driving license held for 5+ years. A refundable security deposit is required at pickup. Chauffeur service available on request. Free cancellation up to 72 hours before pickup.",
  },
];



const CATEGORY_LABELS = {
  all: "All Cars",
  economy: "Economy Cars",
  sedan: "Sedans",
  suv: "SUVs",
  luxury: "Luxury Cars",
};

/* ---------------------------------------------------------------------- */
/* Rendering                                                              */
/* ---------------------------------------------------------------------- */

const CarsModule = (() => {
  let currentFilter = "all";

  function getCarById(id) {
    return CARS.find((c) => c.id === id) || null;
  }

  function cardTemplate(car) {
    return `
      <article class="car-card surface-card" data-category="${car.category}">
        <div class="car-card__media">
          <span class="badge badge-gold car-card__category">${CATEGORY_LABELS[car.category]}</span>
          <img
            src="${car.images[0]}"
            alt="${car.name} available for rent"
            loading="lazy"
            width="800" height="600"
          />
          <span class="car-card__price-tag">${SITE_CONFIG.currency}<strong>${car.price.toLocaleString()}</strong>/day</span>        </div>
        <div class="car-card__body">
          <div class="car-card__top">
            <div>
              <h3 class="car-card__name">${car.name}</h3>
              <div class="rating mt-sm">
                <span class="rating__stars">${starRow(car.rating)}</span>
                <span class="rating__score">${car.rating.toFixed(1)}</span>
                <span class="rating__count">(${car.reviews} Reviews)</span>
              </div>
            </div>
          </div>
          <div class="car-card__specs">
            <span class="car-spec">${ICONS.transmission} ${car.transmission}</span>
            <span class="car-spec">${ICONS.fuel} ${car.fuel}</span>
            <span class="car-spec">${ICONS.seat} ${car.seats} Seats</span>
            ${car.ac ? `<span class="car-spec">${ICONS.ac} A/C</span>` : ""}
          </div>
          <div class="car-card__footer">
            <button type="button" class="btn btn-outline-dark js-view-details" data-car-id="${car.id}">
              View Details
            </button>
            <button type="button" class="btn btn-gold js-book-now" data-car-id="${car.id}">
              Book Now
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderList(list, emptyMessage) {
    const grid = document.getElementById("carGrid");
    if (!grid) return;

    grid.classList.add("is-filtering");
    grid.innerHTML = list.length
      ? list.map(cardTemplate).join("")
      : `<p class="text-center" style="grid-column:1/-1;">${emptyMessage}</p>`;

    // Re-run scroll reveal + lazy-load hookups on the freshly injected nodes
    if (window.AppModule) {
      window.AppModule.observeReveals(grid);
      window.AppModule.observeLazyImages(grid);
    }
    requestAnimationFrame(() => grid.classList.remove("is-filtering"));
  }

  function render(filter = currentFilter, { limit = null } = {}) {
    currentFilter = filter;
    let list = filter === "all" ? CARS : CARS.filter((c) => c.category === filter);
    if (limit) list = list.slice(0, limit);
    renderList(list, "No cars found in this category right now.");
  }

  /** Filters the fleet grid to a single brand (e.g. from the Brands
   * section) and scrolls the Cars section into view. */
  function applyBrandFilter(brand) {
    // No single category button represents "one brand across all
    // categories," so clear the category filter bar's active state.
    document.getElementById("carFilterBar")?.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
    currentFilter = "all";

    const list = CARS.filter((c) => c.brand === brand);
    renderList(list, `No ${brand} vehicles currently in the fleet.`);

    const target = document.getElementById("cars");
    if (target) {
      const header = document.getElementById("siteHeader");
      const offset = (header?.offsetHeight || 88) - 1;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function initBrandFilterLinks() {
    document.querySelectorAll(".js-brand-filter").forEach((tile) => {
      tile.addEventListener("click", () => applyBrandFilter(tile.dataset.brand));
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          applyBrandFilter(tile.dataset.brand);
        }
      });
    });
  }

  function initFilters() {
  const bar = document.getElementById("carFilterBar");
  if (!bar) return;

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    applyFilter(btn.dataset.filter);
  });
}

  /** Syncs the visible filter bar state and re-renders the grid. */
function applyFilter(filter) {
  const bar = document.getElementById("carFilterBar");
  bar?.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.filter === filter);
  });
  render(filter);
}

  /** Nav dropdown category links (Cars ▾ Economy/Sedans/SUVs/Luxury) jump
   * to the fleet section pre-filtered to that category. */
  function initNavFilterLinks() {
    document.querySelectorAll(".js-nav-filter").forEach((link) => {
      link.addEventListener("click", () => applyFilter(link.dataset.filter));
    });
  }

  function init() {
    initFilters();
    initNavFilterLinks();
    initBrandFilterLinks();   // added
    render("all");
  }

  return { init, render, applyFilter, applyBrandFilter, getCarById, CATEGORY_LABELS };   // added applyBrandFilter
})();
