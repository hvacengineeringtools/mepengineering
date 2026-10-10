/* Typeset formulae and worked steps, shared by sheets I, II, III and IX.
   Pair with formula.css. Keep this file beside those pages.

   Mini-notation (written by the site's author only, never from user input):
     $x$            italic variable            _{ab} or _a   subscript
     ^{2} or ^2     superscript                @frac{a}{b}   fraction
     @sqrt{...}     square root                @bar{x}       overbar
     **text**       bold result                =             spaced equals sign
   A formula row is "left = right", with an optional "## (tag)" at the end. */
(function (root) {
  "use strict";

  function esc(c) { return c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c; }

  function tex(s) {
    s = String(s);
    let i = 0, out = "";
    function group() {                       /* read a {...} group starting at s[i] */
      let d = 0; const start = i + 1;
      for (; i < s.length; i++) {
        if (s[i] === "{") d++;
        else if (s[i] === "}" && --d === 0) { const g = s.slice(start, i); i++; return g; }
      }
      return s.slice(start);
    }
    while (i < s.length) {
      const c = s[i];
      if (s.startsWith("@frac", i)) { i += 5; const a = group(), b = group(); out += '<span class="mx-frac"><span class="mx-num">' + tex(a) + '</span><span class="mx-den">' + tex(b) + "</span></span>"; }
      else if (s.startsWith("@sqrt", i)) { i += 5; out += '<span class="mx-sq"><span class="mx-rd">' + tex(group()) + "</span></span>"; }
      else if (s.startsWith("@bar", i)) { i += 4; out += '<span class="mx-ov">' + tex(group()) + "</span>"; }
      else if (c === "_" || c === "^") {
        i++;
        const g = s[i] === "{" ? group() : s[i++];
        out += (c === "_" ? "<sub>" : "<sup>") + tex(g) + (c === "_" ? "</sub>" : "</sup>");
      }
      else if (c === "$") { const j = s.indexOf("$", i + 1); if (j < 0) { out += c; i++; } else { out += "<i>" + s.slice(i + 1, j).replace(/[<>&]/g, esc) + "</i>"; i = j + 1; } }
      else if (s.startsWith("**", i)) { const j = s.indexOf("**", i + 2); if (j < 0) { i += 2; } else { out += '<b class="mx-res">' + tex(s.slice(i + 2, j)) + "</b>"; i = j + 2; } }
      else if (c === "-" && /\d/.test(s[i + 1] || "") && (i === 0 || /[\s(|]/.test(s[i - 1]))) { out += "−"; i++; }
      else if (c === "=") { out += '<span class="mx-eqs">=</span>'; i++; }
      else if (c === "·") { out += '<span class="mx-dot">·</span>'; i++; }
      else { out += esc(c); i++; }
    }
    return out;
  }

  /* index of the first top-level " = " (outside any braces), or -1 */
  function splitAt(s) {
    let d = 0;
    for (let k = 0; k < s.length; k++) {
      if (s[k] === "{") d++; else if (s[k] === "}") d--;
      else if (d === 0 && (s.startsWith(" = ", k) || s.startsWith(" > ", k))) return k;
    }
    return -1;
  }

  /* Formula block. rows is an array of strings. */
  function formula(el, rows) {
    const tagged = rows.some(r => r.indexOf(" ## ") > -1);
    el.classList.add("mx-formula"); if (tagged) el.classList.add("tagged");
    el.innerHTML = rows.map(r => {
      if (r[0] === "~") return '<div class="mx-note">' + tex(r.slice(1).trim()) + "</div>";
      let tag = ""; const t = r.indexOf(" ## ");
      if (t > -1) { tag = r.slice(t + 4); r = r.slice(0, t); }
      const k = splitAt(r);
      const lhs = k > -1 ? r.slice(0, k) : r, rhs = k > -1 ? r.slice(k + 3) : "";
      return '<span class="mx-lhs">' + tex(lhs) + '</span><span class="mx-op">' + (k > -1 ? r[k + 1] : "") + '</span><span class="mx-rhs">' + tex(rhs) + "</span>" +
        (tagged ? '<span class="mx-tag">' + tex(tag) + "</span>" : "");
    }).join("");
  }

  /* Symbol list. items is [[symbol, meaning], ...] in the same notation. */
  function defs(el, items) {
    el.classList.add("mx-defs");
    el.innerHTML = items.map(d => "<li><b>" + tex(d[0]) + "</b><span>" + tex(d[1]) + "</span></li>").join("");
  }

  /* Worked steps. list is [{t: title, m: [equation lines], n: note, bad: bool}, ...]. */
  function steps(el, list, emptyText) {
    el.classList.add("mx-work");
    if (!list || !list.length) { el.innerHTML = '<div class="mx-empty">' + (emptyText || "Enter valid values to see the working.") + "</div>"; return; }
    el.innerHTML = list.map((s, n) =>
      '<div class="mx-st' + (s.bad ? " bad" : "") + '"><div class="mx-no">' + (n + 1) + '.</div><div>' +
      '<div class="mx-ti">' + s.t + "</div>" +
      (s.m || []).map(m => '<div class="mx-m">' + tex(m) + "</div>").join("") +
      (s.n ? '<p class="mx-nt">' + s.n + "</p>" : "") + "</div></div>"
    ).join("");
  }

  /* Slide-out panel: wires #mxPull, #mxScrim and #mxDrawer if the page has them. */
  function initDrawer() {
    const drawer = document.getElementById("mxDrawer"), pull = document.getElementById("mxPull"), scrim = document.getElementById("mxScrim");
    if (!drawer || !pull || !scrim) return;
    const tabs = [].slice.call(drawer.querySelectorAll('[role="tab"]'));
    drawer.inert = true;
    function showTab(name) {
      tabs.forEach(function (t) {
        const on = t.dataset.tab === name;
        t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1;
        document.getElementById("mxtab-" + t.dataset.tab).hidden = !on;
      });
    }
    function open(name) {
      if (name) showTab(name);
      drawer.inert = false; drawer.classList.add("open"); scrim.classList.add("on");
      pull.setAttribute("aria-expanded", "true"); drawer.querySelector(".mx-close").focus();
    }
    function close() {
      drawer.classList.remove("open"); scrim.classList.remove("on");
      pull.setAttribute("aria-expanded", "false"); drawer.inert = true; pull.focus();
    }
    pull.addEventListener("click", function () { drawer.classList.contains("open") ? close() : open(); });
    scrim.addEventListener("click", close);
    drawer.querySelector(".mx-close").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) close(); });
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { showTab(t.dataset.tab); });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        showTab(n.dataset.tab); n.focus();
      });
    });
    [].forEach.call(document.querySelectorAll("[data-mxopen]"), function (b) { b.addEventListener("click", function () { open(b.dataset.mxopen); }); });
    showTab(tabs[0].dataset.tab);
    window.addEventListener("beforeprint", function () { drawer.inert = false; });
  }
  initDrawer();

  root.MX = { tex: tex, formula: formula, defs: defs, steps: steps };
})(window);
