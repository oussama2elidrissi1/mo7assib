/**
 * Mo7assib Landing Page — Scripts
 *
 * - Navbar scroll behavior
 * - Intersection Observer scroll reveal
 * - Animated counters
 * - Secteurs tabs
 *
 * @package Mo7assibCore
 */

( function () {
	'use strict';

	// ─── NAVBAR SCROLL ───────────────────────────────────────
	function initNavbar() {
		var nav = document.querySelector( '.lp-nav' );
		if ( ! nav ) { return; }

		function updateNav() {
			if ( window.scrollY > 40 ) {
				nav.classList.add( 'lp-nav--scrolled' );
			} else {
				nav.classList.remove( 'lp-nav--scrolled' );
			}
		}

		window.addEventListener( 'scroll', updateNav, { passive: true } );
		updateNav();
	}

	// ─── SCROLL REVEAL ───────────────────────────────────────
	function initReveal() {
		var items = document.querySelectorAll( '.lp-reveal' );
		if ( ! items.length ) { return; }

		if ( ! window.IntersectionObserver ) {
			items.forEach( function ( el ) { el.classList.add( 'lp-visible' ); } );
			return;
		}

		var observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'lp-visible' );
						observer.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
		);

		items.forEach( function ( el ) { observer.observe( el ); } );
	}

	// ─── COUNTER ANIMATION ───────────────────────────────────
	function animateCounter( el ) {
		var target  = parseFloat( el.getAttribute( 'data-target' ) ) || 0;
		var suffix  = el.getAttribute( 'data-suffix' ) || '';
		var prefix  = el.getAttribute( 'data-prefix' ) || '';
		var decimals = el.getAttribute( 'data-decimals' ) ? parseInt( el.getAttribute( 'data-decimals' ), 10 ) : 0;
		var duration = 1800;
		var start    = null;

		function step( ts ) {
			if ( ! start ) { start = ts; }
			var progress = Math.min( ( ts - start ) / duration, 1 );
			// ease-out cubic
			var ease     = 1 - Math.pow( 1 - progress, 3 );
			var value    = target * ease;
			el.textContent = prefix + value.toFixed( decimals ) + suffix;
			if ( progress < 1 ) {
				requestAnimationFrame( step );
			}
		}

		requestAnimationFrame( step );
	}

	function initCounters() {
		var counters = document.querySelectorAll( '[data-counter]' );
		if ( ! counters.length ) { return; }

		if ( ! window.IntersectionObserver ) {
			counters.forEach( function ( el ) { animateCounter( el ); } );
			return;
		}

		var observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						animateCounter( entry.target );
						observer.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.5 }
		);

		counters.forEach( function ( el ) { observer.observe( el ); } );
	}

	// ─── SECTEURS TABS ───────────────────────────────────────
	function initSecteursTabs() {
		var tabs   = document.querySelectorAll( '.lp-secteurs__tab' );
		var panels = document.querySelectorAll( '.lp-secteurs__panel' );
		if ( ! tabs.length ) { return; }

		tabs.forEach( function ( tab ) {
			tab.addEventListener( 'click', function () {
				var target = this.getAttribute( 'data-tab' );

				tabs.forEach( function ( t ) { t.classList.remove( 'lp-secteurs__tab--active' ); } );
				panels.forEach( function ( p ) { p.classList.remove( 'lp-secteurs__panel--active' ); } );

				this.classList.add( 'lp-secteurs__tab--active' );
				var panel = document.querySelector( '.lp-secteurs__panel[data-panel="' + target + '"]' );
				if ( panel ) {
					panel.classList.add( 'lp-secteurs__panel--active' );
				}
			} );
		} );
	}

	// ─── SMOOTH SCROLL ───────────────────────────────────────
	function initSmoothScroll() {
		document.querySelectorAll( 'a[href^="#"]' ).forEach( function ( anchor ) {
			anchor.addEventListener( 'click', function ( e ) {
				var id = this.getAttribute( 'href' ).slice( 1 );
				var target = document.getElementById( id );
				if ( ! target ) { return; }
				e.preventDefault();
				var offset = 80;
				var top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
				window.scrollTo( { top: top, behavior: 'smooth' } );
			} );
		} );
	}

	// ─── INIT ─────────────────────────────────────────────────
	function init() {
		initNavbar();
		initReveal();
		initCounters();
		initSecteursTabs();
		initSmoothScroll();
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

} )();
