document.addEventListener("DOMContentLoaded", () => {
  // login.html 側
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const res = await fetch("https://YOUR-PI-TUNNEL.trycloudflare.com/auth", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({username, password})
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        window.location.href = "viewer.html";
      } else {
        alert("Unauthorized!");
      }
    });
  }

  // viewer.html 側
  const container = document.getElementById("video-container");
  if (container) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html";
      return;
    }

    fetch(`https://YOUR-PI-TUNNEL.trycloudflare.com/stream?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.url) {
          container.innerHTML = `<iframe src="${d.url}" width="800" height="600"></iframe>`;
        } else {
          alert("Forbidden!");
        }
      });
  }

  // ログアウト
  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
});
