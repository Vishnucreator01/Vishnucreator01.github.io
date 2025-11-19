// ========= EmailJS, theme, background, scroll, tilt, preloader =========

// Init EmailJS & set up contact form
document.addEventListener("DOMContentLoaded", () => {
  // ---- EmailJS Setup ----
  if (window.emailjs) {
    // NOTE: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL EmailJS KEYS!
    emailjs.init("T6ywNdQup20o7n8MF");
  }

  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!window.emailjs) {
        statusEl.textContent = "Email service not initialized.";
        statusEl.style.color = "#dc2626";
        return;
      }

      statusEl.textContent = "Sending...";
      statusEl.style.color = "#6b7280";

      const formData = {
        from_name: form.from_name.value,
        reply_to: form.reply_to.value,
        message: form.message.value,
      };

      try {
        // NOTE: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL EmailJS SERVICE & TEMPLATE IDs!
        await emailjs.send("service_2debsvl", "template_c75zjcp", formData);
        statusEl.textContent = "Message sent! I’ll get back to you soon.";
        statusEl.style.color = "#16a34a";
        form.reset();
      } catch (err) {
        console.error("EmailJS Error:", err);
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

  // FORCE DARK MODE BY DEFAULT
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

  // ---- START: World Class Animated Background ----
  initWorldClassParticles();
});

// Advanced Particle Animation with Scroll Parallax
function initWorldClassParticles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];
  
  // Configuration
  const particleCount = window.innerWidth < 768 ? 40 : 80; // Fewer on mobile for performance
  const connectionDistance = 120;
  const mouseDistance = 150;

  // Mouse tracking
  let mouse = { x: null, y: null };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Scroll tracking for Parallax
  let scrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  // Resize handling
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5; // Random horizontal velocity
      this.vy = (Math.random() - 0.5) * 0.5; // Random vertical velocity
      this.size = Math.random() * 2 + 1; // Random size
      this.baseY = this.y; // Store original Y for parallax calculation
    }

    update() {
      // Basic movement
      this.x += this.vx;
      this.y += this.vy;

      // Parallax Effect: Move particles slightly based on scroll position
      // The factor (0.2) determines how fast they move relative to scroll
      this.y = this.baseY - (scrollY * 0.1 * this.size); 
      // Wrap around screen (infinite scroll feel)
      if (this.y < -50) {
          this.y = height + 50;
          this.baseY = height + 50 + (scrollY * 0.1 * this.size); 
      }

      // Boundary check (bounce off walls)
      if (this.x < 0 || this.x > width) this.vx *= -1;
      
      // Mouse interaction (move away from mouse)
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * 3; // Push strength
            const directionY = forceDirectionY * force * 3;
            this.x -= directionX;
            this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)"; // Particle color (Slate-400 with opacity)
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize Particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Dark Mode Background Check (Optional: can rely on CSS background-color)
    // ctx.fillStyle = "#020617"; 
    // ctx.fillRect(0,0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Draw connections
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          // Dynamic opacity based on distance
          let opacity = 1 - (distance / connectionDistance);
          ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.2})`; 
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  // Ensure dark mode class is set
  document.body.classList.add('dark');
  
  animate();
}
