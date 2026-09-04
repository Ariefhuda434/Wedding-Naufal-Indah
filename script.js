/* ==========================================
   WEDDING INVITATION - Premium 07
   JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- CONFIG: GANTI DENGAN URL Apps Script kamu ---------- */
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzVCYCljfHgVvpqqc1jNYDMzI1ID5YyBEtBMcAlsBuQhaT8N3ADbBjMosLinwSySE4lIA/exec'; // contoh: https://script.google.com/macros/s/XXXX/exec

  const cover = document.getElementById('cover');
  const mainContent = document.getElementById('main-content');
  const btnOpen = document.getElementById('btn-open');
  const musicPlayer = document.getElementById('music-player');
  const bgMusic = document.getElementById('bg-music');
  const btnMusic = document.getElementById('btn-music');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  /* ---------- LOCK BODY ---------- */
  document.body.classList.add('locked');

  /* ---------- GUEST NAME FROM URL ---------- */
  const params = new URLSearchParams(window.location.search);
  const guestName = (params.get('untuk') || '').trim();
  const guestNameEl = document.getElementById('guest-name');
  if (guestName) {
    guestNameEl.textContent = guestName;
  }

  /* ---------- COVER REVEAL ---------- */
  setTimeout(() => {
    cover.classList.add('active');
  }, 300);

  /* ---------- OPEN INVITATION ---------- */
  btnOpen.addEventListener('click', () => {
    cover.classList.add('opened');
    document.body.classList.remove('locked');

    setTimeout(() => {
      mainContent.classList.remove('hidden');
      musicPlayer.classList.remove('hidden');

      // Try autoplay music
      bgMusic.play().then(() => {
        btnMusic.classList.add('playing');
      }).catch(() => {
        btnMusic.classList.add('paused');
        btnMusic.style.animation = 'pulse 1.5s infinite';
      });

      // Trigger reveal animations
      initRevealObserver();
      initCountdown();
      initCounters();
      initGallery();
      initRSVP();
    }, 600);
  });

  /* ---------- MUSIC PLAYER ---------- */
  btnMusic.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      btnMusic.classList.add('playing');
      btnMusic.classList.remove('paused');
      btnMusic.style.animation = 'none';
    } else {
      bgMusic.pause();
      btnMusic.classList.remove('playing');
      btnMusic.classList.add('paused');
    }
  });

  // Pause on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !bgMusic.paused) {
      bgMusic.pause();
    }
  });

  /* ---------- SCROLL REVEAL ---------- */
  function initRevealObserver() {
    const elements = document.querySelectorAll('.reveal-element');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;
          setTimeout(() => {
            el.classList.add('visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /* ---------- COUNTDOWN ---------- */
  function initCountdown() {
    const target = new Date('2026-09-20T01:00:00+00:00').getTime();

    function update() {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        document.getElementById('cd-days').textContent = '0';
        document.getElementById('cd-hours').textContent = '0';
        document.getElementById('cd-mins').textContent = '0';
        document.getElementById('cd-secs').textContent = '0';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('cd-days').textContent = days;
      document.getElementById('cd-hours').textContent = hours;
      document.getElementById('cd-mins').textContent = mins;
      document.getElementById('cd-secs').textContent = secs;
    }

    update();
    setInterval(update, 1000);
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          animateCounter(el, 0, target, 2000);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ---------- GALLERY LIGHTBOX ---------- */
  function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img || !img.src) return;
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- AMPLOP TOGGLE ---------- */
  document.getElementById('btn-amplop').addEventListener('click', () => {
    const content = document.getElementById('amplop-content');
    content.classList.toggle('hidden');
  });

  /* ---------- RSVP / GUESTBOOK ---------- */
  function initRSVP() {
    // Load existing comments from Google Sheets
    loadComments();

    document.getElementById('rsvp-prev').addEventListener('click', () => {
      if (page > 1) { page--; renderComments(); }
    });
    document.getElementById('rsvp-next').addEventListener('click', () => {
      const totalPages = Math.max(1, Math.ceil(allComments.length / PER_PAGE));
      if (page < totalPages) { page++; renderComments(); }
    });

    document.getElementById('rsvp-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const message = document.getElementById('rsvp-message').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked').value;
      const submitBtn = document.getElementById('rsvp-form').querySelector('.btn-submit');

      if (!name || !message) return;

      if (!APPS_SCRIPT_URL) {
        setFormStatus('Setup Apps Script URL di script.js terlebih dahulu.', true);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';

      const payload = {
        action: 'add',
        name: name,
        message: message,
        attendance: attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'
      };

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).then(() => {
        // no-cors tidak mengembalikan body; muat ulang daftar dari server
        document.getElementById('rsvp-name').value = '';
        document.getElementById('rsvp-message').value = '';
        setFormStatus('Terima kasih atas ucapan & doa restunya!');
        loadComments();
      }).catch((err) => {
        setFormStatus('Gagal mengirim. Coba lagi.', true);
        console.error(err);
      }).finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim';
      });
    });
  }

  function setFormStatus(msg, isError) {
    let status = document.getElementById('rsvp-status');
    if (!status) {
      status = document.createElement('p');
      status.id = 'rsvp-status';
      status.className = 'rsvp-status';
      document.getElementById('rsvp-form').appendChild(status);
    }
    status.textContent = msg;
    status.style.color = isError ? '#f44336' : '#4caf50';
    setTimeout(() => { status.textContent = ''; }, 5000);
  }

  function loadComments() {
    if (!APPS_SCRIPT_URL) return;
    fetch(APPS_SCRIPT_URL + '?action=read')
      .then(res => res.json())
      .then(rows => {
        rows = rows || [];
        const comments = rows.map(r => ({
          name: r.name || '',
          message: r.message || '',
          attendance: r.attendance || 'Hadir',
          date: formatWaktu(r.waktu)
        }));
        allComments = comments;
        page = 1;
        renderComments();
        updateStats(comments);
      })
      .catch(err => console.error('Gagal memuat ucapan:', err));
  }

  /* ---------- PAGINATION STATE ---------- */
  let allComments = [];
  let page = 1;
  const PER_PAGE = 6;

  function renderComments() {
    const container = document.getElementById('rsvp-comments');
    container.innerHTML = '';

    if (allComments.length === 0) {
      container.innerHTML = '<p class="rsvp-empty">Belum ada ucapan. Jadilah yang pertama!</p>';
      updatePagination();
      return;
    }

    const totalPages = Math.max(1, Math.ceil(allComments.length / PER_PAGE));
    if (page > totalPages) page = totalPages;

    const start = (page - 1) * PER_PAGE;
    const slice = allComments.slice(start, start + PER_PAGE);
    slice.forEach(c => addCommentToDOM(c));

    updatePagination();
  }

  function updatePagination() {
    const totalPages = Math.max(1, Math.ceil(allComments.length / PER_PAGE));
    const info = document.getElementById('rsvp-pageinfo');
    const prevBtn = document.getElementById('rsvp-prev');
    const nextBtn = document.getElementById('rsvp-next');

    if (info) info.textContent = `Halaman ${page} dari ${totalPages}`;
    if (prevBtn) prevBtn.disabled = page <= 1;
    if (nextBtn) nextBtn.disabled = page >= totalPages;

    const pager = document.getElementById('rsvp-pagination');
    if (pager) pager.style.display = allComments.length > PER_PAGE ? 'flex' : 'none';
  }

  function addCommentToDOM(comment) {
    const container = document.getElementById('rsvp-comments');
    const div = document.createElement('div');
    div.className = 'comment-item';

    const badgeClass = comment.attendance === 'Hadir' ? 'badge-hadir' : 'badge-tidak';
    const badgeText = comment.attendance;

    div.innerHTML = `
      <div class="comment-header">
        <span class="comment-name">${escapeHtml(comment.name)}
          <span class="comment-badge ${badgeClass}">${badgeText}</span>
        </span>
        <span class="comment-date">${escapeHtml(comment.date)}</span>
      </div>
      <p class="comment-text">${escapeHtml(comment.message)}</p>
    `;

    container.appendChild(div);
  }

  function updateStats(comments) {
    const hadir = comments.filter(c => c.attendance === 'Hadir').length;
    const tidak = comments.filter(c => c.attendance === 'Tidak Hadir').length;
    document.getElementById('rsvp-hadir').textContent = hadir;
    document.getElementById('rsvp-tidak').textContent = tidak;
  }

  function formatWaktu(input) {
    if (!input) return '';
    input = input.trim();

    // Sudah dalam format dd/MM/yyyy HH:mm[:ss] → buang detik jika ada
    if (/^\d{2}\/\d{2}\/\d{4}/.test(input)) {
      return input.replace(/:\d{2}$/, '');
    }

    // ISO: 2026-09-04T13:23:00.000Z → parse lalu format manual
    const d = new Date(input);
    if (isNaN(d.getTime())) return input; // gagal parse, kembalikan apa adanya

    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});

/* ---------- COPY REKENING ---------- */
function copyRekening(btn) {
  const card = btn.closest('.bank-card');
  const number = card.querySelector('.bank-number').textContent;
  const toast = card.querySelector('.copy-toast');
  navigator.clipboard.writeText(number).then(() => {
    toast.textContent = 'Tersalin.';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
  }).catch(() => {
    toast.textContent = 'Gagal menyalin.';
    toast.style.color = '#f44336';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
  });
}

/* ---------- LIGHTBOX CLOSE ---------- */
function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}
