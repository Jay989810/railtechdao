// Supabase credentials
const supabaseUrl = "https://lnbtbawdcfsbfgvamady.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYnRiYXdkY2ZzYmZndmFtYWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjcwMDgsImV4cCI6MjA3Mzk0MzAwOH0.usAfqfD8J7sQLPxLvEmXC2XIcK0J8zN3_SgLaWxYjRI";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // ✅ reCAPTCHA check
  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse) {
    alert("⚠️ Please complete the CAPTCHA.");
    return;
  }

  // ✅ Collect form values (match IDs in HTML)
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const institution = document.getElementById("institution").value;
  const department = document.getElementById("department").value;
  const role = document.getElementById("role").value;
  const studentId = document.getElementById("studentId").value;
  const telegram = document.getElementById("telegram").value;
  const interest = document.getElementById("interest").value;
  const consent = document.getElementById("consent").checked;

  const idCardFile = document.getElementById("idCard").files[0];
  if (!idCardFile) {
    alert("⚠️ Please upload your ID card.");
    return;
  }

  try {
    // ✅ 1. Upload ID card image to Supabase Storage
    const filePath = `id-cards/${Date.now()}_${idCardFile.name}`;
    let { error: storageError } = await supabaseClient.storage
      .from("id-cards")
      .upload(filePath, idCardFile);

    if (storageError) throw storageError;

    // ✅ 2. Get public URL of uploaded file
    const { data: publicUrlData } = supabaseClient.storage
      .from("id-cards")
      .getPublicUrl(filePath);

    const idCardUrl = publicUrlData.publicUrl;

    // ✅ 3. Save registration details in Supabase table (snake_case keys!)
    const { error } = await supabaseClient
      .from("registrations")
      .insert([
        { 
          full_name: fullName,
          email: email,
          institution: institution,
          department: department,
          role: role,
          student_id: studentId,
          telegram: telegram,
          interest: interest,
          consent: consent,
          id_card_url: idCardUrl
        }
      ]);

    if (error) throw error;

    // ✅ 4. Show success message
    document.getElementById("regForm").style.display = "none";
    document.getElementById("libraryAccess").style.display = "block";

  } catch (err) {
    alert("❌ Error: " + err.message);
    console.error(err);
  }
});
