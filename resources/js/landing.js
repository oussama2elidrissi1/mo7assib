/**
 * Mo7assib Landing Page — JavaScript
 *
 * Modules :
 *  - Navbar scroll + mobile burger
 *  - Intersection Observer (scroll reveal)
 *  - Compteurs animés
 *  - Tabs secteurs
 *  - Smooth scroll
 *  - Waitlist modal (open / close / AJAX submit + validation)
 */

( function () {
    'use strict';

    // ── NAVBAR ───────────────────────────────────────────────
    function initNavbar() {
        const nav    = document.querySelector( '.lp-nav' );
        const burger = document.querySelector( '.lp-nav__burger' );
        if ( ! nav ) return;

        // Scroll state
        const updateScroll = () => {
            nav.classList.toggle( 'lp-nav--scrolled', window.scrollY > 40 );
        };
        window.addEventListener( 'scroll', updateScroll, { passive: true } );
        updateScroll();

        // Mobile burger
        if ( burger ) {
            burger.addEventListener( 'click', () => {
                nav.classList.toggle( 'lp-nav--open' );
                const expanded = nav.classList.contains( 'lp-nav--open' );
                burger.setAttribute( 'aria-expanded', expanded );
            } );
        }

        // Close mobile menu on nav link click
        nav.querySelectorAll( '.lp-nav__link' ).forEach( link => {
            link.addEventListener( 'click', () => {
                nav.classList.remove( 'lp-nav--open' );
            } );
        } );
    }

    // ── SCROLL REVEAL ────────────────────────────────────────
    function initReveal() {
        const items = document.querySelectorAll( '.lp-reveal' );
        if ( ! items.length ) return;

        if ( ! window.IntersectionObserver ) {
            items.forEach( el => el.classList.add( 'lp-visible' ) );
            return;
        }

        const observer = new IntersectionObserver(
            entries => entries.forEach( entry => {
                if ( entry.isIntersecting ) {
                    entry.target.classList.add( 'lp-visible' );
                    observer.unobserve( entry.target );
                }
            } ),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        items.forEach( el => observer.observe( el ) );
    }

    // ── ANIMATED COUNTERS ────────────────────────────────────
    function animateCounter( el ) {
        const target   = parseFloat( el.dataset.target ) || 0;
        const suffix   = el.dataset.suffix   || '';
        const prefix   = el.dataset.prefix   || '';
        const decimals = parseInt( el.dataset.decimals || '0', 10 );
        const duration = 1800;
        let   start    = null;
        const easeOut  = t => 1 - Math.pow( 1 - t, 3 );

        const step = ts => {
            if ( ! start ) start = ts;
            const progress = Math.min( ( ts - start ) / duration, 1 );
            el.textContent = prefix + ( target * easeOut( progress ) ).toFixed( decimals ) + suffix;
            if ( progress < 1 ) requestAnimationFrame( step );
        };

        requestAnimationFrame( step );
    }

    function initCounters() {
        const els = document.querySelectorAll( '[data-counter]' );
        if ( ! els.length ) return;

        if ( ! window.IntersectionObserver ) {
            els.forEach( animateCounter );
            return;
        }

        const observer = new IntersectionObserver(
            entries => entries.forEach( entry => {
                if ( entry.isIntersecting ) {
                    animateCounter( entry.target );
                    observer.unobserve( entry.target );
                }
            } ),
            { threshold: 0.5 }
        );

        els.forEach( el => observer.observe( el ) );
    }

    // ── SECTEURS TABS ────────────────────────────────────────
    function initSecteursTabs() {
        const tabs   = document.querySelectorAll( '.lp-secteurs__tab' );
        const panels = document.querySelectorAll( '.lp-secteurs__panel' );
        if ( ! tabs.length ) return;

        tabs.forEach( tab => {
            tab.addEventListener( 'click', function () {
                const target = this.dataset.tab;

                tabs.forEach( t => {
                    t.classList.remove( 'lp-secteurs__tab--active' );
                    t.setAttribute( 'aria-selected', 'false' );
                } );
                panels.forEach( p => p.classList.remove( 'lp-secteurs__panel--active' ) );

                this.classList.add( 'lp-secteurs__tab--active' );
                this.setAttribute( 'aria-selected', 'true' );

                const panel = document.querySelector( `.lp-secteurs__panel[data-panel="${target}"]` );
                if ( panel ) panel.classList.add( 'lp-secteurs__panel--active' );
            } );
        } );
    }

    // ── SMOOTH SCROLL ────────────────────────────────────────
    function initSmoothScroll() {
        document.querySelectorAll( 'a[href^="#"]' ).forEach( anchor => {
            anchor.addEventListener( 'click', function ( e ) {
                const id     = this.getAttribute( 'href' ).slice( 1 );
                const target = id ? document.getElementById( id ) : null;
                if ( ! target ) return;
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo( { top, behavior: 'smooth' } );
            } );
        } );
    }

    // ── WAITLIST MODAL ───────────────────────────────────────
    function initWaitlistModal() {
        const overlay  = document.getElementById( 'waitlist-modal' );
        const form     = document.getElementById( 'waitlist-form' );
        const success  = document.getElementById( 'waitlist-success' );
        const errBox   = document.getElementById( 'waitlist-error' );
        const submitBtn = form ? form.querySelector( '.lp-form__submit' ) : null;
        const submitLabel  = submitBtn ? submitBtn.querySelector( '.js-submit-label' )  : null;
        const submitSpin   = submitBtn ? submitBtn.querySelector( '.js-submit-spin' )   : null;

        if ( ! overlay ) return;

        // Open modal — any element with data-modal="waitlist"
        document.querySelectorAll( '[data-modal="waitlist"]' ).forEach( trigger => {
            trigger.addEventListener( 'click', e => {
                e.preventDefault();
                openModal();
            } );
        } );

        // Close — overlay click or close button
        overlay.addEventListener( 'click', e => {
            if ( e.target === overlay ) closeModal();
        } );

        const closeBtn = overlay.querySelector( '.lp-modal__close' );
        if ( closeBtn ) closeBtn.addEventListener( 'click', closeModal );

        // Escape key
        document.addEventListener( 'keydown', e => {
            if ( e.key === 'Escape' && overlay.classList.contains( 'lp-modal-overlay--open' ) ) {
                closeModal();
            }
        } );

        function openModal() {
            overlay.classList.add( 'lp-modal-overlay--open' );
            document.body.style.overflow = 'hidden';
            // Focus first field
            setTimeout( () => {
                const first = overlay.querySelector( 'input:not([disabled])' );
                if ( first ) first.focus();
            }, 300 );
        }

        function closeModal() {
            overlay.classList.remove( 'lp-modal-overlay--open' );
            document.body.style.overflow = '';
        }

        if ( ! form ) return;

        // ── Frontend validation ──────────────────────────────
        function validateField( field ) {
            const wrapper = field.closest( '.lp-form__field' );
            if ( ! wrapper ) return true;

            const required = field.hasAttribute( 'required' );
            const type     = field.getAttribute( 'type' ) || 'text';
            let   valid    = true;

            if ( required && ! field.value.trim() ) {
                valid = false;
            } else if ( type === 'email' && field.value.trim() ) {
                valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( field.value.trim() );
            }

            wrapper.classList.toggle( 'lp-form__field--error', ! valid );
            return valid;
        }

        // Live validation on blur
        form.querySelectorAll( 'input, textarea' ).forEach( field => {
            field.addEventListener( 'blur', () => validateField( field ) );
            field.addEventListener( 'input', () => {
                const wrapper = field.closest( '.lp-form__field' );
                if ( wrapper && wrapper.classList.contains( 'lp-form__field--error' ) ) {
                    validateField( field );
                }
            } );
        } );

        // ── Submit ───────────────────────────────────────────
        form.addEventListener( 'submit', async function ( e ) {
            e.preventDefault();

            // Validate all fields
            let allValid = true;
            form.querySelectorAll( 'input[required], textarea[required]' ).forEach( field => {
                if ( ! validateField( field ) ) allValid = false;
            } );
            if ( ! allValid ) return;

            // UI: loading state
            if ( submitBtn )   submitBtn.disabled = true;
            if ( submitLabel ) submitLabel.style.display = 'none';
            if ( submitSpin )  submitSpin.style.display  = 'inline-flex';
            if ( errBox )      errBox.style.display      = 'none';

            try {
                const response = await fetch( form.getAttribute( 'action' ), {
                    method  : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Accept'       : 'application/json',
                        'X-CSRF-TOKEN' : document.querySelector( 'meta[name="csrf-token"]' )?.content || '',
                    },
                    body: JSON.stringify( Object.fromEntries( new FormData( form ) ) ),
                } );

                const data = await response.json();

                if ( data.success ) {
                    form.style.display   = 'none';
                    if ( success ) success.style.display = 'block';
                } else {
                    throw new Error( 'server_error' );
                }
            } catch ( err ) {
                if ( errBox ) errBox.style.display = 'block';
                if ( submitBtn )   submitBtn.disabled = false;
                if ( submitLabel ) submitLabel.style.display = 'inline';
                if ( submitSpin )  submitSpin.style.display  = 'none';
            }
        } );
    }

    // ── INIT ─────────────────────────────────────────────────
    const init = () => {
        initNavbar();
        initReveal();
        initCounters();
        initSecteursTabs();
        initSmoothScroll();
        initWaitlistModal();
    };

    document.readyState === 'loading'
        ? document.addEventListener( 'DOMContentLoaded', init )
        : init();

} )();
