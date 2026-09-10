// Menu mobile, anno corrente, contatori animati e comparsa grafico allo scroll

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  setFooterYear();
  initCounters();
  initBarChartReveal();
});

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = value.toLocaleString("it-IT", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

function initBarChartReveal() {
  const bars = document.querySelectorAll(".bar");
  if (!bars.length) return;

  // Le altezze finali sono definite via --value nel CSS inline;
  // le azzeriamo finché il grafico non entra in viewport per un effetto di crescita.
  bars.forEach((bar) => {
    bar.dataset.finalValue = bar.style.getPropertyValue("--value");
    bar.style.setProperty("--value", "0%");
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chartBars = entry.target.querySelectorAll(".bar");
          chartBars.forEach((bar) => {
            bar.style.setProperty("--value", bar.dataset.finalValue);
          });
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const chart = document.querySelector(".bar-chart");
  if (chart) observer.observe(chart);
}
