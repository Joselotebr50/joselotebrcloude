// =========================================================
// JOSELOTEBR — Experiência cinematográfica
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Fallback de imagens ausentes ---------- */
  document.querySelectorAll('img').forEach(img => {
    const showPlaceholder = () => {
      img.style.display = 'none';
      const ph = img.parentElement.querySelector(
        '.portrait-placeholder, .foto-placeholder, .gallery-placeholder'
      );
      if (ph) ph.style.display = 'flex';
    };
    if (img.complete && img.naturalWidth === 0) showPlaceholder();
    img.addEventListener('error', showPlaceholder);
  });

  /* ---------- Header: fundo ao rolar ---------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
  }));

  /* ---------- Condor: indicador de progresso do scroll ---------- */
  const condorMarker = document.getElementById('condorMarker');
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    condorMarker.style.left = (progress * 100) + '%';
  }, { passive: true });

  /* ---------- Canvas: céu estrelado ---------- */
  const starsCanvas = document.getElementById('starsCanvas');
  const sCtx = starsCanvas.getContext('2d');
  let stars = [];

  function resizeCanvas(canvas) {
    const scene = document.querySelector('.hero-pin');
    canvas.width = scene.clientWidth;
    canvas.height = scene.clientHeight;
  }

  function initStars() {
    resizeCanvas(starsCanvas);
    const count = window.innerWidth < 720 ? 70 : 150;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height * 0.75,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.6
    }));
  }

  function drawStars(t) {
    sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase);
      sCtx.beginPath();
      sCtx.fillStyle = `rgba(240,230,210,${0.25 + twinkle * 0.65})`;
      sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sCtx.fill();
    });
  }

  /* ---------- Canvas: partículas douradas ---------- */
  const particlesCanvas = document.getElementById('particlesCanvas');
  const pCtx = particlesCanvas.getContext('2d');
  let particles = [];

  function initParticles() {
    resizeCanvas(particlesCanvas);
    const count = window.innerWidth < 720 ? 55 : 130;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      r: Math.random() * 2 + 0.6,
      speedY: 0.25 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.5 + 0.25
    }));
  }

  function drawParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.drift;
      if (p.y < 0) { p.y = particlesCanvas.height; p.x = Math.random() * particlesCanvas.width; }
      pCtx.beginPath();
      pCtx.fillStyle = `rgba(212,162,76,${p.alpha})`;
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fill();
    });
  }

  function loop(t) {
    drawStars(t);
    drawParticles();
    requestAnimationFrame(loop);
  }

  initStars();
  initParticles();
  requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    initStars();
    initParticles();
  });

  /* ---------- Partículas nas seções com vídeo de fundo ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('.section-particles').forEach(canvas => {
      const section = canvas.closest('.has-bg-video');
      if (!section) return;
      const ctx = canvas.getContext('2d');
      let secParticles = [];

      function resizeSection() {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
      }
      function initSection() {
        resizeSection();
        const count = window.innerWidth < 720 ? 22 : 50;
        secParticles = Array.from({ length: count }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.6 + 0.5,
          speedY: 0.12 + Math.random() * 0.28,
          drift: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.4 + 0.15
        }));
      }
      function drawSection() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        secParticles.forEach(p => {
          p.y -= p.speedY;
          p.x += p.drift;
          if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
          ctx.beginPath();
          ctx.fillStyle = `rgba(212,162,76,${p.alpha})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        requestAnimationFrame(drawSection);
      }
      initSection();
      requestAnimationFrame(drawSection);
      window.addEventListener('resize', initSection);
    });
  }

  /* ---------- GSAP: sequência cinematográfica do hero ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax das montanhas + voo do condor + revelação de Machu Picchu + retrato + título
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-scene',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    heroTl
      .to('.mountains-photo', { y: -70, scale: 1.08, ease: 'none', duration: 1 }, 0)
      .to('.night-overlay', { opacity: 0.35, ease: 'none', duration: 0.6 }, 0.15)
      .to('.cloud-1', { y: -50, x: 30, ease: 'none', duration: 1 }, 0)
      .to('.cloud-2', { y: -30, x: -20, ease: 'none', duration: 1 }, 0)
      .to('.cloud-3', { y: -65, x: 15, ease: 'none', duration: 1 }, 0)
      .to('.condor-fly', { left: '104%', top: '18%', ease: 'none', duration: 0.85 }, 0)
      .to('.machu-picchu', { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 0.5 }, 0.35)
      .to('.jose-portrait', { opacity: 1, y: 0, ease: 'none', duration: 0.35 }, 0.78)
      .to('.hero-content', { opacity: 1, y: 0, ease: 'none', duration: 0.35 }, 0.92);

    // Voo ambiente: padrão "bate-bate-plana", como o condor real
    if (!reduceMotion) {
      const condorFlap = gsap.timeline({ repeat: -1 });
      condorFlap
        .to('#condorFly', { scaleY: 0.86, y: '+=8', duration: 0.28, ease: 'power1.inOut' })
        .to('#condorFly', { scaleY: 1.06, y: '-=14', duration: 0.28, ease: 'power1.inOut' })
        .to('#condorFly', { scaleY: 0.9, y: '+=6', duration: 0.26, ease: 'power1.inOut' })
        .to('#condorFly', { scaleY: 1, y: '-=6', duration: 0.3, ease: 'power1.inOut' })
        .to('#condorFly', { y: '+=10', duration: 2.6, ease: 'sine.inOut' })   // planeio
        .to('#condorFly', { y: '-=10', duration: 2.6, ease: 'sine.inOut' });  // planeio
    }

    // Revelações de seção
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      });
    });

  } else {
    // Fallback sem GSAP: mostra tudo direto
    document.querySelectorAll('.reveal-up, .hero-content, .jose-portrait, .machu-picchu')
      .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

});
