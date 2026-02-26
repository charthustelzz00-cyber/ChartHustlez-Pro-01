/* ========== ADMIN DASHBOARD SCRIPT ========== */

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=<>{}[]|^~";

// ========== MATRIX RAIN (lightweight background) ==========
function initMatrixBg(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(0).map(() => Math.random() * -50);

  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(0).map(() => Math.random() * -50);
  });

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6bff2a';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(char, x, y);

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3;
      ctx.fillText(char, x, y - fontSize);
      ctx.globalAlpha = 1;

      if (y > canvas.height && Math.random() > 0.98) {
        drops[i] = Math.random() * -10;
      }
      drops[i] += 0.2 + Math.random() * 0.2;
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// ========== AUTH GATE ==========
function initAuthGate() {
  const authGate = document.getElementById('auth-gate');
  const authForm = document.getElementById('auth-form');
  const authStatus = document.getElementById('auth-status');
  const authBtn = document.getElementById('auth-btn');
  const dashboard = document.getElementById('dashboard');

  // Check if already authenticated this session
  const savedKey = sessionStorage.getItem('charthustlez-admin-key');
  if (savedKey) {
    authGate.classList.add('hidden');
    dashboard.classList.remove('hidden');
    initDashboard(savedKey);
    return;
  }

  // Start matrix rain on auth screen
  initMatrixBg('auth-canvas');

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const keyInput = document.getElementById('auth-key');
    const key = keyInput.value.trim();

    if (!key) {
      showAuthStatus('Access key required.', 'error');
      return;
    }

    authBtn.disabled = true;
    authBtn.textContent = 'VERIFYING...';
    showAuthStatus('Authenticating...', '');

    try {
      // Verify key by hitting the API
      const res = await fetch('/api/admin-insights?key=' + encodeURIComponent(key));

      if (res.ok) {
        showAuthStatus('ACCESS GRANTED', 'success');
        sessionStorage.setItem('charthustlez-admin-key', key);

        setTimeout(() => {
          authGate.classList.add('hidden');
          dashboard.classList.remove('hidden');
          initDashboard(key);
        }, 600);
      } else if (res.status === 401) {
        showAuthStatus('ACCESS DENIED - Invalid key', 'error');
        keyInput.value = '';
        keyInput.focus();
      } else {
        showAuthStatus('Server error. Try again.', 'error');
      }
    } catch (err) {
      showAuthStatus('Connection failed.', 'error');
    } finally {
      authBtn.disabled = false;
      authBtn.textContent = 'AUTHENTICATE';
    }
  });

  function showAuthStatus(msg, type) {
    authStatus.textContent = msg;
    authStatus.className = 'auth-status' + (type ? ' ' + type : '');
  }
}

// ========== DASHBOARD ==========
let adminKey = '';

function initDashboard(key) {
  adminKey = key;

  initMatrixBg('dash-canvas');
  initClock();
  initRefreshBtn();
  loadInsights();
}

// Live clock
function initClock() {
  const clockEl = document.getElementById('dash-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  update();
  setInterval(update, 1000);
}

// Refresh button
function initRefreshBtn() {
  const btn = document.getElementById('refresh-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.classList.add('spinning');
    loadInsights().finally(() => {
      setTimeout(() => btn.classList.remove('spinning'), 800);
    });
  });
}

// ========== FETCH INSIGHTS ==========
async function loadInsights() {
  const loading = document.getElementById('dash-loading');
  const stats = document.getElementById('stats-section');
  const charts = document.getElementById('charts-section');
  const table = document.getElementById('table-section');

  loading.classList.remove('hidden');
  stats.classList.add('hidden');
  charts.classList.add('hidden');
  table.classList.add('hidden');

  try {
    const res = await fetch('/api/admin-insights?key=' + encodeURIComponent(adminKey));
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();

    if (data.success) {
      renderStats(data.insights);
      renderDailyChart(data.insights.dailyBreakdown);
      renderHourlyChart(data.insights.hourlyBreakdown);
      renderGrowth(data.insights);
      renderTable(data.insights.latestSignups);
      renderFooter(data.generatedAt);

      loading.classList.add('hidden');
      stats.classList.remove('hidden');
      charts.classList.remove('hidden');
      table.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Failed to load insights:', err);
    loading.querySelector('span').textContent = 'Failed to decrypt data. Retrying...';
    setTimeout(loadInsights, 3000);
  }
}

// ========== RENDER STATS ==========
function renderStats(insights) {
  // Total
  animateValue('val-total', insights.total);
  setText('sub-total', insights.avgPerDay + ' avg/day', 'neutral');

  // Today
  animateValue('val-today', insights.today);
  if (insights.yesterday > 0) {
    const diff = insights.today - insights.yesterday;
    const dir = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
    const arrow = diff > 0 ? '+' : '';
    setText('sub-today', arrow + diff + ' vs yesterday', dir);
  } else {
    setText('sub-today', 'Yesterday: ' + insights.yesterday, 'neutral');
  }

  // Week
  animateValue('val-week', insights.thisWeek);
  if (insights.weeklyGrowth !== null) {
    const g = parseFloat(insights.weeklyGrowth);
    const dir = g > 0 ? 'up' : g < 0 ? 'down' : 'neutral';
    const arrow = g > 0 ? '+' : '';
    setText('sub-week', arrow + insights.weeklyGrowth + '% vs prev', dir);
  } else {
    setText('sub-week', 'No prior data', 'neutral');
  }

  // Month
  animateValue('val-month', insights.thisMonth);
  if (insights.monthlyGrowth !== null) {
    const g = parseFloat(insights.monthlyGrowth);
    const dir = g > 0 ? 'up' : g < 0 ? 'down' : 'neutral';
    const arrow = g > 0 ? '+' : '';
    setText('sub-month', arrow + insights.monthlyGrowth + '% vs prev', dir);
  } else {
    setText('sub-month', 'No prior data', 'neutral');
  }

  // Avg
  animateValue('val-avg', parseFloat(insights.avgPerDay), true);
  setText('sub-avg', 'Last 30 days', 'neutral');

  // Peak
  const peakCount = insights.peakDay.count;
  animateValue('val-peak', peakCount);
  setText('sub-peak', insights.peakDay.date !== 'N/A' ? insights.peakDay.date : '--', 'neutral');
}

function animateValue(elId, target, isFloat) {
  const el = document.getElementById(elId);
  if (!el) return;
  const duration = 900;
  const start = performance.now();
  const from = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (target - from) * eased;
    el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function setText(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.className = 'stat-sub' + (type ? ' ' + type : '');
}

// ========== CANVAS BAR CHART (Daily) ==========
function renderDailyChart(dailyBreakdown) {
  const canvas = document.getElementById('chart-daily');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const pad = { top: 20, right: 10, bottom: 40, left: 45 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const data = dailyBreakdown;
  const maxVal = Math.max(...data.map(d => d.count), 1);

  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6bff2a';
  const primaryRgb = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim() || '107,255,42';

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  const gridLines = 4;
  ctx.strokeStyle = 'rgba(' + primaryRgb + ', 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();

    // Y-axis labels
    const val = Math.round(maxVal - (maxVal / gridLines) * i);
    ctx.fillStyle = 'rgba(' + primaryRgb + ', 0.35)';
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(val.toString(), pad.left - 8, y + 4);
  }

  // Bars
  const barGap = 2;
  const barWidth = Math.max((chartW / data.length) - barGap, 2);

  data.forEach((d, i) => {
    const barH = (d.count / maxVal) * chartH;
    const x = pad.left + i * (barWidth + barGap);
    const y = pad.top + chartH - barH;

    // Bar glow
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = d.count > 0 ? 6 : 0;
    ctx.fillStyle = d.count > 0 ? primaryColor : 'rgba(' + primaryRgb + ', 0.1)';
    ctx.fillRect(x, y, barWidth, barH || 1);
    ctx.shadowBlur = 0;

    // X-axis labels (every 5th day or first/last)
    if (i === 0 || i === data.length - 1 || i % 5 === 0) {
      ctx.fillStyle = 'rgba(' + primaryRgb + ', 0.35)';
      ctx.font = '9px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      const label = d.date.slice(5); // MM-DD
      ctx.save();
      ctx.translate(x + barWidth / 2, pad.top + chartH + 12);
      ctx.rotate(-0.4);
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }
  });

  // Weekly growth badge
  const weekGrowthEl = document.getElementById('chart-weekly-growth');
  if (weekGrowthEl) {
    const last7 = data.slice(-7).reduce((s, d) => s + d.count, 0);
    const prev7 = data.slice(-14, -7).reduce((s, d) => s + d.count, 0);
    if (prev7 > 0) {
      const g = ((last7 - prev7) / prev7 * 100).toFixed(1);
      const arrow = parseFloat(g) > 0 ? '+' : '';
      weekGrowthEl.textContent = arrow + g + '% this week';
      weekGrowthEl.className = 'chart-growth ' + (parseFloat(g) >= 0 ? 'up' : 'down');
    } else {
      weekGrowthEl.textContent = last7 + ' this week';
      weekGrowthEl.className = 'chart-growth up';
    }
  }
}

// ========== CANVAS BAR CHART (Hourly) ==========
function renderHourlyChart(hourlyBreakdown) {
  const canvas = document.getElementById('chart-hourly');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  const pad = { top: 20, right: 10, bottom: 30, left: 35 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const data = hourlyBreakdown;
  const maxVal = Math.max(...data.map(d => d.count), 1);

  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6bff2a';
  const primaryRgb = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim() || '107,255,42';

  ctx.clearRect(0, 0, W, H);

  // Grid
  const gridLines = 3;
  ctx.strokeStyle = 'rgba(' + primaryRgb + ', 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();

    const val = Math.round(maxVal - (maxVal / gridLines) * i);
    ctx.fillStyle = 'rgba(' + primaryRgb + ', 0.35)';
    ctx.font = '9px "Share Tech Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(val.toString(), pad.left - 6, y + 3);
  }

  // Bars
  const barGap = 2;
  const barWidth = Math.max((chartW / 24) - barGap, 3);
  const currentHour = new Date().getHours();

  data.forEach((d, i) => {
    const barH = (d.count / maxVal) * chartH;
    const x = pad.left + i * (barWidth + barGap);
    const y = pad.top + chartH - barH;

    const isCurrent = d.hour === currentHour;

    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = isCurrent ? 10 : (d.count > 0 ? 4 : 0);
    ctx.fillStyle = isCurrent
      ? '#fff'
      : (d.count > 0 ? primaryColor : 'rgba(' + primaryRgb + ', 0.08)');
    ctx.fillRect(x, y, barWidth, barH || 1);
    ctx.shadowBlur = 0;

    // Labels every 3 hours
    if (d.hour % 3 === 0) {
      ctx.fillStyle = 'rgba(' + primaryRgb + ', 0.35)';
      ctx.font = '8px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barWidth / 2, pad.top + chartH + 14);
    }
  });
}

// ========== GROWTH COMPARISON ==========
function renderGrowth(insights) {
  const thisWeek = insights.thisWeek || 0;
  const prevWeek = insights.prevWeek || 0;
  const thisMonth = insights.thisMonth || 0;
  const prevMonth = insights.prevMonth || 0;

  const weekMax = Math.max(thisWeek, prevWeek, 1);
  const monthMax = Math.max(thisMonth, prevMonth, 1);

  // Weekly bars
  setBarWidth('bar-this-week', (thisWeek / weekMax) * 100);
  setBarWidth('bar-prev-week', (prevWeek / weekMax) * 100);
  document.getElementById('val-bar-this-week').textContent = thisWeek;
  document.getElementById('val-bar-prev-week').textContent = prevWeek;

  // Monthly bars
  setBarWidth('bar-this-month', (thisMonth / monthMax) * 100);
  setBarWidth('bar-prev-month', (prevMonth / monthMax) * 100);
  document.getElementById('val-bar-this-month').textContent = thisMonth;
  document.getElementById('val-bar-prev-month').textContent = prevMonth;

  // Growth rates
  const weeklyRateEl = document.getElementById('growth-weekly-rate');
  if (insights.weeklyGrowth !== null) {
    const g = parseFloat(insights.weeklyGrowth);
    const arrow = g > 0 ? '+' : '';
    weeklyRateEl.textContent = arrow + insights.weeklyGrowth + '% growth';
    weeklyRateEl.className = 'growth-rate ' + (g >= 0 ? 'up' : 'down');
  } else {
    weeklyRateEl.textContent = 'No prior data';
    weeklyRateEl.className = 'growth-rate neutral';
  }

  const monthlyRateEl = document.getElementById('growth-monthly-rate');
  if (insights.monthlyGrowth !== null) {
    const g = parseFloat(insights.monthlyGrowth);
    const arrow = g > 0 ? '+' : '';
    monthlyRateEl.textContent = arrow + insights.monthlyGrowth + '% growth';
    monthlyRateEl.className = 'growth-rate ' + (g >= 0 ? 'up' : 'down');
  } else {
    monthlyRateEl.textContent = 'No prior data';
    monthlyRateEl.className = 'growth-rate neutral';
  }
}

function setBarWidth(id, pct) {
  const el = document.getElementById(id);
  if (!el) return;
  // Trigger animation by setting width after a frame
  requestAnimationFrame(() => {
    el.style.width = Math.max(pct, 2) + '%';
  });
}

// ========== SIGNUPS TABLE ==========
function renderTable(signups) {
  const tbody = document.getElementById('signups-tbody');
  const countEl = document.getElementById('table-count');
  if (!tbody) return;

  countEl.textContent = 'Showing ' + signups.length + ' most recent';
  tbody.innerHTML = '';

  signups.forEach((s, i) => {
    const tr = document.createElement('tr');
    const date = new Date(s.created_at);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Mask email for privacy
    const emailParts = s.email.split('@');
    const masked = emailParts[0].slice(0, 3) + '***@' + emailParts[1];

    tr.innerHTML =
      '<td>' + (i + 1) + '</td>' +
      '<td>' + escapeHtml(s.name) + '</td>' +
      '<td>' + escapeHtml(masked) + '</td>' +
      '<td>' + dateStr + '</td>' +
      '<td>' + timeStr + '</td>';

    tbody.appendChild(tr);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== FOOTER ==========
function renderFooter(generatedAt) {
  const el = document.getElementById('dash-generated-at');
  if (!el) return;
  const date = new Date(generatedAt);
  el.textContent = 'Data generated: ' + date.toLocaleString();
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', initAuthGate);

// Redraw charts on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Only redraw if dashboard is visible
    if (!document.getElementById('dashboard').classList.contains('hidden')) {
      loadInsights();
    }
  }, 300);
});
