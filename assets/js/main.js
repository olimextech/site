// Olimex – small progressive enhancements. The site works without JS,
// except for the quote form, which needs it to compose the message.
(() => {
  const WHATSAPP_NUMBER = "553193310528";
  const EMAIL = "olimex@olimex.com.br";

  // Footer year and "years in business" counter
  document.getElementById("year").textContent = new Date().getFullYear();
  const since = document.querySelector("[data-since]");
  if (since) since.textContent = `${new Date().getFullYear() - Number(since.dataset.since)}+`;

  // Mobile menu (full-screen overlay)
  const toggle = document.querySelector(".globalnav-toggle");
  const menu = document.getElementById("menu");
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  if ("IntersectionObserver" in window) {
    // Highlight the nav link for the section currently in view
    const links = [...menu.querySelectorAll('a[href^="#"]')];
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean).forEach((s) => spy.observe(s));

    // Fade-in on scroll
    const revealer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealer.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    document
      .querySelectorAll(".tile:not(.tile-hero) .tile-copy, .stats, .body-copy, .grid-head, .grid-tile, .form, .contact-row, .map")
      .forEach((el) => {
        el.classList.add("reveal");
        revealer.observe(el);
      });
  }

  // Quote form: GitHub Pages has no backend, so we compose the request
  // and hand it off to WhatsApp or the visitor's e-mail client.
  const form = document.getElementById("quote-form");
  const errorBox = form.querySelector(".form-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const channel = event.submitter?.dataset.channel || "whatsapp";

    const required = [...form.querySelectorAll("[required]")];
    required.forEach((f) => f.classList.toggle("invalid", !f.checkValidity()));
    const firstInvalid = required.find((f) => !f.checkValidity());
    if (firstInvalid) {
      errorBox.textContent = "Preencha nome, e-mail válido e a solicitação.";
      errorBox.hidden = false;
      firstInvalid.focus();
      return;
    }
    errorBox.hidden = true;

    const data = Object.fromEntries(new FormData(form));
    const lines = [
      "*Cotação online - Olimex*",
      `Nome: ${data.nome}`,
      data.empresa ? `Empresa: ${data.empresa}` : null,
      data.telefone ? `Telefone: ${data.telefone}` : null,
      `E-mail: ${data.email}`,
      "",
      "Solicitação:",
      data.solicitacao,
    ].filter((l) => l !== null);

    if (channel === "email") {
      const subject = `Cotação online - ${data.nome}${data.empresa ? ` (${data.empresa})` : ""}`;
      const body = lines.join("\n").replace(/\*/g, "");
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    }
  });
})();
