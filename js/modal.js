/**
 * modal.js
 * ---------------------------------------------------------------------
 * Generic modal open/close plumbing + the "Car Details" modal, which is
 * populated dynamically from CARS data (see cars.js). Booking modal logic
 * lives in booking.js but reuses the openModal()/closeModal() helpers
 * exported here via ModalModule.
 * ---------------------------------------------------------------------
 */

const ModalModule = (() => {
  let activeModal = null;
  let lastFocusedEl = null;

  function openModal(modalEl) {
    if (!modalEl) return;
    lastFocusedEl = document.activeElement;
    activeModal = modalEl;

    document.getElementById("modalBackdrop").classList.add("is-open");
    modalEl.classList.add("is-open");
    document.body.classList.add("no-scroll");

    // Move focus to the modal for accessibility
    const focusTarget = modalEl.querySelector("[data-autofocus]") || modalEl;
    focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
  }

  function closeModal() {
    if (!activeModal) return;
    document.getElementById("modalBackdrop").classList.remove("is-open");
    activeModal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    activeModal = null;
    if (lastFocusedEl) lastFocusedEl.focus({ preventScroll: true });
  }

  function closeAll() {
    document.querySelectorAll(".modal.is-open").forEach((m) => m.classList.remove("is-open"));
    document.getElementById("modalBackdrop")?.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    activeModal = null;
  }

  /* ---------------------------- Car Details ---------------------------- */

  function specBlock(icon, label, value) {
    return `
      <div class="car-modal__spec">
        ${icon}
        <div>${value}</div>
        <div class="car-modal__spec-label">${label}</div>
      </div>
    `;
  }

  function renderGallery(car, activeIndex = 0) {
    const main = document.getElementById("carModalMainImg");
    const thumbs = document.getElementById("carModalThumbs");
    if (!main || !thumbs) return;

    main.src = car.images[activeIndex];
    main.alt = `${car.name} — photo ${activeIndex + 1}`;

    thumbs.innerHTML = car.images
      .map(
        (src, i) => `
        <button type="button" class="car-modal__thumb ${i === activeIndex ? "is-active" : ""}" data-index="${i}" aria-label="View photo ${i + 1} of ${car.name}">
          <img src="${src}" alt="" loading="lazy" />
        </button>`
      )
      .join("");

    thumbs.querySelectorAll(".car-modal__thumb").forEach((btn) => {
      btn.addEventListener("click", () => renderGallery(car, Number(btn.dataset.index)));
    });
  }

  function openCarDetails(carId) {
    const car = CarsModule.getCarById(carId);
    if (!car) return;

    document.getElementById("carModalName").textContent = car.name;
    document.getElementById("carModalCategory").textContent = CarsModule.CATEGORY_LABELS[car.category];
    document.getElementById("carModalPrice").innerHTML = `${SITE_CONFIG.currency}${car.price.toLocaleString()}<span style="font-size:0.9rem;color:var(--color-text-muted-dark);">/day</span>`;

    const ratingEl = document.getElementById("carModalRating");
    ratingEl.innerHTML = `
      <span class="rating__stars">${Array.from({ length: 5 }).map((_, i) => `<span style="opacity:${i < Math.round(car.rating) ? 1 : 0.25}">${ICONS.star}</span>`).join("")}</span>
      <span class="rating__score">${car.rating.toFixed(1)}</span>
      <span class="rating__count">(${car.reviews} Reviews)</span>
    `;

    document.getElementById("carModalSpecs").innerHTML = [
      specBlock(ICONS.transmission, "Transmission", car.transmission),
      specBlock(ICONS.fuel, "Fuel Type", car.fuel),
      specBlock(ICONS.seat, "Seats", car.seats),
      specBlock(ICONS.ac, "Climate", car.ac ? "A/C" : "None"),
    ].join("");

    document.getElementById("carModalFeatures").innerHTML = car.features
      .map((f) => `<span class="car-modal__feature">${ICONS.check} ${f}</span>`)
      .join("");

    document.getElementById("carModalPolicy").textContent = car.policy;

    const bookBtn = document.getElementById("carModalBookBtn");
    bookBtn.dataset.carId = car.id;

    renderGallery(car, 0);
    openModal(document.getElementById("carDetailsModal"));
  }

  function init() {
    // Open details modal from any "View Details" trigger (event delegation
    // so it works for dynamically-rendered car cards too)
    document.addEventListener("click", (e) => {
      const viewBtn = e.target.closest(".js-view-details");
      if (viewBtn) {
        openCarDetails(viewBtn.dataset.carId);
        return;
      }

      // Close buttons
      if (e.target.closest("[data-modal-close]")) {
        closeModal();
        return;
      }

      // Click on backdrop closes whatever is open
      if (e.target.id === "modalBackdrop") {
        closeModal();
      }
    });

    // Esc key closes the active modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  return { init, openModal, closeModal, closeAll, openCarDetails };
})();
