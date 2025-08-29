/* =========================================================
   script.js – AlegreMente 2025
   Mejora progresiva sin romper nada de lo existente.
   Todo es opcional y seguro si algunos elementos no existen.
   ========================================================= */

(function () {
  'use strict';

  /** Utilidad: selector corto */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /** Marca que JS está activo (para estilos opcionales) */
  document.documentElement.classList.add('js-enabled');

  document.addEventListener('DOMContentLoaded', () => {
    initLazyImages();
    hardenExternalLinks();
    initSmoothAnchors();
    initHeaderShadow();
    protectImageErrors();
  });

  /* ---------------------------------------------
     1) Lazy loading de imágenes (si no lo tienen)
     --------------------------------------------- */
  function initLazyImages() {
    $$('img').forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      // Evita layout shift en navegadores que soportan decoding
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });
  }

  /* -------------------------------------------------------
     2) Asegurar seguridad/accesibilidad en enlaces externos
     ------------------------------------------------------- */
  function hardenExternalLinks() {
    const isHttp = url => /^https?:\/\//i.test(url);

    $$('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      // Considera externo si es http(s) absoluto y no es mismo host
      if (isHttp(href)) {
        try {
          const u = new URL(href, location.href);
          if (u.host !== location.host) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
          }
        } catch (_) {
          // URL relativa rara: ignorar de forma segura
        }
      }
    });
  }

  /* ----------------------------------------------------
     3) Desplazamiento suave para anclas internas (#id)
     ---------------------------------------------------- */
  function initSmoothAnchors() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = $(id);
        if (!target) return;

        e.preventDefault();
        if (prefersReduced) {
          target.scrollIntoView(); // sin smooth
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Mueve el foco para accesibilidad
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ----------------------------------------------------
     4) Sombra del header al hacer scroll (feedback sutil)
     ---------------------------------------------------- */
  function initHeaderShadow() {
    const header = $('.site-header');
    if (!header) return;

    const toggleShadow = () => {
      if (window.scrollY > 4) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    toggleShadow();
    window.addEventListener('scroll', toggleShadow, { passive: true });
  }

  /* -----------------------------------------------------------------
     5) Manejo elegante de errores en imágenes (oculta contenedores)
     ----------------------------------------------------------------- */
  function protectImageErrors() {
    // Cubre logos del header
    $$('.site-header .logo').forEach(img => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
      }, { once: true });
    });

    // Cubre imagen de historieta de la nueva sección
    const fig = $('#viaje-sofia .vs-image');
    const img = fig ? $('img', fig) : null;
    if (img) {
      img.addEventListener('error', () => {
        // Si falla “Resumen historieta.jpg”, ocultamos la figura completa
        fig.style.display = 'none';
      }, { once: true });
    }
  }

})();
