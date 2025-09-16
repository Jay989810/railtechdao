// js/register.js

// ---------- CONFIGURE THESE ----------
const SUPABASE_URL = "https://ooxxampqveibgzonglxz.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veHhhbXBxdmVpYmd6b25nbHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTUzNjYsImV4cCI6MjA3MzUzMTM2Nn0.9QrAmTBPiDbVuyLQbmdxwf-LCgDoxT8zmLzowTq7oKA";
// -------------------------------------

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("regForm");
const message = document.getElementById("message");
const libraryAccess = document.getElementById("libraryAccess");
const submitBtn = document.getElementById("submitBtn");

function showMessage(html, type = "info") {
  message.innerHTML = `<div class="alert alert-${type}">${html}</div>`;
}

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  showMessage("Submitting... Please wait.", "info");

  // Collect values
  const full_name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const institution = document.getElementById("institution").value.trim();
  const department = document.getElementById("department").value.trim();
  const student_id = document.getElementById("studentId").value.trim();
  const telegram = document.getElementById("telegram").value.trim();
  const wallet_address = document.getElementById("wallet")
    ? document.getElementById("wallet").value.trim()
    : "";
  const interest_area = document.getElementById("interest").value;
  const consent = document.getElementById("consent").checked;

  // Validate required fields
  if (!full_name || !email || !institution || !consent) {
    showMessage(
      "Please fill in Full Name, Email, Institution and accept the consent.",
      "danger"
    );
    submitBtn.disabled = false;
    return;
  }

  try {
    // ✅ 1. Check if user already exists by email
    const { data: existing, error: checkError } = await supabaseClient
      .from("registrations")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      showMessage(
        "✅ You are already registered. Access to the library is below.",
        "warning"
      );
      libraryAccess.style.display = "block";
      submitBtn.disabled = false;
      return;
    }

    // ✅ 2. Insert new record
    const { data, error: insertError } = await supabaseClient
      .from("registrations")
      .insert([
        {
          full_name,
          email,
          institution,
          department,
          student_id,
          telegram,
          wallet_address,
          interest_area,
          consent,
          created_at: new Date().toISOString(), // optional: timestamp
        },
      ])
      .select();

    if (insertError) throw insertError;

    // ✅ Success
    showMessage(
      "🎉 Registration successful. You can now open the E-Library below.",
      "success"
    );
    libraryAccess.style.display = "block";
  } catch (err) {
    console.error("Supabase error:", err);
    showMessage("❌ Registration failed: " + err.message, "danger");
  } finally {
    submitBtn.disabled = false;
  }
});
