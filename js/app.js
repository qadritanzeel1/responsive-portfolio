(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Small toast (for placeholder links etc.)
  const toastEl = $("#toast");
  let toastTimer = null;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-open");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("is-open"), 2200);
  }

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  const menuBtn = $(".menu-btn");
  const nav = $("#site-nav");

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      const target = e.target;
      const clickedInsideNav = nav.contains(target);
      const clickedButton = menuBtn.contains(target);
      if (!clickedInsideNav && !clickedButton) setMenu(false);
    });
    $$(".nav-link").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  // Scroll reveal
  const revealEls = $$("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");

        // Animate skill bars when skills container/skills come into view
        if (entry.target.classList.contains("skills-grid")) {
          $$(".skill", entry.target).forEach((skill) => {
            const level = Number(skill.getAttribute("data-level") || "0");
            skill.style.setProperty("--level", String(Math.max(0, Math.min(100, level))));
            skill.classList.add("is-animated");
          });
        }
      });
    },
    { threshold: 0.18 }
  );
  revealEls.forEach((el) => io.observe(el));

  // Prevent jump for placeholder links
  $$('a[href="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      toast("Add your real link in index.html.");
    });
  });

  // Active nav link on scroll (simple section spy)
  const sections = ["home", "about", "skills", "education", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = $$(".nav-link");

  function setActiveLink(activeId) {
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("is-active", href === `#${activeId}`);
    });
  }

  if (sections.length && navLinks.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible?.target?.id) setActiveLink(visible.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0.05, 0.1, 0.2] }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // Contact form -> mailto (no external services)
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "");
      const email = String(data.get("email") || "");
      const subject = String(data.get("subject") || "");
      const message = String(data.get("message") || "");

      const to = "tanzeelqadri042@gmail.com";
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n");

      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  }
})();

