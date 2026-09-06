// ============================================================
// POLO360 — interactions
// ============================================================

// ===== Mobile menu =====
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

function closeMenu() {
  menu.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", closeMenu)
);

// ===== Nav background on scroll + back-to-top =====
const nav = document.getElementById("nav");
const toTop = document.getElementById("toTop");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 40);
  toTop.classList.toggle("show", y > 500);
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ===== Hero slider =====
const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.getElementById("dots");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

let current = 0;
let timer = null;
const INTERVAL = 5500;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.setAttribute("role", "tab");
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.children);

function goTo(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
  dots.forEach((d, i) => d.classList.toggle("active", i === current));
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

function startAuto() {
  stopAuto();
  timer = setInterval(next, INTERVAL);
}
function stopAuto() {
  if (timer) clearInterval(timer);
}

nextBtn.addEventListener("click", () => { next(); startAuto(); });
prevBtn.addEventListener("click", () => { prev(); startAuto(); });

const hero = document.querySelector(".hero");
hero.addEventListener("mouseenter", stopAuto);
hero.addEventListener("mouseleave", startAuto);
startAuto();

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ===== Animated counters =====
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1500;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ===== Form helpers =====
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function showMsg(el, text, type) {
  el.textContent = text;
  el.className = "form-msg " + type;
}

// ===== Newsletter =====
const newsletter = document.getElementById("newsletter");
const nlEmail = document.getElementById("nlEmail");
const nlMsg = document.getElementById("nlMsg");

newsletter.addEventListener("submit", (e) => {
  e.preventDefault();
  nlEmail.classList.remove("invalid");

  if (!isValidEmail(nlEmail.value.trim())) {
    nlEmail.classList.add("invalid");
    showMsg(nlMsg, "Please enter a valid email address.", "err");
    nlEmail.focus();
    return;
  }
  showMsg(nlMsg, "You're on the list — welcome to POLO360. ✦", "ok");
  newsletter.reset();
});

// ===== Contact =====
const contactForm = document.getElementById("contactForm");
const cName = document.getElementById("cName");
const cEmail = document.getElementById("cEmail");
const cMsg = document.getElementById("cMsg");
const cFormMsg = document.getElementById("cFormMsg");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  [cName, cEmail, cMsg].forEach((el) => el.classList.remove("invalid"));

  if (cName.value.trim().length < 2) {
    cName.classList.add("invalid");
    showMsg(cFormMsg, "Please enter your name.", "err");
    cName.focus();
    return;
  }
  if (!isValidEmail(cEmail.value.trim())) {
    cEmail.classList.add("invalid");
    showMsg(cFormMsg, "Please enter a valid email address.", "err");
    cEmail.focus();
    return;
  }
  if (cMsg.value.trim().length < 5) {
    cMsg.classList.add("invalid");
    showMsg(cFormMsg, "Please add a short message.", "err");
    cMsg.focus();
    return;
  }
  showMsg(cFormMsg, `Thanks, ${cName.value.trim()}! We'll be in touch soon.`, "ok");
  contactForm.reset();
});

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
