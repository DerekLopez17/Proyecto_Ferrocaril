/**
 * main.js — Rieles de Bugaba
 * Comportamiento general del sitio: navegación responsive, año del footer,
 * y resaltado del enlace activo según la sección visible.
 */

(function () {
  'use strict';

  // ----- Año dinámico en el footer -----
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ----- Menú de navegación responsive -----
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cierra el menú al elegir un enlace (útil en móvil)
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Resalta el enlace de navegación activo según la sección visible -----
  const sections = document.querySelectorAll('main section[id], header[id]');
  const navLinks = document.querySelectorAll('.primary-nav a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const linkFor = (id) => document.querySelector(`.primary-nav a[href="#${id}"]`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.removeAttribute('aria-current'));
            const activeLink = linkFor(entry.target.id);
            if (activeLink) activeLink.setAttribute('aria-current', 'true');
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ----- Ocultar/Mostrar menú al hacer scroll con suavidad (NUEVO) -----
  let lastScrollTop = 0;
  const header = document.querySelector('.site-header');
  let scrollTimeout;

  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Limpiamos el temporizador anterior
    clearTimeout(scrollTimeout);

    // Esperamos 10 milisegundos antes de ejecutar la animación
    scrollTimeout = setTimeout(() => {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 10);
  });

  // ----- Ocultar menú inmediatamente al hacer clic en un enlace de navegación (NUEVO) -----
  const allNavLinks = document.querySelectorAll('.primary-nav a, .footer-nav a');
  allNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.add('header-hidden');
    });
  });

})(); // <--- Cierre de la función principal