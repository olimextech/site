// Olimex – small progressive enhancements. The site works without JS,
// except for the quote form, which needs it to compose the message.
(() => {
  const WHATSAPP_NUMBER = "553193310528";
  const EMAIL = "olimex@olimex.com.br";

  // Footer year and "years in business" counter
  document.getElementById("year").textContent = new Date().getFullYear();
  const since = document.querySelector("[data-since]");
  if (since) since.textContent = `${new Date().getFullYear() - Number(since.dataset.since)}+`;

  // Header shadow once the page is scrolled
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("menu");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Highlight the nav link for the section currently in view
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));

    // Fade-in on scroll
    const revealer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealer.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".section-head, .split > *, .brand-card, .contact-card").forEach((el) => {
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
