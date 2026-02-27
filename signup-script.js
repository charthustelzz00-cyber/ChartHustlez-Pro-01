/* ========== SIGNUP PAGE SCRIPT ========== */

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=<>{}[]|^~";

// Mini matrix rain for signup background
function initSignupMatrix() {
  const canvas = document.getElementById('signup-canvas');
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

    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00ff00';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(char, x, y);

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.4;
      ctx.fillText(char, x, y - fontSize);
      ctx.globalAlpha = 1;

      if (y > canvas.height && Math.random() > 0.98) {
        drops[i] = Math.random() * -10;
      }
      drops[i] += 0.3 + Math.random() * 0.3;
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// Form submission - connected to Supabase
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value;
  const message = messageInput.value.trim();

  if (!name || !email || !subject || !message) {
    showStatus('Please complete all fields.', 'error');
    return;
  }

  // Disable form during submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'TRANSMITTING...';
  showStatus('Sending your request...', '');

  try {
    // Get visitor IP for the booking record
    let ip = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ip = ipData.ip;
    } catch (err) {
      console.warn('Could not fetch IP:', err);
    }

    // Insert booking into Supabase
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        name: name,
        email: email,
        subject: subject,
        message: message,
        ip_address: ip,
        user_agent: navigator.userAgent
      }]);

    if (bookingError) {
      throw bookingError;
    }

    // Also add to email subscribers
    const { error: subscriberError } = await supabase
      .from('email_subscribers')
      .upsert([{
        email: email,
        name: name,
        source: 'booking_form'
      }], { onConflict: 'email' });

    if (subscriberError) {
      console.warn('Subscriber insert warning:', subscriberError);
    }

    showStatus('REQUEST SENT. I\'ll get back to you soon!', 'success');
    e.target.reset();

    // Track booking event for Vercel Analytics
    if (window.si) {
      window.si('event', { name: 'booking_complete', subject: subject });
    }
  } catch (err) {
    console.error('Booking error:', err);
    showStatus('Connection failed. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'SEND REQUEST';
  }
});

function showStatus(message, type) {
  const statusEl = document.getElementById('signup-status');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = 'signup-status' + (type ? ' ' + type : '');
}

// Initialize
document.addEventListener('DOMContentLoaded', initSignupMatrix);
