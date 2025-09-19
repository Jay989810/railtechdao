// Supabase credentials
const supabaseUrl = "https://ooxxampqveibgzonglxz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veHhhbXBxdmVpYmd6b25nbHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTUzNjYsImV4cCI6MjA3MzUzMTM2Nn0.9QrAmTBPiDbVuyLQbmdxwf-LCgDoxT8zmLzowTq7oKA";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // reCAPTCHA check
  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse) {
    alert("⚠️ Please complete the CAPTCHA.");
    return;
  }

  // Collect form values
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
    // 1. Upload ID card image to Supabase Storage
    const filePath = `id_cards/${Date.now()}_${idCardFile.name}`;
    let { data: storageData, error: storageError } = await supabaseClient.storage
      .from("railtech-storage")
      .upload(filePath, idCardFile);

    if (storageError) throw storageError;

    // 2. Get public URL of uploaded file
    const { data: publicUrlData } = supabaseClient.storage
      .from("railtech-storage")
      .getPublicUrl(filePath);

    const idCardUrl = publicUrlData.publicUrl;

    // 3. Save registration details in Supabase table
    const { data, error } = await supabaseClient
      .from("registrations")
      .insert([
        { fullName, email, institution, department, role, studentId, telegram, interest, consent, idCardUrl }
      ]);

    if (error) throw error;

    // 4. Show success message
    document.getElementById("regForm").style.display = "none";
    document.getElementById("libraryAccess").style.display = "block";

  } catch (err) {
    alert("❌ Error: " + err.message);
    console.error(err);
  }
});
