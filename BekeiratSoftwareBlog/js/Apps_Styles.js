document.addEventListener("DOMContentLoaded", function() {
    var today = new Date();
    var variant = (today.getDate() % 7) + 1; 
    var containerEl = document.querySelector(".container");
    containerEl.classList.add("variant-" + variant); 
    var targetApp = containerEl.getAttribute("data-app");
});  
