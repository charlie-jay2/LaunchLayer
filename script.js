const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const userPref = localStorage.getItem("theme");
const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Apply saved or system theme on load
if (userPref === "dark" || (!userPref && systemPref)) {
  document.documentElement.classList.add("dark");
  themeIcon.innerHTML = sunSVG();
} else {
  document.documentElement.classList.remove("dark");
  themeIcon.innerHTML = moonSVG();
}

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeIcon.innerHTML = isDark ? sunSVG() : moonSVG();
});

// SVG icons
function sunSVG() {
  return `<path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/>`;
}

function moonSVG() {
  return `<path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>`;
}
