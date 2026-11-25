document.documentElement.classList.remove("no-js");

// Animate sections as they enter the viewport without hiding content when
// JavaScript or animation APIs are unavailable.
const sectionMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && Element.prototype.animate && !sectionMotion.matches) {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.animate(
        [{ opacity: 0.35, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 650, easing: "cubic-bezier(.22, 1, .36, 1)" }
      );
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll("main > section:not(.hero--interactive)").forEach((section) => sectionObserver.observe(section));
  sectionMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      sectionObserver.disconnect();
      document.querySelectorAll("main > section").forEach((section) => section.getAnimations().forEach((animation) => animation.finish()));
    }
  });
}

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) close();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item) => observer.observe(item));

  window.setTimeout(() => {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }, 1600);
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const chips = document.querySelectorAll(".filter-chip");
const products = document.querySelectorAll(".product-card[data-category]");
const count = document.querySelector(".product-count");

if (chips.length && products.length) {
  chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.classList.contains("is-active"))));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      let shown = 0;

      chips.forEach((item) => {
        item.classList.toggle("is-active", item === chip);
        item.setAttribute("aria-pressed", String(item === chip));
      });

      products.forEach((product) => {
        const match = filter === "all" || product.dataset.category === filter;
        product.hidden = !match;
        if (match) {
          shown += 1;
          if (product.animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            product.animate(
              [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
              { duration: 300, delay: Math.min(shown - 1, 5) * 35, easing: "ease-out", fill: "backwards" }
            );
          }
        }
      });

      if (count) count.textContent = `${shown} products`;
    });
  });
}

const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');
    if (status) status.textContent = "Thank you — we'll be in touch shortly.";
    if (button) {
      button.textContent = "Enquiry noted ✓";
      button.disabled = true;
    }
    form.reset();
    window.setTimeout(() => {
      if (button) {
        button.innerHTML = 'Send enquiry <span class="arrow" aria-hidden="true">→</span>';
        button.disabled = false;
      }
      if (status) status.textContent = "";
    }, 5000);
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const hero = document.querySelector(".hero--interactive");

if (hero) {
  const slides = [
    {
      eyebrow: "01 / Velpearl Ceramics",
      title: "Beauty built into <em>every surface.</em>",
      lede: "From marble-look slabs to warm wood textures, Velpearl ceramics give floors and walls a quiet, lasting presence.",
      cta: "Explore ceramics",
      href: "ceramics.html",
    },
    {
      eyebrow: "02 / Sanitary Wares",
      title: "The bathroom, <em>considered.</em>",
      lede: "Clean lines, generous proportions and surfaces that stay beautiful with everyday care — made for the rituals of real life.",
      cta: "Explore sanitaryware",
      href: "sanitary-wares.html",
    },
    {
      eyebrow: "03 / Velpearl Fittings",
      title: "Precision in <em>every detail.</em>",
      lede: "Faucets and bathroom hardware engineered to feel smooth, solid and quietly precise through thousands of everyday moments.",
      cta: "Explore fittings",
      href: "fittings.html",
    },
    {
      eyebrow: "04 / Manhole Covers",
      title: "Strength beneath <em>the surface.</em>",
      lede: "Reliable load performance, corrosion resistance and long service in the demanding places nobody gets to see.",
      cta: "Explore manhole covers",
      href: "manhole-covers.html",
    },
  ];

  const duration = 7000;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stage = hero.querySelector(".hero__stage");
  const layers = Array.from(hero.querySelectorAll(".hero__layer"));
  const videos = Array.from(hero.querySelectorAll(".hero__video"));
  const railItems = Array.from(hero.querySelectorAll(".hero__rail-item"));
  const content = hero.querySelector(".hero__content");
  const eyebrow = hero.querySelector("[data-hero-eyebrow]");
  const title = hero.querySelector("[data-hero-title]");
  const lede = hero.querySelector("[data-hero-lede]");
  const cta = hero.querySelector("[data-hero-cta]");
  const play = hero.querySelector(".hero__play");
  const progress = hero.querySelector(".hero__progress-fill");

  let index = 0;
  let timer = null;
  let playing = false;
  let suspended = false;

  function clearTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function setPlayLabel(paused) {
    if (!play) return;
    play.setAttribute("aria-pressed", String(paused));
    play.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
  }

  function stop() {
    clearTimer();
    playing = false;
    suspended = false;
    hero.classList.remove("is-playing");
    setPlayLabel(true);
    const active = videos[index];
    if (active) active.pause();
  }

  function restart() {
    if (!playing) return;
    clearTimer();
    hero.classList.remove("is-playing");
    void progress.offsetWidth;
    hero.classList.add("is-playing");
    timer = window.setInterval(() => render(index + 1), duration);
  }

  function start() {
    if (reduced.matches) return;
    clearTimer();
    playing = true;
    suspended = false;
    restart();
    setPlayLabel(false);
    syncVideos();
  }

  function suspend() {
    if (!playing || suspended) return;
    suspended = true;
    clearTimer();
    hero.classList.remove("is-playing");
  }

  function resume() {
    if (!playing || !suspended) return;
    suspended = false;
    restart();
  }

  function syncVideos() {
    videos.forEach((video, position) => {
      if (position === index) {
        if (video.readyState < 2) video.load();
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  function render(next) {
    const target = (next + slides.length) % slides.length;
    if (target === index) return;
    index = target;

    content.classList.add("is-changing");
    window.setTimeout(
      () => {
        const slide = slides[index];
        eyebrow.textContent = slide.eyebrow;
        title.innerHTML = slide.title;
        lede.textContent = slide.lede;
        cta.innerHTML = `${slide.cta} <span class="arrow" aria-hidden="true">→</span>`;
        cta.setAttribute("href", slide.href);
        content.classList.remove("is-changing");
      },
      reduced.matches ? 0 : 200
    );

    layers.forEach((layer, position) => layer.classList.toggle("is-active", position === index));
    railItems.forEach((item, position) => {
      const active = position === index;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
    syncVideos();
    restart();
  }

  railItems.forEach((item, position) => {
    item.addEventListener("click", () => render(position));
    item.addEventListener("keydown", (event) => {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!forward && !backward) return;
      event.preventDefault();
      const target = (position + (forward ? 1 : -1) + slides.length) % slides.length;
      railItems[target].focus();
      render(target);
    });
  });

  if (play) {
    play.addEventListener("click", () => {
      if (playing) stop();
      else start();
    });
  }

  hero.addEventListener("mouseenter", suspend);
  hero.addEventListener("mouseleave", resume);
  hero.addEventListener("focusin", suspend);
  hero.addEventListener("focusout", (event) => {
    if (!hero.contains(event.relatedTarget)) resume();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      suspend();
      videos.forEach((video) => video.pause());
    } else {
      resume();
      syncVideos();
    }
  });

  let startX = 0;
  let startY = 0;
  let dragging = false;
  let moved = false;

  hero.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a, button")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    try {
      hero.setPointerCapture(event.pointerId);
    } catch (error) {}
    suspend();
  });

  hero.addEventListener("pointermove", (event) => {
    if (!dragging) {
      if (reduced.matches || event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      layers.forEach((layer) => {
        layer.style.setProperty("--parallax-x", `${(x * -22).toFixed(1)}px`);
        layer.style.setProperty("--parallax-y", `${(y * -16).toFixed(1)}px`);
      });
      return;
    }

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      moved = true;
      hero.classList.add("is-dragging");
    }
    if (moved) stage.style.transform = `translateX(${(dx * 0.12).toFixed(1)}px)`;
  });

  function endDrag(event) {
    if (!dragging) return;
    const dx = event.clientX - startX;
    dragging = false;
    hero.classList.remove("is-dragging");
    stage.style.transform = "";
    if (moved && Math.abs(dx) > 55) render(index + (dx < 0 ? 1 : -1));
    resume();
  }

  hero.addEventListener("pointerup", endDrag);
  hero.addEventListener("pointercancel", endDrag);
  hero.addEventListener("pointerleave", () => {
    layers.forEach((layer) => {
      layer.style.setProperty("--parallax-x", "0px");
      layer.style.setProperty("--parallax-y", "0px");
    });
  });

  if (reduced.matches) {
    videos.forEach((video, position) => {
      if (position !== index) { video.pause(); video.currentTime = 0; }
    });
  } else {
    syncVideos();
  }
  start();
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const header = document.querySelector(".site-header");
const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
scrollProgress.innerHTML = '<span class="scroll-progress__bar"></span>';
document.body.appendChild(scrollProgress);
const scrollBar = scrollProgress.querySelector(".scroll-progress__bar");

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.textContent = "↑";
document.body.appendChild(backToTop);

const heroParallaxImages = Array.from(document.querySelectorAll(".page-hero__media img"));

function onPageScroll() {
  const y = window.scrollY || document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? Math.min(100, (y / max) * 100) : 0;

  scrollBar.style.width = `${percent.toFixed(2)}%`;
  if (header) header.classList.toggle("is-scrolled", y > 30);
  backToTop.classList.toggle("is-visible", y > 600);

  if (!reduceMotion.matches) {
    heroParallaxImages.forEach((image) => {
      image.style.setProperty("--hero-scroll", `${Math.min(24, y * 0.06).toFixed(1)}px`);
    });
  }
}

window.addEventListener("scroll", onPageScroll, { passive: true });
onPageScroll();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
});

if (!reduceMotion.matches && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.setProperty("--mx", `${x.toFixed(1)}px`);
      button.style.setProperty("--my", `${y.toFixed(1)}px`);
    });
    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--mx", "0px");
      button.style.setProperty("--my", "0px");
    });
  });
}

const quickTriggers = document.querySelectorAll("[data-quick]");

if (quickTriggers.length) {
  const dialog = document.createElement("dialog");
  dialog.className = "quick-view";
  dialog.setAttribute("aria-label", "Product quick view");
  dialog.innerHTML = `
    <button class="quick-view__close" type="button" aria-label="Close quick view">×</button>
    <div class="quick-view__inner">
      <div class="quick-view__media"></div>
      <div class="quick-view__body">
        <span class="eyebrow" data-qv-code></span>
        <h2 data-qv-title></h2>
        <p data-qv-desc></p>
        <div class="quick-view__actions">
          <a class="btn btn--primary" href="contact.html">Enquire now <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--dark" href="catalogue.html">View catalogue</a>
        </div>
      </div>
    </div>`;
  document.body.appendChild(dialog);

  const qvMedia = dialog.querySelector(".quick-view__media");
  const qvCode = dialog.querySelector("[data-qv-code]");
  const qvTitle = dialog.querySelector("[data-qv-title]");
  const qvDesc = dialog.querySelector("[data-qv-desc]");

  quickTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const card = trigger.closest(".product-card");
      if (!card) return;
      const title = card.querySelector("h3").textContent;
      const image = card.querySelector(".product-card__media img");

      qvCode.textContent = card.querySelector(".product-card__code").textContent;
      qvTitle.textContent = title;
      qvDesc.textContent = card.querySelector(".product-card__body p").textContent;

      if (image) {
        qvMedia.className = "quick-view__media";
        qvMedia.innerHTML = `<img src="${image.getAttribute("src")}" alt="${title}" />`;
      } else {
        qvMedia.className = "quick-view__media quick-view__media--graphic";
        qvMedia.innerHTML = '<span class="manhole-graphic" aria-hidden="true"></span>';
      }

      dialog.showModal();
    });
  });

  dialog.querySelector(".quick-view__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

const spotTabs = document.querySelectorAll("[data-spotlight]");

if (spotTabs.length) {
  const spotImages = document.querySelectorAll("[data-spotlight-image]");
  const spotCaption = document.querySelector("[data-spotlight-caption]");
  const captions = [
    "Satatuario Vol. I — Marble look",
    "Satatuario Vol. II — Stone",
    "Carving Wood — Wood look",
  ];

  spotTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const index = Number(tab.dataset.spotlight);
      spotTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        if (active) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      });
      spotImages.forEach((image) => {
        image.classList.toggle("is-active", Number(image.dataset.spotlightImage) === index);
      });
      if (spotCaption) spotCaption.textContent = captions[index];
    });
  });
}

const catalogueSearch = document.querySelector("#catalogue-query");

if (catalogueSearch) {
  const items = document.querySelectorAll(".catalogue-item");
  const count = document.querySelector("[data-catalogue-count]");

  catalogueSearch.addEventListener("input", () => {
    const query = catalogueSearch.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((item) => {
      const match = item.textContent.toLowerCase().includes(query);
      item.hidden = !match;
      if (match) shown += 1;
    });
    if (count) count.textContent = `${shown} ${shown === 1 ? "catalogue" : "catalogues"}`;
  });
}

const interestChips = document.querySelectorAll("[data-interest]");

if (interestChips.length) {
  interestChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const select = document.querySelector("#interest");
      if (select) select.value = chip.dataset.interest;
      interestChips.forEach((item) => item.classList.toggle("is-active", item === chip));
    });
  });
}

const copyButton = document.querySelector("[data-copy]");

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
      copyButton.textContent = "Copied";
      copyButton.classList.add("is-copied");
    } catch (error) {
      copyButton.textContent = "Select email";
    }
    window.setTimeout(() => {
      copyButton.textContent = "Copy";
      copyButton.classList.remove("is-copied");
    }, 2200);
  });
}
