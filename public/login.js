const form = document.querySelector(".signup");
const login = document.querySelector(".login");
const password = document.querySelector(".password");
const toggle = document.querySelector(".toggle");
const error = document.querySelector(".error");

toggle.addEventListener("click", () => {
  const show = password.type === "password";
  password.type = show ? "text" : "password";
  toggle.textContent = show ? "Ukryj" : "Pokaż";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  error.classList.remove("show");

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: login.value.trim(), password: password.value })
  });

  if (res.ok) {
    localStorage.setItem("user", login.value.trim());
    window.location.href = "/index.html";
  } else {
    error.classList.add("show");
  }
});