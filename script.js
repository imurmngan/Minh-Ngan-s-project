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

  // Mèo mở/đóng mini player; các nút đổi bài cập nhật trình phát Spotify.
  const musicCatButton = document.getElementById('musicCatButton');
  const musicPlaylist = document.getElementById('musicPlaylist');
  if (musicCatButton && musicPlaylist) {
    musicCatButton.addEventListener('click', () => {
      const willOpen = musicPlaylist.hidden;
      musicPlaylist.hidden = !willOpen;
      musicCatButton.setAttribute('aria-expanded', String(willOpen));
      musicCatButton.classList.toggle('playlist-open', willOpen);
    });
  }

  const tracks = [
    { title: 'Attention', artist: 'Charlie Puth', id: '5cF0dROlMOK5uNZtivgu50', url: 'https://open.spotify.com/search/attention?flow_ctx=b5ce3cbc-3790-45bd-841b-01bd87fedafe%3A1792486353' },
    { title: 'Từng Quen', artist: 'Wren Evans, itsnk', id: '7f4Qg1YqBvgIDqyVdRZ4o4', url: 'https://open.spotify.com/intl-vi/album/2M0vYJZddXn6qRpeVtGvDZ' },
    { title: 'toxic till the end', artist: 'ROSÉ', id: '3cgCBNO29q6BgxqHDA7peh', url: 'https://open.spotify.com/search/toxic%20till%20the%20end' }
  ];
  const spotifyEmbed = document.getElementById('spotifyEmbed');
  const spotifyTrackNumber = document.getElementById('spotifyTrackNumber');
  const spotifyTrackTitle = document.getElementById('spotifyTrackTitle');
  const spotifyTrackArtist = document.getElementById('spotifyTrackArtist');
  const spotifyOpenLink = document.getElementById('spotifyOpenLink');
  const spotifyTrackCount = document.getElementById('spotifyTrackCount');
  const trackButtons = Array.from(document.querySelectorAll('.spotify-track'));
  let currentTrack = 0;

  const selectTrack = (index) => {
    if (!tracks.length) return;
    currentTrack = (index + tracks.length) % tracks.length;
    const track = tracks[currentTrack];
    if (spotifyEmbed) {
      spotifyEmbed.src = 'https://open.spotify.com/embed/track/' + track.id + '?utm_source=generator&theme=1';
      spotifyEmbed.title = 'Trình phát Spotify — ' + track.title;
    }
    if (spotifyTrackNumber) spotifyTrackNumber.textContent = String(currentTrack + 1).padStart(2, '0') + ' / ' + String(tracks.length).padStart(2, '0');
    if (spotifyTrackTitle) spotifyTrackTitle.textContent = track.title;
    if (spotifyTrackArtist) spotifyTrackArtist.textContent = track.artist;
    if (spotifyOpenLink) spotifyOpenLink.href = track.url;
    if (spotifyTrackCount) spotifyTrackCount.textContent = String(currentTrack + 1).padStart(2, '0') + ' — ' + String(tracks.length).padStart(2, '0');
    trackButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === currentTrack;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  };
  const previousButton = document.getElementById('previousTrack');
  const nextButton = document.getElementById('nextTrack');

  // Delegated click handlers are resilient to styling/layout changes on desktop.
  if (previousButton) previousButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    selectTrack(currentTrack - 1);
  });
  if (nextButton) nextButton.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    selectTrack(currentTrack + 1);
  });
  trackButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      selectTrack(Number(button.dataset.track));
    });
  });


  // Fun facts: each opening reveals one randomly selected fact, verbatim.
  const envelopeButton = document.getElementById('envelopeButton');
  const funFactText = document.getElementById('funFactText');
  const envelopeHint = document.getElementById('envelopeHint');
  if (envelopeButton && funFactText) {
    const funFacts = [
      'I’m Catholic✝️',
      'Có thể gọi mình là Mân Nghinh🎀',
      'Tên tiếng Anh từ nhỏ tới lớn là Lucy🌷',
      'Mình siu thích Hachiware và Momonga',
      '90% cơ thể là nước mắt🥺',
      'Ovtk giai đoạn cuối☠️',
      'Siu thích các món có thịt bò ( bún bò, phở bò, beefsteak,…)🥩',
      'Toi iu freeze trà xanh của Highlands🍵',
      'I can be a coder👩‍💻, editor💻, dancer👯‍♀️, actress🎬, artist🎨, designer👩‍🎨, or just simply a girl🫣'
    ];
    let isEnvelopeOpen = false;
    let previousFactIndex = -1;
    envelopeButton.addEventListener('click', () => {
      isEnvelopeOpen = !isEnvelopeOpen;
      envelopeButton.classList.toggle('is-open', isEnvelopeOpen);
      envelopeButton.setAttribute('aria-expanded', String(isEnvelopeOpen));
      envelopeButton.setAttribute('aria-label', isEnvelopeOpen ? 'Đóng phong bì fun facts' : 'Mở phong bì fun facts');
      if (isEnvelopeOpen) {
        let nextIndex = Math.floor(Math.random() * funFacts.length);
        if (funFacts.length > 1 && nextIndex === previousFactIndex) {
          nextIndex = (nextIndex + 1 + Math.floor(Math.random() * (funFacts.length - 1))) % funFacts.length;
        }
        previousFactIndex = nextIndex;
        funFactText.textContent = funFacts[nextIndex];
        if (envelopeHint) envelopeHint.innerHTML = 'CLOSE THE LETTER <span aria-hidden="true">↙</span>';
      } else {
        if (envelopeHint) envelopeHint.innerHTML = 'OPEN A LITTLE SECRET <span aria-hidden="true">↗</span>';
      }
    });
  }

})();