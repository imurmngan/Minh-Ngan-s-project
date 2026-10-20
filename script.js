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

  // Sao nhỏ xuất hiện quanh chú mèo, có chuyển động nhẹ và không gây rối mắt.
  const starField = document.querySelector('.star-field');
  if (starField && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const symbols = ['✦', '✧', '⋆', '·'];
    for (let i = 0; i < 9; i += 1) {
      const star = document.createElement('span');
      star.textContent = symbols[i % symbols.length];
      star.className = 'generated-star';
      star.style.left = (8 + ((i * 29) % 84)) + '%';
      star.style.top = (8 + ((i * 37) % 82)) + '%';
      star.style.animationDelay = (-i * 0.43) + 's';
      star.style.fontSize = (0.65 + (i % 3) * 0.35) + 'rem';
      starField.appendChild(star);
    }
  }

  // Nhấn vào minh hoạ mèo để tạo một nhịp lấp lánh nhỏ.
  const heroCat = document.querySelector('.hero-cat');
  if (heroCat && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroCat.style.cursor = 'pointer';
    heroCat.setAttribute('tabindex', '0');
    heroCat.setAttribute('role', 'button');
    heroCat.setAttribute('aria-label', 'Chạm vào chú mèo để xem hiệu ứng lấp lánh');
    const sparkle = () => {
      heroCat.classList.remove('cat-popped');
      void heroCat.getBoundingClientRect();
      heroCat.classList.add('cat-popped');
      window.setTimeout(() => heroCat.classList.remove('cat-popped'), 700);
    };
    heroCat.addEventListener('click', sparkle);
    heroCat.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        sparkle();
      }
    });
  }

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