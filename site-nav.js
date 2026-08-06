/* Bandeau site : brand + liens + état connexion (email).
   Dépend de auth.js (FLIPCARDS_AUTH). Placer après auth.js. */
(function () {
  const script = document.currentScript;
  const root = new URL("./", script.src).href;

  function abs(path) {
    return new URL(path.replace(/^\//, ""), root).href;
  }

  function pathIs(path) {
    try {
      return location.pathname.replace(/\/+$/, "") === new URL(path, root).pathname.replace(/\/+$/, "");
    } catch (_) {
      return false;
    }
  }

  const header = document.createElement("header");
  header.className = "site-nav";
  header.innerHTML =
    '<a class="site-nav-brand" href="' + abs("index.html") + '">' +
      '<span class="site-nav-kicker">Éditions Particulières</span>' +
      '<span class="site-nav-product">Droit public et administratif</span>' +
    "</a>" +
    '<nav class="site-nav-links" aria-label="Navigation">' +
      '<a data-nav="home" href="' + abs("index.html") + '">Accueil</a>' +
      '<a data-nav="ressources" href="' + abs("index.html#ressources") + '">Ressources</a>' +
      '<a data-nav="manuel" href="' + abs("manuel/") + '">Manuel</a>' +
      '<a data-nav="exercices" href="' + abs("index.html#exercices") + '">Exercices</a>' +
      '<a data-nav="checkout" href="' + abs("checkout/") + '">Abonnements</a>' +
      '<span class="site-nav-guest">' +
        '<a data-nav="membre" href="' + abs("membre/") + '">Connexion</a>' +
      "</span>" +
      '<span class="site-nav-auth" hidden>' +
        '<a class="site-nav-user" href="' + abs("gada/app.html") + '" title="Espace abonné">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
            '<path d="M4 6h16v12H4z"/><path d="M4 8l8 6 8-6"/>' +
          "</svg>" +
          '<span data-nav-email></span>' +
        "</a>" +
        '<button type="button" class="site-nav-logout" data-nav-logout>Déconnexion</button>' +
      "</span>" +
    "</nav>";

  document.body.prepend(header);
  document.body.classList.add("site-body");

  header.querySelectorAll("[data-nav]").forEach((a) => {
    const key = a.getAttribute("data-nav");
    const href = a.getAttribute("href") || "";
    try {
      const p = new URL(href).pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
      const cur = location.pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
      const hash = location.hash;
      if (key === "home") {
        if (cur === p && (!hash || hash === "#")) a.classList.add("is-active");
      } else if (key === "exercices" || key === "ressources") {
        if (cur === p && hash === "#" + key) a.classList.add("is-active");
      } else if (cur === p || (p !== "/" && cur.startsWith(p + "/"))) {
        a.classList.add("is-active");
      }
    } catch (_) {}
  });

  const guest = header.querySelector(".site-nav-guest");
  const auth = header.querySelector(".site-nav-auth");
  const emailEl = header.querySelector("[data-nav-email]");
  const logoutBtn = header.querySelector("[data-nav-logout]");

  logoutBtn.addEventListener("click", () => {
    if (window.FLIPCARDS_AUTH) FLIPCARDS_AUTH.clearToken();
    location.href = abs("index.html");
  });

  async function refreshAuth() {
    if (!window.FLIPCARDS_AUTH) return;
    const me = await FLIPCARDS_AUTH.requireSession();
    if (me && me.email) {
      guest.hidden = true;
      auth.hidden = false;
      emailEl.textContent = me.email;
    } else {
      guest.hidden = false;
      auth.hidden = true;
      emailEl.textContent = "";
    }
  }

  refreshAuth();

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML =
    '<div class="site-footer-inner">' +
      '<div class="site-footer-meta">' +
        '<p class="site-footer-brand">Éditions Particulières — Droit public et administratif</p>' +
        '<p class="site-footer-copy">© Éditions Particulières · Tous droits réservés · Reproductions / exportations interdites</p>' +
      "</div>" +
      '<nav class="site-footer-links" aria-label="Informations légales">' +
        '<a href="' + abs("mentions-legales/") + '">Mentions légales</a>' +
        '<a href="' + abs("cgv/") + '">CGV</a>' +
        '<a href="mailto:cab.pechard@gmail.com">Contact</a>' +
      "</nav>" +
    "</div>";
  document.body.appendChild(footer);
})();
