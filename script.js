// ================= SIGNUP =================
async function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
}


// ================= LOGIN =================
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.token) {
    // ✅ STORE LOGIN DATA
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", username);

    // ✅ REDIRECT TO HOME PAGE
    window.location.href = "home.html";
  } else {
    alert(data.message);
  }
}

