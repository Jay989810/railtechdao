<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RailTech DAO Login</title>
</head>
<body>
  <h2>Login to RailTech DAO</h2>

  <form id="loginForm">
    <input id="loginEmail" type="email" placeholder="Email" required>
    <input id="loginPassword" type="password" placeholder="Password" required>
    <button id="loginBtn" type="submit"
      class="g-recaptcha"
      data-sitekey="6LcnXc4rAAAAAAM_oR9XZ_01R6QwBM18AGf33fhD"
      data-callback="onSubmit"
      data-action="login">
      Login
    </button>
  </form>

  <!-- Load reCAPTCHA v3 API -->
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>

  <!-- Supabase setup (replace with your details) -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
  <script>
    const supabaseUrl = "YOUR_SUPABASE_URL";
    const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // reCAPTCHA callback
    async function onSubmit(token) {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      // Proceed with Supabase login only if captcha succeeds
      if (token) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          alert(error.message);
        } else {
          window.location.href = "dashboard.html"; // redirect after login
        }
      } else {
        alert("Captcha verification failed, please try again.");
      }
    }
  </script>
</body>
</html>
