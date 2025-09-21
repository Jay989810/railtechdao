// Supabase credentials
const supabaseUrl = "https://lnbtbawdcfsbfgvamady.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYnRiYXdkY2ZzYmZndmFtYWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjcwMDgsImV4cCI6MjA3Mzk0MzAwOH0.usAfqfD8J7sQLPxLvEmXC2XIcK0J8zN3_SgLaWxYjRI"; 
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded, attaching form listener...");

  const form = document.getElementById("regForm");
  if (!form) {
    console.error("❌ regForm not found in DOM.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    console.log("📌 Form submitted, starting registration...");

    try {
      // reCAPTCHA check
      if (typeof grecaptcha !== "undefined") {
        const captchaResponse = grecaptcha.getResponse();
        if (!captchaResponse) {
          alert("⚠️ Please complete the CAPTCHA.");
          return;
        }
      }

      // Collect form values
      const full_name = document.getElementById("full_name").value.trim();
      const email = document.getElementById("email").value.trim();
      const institution = document.getElementById("institution").value.trim();
      const department = document.getElementById("department").value.trim();
      const role = document.getElementById("role").value;
      const student_id = document.getElementById("studentId").value.trim();
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

      const id_card_url = publicUrlData.publicUrl;

      console.log("✅ File uploaded, inserting row...");

      // ✅ Use snake_case to match your table
      const { error } = await supabaseClient.from("registrations").insert([
        { full_name, email, institution, department, role, student_id, telegram, interest, consent, id_card_url },
      ]);

      if (error) throw error;

      // Success
      form.style.display = "none";
      document.getElementById("libraryAccess").style.display = "block";
      console.log("🎉 Registration success!");

      // ======================
      // 🚀 Send Welcome Email
      // ======================
      emailjs.init("sd65VDZVJ5iFCExv5"); // replace with your EmailJS Public Key

      const templateParams = {
        full_name: full_name,
        email: email,
        drive_link: "https://drive.google.com/drive/folders/1-0UUvAHiF6z7BbTZBdG_7V_zzXvWcCY6"
      };

      emailjs.send("service_3b1sfci", "template_qnd7cve", templateParams)
        .then(() => {
          console.log("📧 Welcome email sent successfully!");
        })
        .catch((err) => {
          console.error("❌ Failed to send email:", err);
        });

    } catch (err) {
      alert("❌ Error: " + err.message);
      console.error("Registration failed:", err);
    }
  });
});
