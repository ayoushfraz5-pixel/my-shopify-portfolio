(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobile-nav");

  function closeMenu() {
    mobileNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
  }

  function openMenu() {
    mobileNav.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileNav.classList.contains("open");
      if (isOpen) closeMenu(); else openMenu();
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (e) {
      var header = document.getElementById("site-header");
      if (mobileNav.classList.contains("open") && header && !header.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");

  var validators = {
    name: function (v) {
      return v.trim().length >= 2 ? "" : "Please enter your name.";
    },
    email: function (v) {
      var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(v.trim()) ? "" : "Please enter a valid email address.";
    },
    "project-type": function (v) {
      return v ? "" : "Please select a project type.";
    },
    message: function (v) {
      return v.trim().length >= 10 ? "" : "Please add a few details about your project (10+ characters).";
    }
  };

  function showError(fieldName, message) {
    var field = form.querySelector("[name='" + fieldName + "']");
    var errorEl = form.querySelector("[data-error-for='" + fieldName + "']");
    var wrapper = field ? field.closest(".form-field") : null;
    if (errorEl) errorEl.textContent = message;
    if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
  }

  if (form) {
    Object.keys(validators).forEach(function (fieldName) {
      var field = form.querySelector("[name='" + fieldName + "']");
      if (!field) return;
      field.addEventListener("blur", function () {
        showError(fieldName, validators[fieldName](field.value));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var isValid = true;
      Object.keys(validators).forEach(function (fieldName) {
        var field = form.querySelector("[name='" + fieldName + "']");
        var message = validators[fieldName](field.value);
        showError(fieldName, message);
        if (message) isValid = false;
      });

      if (!isValid) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.className = "form-status error";
        return;
      }

      // No backend is connected yet. Wire this up to a form service
      // (e.g. Formspree, EmailJS) or a server endpoint to actually
      // send messages. For now, confirm receipt locally.
      statusEl.textContent = "Thanks — your message has been captured. I'll get back to you soon.";
      statusEl.className = "form-status success";
      form.reset();
    });
  }
})();
