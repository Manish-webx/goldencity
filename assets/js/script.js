// GSAP Plugins – register before Lenis init
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Proxy ScrollTrigger to use Lenis scroll position
ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
        if (arguments.length) {
            lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
    },
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.body.style.transform ? 'transform' : 'fixed'
});

// Keep ScrollTrigger in sync with Lenis ticks
lenis.on('scroll', () => ScrollTrigger.update());

// Initial refresh after everything loads
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Lenis Sync
    const offcanvas = document.getElementById('offcanvasNavbar');
    if (offcanvas) {
        offcanvas.addEventListener('show.bs.offcanvas', () => {
            lenis.stop();
        });
        offcanvas.addEventListener('hidden.bs.offcanvas', () => {
            lenis.start();
        });
        
        // Close menu on link click
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const modal = bootstrap.Offcanvas.getInstance(offcanvas);
                if (modal) modal.hide();
            });
        });
    }

    // Hero Animations
    gsap.from('.fade-up', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power4.out',
        delay: 0.5
    });

    gsap.to('.parallax-img', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 150,
        ease: 'none'
    });

    // Reveal Left
    gsap.utils.toArray('.reveal-left').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            x: -80,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Reveal Right
    gsap.utils.toArray('.reveal-right').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            x: 80,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Reveal Up
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        const delay = elem.dataset.delay || 0;
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            delay: delay,
            ease: 'power3.out'
        });
    });

    // Center Reveal
    gsap.utils.toArray('.center-reveal').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            scale: 0.95,
            opacity: 0,
            duration: 1.5,
            ease: 'expo.out'
        });
    });

    // Workflow Line Animation
    const workflowSteps = document.querySelectorAll('.step-modern');
    if (workflowSteps.length > 0) {
        gsap.from('.step-modern', {
            scrollTrigger: {
                trigger: '.workflow-container',
                start: 'top 80%'
            },
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        });
        
        gsap.from('.line-bg', {
            scrollTrigger: {
                trigger: '.workflow-container',
                start: 'top 80%'
            },
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.5,
            ease: 'power2.inOut'
        });
    }

    // Smooth Anchor Scroll Integration with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                lenis.scrollTo(targetElem, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

});

// Refresh ScrollTrigger on window resize and image loads
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Periodic refresh to handle dynamic images
setTimeout(() => {
    ScrollTrigger.refresh();
}, 2000);

// Continuous RAF Loop for Lenis (Alternative to ticker for stability)
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
