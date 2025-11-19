// ========= EmailJS, theme, background, scroll, tilt, preloader =========

// Init EmailJS & set up contact form
document.addEventListener("DOMContentLoaded", () => {
  // ---- EmailJS ----
  if (window.emailjs) {
    // NOTE: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL EmailJS KEYS!
    emailjs.init("T6ywNdQup20o7n8MF");
  }

  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!window.emailjs) return;

      statusEl.textContent = "Sending...";
      statusEl.style.color = "#6b7280";

      const formData = {
        from_name: form.from_name.value,
        reply_to: form.reply_to.value,
        message: form.message.value,
      };

      try {
        // NOTE: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL EmailJS SERVICE & TEMPLATE IDs!
        await emailjs.send("service_72n093k", "template_c75zjcp", formData);
        statusEl.textContent = "Message sent! I’ll get back to you soon.";
        statusEl.style.color = "#16a34a";
        form.reset();
      } catch (err) {
        console.error(err);
        statusEl.textContent =
          "Something went wrong. You can also email me directly.";
        statusEl.style.color = "#dc2626";
      }
    });
  }

  // ---- Theme toggle ----
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark");
      if (themeIcon) {
        themeIcon.classList.remove("ri-sun-line");
        themeIcon.classList.add("ri-moon-line");
      }
    } else {
      body.classList.remove("dark");
      if (themeIcon) {
        themeIcon.classList.add("ri-sun-line");
        themeIcon.classList.remove("ri-moon-line");
      }
    }
  };

  // FORCE DARK MODE BY DEFAULT, as requested for the background aesthetic
  const storedTheme = localStorage.getItem("theme");
  applyTheme(storedTheme || "dark"); 

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = body.classList.contains("dark");
      const newTheme = isDark ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  }

  // ---- Mobile nav (Unchanged) ----
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("nav-links");

  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        burger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  // ---- Scroll reveal (Unchanged) ----
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // ---- Tilt effect for project cards (Unchanged) ----
  const tiltCards = document.querySelectorAll(".tilt");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * 10; // tilt strength
      const rotateY = (x - 0.5) * -10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // ---- Preloader (Unchanged) ----
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 600);
    }
  });

  // ---- Interactive geometric background (FIX: Replaces fluid blobs) ----
  initGeometricBackground();
});

// Simple Geometric Grid Effect (similar to toukoum.fr style)
function initGeometricBackground() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H;
  function onResize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", onResize);
  onResize(); // Initial call to set dimensions

  // Subtle grid lines for dark mode aesthetic
  ctx.strokeStyle = "rgba(148, 163, 184, 0.08)"; 
  ctx.lineWidth = 1;
  const step = 40; // Spacing of the grid

  function drawGrid() {
    ctx.clearRect(0, 0, W, H);
    
    // Draw horizontal lines
    for (let i = 0; i < H; i += step) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(W, i);
      ctx.stroke();
    }

    // Draw vertical lines
    for (let i = 0; i < W; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, H);
      ctx.stroke();
    }

    requestAnimationFrame(drawGrid);
  }

  drawGrid();
}