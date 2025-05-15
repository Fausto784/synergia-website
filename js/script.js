document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initSmoothScroll();
  initScrollReveal();
  initIconAnimations();
  protectFormElements();
  fixExternalLinks();
  updateYear();
  preventClickjacking();
});

function initMobileMenu() {
  const btnMenu = document.createElement("button");
  btnMenu.className = "hamburger";
  btnMenu.setAttribute("aria-label", "Abrir menú");
  btnMenu.setAttribute("type", "button");
  btnMenu.innerHTML = '<i class="fas fa-bars"></i>';

  const headerContainer = document.querySelector("header .container");
  if (headerContainer) {
    headerContainer.appendChild(btnMenu);
  }

  const navList = document.querySelector(".nav-list");
  let clickCount = 0;
  const maxClicks = 100;

  btnMenu.addEventListener("click", function (e) {
    if (clickCount >= maxClicks) return;
    clickCount++;
    e.preventDefault();

    navList.classList.toggle("open");
    btnMenu.classList.toggle("active");
    const isExpanded = navList.classList.contains("open");
    btnMenu.setAttribute("aria-expanded", isExpanded);
  });

  document.querySelectorAll(".nav-list a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      btnMenu.classList.remove("active");
      btnMenu.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!navList.contains(event.target) && !btnMenu.contains(event.target)) {
      navList.classList.remove("open");
      btnMenu.classList.remove("active");
      btnMenu.setAttribute("aria-expanded", "false");
    }
  });
}

function initStickyHeader() {
  const header = document.querySelector("header");
  if (!header) return;
  const stickyOffset = header.offsetTop;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle("sticky", window.pageYOffset > stickyOffset);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").replace("#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function initScrollReveal() {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll("section").forEach((sec) => {
      sec.classList.add("hidden");
      observer.observe(sec);
    });
  } else {
    document.querySelectorAll("section").forEach((sec) => {
      sec.classList.add("visible");
    });
  }
}

function initIconAnimations() {
  document.querySelectorAll('.service-icon').forEach((icon) => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.05)';
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1)';
    });
  });
}

function protectFormElements() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", () => {
      form.querySelectorAll("input, textarea").forEach((input) => {
        if (["text", "email"].includes(input.type) || input.tagName === "TEXTAREA") {
          input.value = DOMPurify.sanitize(input.value);
        }
      });
    });
  });
}

function fixExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (!link.hasAttribute("rel") || !link.getAttribute("rel").includes("noopener")) {
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
}

function updateYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}

function preventClickjacking() {
  if (window.self !== window.top) {
    try {
      const allowed = ['synergiaconsultores.lat', 'www.synergiaconsultores.lat', 'localhost'];
      if (!allowed.includes(window.parent.location.host)) {
        window.parent.location = window.location;
      }
    } catch (e) {
      window.parent.location = window.location;
    }
  }
}
