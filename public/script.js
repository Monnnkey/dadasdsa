const form = document.querySelector(".signup");
const login = document.querySelector(".login");
const password = document.querySelector(".password");
const toggle = document.querySelector(".toggle");
const success = document.querySelector(".success");

toggle.addEventListener("click", () => {
  const show = password.type === "password";
  password.type = show ? "text" : "password";
  toggle.textContent = show ? "Ukryj" : "Pokaż";
});


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  success.classList.remove("show");

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: login.value.trim(), password: password.value })
  });

  if (res.ok) {
    success.classList.add("show");
    form.reset();
    password.type = "password";
    toggle.textContent = "Pokaż";
    window.location.href = "/index.html";
  }
});