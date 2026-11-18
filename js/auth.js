async function getCurrentProfile() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) return null;

  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) return null;
  return data;
}

function pageForRole(role) {
  if (role === "admin") return "admin.html";
  if (role === "staff") return "staff.html";
  return "requester.html";
}

// Tawgon sa matag protected page
async function requireRole(allowedRoles) {
  const profile = await getCurrentProfile();

  if (!profile) {
    window.location.href = "login.html";
    return null;
  }

  if (!allowedRoles.includes(profile.role)) {
    alert("Access denied: your role cannot open this page.");
    window.location.href = pageForRole(profile.role);
    return null;
  }

  document.getElementById("content").style.display = "block";
  document.getElementById("checking").style.display = "none";
  return profile;
}

async function logout() {
  await db.auth.signOut();
  window.location.href = "login.html";
}