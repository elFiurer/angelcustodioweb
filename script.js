// script.js

document.addEventListener('DOMContentLoaded', function () {

    // ====================================================================
    // 1. GESTIÓN DE RECARGA Y NAVEGACIÓN
    // ====================================================================
    const entries = performance.getEntriesByType("navigation");
    if (entries.length > 0 && entries[0].type === 'reload') {
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
    } else {
        window.history.scrollRestoration = 'auto';
    }

    // ====================================================================
    // 2. LÓGICA PARA EL MENÚ MÓVIL
    // ====================================================================
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ====================================================================
    // 3. LÓGICA PARA LA ANIMACIÓN DEL ENCABEZADO PRINCIPAL (VERSIÓN CORREGIDA)
    // ====================================================================
    const headline = document.getElementById('main-headline');

    if (headline) {
        const text = headline.textContent.trim(); // .trim() para limpiar espacios sobrantes
        const words = text.split(' ');
        headline.innerHTML = '';

        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word; // Usamos textContent que es más seguro
            span.style.transitionDelay = `${index * 100}ms`;

            // LA SOLUCIÓN: Añadimos un margen derecho a cada palabra para crear el espacio.
            // La unidad 'em' se ajusta automáticamente al tamaño de la letra.
            if (index < words.length - 1) {
                span.style.marginRight = '0.25em';
            }

            headline.appendChild(span);
        });

        setTimeout(() => {
            headline.classList.add('visible');
        }, 100);
    }

    // ====================================================================
    // 4. SISTEMA UNIFICADO DE ANIMACIONES AL HACER SCROLL
    // ====================================================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach((element, index) => {
        element.style.transitionDelay = `${(index % 4) * 100}ms`;
        observer.observe(element);
    });

});