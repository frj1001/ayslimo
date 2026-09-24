/**
 * config.js
 * ---------------------------------------------------------------------
 * Single source of truth for business details used across the template.
 * Edit the values below to rebrand this template for any car rental
 * business — nothing else in the codebase needs to change.
 * ---------------------------------------------------------------------
 */

const SITE_CONFIG = {
  // Business identity
  businessName: "Ays Car Rental",
  tagline: "Luxury Car & Limousine Rental",

  // IMPORTANT: WhatsApp number in international format, digits only,
  // no "+", no spaces, no dashes. Example: 15551234567 (US), 923001234567 (PK)
  whatsappNumber: "923214002484",

  // Contact details
  phone: "+92 321 4002484",
  phoneHref: "tel:+923214002484",
  email: "bilal@ayscarrentallahore.pk",
  address: "14 B Commercial Fifth Floor Bahria Orchard Raiwand Road Lahore",

  // Bank details for advance payment via transfer — included automatically
  // in the WhatsApp message once a booking is submitted (see booking.js)
  bankDetails: {
    bankName: "AlBaraka Bank",
    accountTitle: "Ays Car Rental",
    accountNumber: "0102724379012",
    iban: "PK18AIIN0000102724379012",
  },

  // Business hours (displayed in the Contact section)
  businessHours: [
    { days: "Monday – Sunday", hours: "24/7" },
    { days: "Airport Pickups", hours: "24/7" },
  ],

  // Google Maps embed URL — replace with your own location's embed src
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.5!2d-118.26!3d34.098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA1JzUyLjkiTiAxMTjCsDE1JzQzLjMiVw!5e0!3m2!1sen!2sus!4v1700000000000",

  // Social links (leave "#" for unused platforms)
  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    linkedin: "#",
  },

  // Currency symbol/code used on price tags
  currency: "Rs. ",

  // Default WhatsApp greeting inserted above generated booking messages
  whatsappGreeting: "Hello Ays Car Rental! I'd like to make a booking.",
};

// Freeze to avoid accidental mutation elsewhere in the app
Object.freeze(SITE_CONFIG);
Object.freeze(SITE_CONFIG.businessHours);
Object.freeze(SITE_CONFIG.social);
