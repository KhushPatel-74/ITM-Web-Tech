// 1. Greeting based on the time of day
const hour = new Date().getHours();
let greeting = "Good evening";

if (hour < 12) {
  greeting = "Good morning";
} else if (hour < 17) {
  greeting = "Good afternoon";
}

document.getElementById("greeting").textContent = greeting;

// 2. Current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// 3. Numbers in the hero count up
document.querySelectorAll(".count").forEach(function (item) {
  const target = Number(item.dataset.target);
  let number = 0;

  const timer = setInterval(function () {
    number = number + 1;
    item.textContent = number;
    if (number === target) {
      clearInterval(timer);
    }
  }, 120);
});

// 4. Filter buttons for the practicals
const buttons = document.querySelectorAll(".filters button");
const cards = document.querySelectorAll(".card");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const type = button.dataset.type;

    buttons.forEach(function (b) {
      b.classList.remove("active");
    });
    button.classList.add("active");

    cards.forEach(function (card) {
      if (type === "all" || card.dataset.type.includes(type)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// 5. Colour theme button
const themes = ["teal", "blue", "orange", "rose", "green"];
let current = 0;
const themeButton = document.getElementById("themeBtn");

themeButton.addEventListener("click", function () {
  current = current + 1;
  if (current === themes.length) {
    current = 0;
  }
  document.body.dataset.theme = themes[current];
  themeButton.textContent = "Theme: " + themes[current];
});

// 6. Scroll progress bar and back-to-top button
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", function () {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (scrolled / total) * 100 + "%";

  if (scrolled > 400) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }
});
