// Supabase credentials
const supabaseUrl = "https://lnbtbawdcfsbfgvamady.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYnRiYXdkY2ZzYmZndmFtYWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjcwMDgsImV4cCI6MjA3Mzk0MzAwOH0.usAfqfD8J7sQLPxLvEmXC2XIcK0J8zN3_SgLaWxYjRI"; // replace with anon/public key
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded, attaching form listener...");

  const form = document.getElementById("regForm");
  if (!form) {
    console.error("❌ regForm not found in DOM.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop form reload
    console.log("📌 Form submitted, starting registration...");

    try {
      // reCAPTCHA
      if (typeof grecaptcha !== "undefined") {
        const captchaResponse = grecaptcha.getResponse();
        if (!captchaResponse) {
          alert("⚠️ Please complete the CAPTCHA.");
          return;
        }
      }

      // Collect fields
      const fullName = document.getElementById("full_name").value.trim();
      const email = document.getElementById("email").value.trim();
      const institution = document.getElementById("institution").value.trim();
      const department = document.getElementById("department").value.trim();
      const role = document.getElementById("role").value;
      const studentId = document.getElementById("studentId").value.trim();
      const telegram = document.getElementById("telegram").value.trim();
      const interest = document.getElementById("interest").value;
      const consent = document.getElementById("consent").checked;

      const idCardFile = document.getElementById("idCard").files[0];
      if (!idCardFile) {
        alert("⚠️ Please upload your ID card.");
        return;
      }

      console.log("📁 Uploading ID card...");
      const filePath = `id-cards/${Date.now()}_${idCardFile.name}`;
      let { error: storageError } = await supabaseClient.storage
        .from("id-cards")
        .upload(filePath, idCardFile);

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabaseClient.storage
        .from("id-cards")
        .getPublicUrl(filePath);

      const idCardUrl = publicUrlData.publicUrl;

      console.log("✅ File uploaded, inserting row...");
      const { error } = await supabaseClient.from("registrations").insert([
        { fullName, email, institution, department, role, studentId, telegram, interest, consent, idCardUrl },
      ]);

      if (error) throw error;

      // Success
      form.style.display = "none";
      document.getElementById("libraryAccess").style.display = "block";
      console.log("🎉 Registration success!");
    } catch (err) {
      alert("❌ Error: " + err.message);
      console.error("Registration failed:", err);
    }
  });
});
