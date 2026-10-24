(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "chenlab-lang";

  /* ---------- language ---------- */
  function applyLang(lang, persist) {
    if (lang !== "en" && lang !== "zh") lang = "en";
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var on = btn.getAttribute("data-set-lang") === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (persist) {
      try { localStorage.setItem(KEY, lang); } catch (e) {}
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var q = new URLSearchParams(location.search).get("lang");
  applyLang(q || saved || "en", false);

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-set-lang"), true);
    });
  });

  /* ---------- year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- header: visible at top, hide on scroll down, reveal on hover ---------- */
  var header = document.querySelector(".site-header");
  if (!header) return;

  var canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  if (!canHover) return; // touch devices keep a permanent sticky header

  var lastY = window.scrollY;
  var suppressUntil = 0;

  function syncHeaderHeight() {
    root.style.setProperty("--header-h", header.offsetHeight + "px");
  }
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);
  window.addEventListener("load", syncHeaderHeight);

  function setHidden(hidden) {
    header.classList.toggle("is-hidden", hidden);
    root.classList.toggle("nav-hidden", hidden);
  }

  function onScroll() {
    var y = window.scrollY;
    if (Date.now() < suppressUntil) {
      setHidden(false);
      lastY = y;
      return;
    }
    if (y < 120) {
      setHidden(false);
    } else if (y > lastY + 6) {
      setHidden(true);
    } else if (y < lastY - 6) {
      setHidden(false);
    }
    lastY = y;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      suppressUntil = Date.now() + 900;
      setHidden(false);
    });
  });

  onScroll();
})();

(()=>{const links=[...document.querySelectorAll('.album-zoom')];if(!links.length)return;
const dialog=document.createElement('dialog');dialog.className='album-viewer';dialog.setAttribute('aria-label','照片浏览 / Photo viewer');
const img=document.createElement('img'),caption=document.createElement('p'),controls=document.createElement('div');controls.className='album-viewer-controls';let index=0,origin;
function show(i){index=(i+links.length)%links.length;const figure=links[index].closest('figure');img.src=links[index].href;img.alt=figure.querySelector('img').alt;caption.textContent=(index+1)+' / '+links.length+' · '+figure.querySelector('figcaption').innerText;}
function button(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=fn;controls.append(b);return b;}
button('←',()=>show(index-1)).setAttribute('aria-label','上一张 / Previous');button('关闭 / Close',()=>dialog.close());button('→',()=>show(index+1)).setAttribute('aria-label','下一张 / Next');dialog.append(img,caption,controls);document.body.append(dialog);
links.forEach((a,i)=>a.addEventListener('click',ev=>{ev.preventDefault();origin=a;show(i);dialog.showModal();}));dialog.addEventListener('keydown',ev=>{if(ev.key==='ArrowRight'){ev.preventDefault();show(index+1);}if(ev.key==='ArrowLeft'){ev.preventDefault();show(index-1);}});dialog.addEventListener('close',()=>origin?.focus());})();
