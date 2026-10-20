(() => {
  const progress = document.getElementById('progress');
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const body = document.body;

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = amount + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  toggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    icon.textContent = isDark ? '☀' : '☾';
    toggle.setAttribute('aria-label', isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  });

  // Hiệu ứng nghiêng rất nhẹ theo con trỏ, chỉ bật trên thiết bị có chuột.
  const art = document.querySelector('.hero-art');
  if (art && window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    art.addEventListener('pointermove', event => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      art.style.backgroundPosition = (50 + x * 4) + '% ' + (50 + y * 4) + '%';
    });
    art.addEventListener('pointerleave', () => { art.style.backgroundPosition = ''; });
  }
})();