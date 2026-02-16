document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !email) {
    alert("Please complete all fields.");
    return;
  }

  console.log("Signup:", { name, email });

  alert("Welcome to ChartHustlez 🚀");
  e.target.reset();
});