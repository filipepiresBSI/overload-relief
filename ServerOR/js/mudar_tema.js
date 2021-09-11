const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function checkTheme() {
    var currentTheme = localStorage.getItem("theme");
    var bodyTheme = document.getElementById("corpo")
    if (currentTheme == "dark") {
        bodyTheme.classList.toggle("light-theme");
    } else if (currentTheme == "light") {
        bodyTheme.classList.toggle("dark-theme");
    } else {
        localStorage.setItem("theme", "light")
    }

}

checkTheme();

var btn = document.querySelector(".toggle-mode");

function changeTheme() {
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle("light-theme");
      var theme = document.body.classList.contains("light-theme") 
      ? "light" 
      : "dark";
    } else {
      document.body.classList.toggle("dark-theme");
      var theme = document.body.classList.contains("dark-theme") 
      ? "dark" 
      : "light";
    }
    localStorage.setItem("theme", theme);
}
