const skills = [
  { group: "Web development", items: [
    { name: "HTML", level: 4, text: "Comfortable" },
    { name: "CSS", level: 4, text: "Comfortable" },
    { name: "JavaScript", level: 2, text: "Learning" }
  ] },
  { group: "Programming", items: [
    { name: "Python", level: 3, text: "Working knowledge" }
  ] }
];

const projects = [
  { no: "Practical 6", title: "Student Bookstore Survey", type: "html css", tags: ["HTML", "CSS"], short: "A survey form for a student bookstore.", more: "A form-based page that collects responses from students, styled with an external stylesheet." },
  { no: "Practical 7", title: "Real Madrid Soccer Site", type: "html css", tags: ["HTML", "CSS"], short: "A two-frame website in the club’s colours.", more: "One frame holds the navigation and the other shows the content. The colour scheme follows the club’s logo." },
  { no: "Practical 8", title: "Arithmetic in JavaScript", type: "js", tags: ["JavaScript"], short: "Arithmetic operations performed by a script.", more: "Takes numbers from the visitor, runs the calculation and shows the result on the page." },
  { no: "Practical 9", title: "Text Grow and Shrink", type: "js", tags: ["JavaScript"], short: "Buttons that enlarge or reduce text.", more: "A script changes the font size of the text each time a button is clicked." },
  { no: "Practical 10", title: "Show or Hide Password", type: "js", tags: ["JavaScript"], short: "A toggle that reveals a password field.", more: "Switches the input between hidden characters and readable text." },
  { no: "Python", title: "Python Assignments", type: "python", tags: ["Python"], short: "Programs on loops, conditions, functions and modules.", more: "Each assignment is documented with the problem, the code and a screenshot of it running in the terminal." },
  { no: "This site", title: "Portfolio Website", type: "html css js", tags: ["HTML", "CSS", "JavaScript"], short: "The page you are viewing.", more: "Plain HTML, CSS and JavaScript with no libraries. It has a light and dark theme, live project search, and a validated contact form." }
];

const filterList = [
  { key: "all", text: "All" },
  { key: "html", text: "HTML" },
  { key: "css", text: "CSS" },
  { key: "js", text: "JavaScript" },
  { key: "python", text: "Python" }
];

const root = document.documentElement;
const themeButton = document.getElementById("theme");

function setTheme(name) {
  root.setAttribute("data-theme", name);
  themeButton.textContent = name === "dark" ? "Light mode" : "Dark mode";
  try {
    localStorage.setItem("theme", name);
  } catch (err) {}
}

let saved = null;
try {
  saved = localStorage.getItem("theme");
} catch (err) {}
if (!saved) {
  saved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
setTheme(saved);
themeButton.addEventListener("click", function () {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

const skillBox = document.getElementById("skillList");
skills.forEach(function (g) {
  const group = document.createElement("div");
  group.className = "group";
  let html = "<h3>" + g.group + "</h3>";
  g.items.forEach(function (s) {
    let cells = "";
    for (let i = 1; i <= 5; i++) {
      cells += "<i data-on=\"" + (i <= s.level ? 1 : 0) + "\"></i>";
    }
    html += "<div class=\"skill\"><b>" + s.name + "</b><div class=\"meter\">" + cells + "</div><span class=\"level\">" + s.text + "</span></div>";
  });
  group.innerHTML = html;
  skillBox.appendChild(group);
});

const skillWatcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll("i").forEach(function (cell, n) {
        setTimeout(function () {
          if (cell.dataset.on === "1") cell.classList.add("fill");
        }, n * 90);
      });
      skillWatcher.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".meter").forEach(function (m) {
  skillWatcher.observe(m);
});

const list = document.getElementById("list");
const search = document.getElementById("search");
const result = document.getElementById("result");
const filterBox = document.getElementById("filters");
let activeFilter = "all";

function showProjects() {
  const term = search.value.trim().toLowerCase();
  list.innerHTML = "";
  let shown = 0;
  projects.forEach(function (p) {
    const inFilter = activeFilter === "all" || p.type.split(" ").indexOf(activeFilter) !== -1;
    const text = (p.title + " " + p.short + " " + p.tags.join(" ")).toLowerCase();
    if (!inFilter || text.indexOf(term) === -1) return;
    shown += 1;
    const li = document.createElement("li");
    li.className = "item";
    const tagHtml = p.tags.map(function (t) {
      return "<span class=\"tag\">" + t + "</span>";
    }).join("");
    li.innerHTML = "<button type=\"button\" class=\"head\" aria-expanded=\"false\"><span class=\"no\">" + p.no + "</span><span><span class=\"name\">" + p.title + "</span><br>" + p.short + "</span></button><div class=\"body\"><p>" + p.more + "</p>" + tagHtml + "</div>";
    const head = li.querySelector(".head");
    head.addEventListener("click", function () {
      const open = li.classList.toggle("open");
      head.setAttribute("aria-expanded", open);
    });
    list.appendChild(li);
  });
  result.textContent = shown === 0 ? "No projects match. Try a different word or filter." : "Showing " + shown + " of " + projects.length + " projects";
}

filterList.forEach(function (f) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = f.text;
  if (f.key === "all") b.className = "on";
  b.addEventListener("click", function () {
    filterBox.querySelectorAll("button").forEach(function (x) {
      x.classList.remove("on");
    });
    b.classList.add("on");
    activeFilter = f.key;
    showProjects();
  });
  filterBox.appendChild(b);
});
search.addEventListener("input", showProjects);
showProjects();

const navLinks = document.querySelectorAll("#nav a");
const spy = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function (a) {
        a.classList.toggle("on", a.getAttribute("href") === "#" + entry.target.id);
      });
    }
  });
}, { rootMargin: "-35% 0px -60% 0px" });
document.querySelectorAll("main section").forEach(function (s) {
  spy.observe(s);
});

const nameField = document.getElementById("fname");
const emailField = document.getElementById("femail");
const msgField = document.getElementById("fmsg");
const counter = document.getElementById("count");
const statusLine = document.getElementById("status");

msgField.addEventListener("input", function () {
  counter.textContent = msgField.value.length + "/300";
});

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const problems = [];
  [nameField, emailField, msgField].forEach(function (f) {
    f.classList.remove("bad");
  });
  if (nameField.value.trim().length < 2) {
    problems.push("your name");
    nameField.classList.add("bad");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
    problems.push("a valid email address");
    emailField.classList.add("bad");
  }
  if (msgField.value.trim().length < 10) {
    problems.push("a message of at least 10 characters");
    msgField.classList.add("bad");
  }
  if (problems.length > 0) {
    statusLine.textContent = "Please enter " + problems.join(", ") + ".";
    return;
  }
  statusLine.textContent = "Thank you, " + nameField.value.trim() + ". This is a demo form with no server, so the message was not sent.";
  this.reset();
  counter.textContent = "0/300";
});
