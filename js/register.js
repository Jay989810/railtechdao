const supabase = supabase.createClient("https://ooxxampqveibgzonglxz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veHhhbXBxdmVpYmd6b25nbHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTUzNjYsImV4cCI6MjA3MzUzMTM2Nn0.9QrAmTBPiDbVuyLQbmdxwf-LCgDoxT8zmLzowTq7oKA");

document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const institution = document.getElementById("institution").value;
  const department = document.getElementById("department").value;
  const role = document.getElementById("role").value;
  const studentId = document.getElementById("studentId").value;
  const telegram = document.getElementById("telegram").value;
  const interest = document.getElementById("interest").value;
  const idCardFile = document.getElementById("idCard").files[0];

  // 1. Create user account with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    document.getElementById("message").innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    return;
  }

  const user = data.user;

  // 2. Upload ID card
  let idCardUrl = "";
  if (idCardFile) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("id-cards")  // make sure you created this bucket
      .upload(`cards/${user.id}_${idCardFile.name}`, idCardFile, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
    } else {
      const { data: publicUrl } = supabase.storage.from("id-cards").getPublicUrl(uploadData.path);
      idCardUrl = publicUrl.publicUrl;
    }
  }

  // 3. Save user profile
  const { error: profileError } = await supabase.from("profiles").insert([{
    id: user.id,
    full_name: fullName,
    institution,
    department,
    role,
    student_id: studentId,
    telegram,
    interest,
    id_card_url: idCardUrl
  }]);

  if (profileError) {
    console.error(profileError);
  }

  document.getElementById("message").innerHTML = `
    <div class="alert alert-success">
      Registration successful! Please check your email to verify your account before logging in.
    </div>`;
});
