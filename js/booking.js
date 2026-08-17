/**
 * booking.js
 * ---------------------------------------------------------------------
 * Booking modal: collects trip details and sends them to the business's
 * WhatsApp number (configured in config.js) as a pre-filled message via
 * the wa.me deep link. No backend required.
 * ---------------------------------------------------------------------
 */

const BookingModule = (() => {
  let selectedCarId = null;

  function todayISO() {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }

  function setMinDates() {
    const pickup = document.getElementById("bookingPickupDate");
    const ret = document.getElementById("bookingReturnDate");
    if (!pickup || !ret) return;
    pickup.min = todayISO();
    ret.min = todayISO();

    pickup.addEventListener("change", () => {
      ret.min = pickup.value || todayISO();
      if (ret.value && ret.value < ret.min) ret.value = ret.min;
    });
  }

  function fillCarPreview(carId) {
    const preview = document.getElementById("bookingCarPreview");
    const car = carId ? CarsModule.getCarById(carId) : null;

    if (!car) {
      preview.innerHTML = `<span>General enquiry — no specific vehicle selected. You can mention your preferred car in the notes below.</span>`;
      return;
    }
    preview.innerHTML = `
      <img src="${car.images[0]}" alt="${car.name}" loading="lazy" />
      <div>
        <strong>${car.name}</strong><br/>
        <span style="color:var(--color-text-muted-dark);">${SITE_CONFIG.currency}${car.price}/day &middot; ${car.transmission} &middot; ${car.seats} Seats</span>
      </div>
    `;
  }

  function openBooking(carId = null) {
    selectedCarId = carId;
    fillCarPreview(carId);
    document.getElementById("bookingForm").reset();
    setMinDates();

    // If another modal (e.g. car details) is open, swap directly to the
    // booking modal rather than stacking two open modals.
    document.querySelectorAll(".modal.is-open").forEach((m) => m.classList.remove("is-open"));
    ModalModule.openModal(document.getElementById("bookingModal"));
  }

  function openRouteBooking(city, price) {
  selectedCarId = null;
  const preview = document.getElementById("bookingCarPreview");
  preview.innerHTML = `<span><strong>Lahore → ${city}</strong> — Fixed one-way rate: ${SITE_CONFIG.currency}${Number(price).toLocaleString()}</span>`;

  document.getElementById("bookingForm").reset();
  document.getElementById("bookingPickupLocation").value = "Lahore";
  document.getElementById("bookingNotes").value = `One-way drop-off to ${city} (fixed rate ${SITE_CONFIG.currency}${Number(price).toLocaleString()})`;
  setMinDates();

  document.querySelectorAll(".modal.is-open").forEach((m) => m.classList.remove("is-open"));
  ModalModule.openModal(document.getElementById("bookingModal"));
}

  function validateForm(form) {
    let valid = true;
    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      const group = field.closest(".form-group");
      const isEmpty = !field.value || !field.value.trim();
      const isInvalidPhone = field.type === "tel" && field.value && !/^[0-9+\-\s()]{7,20}$/.test(field.value);

      if (isEmpty || isInvalidPhone) {
        valid = false;
        group?.classList.add("has-error");
        field.classList.add("is-invalid");
      } else {
        group?.classList.remove("has-error");
        field.classList.remove("is-invalid");
      }
    });

    // Return date must not precede pickup date
    const pickup = form.querySelector("#bookingPickupDate");
    const ret = form.querySelector("#bookingReturnDate");
    if (pickup?.value && ret?.value && ret.value < pickup.value) {
      valid = false;
      ret.classList.add("is-invalid");
      ret.closest(".form-group")?.classList.add("has-error");
    }

    return valid;
  }

  function buildWhatsAppMessage(data) {
    const car = selectedCarId ? CarsModule.getCarById(selectedCarId) : null;

    const lines = [
      SITE_CONFIG.whatsappGreeting,
      "",
      "*Booking Request*",
      car ? `Vehicle: ${car.name} (${SITE_CONFIG.currency}${car.price.toLocaleString()}/day)` : "Vehicle: Not specified",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Pickup Date: ${data.pickupDate}`,
      `Return Date: ${data.returnDate}`,
      `Pickup Location: ${data.pickupLocation}`,
      `Driver Required: ${data.driverRequired}`,
    ];

    if (data.notes) {
      lines.push(`Notes: ${data.notes}`);
    }

    return lines.join("\n");
  }

  function sendToWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank", "noopener");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!validateForm(form)) return;

    const data = {
      name: form.bookingName.value.trim(),
      phone: form.bookingPhone.value.trim(),
      pickupDate: form.bookingPickupDate.value,
      returnDate: form.bookingReturnDate.value,
      pickupLocation: form.bookingPickupLocation.value.trim(),
      driverRequired: form.bookingDriver.value,
      notes: form.bookingNotes.value.trim(),
    };

    const message = buildWhatsAppMessage(data);
    sendToWhatsApp(message);

    ModalModule.closeModal();
  }

  function init() {
    const form = document.getElementById("bookingForm");
    if (form) form.addEventListener("submit", handleSubmit);

    // Open booking modal from any "Book Now" trigger (car cards, car
    // details modal footer, hero CTA, services, etc.)
    document.addEventListener("click", (e) => {
      const bookBtn = e.target.closest(".js-book-now");
      if (bookBtn) {
        openBooking(bookBtn.dataset.carId || null);
      }
    });

    document.addEventListener("click", (e) => {
      const routeBtn = e.target.closest(".js-book-route");
      if (routeBtn) {
        openRouteBooking(routeBtn.dataset.city, routeBtn.dataset.price);
      }
    });

    // Clear individual field errors as the user corrects them
    document.getElementById("bookingModal")?.addEventListener("input", (e) => {
      if (e.target.classList.contains("is-invalid")) {
        e.target.classList.remove("is-invalid");
        e.target.closest(".form-group")?.classList.remove("has-error");
      }
    });
  }

  return { init, openBooking };
})();
