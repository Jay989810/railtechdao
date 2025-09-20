// Supabase credentials
const supabaseUrl = "https://lnbtbawdcfsbfgvamady.supabase.co";
const supabaseKey = "YOUR_SUPABASE_KEY"; // replace with your anon/public key
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");

  if (!form) {
    console.error("⚠️ regForm not found in DOM.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop form refresh

    // reCAPTCHA check
    if (typeof grecaptcha !== "undefined") {
      const captchaResponse = grecaptcha.getResponse();
      if (!captchaResponse) {
        alert("⚠️ Please complete the CAPTCHA.");
        return;
      }
    }

    // Collect form values
    const fullName = document.getElementById("full_name")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const institution = document.getElementById("institution")?.value || "";
    const department = document.getElementById("department")?.value || "";
    const role = document.getElementById("role")?.value || "";
    const studentId = document.getElementById("studentId")?.value || "";
    const telegram = document.getElementById("telegram")?.value || "";
    const interest = document.getElementById("interest")?.value || "";
    const consent = document.getElementById("consent")?.checked || false;

    const idCardFile = document.getElementById("idCard")?.files[0];
    if (!idCardFile) {
      alert("⚠️ Please upload your ID card.");
      return;
    }

    try {
      // 1. Upload ID card image
      const filePath = `id-cards/${Date.now()}_${idCardFile.name}`;
      let { error: storageError } = await supabaseClient.storage
        .from("id-cards")
        .upload(filePath, idCardFile);

      if (storageError) throw storageError;

      // 2. Get public URL
      const { data: publicUrlData } = supabaseClient.storage
        .from("id-cards")
        .getPublicUrl(filePath);

      const idCardUrl = publicUrlData.publicUrl;

      // 3. Insert into table
      const { error } = await supabaseClient.from("registrations").insert([
        { fullName, email, institution, department, role, studentId, telegram, interest, consent, idCardUrl },
      ]);

      if (error) throw error;

      // 4. Success
      form.style.display = "none";
      document.getElementById("libraryAccess").style.display = "block";
    } catch (err) {
      alert("❌ Error: " + err.message);
      console.error(err);
    }
  });
});
