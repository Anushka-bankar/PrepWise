// ── Auth helpers ──────────────────────────────────────────────
function getUser() {
  return localStorage.getItem('pw_user') || '';
}
function getUserName() {
  const email = getUser();
  if (!email) return 'Friend';
  // extract name part before @
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
function requireAuth() {
  if (!getUser()) { window.location.href = 'login.html'; }
}
function logout() {
  localStorage.removeItem('pw_user');
  window.location.href = 'login.html';
}

// ── Progress tracker ──────────────────────────────────────────
const SECTIONS = ['aptitude', 'hr', 'communication'];

function getProgress() {
  const raw = localStorage.getItem('pw_progress');
  return raw ? JSON.parse(raw) : {};
}
function markSection(section) {
  const p = getProgress();
  p[section] = true;
  localStorage.setItem('pw_progress', JSON.stringify(p));
}
function getProgressPct() {
  const p = getProgress();
  const done = SECTIONS.filter(s => p[s]).length;
  return Math.round((done / SECTIONS.length) * 100);
}
function resetProgress() {
  localStorage.removeItem('pw_progress');
}

// ── Toast notification ────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Navbar: inject user info & active link ────────────────────
function initNav() {
  const userSpan = document.getElementById('nav-user-name');
  if (userSpan) userSpan.textContent = getUserName();

  // Highlight active link
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(a => {
    if (a.href === location.href || location.href.endsWith(a.getAttribute('href'))) {
      a.classList.add('active');
    }
  });

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

// ── Update progress bars wherever shown ──────────────────────
function renderProgressBars() {
  const pct = getProgressPct();
  document.querySelectorAll('.progress-bar').forEach(bar => {
    bar.style.width = pct + '%';
  });
  document.querySelectorAll('.progress-pct').forEach(el => {
    el.textContent = pct + '%';
  });
  document.querySelectorAll('.progress-label').forEach(el => {
    const done = Object.keys(getProgress()).filter(k => getProgress()[k]).length;
    el.textContent = `${done} / ${SECTIONS.length} sections completed`;
  });
}

// ── Run on DOMContentLoaded ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderProgressBars();
});
