const form = document.querySelector(".add");
const input = document.querySelector(".input");
const addButton = form.querySelector("button");
const list = document.querySelector(".list");
const guest = document.querySelector(".guest");
const user = document.querySelector(".user");
const username = document.querySelector(".username");
const logout = document.querySelector(".logout");

const name = localStorage.getItem("user");
const loggedIn = !!name;
let tasks = [];
tasks = JSON.parse(localStorage.getItem("tasks")) || [];

guest.hidden = loggedIn;
user.hidden = !loggedIn;
input.disabled = !loggedIn;
addButton.disabled = !loggedIn;
username.textContent = name || "";

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.classList.toggle("done", task.done);

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.disabled = !loggedIn;
    check.addEventListener("change", () => {
      task.done = check.checked;
      save();
      render();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.textContent = "Usuń";
    remove.disabled = !loggedIn;
    remove.addEventListener("click", () => {
      tasks.splice(i, 1);
      save();
      render();
    });

    li.append(check, text, remove);
    list.append(li);
  });
}

async function load() {
  if (loggedIn) {
    const res = await fetch("/todos?user=" + encodeURIComponent(name));
    if (res.ok) tasks = await res.json();
  }
  render();
}

load();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
    const text = input.value.trim();
    const res = await fetch("/todos",{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({user:name,description:text})
    })

    if(!res.ok) return

  tasks.push({ text: input.value.trim(), done: false });
  input.value = "";
  save();
  render();
});

logout.addEventListener("click", () => {
  localStorage.removeItem("user");
  location.reload();
});

render();