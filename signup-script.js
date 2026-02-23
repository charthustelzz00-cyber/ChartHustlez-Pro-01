const form = document.getElementById('signup-form');
const heading = document.querySelector('.signup-box h1');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const messageEl = document.getElementById('form-message');
const toggleMode = document.getElementById('toggle-mode');

let isLoginMode = false;

function showMessage(text, isError) {
  messageEl.textContent = text;
  messageEl.style.display = 'block';
  messageEl.style.color = isError ? '#ff4444' : 'var(--primary, #39ff14)';
}

function hideMessage() {
  messageEl.style.display = 'none';
}

// Toggle between register and login
toggleMode.addEventListener('click', function (e) {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  hideMessage();

  if (isLoginMode) {
    heading.textContent = 'LOG IN';
    nameInput.style.display = 'none';
    nameInput.removeAttribute('required');
    passwordInput.placeholder = 'Password';
    submitBtn.textContent = 'LOG IN';
    toggleMode.textContent = 'Sign up';
    toggleMode.parentElement.firstChild.textContent = "Don't have an account? ";
  } else {
    heading.textContent = 'JOIN THE MATRIX';
    nameInput.style.display = '';
    nameInput.setAttribute('required', '');
    passwordInput.placeholder = 'Password (min 8 chars)';
    submitBtn.textContent = 'ENTER';
    toggleMode.textContent = 'Log in';
    toggleMode.parentElement.firstChild.textContent = 'Already have an account? ';
  }
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  hideMessage();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage('Please complete all fields.', true);
    return;
  }

  if (!isLoginMode && !nameInput.value.trim()) {
    showMessage('Please enter your name.', true);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = isLoginMode ? 'LOGGING IN...' : 'CREATING ACCOUNT...';

  try {
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const body = isLoginMode
      ? { email, password }
      : { name: nameInput.value.trim(), email, password };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || 'Something went wrong.', true);
      return;
    }

    showMessage(data.message, false);
    form.reset();
  } catch (err) {
    showMessage('Network error. Please try again.', true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isLoginMode ? 'LOG IN' : 'ENTER';
  }
});
