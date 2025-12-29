import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class Animations {
  constructor() {
    this.init();
  }

  init() {
    this.hideLoadingScreen();
    this.initNavbarAnimations();
    this.initScrollAnimations();
    this.initStatCounters();
    this.initProjectCardAnimations();
    this.initMobileMenu();
    this.initSmoothScrolling();
    this.initMagneticButtons();
    this.initCursorEffects();
    this.initParallaxEffects();
  }

  hideLoadingScreen() {
    window.addEventListener('load', () => {
      const loadingScreen = document.getElementById('loading-screen');
      
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.inOut',
        onComplete: () => {
          loadingScreen.classList.add('hidden');
          this.playHeroSequence();
        }
      });
    });
  }

  playHeroSequence() {
    const tl = gsap.timeline();

    // Badge animation
    tl.to('.hero-badge', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    // Title line reveal
    .to('.title-line', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power4.out'
    }, '-=0.4')
    // Name reveal
    .to('.title-name', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=0.6')
    // Subtitle reveal
    .to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    // Word by word reveal
    .to('.hero-description .word', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power3.out'
    }, '-=0.3')
    // Buttons reveal
    .to('.hero-buttons', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.3')
    // Scroll indicator
    .to('.scroll-indicator', {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.3');
  }

  initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(elem => {
      elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(elem, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      elem.addEventListener('mouseleave', () => {
        gsap.to(elem, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }

  initCursorEffects() {
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
    document.body.appendChild(cursor);

    const cursorDot = cursor.querySelector('.cursor-dot');
    const cursorOutline = cursor.querySelector('.cursor-outline');

    // Add cursor styles
    const style = document.createElement('style');
    style.textContent = `
      .custom-cursor { pointer-events: none; position: fixed; z-index: 99999; }
      .cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        background: #fd79a8;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99999;
        mix-blend-mode: difference;
      }
      .cursor-outline {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid #6c5ce7;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99998;
        opacity: 0.5;
        transition: width 0.3s, height 0.3s, opacity 0.3s, border-color 0.3s;
      }
      .cursor-hover .cursor-outline {
        width: 70px;
        height: 70px;
        opacity: 0.8;
        border-color: #fd79a8;
      }
      .cursor-hover .cursor-dot {
        transform: translate(-50%, -50%) scale(2);
      }
      @media (max-width: 768px) { .custom-cursor { display: none; } }
    `;
    document.head.appendChild(style);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      gsap.to(cursorDot, {
        left: mouseX,
        top: mouseY,
        duration: 0.1
      });
    });

    // Smooth follow
    const animateOutline = () => {
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    };
    animateOutline();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-category, .timeline-content, .stat');
    hoverElements.forEach(elem => {
      elem.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      elem.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
  }

  initParallaxEffects() {
    // Parallax for project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: i % 2 === 0 ? -30 : 30,
        ease: 'none'
      });
    });
  }

  initNavbarAnimations() {
    const navbar = document.getElementById('navbar');
    
    ScrollTrigger.create({
      start: 'top -100',
      onUpdate: (self) => {
        if (self.direction === 1) {
          navbar.classList.add('scrolled');
        } else if (window.scrollY < 100) {
          navbar.classList.remove('scrolled');
        }
      }
    });

    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  initScrollAnimations() {
    // Section titles with clip reveal
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 80,
        scale: 0.9,
        rotationX: 20,
        duration: 1.2,
        ease: 'power4.out'
      });
    });

    // About section - immediate visibility
    gsap.fromTo('.about-text p', 
      { opacity: 0, y: 60 },
      {
        scrollTrigger: {
          trigger: '.about',
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
      }
    );

    // Stats with bounce
    gsap.fromTo('.stat',
      { opacity: 0, y: 50, scale: 0.7 },
      {
        scrollTrigger: {
          trigger: '.about-stats',
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(2)'
      }
    );

    // Experience timeline
    gsap.from('.timeline-item', {
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -100,
      rotationY: -15,
      duration: 1,
      stagger: 0.3,
      ease: 'power4.out'
    });

    // Projects with 3D effect
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 120,
      rotationX: 25,
      scale: 0.85,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power4.out',
      transformOrigin: 'center bottom'
    });

    // Skills with wave
    gsap.from('.skill-category', {
      scrollTrigger: {
        trigger: '.skills-container',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 100,
      scale: 0.85,
      rotation: 5,
      duration: 1,
      stagger: { each: 0.15, from: 'start' },
      ease: 'power4.out'
    });

    // Contact
    gsap.from('.contact-info', {
      scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -100,
      duration: 1,
      ease: 'power4.out'
    });

    gsap.from('.contact-form', {
      scrollTrigger: {
        trigger: '.contact-content',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: 100,
      duration: 1,
      ease: 'power4.out'
    });
  }

  initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(stat, {
            innerHTML: target,
            duration: 2.5,
            ease: 'power1.out',
            snap: { innerHTML: 1 },
            onUpdate: function() {
              stat.innerHTML = Math.round(this.targets()[0].innerHTML);
            }
          });
        },
        once: true
      });
    });
  }

  initProjectCardAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const placeholder = card.querySelector('.project-placeholder');
      const info = card.querySelector('.project-info');

      card.addEventListener('mouseenter', () => {
        gsap.to(placeholder, { scale: 1.15, duration: 0.5, ease: 'power2.out' });
        gsap.to(info, { y: -10, duration: 0.3, ease: 'power2.out' });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(placeholder, { scale: 1, duration: 0.5, ease: 'power2.out' });
        gsap.to(info, { y: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
      });

      // 3D tilt
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y - rect.height / 2) / 15;
        const rotateY = (rect.width / 2 - x) / 15;
        gsap.to(card, {
          rotateX, rotateY,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });
    });
  }

  initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (isActive) {
        gsap.from(navLinkItems, {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: target, offsetY: 80 },
            ease: 'power3.inOut'
          });
        }
      });
    });
  }
}
