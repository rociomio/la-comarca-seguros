// Site interactions - banner timer, parallax quote block and seguros vertical swap.

// Banner slides - rotate hero images every 3 seconds.
function initBanner() {
  const root = document.querySelector("[data-banner]");
  const dotsRoot = document.querySelector("[data-banner-dots]");
  if (!root) return;

  const slides = [...root.querySelectorAll(".hero-slide")];
  if (!slides.length) return;

  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir a imagen ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => go(i));
    dotsRoot?.appendChild(dot);
  });

  const dots = [...(dotsRoot?.querySelectorAll("button") || [])];

  function go(next) {
    slides[index].classList.remove("is-active");
    dots[index]?.classList.remove("is-active");
    index = (next + slides.length) % slides.length;
    slides[index].classList.add("is-active");
    dots[index]?.classList.add("is-active");
    restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 3000);
  }

  restart();
}

// Parallax - move cotizar background slower than scroll.
function initParallax() {
  const layer = document.querySelector("[data-parallax]");
  const section = document.querySelector("#cotizar");
  if (!layer || !section) return;

  let ticking = false;

  function update() {
    const rect = section.getBoundingClientRect();
    const view = window.innerHeight || 1;
    const progress = (view - rect.top) / (view + rect.height);
    const shift = (progress - 0.5) * 120;
    layer.style.transform = `translate3d(0, ${shift}px, 0)`;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
}

// Seguros carousel - image exits upward, text enters from below.
function initSeguros() {
  const list = [...document.querySelectorAll("[data-seguro-list] li")];
  const media = document.querySelector("[data-seguros-media]");
  const copy = document.querySelector("[data-seguros-copy]");
  const progress = document.querySelector("[data-seguro-progress]");
  const prev = document.querySelector("[data-seguro-prev]");
  const next = document.querySelector("[data-seguro-next]");
  if (!list.length || !media || !copy) return;

  let index = 0;
  let busy = false;
  let auto;

  list.forEach((item, i) => {
    const frame = document.createElement("div");
    frame.className = "seguro-frame" + (i === 0 ? " is-active" : "");
    frame.style.backgroundImage = `url("${item.dataset.image}")`;
    frame.dataset.index = String(i);
    media.appendChild(frame);

    const panel = document.createElement("article");
    panel.className = "seguro-panel" + (i === 0 ? " is-active" : "");
    panel.dataset.index = String(i);
    panel.innerHTML = `
      <div>
        <p class="seguro-index">${String(i + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}</p>
        <h3>${item.dataset.title}</h3>
        <p>${item.dataset.copy}</p>
      </div>
      <a class="btn btn-primary" href="#cotizar">Cotizar este seguro</a>
    `;
    copy.appendChild(panel);
  });

  function setProgress() {
    if (!progress) return;
    progress.style.width = `${((index + 1) / list.length) * 100}%`;
  }

  function go(nextIndex) {
    if (busy) return;
    const target = (nextIndex + list.length) % list.length;
    if (target === index) return;
    busy = true;

    const frames = [...media.querySelectorAll(".seguro-frame")];
    const panels = [...copy.querySelectorAll(".seguro-panel")];
    const currentFrame = frames[index];
    const nextFrame = frames[target];
    const currentPanel = panels[index];
    const nextPanel = panels[target];

    currentFrame.classList.remove("is-active");
    currentFrame.classList.add("is-exit");
    nextFrame.classList.remove("is-exit");
    nextFrame.classList.add("is-active");

    currentPanel.classList.remove("is-active");
    currentPanel.classList.add("is-exit");
    nextPanel.classList.remove("is-exit");
    nextPanel.classList.add("is-active");

    window.setTimeout(() => {
      currentFrame.classList.remove("is-exit");
      currentPanel.classList.remove("is-exit");
      index = target;
      setProgress();
      busy = false;
    }, 720);

    restart();
  }

  function restart() {
    clearInterval(auto);
    auto = setInterval(() => go(index + 1), 4500);
  }

  prev?.addEventListener("click", () => go(index - 1));
  next?.addEventListener("click", () => go(index + 1));

  setProgress();
  restart();
}

// Quote form - local confirmation until mail/WhatsApp wiring exists.
function initQuoteForm() {
  const form = document.querySelector("[data-quote-form]");
  const status = document.querySelector("[data-form-status]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const contact = String(data.get("contacto") || "").trim();
    const seguro = String(data.get("seguro") || "").trim();
    if (!contact || !seguro) return;
    if (status) {
      status.textContent = "Listo. Guardamos tu consulta en esta demo; el próximo paso es conectar el envío real.";
    }
    form.reset();
  });
}

initBanner();
initParallax();
initSeguros();
initQuoteForm();
